import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

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
export class HomeGalleryComponent {
  readonly content = input.required<HomeGalleryContent>();

  protected readonly activeCategoryIndex = signal(0);
  protected readonly activeImageIndex = signal(0);

  protected readonly activeCategory = computed(() => {
    const categories = this.content().categories;
    return categories[this.activeCategoryIndex()] ?? categories[0];
  });

  protected readonly activeImage = computed(() => {
    const category = this.activeCategory();
    return category.images[this.activeImageIndex()] ?? category.images[0];
  });

  protected selectCategory(index: number): void {
    if (index === this.activeCategoryIndex()) {
      return;
    }

    this.activeCategoryIndex.set(index);
    this.activeImageIndex.set(0);
  }

  protected selectImage(index: number): void {
    this.activeImageIndex.set(index);
  }
}
