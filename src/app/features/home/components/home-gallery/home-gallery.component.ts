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

export interface HomeGalleryImage {
  readonly src: string;
  readonly alt: string;
}

export interface HomeGalleryCategory {
  readonly slug: string;
  readonly label: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly inverted?: boolean;
  readonly images: readonly HomeGalleryImage[];
}

export interface HomeGalleryContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly categories: readonly HomeGalleryCategory[];
}

@Component({
  selector: 'app-home-gallery',
  standalone: true,
  templateUrl: './home-gallery.component.html',
  styleUrl: './home-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeGalleryComponent implements AfterViewInit, OnDestroy {
  readonly content = input.required<HomeGalleryContent>();

  @ViewChild('gallerySection')
  private readonly gallerySection?: ElementRef<HTMLElement>;

  @ViewChild('galleryFeature')
  private readonly galleryFeature?: ElementRef<HTMLElement>;

  protected readonly isVisible = signal(false);
  protected readonly featureHighlighted = signal(false);
  protected readonly isViewerOpen = signal(false);
  protected readonly activeCategoryIndex = signal(1);
  protected readonly activeImageIndex = signal(0);

  private visibilityObserver?: IntersectionObserver;
  private featureHighlightTimeout?: ReturnType<typeof setTimeout>;

  protected readonly activeCategory = computed(() => {
    const categories = this.content().categories;
    return categories[this.activeCategoryIndex()] ?? categories[0];
  });

  protected readonly activeImage = computed(() => {
    const category = this.activeCategory();
    return category.images[this.activeImageIndex()] ?? category.images[0];
  });

  ngAfterViewInit(): void {
    const section = this.gallerySection?.nativeElement;

    if (!section) {
      return;
    }

    this.visibilityObserver = new IntersectionObserver(
      entries => {
        const isIntersecting = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.22);

        if (!isIntersecting) {
          return;
        }

        this.isVisible.set(true);
        this.visibilityObserver?.disconnect();
        this.visibilityObserver = undefined;
      },
      {
        threshold: [0.22, 0.4],
        rootMargin: '0px 0px -8% 0px'
      }
    );

    this.visibilityObserver.observe(section);
  }

  ngOnDestroy(): void {
    this.visibilityObserver?.disconnect();

    if (this.featureHighlightTimeout) {
      clearTimeout(this.featureHighlightTimeout);
    }
  }

  @HostListener('document:keydown.escape')
  protected handleEscapeKey(): void {
    if (this.isViewerOpen()) {
      this.closeViewer();
    }
  }

  protected selectCategory(index: number): void {
    if (index === this.activeCategoryIndex()) {
      return;
    }

    this.activeCategoryIndex.set(index);
    this.activeImageIndex.set(0);
    this.featureHighlighted.set(false);
    this.isViewerOpen.set(false);

    if (this.featureHighlightTimeout) {
      clearTimeout(this.featureHighlightTimeout);
      this.featureHighlightTimeout = undefined;
    }
  }

  protected selectImage(index: number): void {
    this.activeImageIndex.set(index);
    this.triggerFeatureHighlight();
    this.scrollFeatureIntoViewOnMobile();
  }

  protected openViewer(): void {
    this.isViewerOpen.set(true);
  }

  protected closeViewer(): void {
    this.isViewerOpen.set(false);
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

  private scrollFeatureIntoViewOnMobile(): void {
    if (typeof window === 'undefined' || window.innerWidth > 899) {
      return;
    }

    const feature = this.galleryFeature?.nativeElement;

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
}
