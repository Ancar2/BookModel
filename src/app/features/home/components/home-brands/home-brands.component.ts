import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  input,
  signal
} from '@angular/core';

export interface HomeBrandsLogo {
  readonly src: string;
  readonly alt: string;
}

export interface HomeBrandsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly logos: readonly HomeBrandsLogo[];
}

interface HomeBrandsLoopLogo extends HomeBrandsLogo {
  readonly key: string;
}

@Component({
  selector: 'app-home-brands',
  standalone: true,
  templateUrl: './home-brands.component.html',
  styleUrl: './home-brands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeBrandsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('brandsSection')
  private readonly brandsSection?: ElementRef<HTMLElement>;

  readonly content = input.required<HomeBrandsContent>();
  protected readonly isVisible = signal(false);

  private intersectionObserver?: IntersectionObserver;

  protected readonly topTrack = computed(() => this.buildLoop(this.content().logos));
  protected readonly bottomTrack = computed(() => this.buildLoop([...this.content().logos].reverse()));

  ngAfterViewInit(): void {
    const section = this.brandsSection?.nativeElement;

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
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  private buildLoop(logos: readonly HomeBrandsLogo[]): HomeBrandsLoopLogo[] {
    return Array.from({ length: 4 }, (_, groupIndex) =>
      logos.map((logo, logoIndex) => ({
        ...logo,
        key: `${groupIndex}-${logoIndex}-${logo.src}`
      }))
    ).flat();
  }
}
