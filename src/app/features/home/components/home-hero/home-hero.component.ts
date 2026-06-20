import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  input,
  signal
} from '@angular/core';

export interface HomeHeroContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly highlight: string;
  readonly description: string;
  readonly primaryCtaLabel: string;
  readonly primaryCtaLink: string;
  readonly secondaryCtaLabel: string;
  readonly secondaryCtaLink: string;
  readonly photoCard: HomeHeroPhotoCardContent;
  readonly socialLinks: readonly HomeHeroSocialLink[];
  readonly videoCard: HomeHeroVideoCardContent;
}

export interface HomeHeroSocialLink {
  readonly label: string;
  readonly href: string;
}

export interface HomeHeroVideoCardContent {
  readonly src: string;
  readonly label: string;
  readonly duration: string;
  readonly ariaLabel: string;
}

export interface HomeHeroPhotoCardContent {
  readonly src: string;
}

@Component({
  selector: 'app-home-hero',
  standalone: true,
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection')
  private readonly heroSection?: ElementRef<HTMLElement>;

  @ViewChild('demoVideo')
  private readonly demoVideo?: ElementRef<HTMLVideoElement>;

  @ViewChild('fullscreenVideo')
  private readonly fullscreenVideo?: ElementRef<HTMLVideoElement>;

  readonly content = input.required<HomeHeroContent>();
  protected readonly isVideoMuted = signal(true);
  protected readonly isVideoViewerOpen = signal(false);

  private heroVisible = false;
  private pageVisible = !document.hidden;
  private windowFocused = document.hasFocus();
  private userMuted = false;
  private userInteracted = false;
  private intersectionObserver?: IntersectionObserver;
  private previousBodyOverflow = '';
  private readonly handleVisibilityChange = (): void => {
    this.pageVisible = !document.hidden;
    this.updateVideoAudio();
  };
  private readonly handleWindowFocus = (): void => {
    this.windowFocused = true;
    this.updateVideoAudio();
  };
  private readonly handleWindowBlur = (): void => {
    this.windowFocused = false;
    this.updateVideoAudio();
  };
  private readonly handleFirstUserGesture = (): void => {
    this.userInteracted = true;
    this.userMuted = false;
    this.updateVideoAudio();
    this.tryResumePlayback();
    this.removeUserGestureListeners();
  };

  ngAfterViewInit(): void {
    this.setupHeroVisibilityObserver();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('focus', this.handleWindowFocus);
    window.addEventListener('blur', this.handleWindowBlur);
    this.addUserGestureListeners();
    this.updateVideoAudio();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleWindowFocus);
    window.removeEventListener('blur', this.handleWindowBlur);
    this.removeUserGestureListeners();
    this.unlockBodyScroll();
  }

  protected ensureVideoAudioState(): void {
    this.updateVideoAudio();
  }

  protected toggleVideoMuted(event?: Event): void {
    event?.stopPropagation();
    this.userMuted = !this.userMuted;
    this.updateVideoAudio();
  }

  protected openVideoViewer(): void {
    this.isVideoViewerOpen.set(true);
    this.lockBodyScroll();
    queueMicrotask(() => this.updateVideoAudio());
  }

  protected closeVideoViewer(): void {
    this.isVideoViewerOpen.set(false);
    this.unlockBodyScroll();
    this.updateVideoAudio();
  }

  @HostListener('document:keydown.escape')
  protected handleEscapeKey(): void {
    if (!this.isVideoViewerOpen()) {
      return;
    }

    this.closeVideoViewer();
  }

  private setupHeroVisibilityObserver(): void {
    const hero = this.heroSection?.nativeElement;

    if (!hero) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.heroVisible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        this.updateVideoAudio();
      },
      {
        threshold: [0, 0.35, 0.6]
      }
    );

    this.intersectionObserver.observe(hero);
  }

  private updateVideoAudio(): void {
    const shouldMute = this.userMuted || !this.heroVisible || !this.pageVisible || !this.windowFocused;

    this.isVideoMuted.set(shouldMute);
    this.applyVideoState(this.demoVideo?.nativeElement, shouldMute || this.isVideoViewerOpen(), true);
    this.applyVideoState(this.fullscreenVideo?.nativeElement, shouldMute, false);
  }

  private applyVideoState(
    video: HTMLVideoElement | undefined,
    shouldMute: boolean,
    allowMutedFallback: boolean
  ): void {
    if (!video) {
      return;
    }

    video.defaultMuted = shouldMute;
    video.muted = shouldMute;
    video.volume = shouldMute ? 0 : 1;

    void video.play().catch(() => {
      if (!shouldMute && allowMutedFallback && !this.userInteracted) {
        video.defaultMuted = true;
        video.muted = true;
        video.volume = 0;
        this.isVideoMuted.set(true);
        return video.play().catch(() => undefined);
      }

      return undefined;
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

  private tryResumePlayback(): void {
    void this.demoVideo?.nativeElement.play().catch(() => undefined);
    void this.fullscreenVideo?.nativeElement.play().catch(() => undefined);
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
}
