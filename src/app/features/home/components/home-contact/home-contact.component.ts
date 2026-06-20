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

export interface HomeContactContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly highlight: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly whatsappHref: string;
  readonly phoneLabel: string;
}

@Component({
  selector: 'app-home-contact',
  standalone: true,
  templateUrl: './home-contact.component.html',
  styleUrl: './home-contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContactComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contactSection')
  private readonly contactSection?: ElementRef<HTMLElement>;

  readonly content = input.required<HomeContactContent>();
  protected readonly isVisible = signal(false);

  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    const section = this.contactSection?.nativeElement;

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
}
