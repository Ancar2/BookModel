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

export interface HomeAboutMediaContent {
  readonly src: string;
  readonly ariaLabel: string;
}

export interface HomeAboutContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly paragraphs: readonly string[];
  readonly quote: string;
  readonly media: HomeAboutMediaContent;
}

@Component({
  selector: 'app-home-about',
  standalone: true,
  templateUrl: './home-about.component.html',
  styleUrl: './home-about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeAboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection')
  private readonly aboutSection?: ElementRef<HTMLElement>;

  readonly content = input.required<HomeAboutContent>();
  protected readonly isVisible = signal(false);

  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    const section = this.aboutSection?.nativeElement;

    if (!section) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.22) {
          this.isVisible.set(true);
          this.intersectionObserver?.disconnect();
        }
      },
      {
        threshold: [0, 0.22, 0.45],
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.intersectionObserver.observe(section);
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }
}
