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
import { RouterLink } from '@angular/router';

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
  imports: [RouterLink],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent implements AfterViewInit, OnDestroy {
  private readonly introDurationMs = 3000;
  private readonly introExitDurationMs = 320;

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
  private introFinished = false;
  private userMuted = false;
  private intersectionObserver?: IntersectionObserver;
  private previousBodyOverflow = '';
  private readonly introTimeout = window.setTimeout(() => {
    this.introFinished = true;
    this.updateVideoAudio();
  }, this.introDurationMs + this.introExitDurationMs);
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

  ngAfterViewInit(): void {
    this.setupHeroVisibilityObserver();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('focus', this.handleWindowFocus);
    window.addEventListener('blur', this.handleWindowBlur);
    this.updateVideoAudio();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    window.clearTimeout(this.introTimeout);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleWindowFocus);
    window.removeEventListener('blur', this.handleWindowBlur);
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
    const shouldMute =
      this.userMuted ||
      !this.introFinished ||
      !this.heroVisible ||
      !this.pageVisible ||
      !this.windowFocused;

    this.isVideoMuted.set(shouldMute);
    this.applyVideoState(this.demoVideo?.nativeElement, shouldMute || this.isVideoViewerOpen());
    this.applyVideoState(this.fullscreenVideo?.nativeElement, shouldMute);
  }

  private applyVideoState(video: HTMLVideoElement | undefined, shouldMute: boolean): void {
    if (!video) {
      return;
    }

    video.defaultMuted = shouldMute;
    video.muted = shouldMute;
    video.volume = shouldMute ? 0 : 1;
    void video.play().catch(() => undefined);
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
