import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  input,
  signal
} from '@angular/core';

export interface HomeFooterLink {
  readonly label: string;
  readonly href: string;
  readonly iconSrc: string;
}

export interface HomeFooterContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly brandLogoSrc: string;
  readonly silhouetteSrc: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly secondaryLabel: string;
  readonly secondaryHref: string;
  readonly links: readonly HomeFooterLink[];
  readonly techHref: string;
  readonly techLabel: string;
  readonly techLogoSrc: string;
  readonly copyright: string;
}

@Component({
  selector: 'app-home-footer',
  standalone: true,
  templateUrl: './home-footer.component.html',
  styleUrl: './home-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeFooterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('footerSection')
  private readonly footerSection?: ElementRef<HTMLElement>;

  readonly content = input.required<HomeFooterContent>();
  protected readonly isVisible = signal(false);

  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    const section = this.footerSection?.nativeElement;

    if (!section) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.16) {
          this.isVisible.set(true);
          this.intersectionObserver?.disconnect();
        }
      },
      {
        threshold: [0, 0.16, 0.32],
        rootMargin: '0px 0px -6% 0px'
      }
    );

    this.intersectionObserver.observe(section);
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }
}
