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
  private viewerTouchStartX?: number;
  private viewerTouchStartY?: number;
  private viewerSwipeTriggered = false;
  private viewerPointerId?: number;
  private previousBodyOverflow = '';

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
    this.unlockBodyScroll();

    if (this.featureHighlightTimeout) {
      clearTimeout(this.featureHighlightTimeout);
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected handleViewerKeydown(event: KeyboardEvent): void {
    if (!this.isViewerOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeViewer();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.goToNextImage();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.goToPreviousImage();
    }
  }

  protected selectCategory(index: number): void {
    if (index === this.activeCategoryIndex()) {
      return;
    }

    this.activeCategoryIndex.set(index);
    this.activeImageIndex.set(0);
    this.featureHighlighted.set(false);
    this.closeViewer();

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
    this.lockBodyScroll();
  }

  protected closeViewer(): void {
    this.isViewerOpen.set(false);
    this.unlockBodyScroll();
  }

  protected goToNextImage(): void {
    const images = this.activeCategory().images;

    if (!images.length) {
      return;
    }

    this.activeImageIndex.update(index => (index + 1) % images.length);
  }

  protected goToPreviousImage(): void {
    const images = this.activeCategory().images;

    if (!images.length) {
      return;
    }

    this.activeImageIndex.update(index => (index - 1 + images.length) % images.length);
  }

  protected onViewerTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    this.viewerTouchStartX = touch.clientX;
    this.viewerTouchStartY = touch.clientY;
    this.viewerSwipeTriggered = false;
  }

  protected onViewerTouchMove(event: TouchEvent): void {
    if (this.viewerTouchStartX === undefined || this.viewerTouchStartY === undefined || this.viewerSwipeTriggered) {
      return;
    }

    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - this.viewerTouchStartX;
    const deltaY = touch.clientY - this.viewerTouchStartY;

    if (Math.abs(deltaX) < 30 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    event.preventDefault();
    this.viewerSwipeTriggered = true;

    if (deltaX < 0) {
      this.goToNextImage();
    } else {
      this.goToPreviousImage();
    }

    this.resetViewerTouchState();
  }

  protected onViewerTouchEnd(event: TouchEvent): void {
    if (this.viewerTouchStartX === undefined || this.viewerTouchStartY === undefined) {
      return;
    }

    const touch = event.changedTouches[0];

    if (!touch) {
      this.resetViewerTouchState();
      return;
    }

    const deltaX = touch.clientX - this.viewerTouchStartX;
    const deltaY = touch.clientY - this.viewerTouchStartY;

    this.resetViewerTouchState();

    if (Math.abs(deltaX) < 28 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      this.goToNextImage();
      return;
    }

    this.goToPreviousImage();
  }

  protected onViewerTouchCancel(): void {
    this.resetViewerTouchState();
  }

  protected onViewerPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') {
      return;
    }

    this.viewerPointerId = event.pointerId;
    this.viewerTouchStartX = event.clientX;
    this.viewerTouchStartY = event.clientY;
    this.viewerSwipeTriggered = false;
  }

  protected onViewerPointerMove(event: PointerEvent): void {
    if (
      this.viewerPointerId !== event.pointerId ||
      this.viewerTouchStartX === undefined ||
      this.viewerTouchStartY === undefined ||
      this.viewerSwipeTriggered
    ) {
      return;
    }

    const deltaX = event.clientX - this.viewerTouchStartX;
    const deltaY = event.clientY - this.viewerTouchStartY;

    if (Math.abs(deltaX) < 30 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    event.preventDefault();
    this.viewerSwipeTriggered = true;

    if (deltaX < 0) {
      this.goToNextImage();
    } else {
      this.goToPreviousImage();
    }

    this.resetViewerTouchState();
  }

  protected onViewerPointerUp(event: PointerEvent): void {
    if (this.viewerPointerId !== event.pointerId) {
      return;
    }

    this.resetViewerTouchState();
  }

  protected onViewerPointerCancel(event: PointerEvent): void {
    if (this.viewerPointerId !== event.pointerId) {
      return;
    }

    this.resetViewerTouchState();
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

  private resetViewerTouchState(): void {
    this.viewerTouchStartX = undefined;
    this.viewerTouchStartY = undefined;
    this.viewerSwipeTriggered = false;
    this.viewerPointerId = undefined;
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
