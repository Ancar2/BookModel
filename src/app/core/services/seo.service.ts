import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoMetadata {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  readonly path?: string;
  readonly image?: string;
  readonly imageAlt?: string;
  readonly type?: string;
  readonly robots?: string;
  readonly schema?: Record<string, unknown> | readonly Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  updatePage(metadata: SeoMetadata): void {
    const currentUrl = this.buildAbsoluteUrl(metadata.path ?? '/');
    const imageUrl = this.buildAbsoluteUrl(metadata.image ?? '/photos/hero.jpg');
    const pageType = metadata.type ?? 'profile';
    const robots = metadata.robots ?? 'index, follow, max-image-preview:large';

    this.title.setTitle(metadata.title);

    this.updateNameTag('description', metadata.description);
    this.updateNameTag('keywords', metadata.keywords ?? '');
    this.updateNameTag('author', 'Mafe Ayala');
    this.updateNameTag('robots', robots);
    this.updateNameTag('twitter:card', 'summary_large_image');
    this.updateNameTag('twitter:title', metadata.title);
    this.updateNameTag('twitter:description', metadata.description);
    this.updateNameTag('twitter:image', imageUrl);

    this.updatePropertyTag('og:locale', 'es_CO');
    this.updatePropertyTag('og:type', pageType);
    this.updatePropertyTag('og:site_name', 'Mafe Ayala');
    this.updatePropertyTag('og:title', metadata.title);
    this.updatePropertyTag('og:description', metadata.description);
    this.updatePropertyTag('og:url', currentUrl);
    this.updatePropertyTag('og:image', imageUrl);
    this.updatePropertyTag('og:image:alt', metadata.imageAlt ?? 'Portafolio profesional de Mafe Ayala');

    this.updateCanonicalLink(currentUrl);

    if (metadata.schema) {
      this.updateStructuredData(this.normalizeStructuredData(metadata.schema));
    }
  }

  private updateNameTag(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private updatePropertyTag(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private updateCanonicalLink(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }

    link.href = href;
  }

  private updateStructuredData(schema: Record<string, unknown> | readonly Record<string, unknown>[]): void {
    const scriptId = 'structured-data-mafe-ayala';
    let script = this.document.head.querySelector<HTMLScriptElement>(`script#${scriptId}`);

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }

  private normalizeStructuredData(
    value: Record<string, unknown> | readonly Record<string, unknown>[]
  ): Record<string, unknown> | readonly Record<string, unknown>[] {
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeStructuredData(item) as Record<string, unknown>);
    }

    const normalizedEntries = Object.entries(value).map(([key, entryValue]) => {
      if (
        typeof entryValue === 'string' &&
        ['url', 'image', 'logo', 'contentUrl'].includes(key) &&
        entryValue.startsWith('/')
      ) {
        return [key, this.buildAbsoluteUrl(entryValue)];
      }

      if (Array.isArray(entryValue)) {
        return [
          key,
          entryValue.map((item) =>
            typeof item === 'object' && item !== null
              ? (this.normalizeStructuredData(item as Record<string, unknown>) as Record<string, unknown>)
              : item
          )
        ];
      }

      if (typeof entryValue === 'object' && entryValue !== null) {
        return [key, this.normalizeStructuredData(entryValue as Record<string, unknown>)];
      }

      return [key, entryValue];
    });

    return Object.fromEntries(normalizedEntries);
  }

  private buildAbsoluteUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const origin = this.document.location?.origin;

    if (!origin) {
      return path;
    }

    return new URL(path, origin).toString();
  }
}
