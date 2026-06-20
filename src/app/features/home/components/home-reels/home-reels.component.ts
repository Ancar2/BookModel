import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  computed,
  input,
  signal
} from '@angular/core';

export interface HomeReelItem {
  readonly src: string;
  readonly poster: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly ariaLabel: string;
}

export interface HomeReelsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly items: readonly HomeReelItem[];
}

@Component({
  selector: 'app-home-reels',
  standalone: true,
  templateUrl: './home-reels.component.html',
  styleUrl: './home-reels.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeReelsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reelsSection')
  private readonly reelsSection?: ElementRef<HTMLElement>;

  @ViewChild('featureReel')
  private readonly featureReel?: ElementRef<HTMLVideoElement>;

  @ViewChild('featureCard')
  private readonly featureCard?: ElementRef<HTMLElement>;

  @ViewChild('fullscreenReel')
  private readonly fullscreenReel?: ElementRef<HTMLVideoElement>;

  readonly content = input.required<HomeReelsContent>();
  protected readonly isVisible = signal(false);
  protected readonly activeIndex = signal(0);
  protected readonly featureHighlighted = signal(false);
  protected readonly isViewerOpen = signal(false);
  protected readonly isMainVideoMuted = signal(false);

  private intersectionObserver?: IntersectionObserver;
  private featureVisibilityObserver?: IntersectionObserver;
  private featureHighlightTimeout?: ReturnType<typeof setTimeout>;
  private previousBodyOverflow = '';
  private featureVideoVisible = false;
  private userInteracted = false;

  protected readonly activeItem = computed(() => {
    const items = this.content().items;
    return items[this.activeIndex()] ?? items[0];
  });
  private readonly handleFirstUserGesture = (): void => {
    this.userInteracted = true;
    this.isMainVideoMuted.set(false);
    this.syncVideoAudioState();
    this.removeUserGestureListeners();
  };

  ngAfterViewInit(): void {
    const section = this.reelsSection?.nativeElement;

    if (!section) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
          this.isVisible.set(true);
          this.intersectionObserver?.disconnect();
        }
      },
      {
        threshold: [0, 0.18, 0.36],
        rootMargin: '0px 0px -8% 0px'
      }
    );

    this.intersectionObserver.observe(section);
    this.setupFeatureVisibilityObserver();
    this.addUserGestureListeners();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.featureVisibilityObserver?.disconnect();
    this.removeUserGestureListeners();
    this.unlockBodyScroll();

    if (this.featureHighlightTimeout) {
      clearTimeout(this.featureHighlightTimeout);
    }
  }

  protected selectItem(index: number): void {
    this.activeIndex.set(index);
    this.triggerFeatureHighlight();
    this.scrollFeatureIntoViewOnMobile();
    queueMicrotask(() => this.syncVideoAudioState());
  }

  protected openViewer(): void {
    this.isViewerOpen.set(true);
    this.lockBodyScroll();
    queueMicrotask(() => this.syncVideoAudioState());
  }

  protected closeViewer(): void {
    this.isViewerOpen.set(false);
    this.unlockBodyScroll();
    this.syncVideoAudioState();
  }

  protected ensureVideoAudioState(): void {
    this.syncVideoAudioState();
  }

  protected ensureThumbnailMuted(event: Event): void {
    const video = event.target;

    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
  }

  protected toggleMainVideoMuted(event?: Event): void {
    event?.stopPropagation();
    this.isMainVideoMuted.update(value => !value);
    this.syncVideoAudioState();
  }

  @HostListener('document:keydown.escape')
  protected handleEscapeKey(): void {
    if (!this.isViewerOpen()) {
      return;
    }

    this.closeViewer();
  }

  private triggerFeatureHighlight(): void {
    this.featureHighlighted.set(false);

    if (this.featureHighlightTimeout) {
      clearTimeout(this.featureHighlightTimeout);
    }

    queueMicrotask(() => this.featureHighlighted.set(true));

    this.featureHighlightTimeout = setTimeout(() => {
      this.featureHighlighted.set(false);
      this.featureHighlightTimeout = undefined;
    }, 5000);
  }

  private lockBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.overflow = this.previousBodyOverflow;
  }

  private syncVideoAudioState(): void {
    this.applyInlineVideoState(
      this.featureReel?.nativeElement,
      this.isMainVideoMuted() || this.isViewerOpen(),
      this.featureVideoVisible && !this.isViewerOpen()
    );
    this.applyFullscreenVideoState(this.fullscreenReel?.nativeElement, this.isMainVideoMuted(), this.isViewerOpen());
  }

  private applyInlineVideoState(
    video: HTMLVideoElement | undefined,
    shouldMute: boolean,
    shouldPlay: boolean
  ): void {
    if (!video) {
      return;
    }

    video.defaultMuted = shouldMute;
    video.muted = shouldMute;
    video.volume = shouldMute ? 0 : 1;

    if (shouldPlay) {
      void video.play().catch(() => {
        if (!shouldMute && !this.userInteracted) {
          video.defaultMuted = true;
          video.muted = true;
          video.volume = 0;
          this.isMainVideoMuted.set(true);
          return video.play().catch(() => undefined);
        }

        return undefined;
      });
      return;
    }

    video.pause();
  }

  private applyFullscreenVideoState(
    video: HTMLVideoElement | undefined,
    shouldMute: boolean,
    shouldPlay: boolean
  ): void {
    if (!video) {
      return;
    }

    video.defaultMuted = shouldMute;
    video.muted = shouldMute;
    video.volume = shouldMute ? 0 : 1;

    if (shouldPlay) {
      void video.play().catch(() => {
        if (!shouldMute && !this.userInteracted) {
          video.defaultMuted = true;
          video.muted = true;
          video.volume = 0;
          this.isMainVideoMuted.set(true);
          return video.play().catch(() => undefined);
        }

        return undefined;
      });
      return;
    }

    video.pause();
  }

  private scrollFeatureIntoViewOnMobile(): void {
    if (typeof window === 'undefined' || window.innerWidth > 899) {
      return;
    }

    const feature = this.featureCard?.nativeElement;

    if (!feature) {
      return;
    }

    requestAnimationFrame(() => {
      const rect = feature.getBoundingClientRect();
      const currentTop = window.scrollY || window.pageYOffset;
      const targetTop = currentTop + rect.top - Math.max((window.innerHeight - rect.height) / 2, 0);

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth'
      });
    });
  }

  private addUserGestureListeners(): void {
    document.addEventListener('pointerdown', this.handleFirstUserGesture, { passive: true });
    document.addEventListener('touchstart', this.handleFirstUserGesture, { passive: true });
    window.addEventListener('scroll', this.handleFirstUserGesture, { passive: true });
    window.addEventListener('wheel', this.handleFirstUserGesture, { passive: true });
    document.addEventListener('keydown', this.handleFirstUserGesture);
  }

  private removeUserGestureListeners(): void {
    document.removeEventListener('pointerdown', this.handleFirstUserGesture);
    document.removeEventListener('touchstart', this.handleFirstUserGesture);
    window.removeEventListener('scroll', this.handleFirstUserGesture);
    window.removeEventListener('wheel', this.handleFirstUserGesture);
    document.removeEventListener('keydown', this.handleFirstUserGesture);
  }

  private setupFeatureVisibilityObserver(): void {
    const feature = this.featureCard?.nativeElement;

    if (!feature) {
      return;
    }

    this.featureVisibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.featureVideoVisible = entry.isIntersecting && entry.intersectionRatio >= 0.55;
        this.syncVideoAudioState();
      },
      {
        threshold: [0, 0.3, 0.55, 0.8]
      }
    );

    this.featureVisibilityObserver.observe(feature);
  }
}
