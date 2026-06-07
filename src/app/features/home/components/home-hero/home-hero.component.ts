import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input
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
  readonly socialLinks: readonly HomeHeroSocialLink[];
}

export interface HomeHeroSocialLink {
  readonly label: string;
  readonly href: string;
}

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent implements AfterViewInit {
  @ViewChild('demoVideo')
  private readonly demoVideo?: ElementRef<HTMLVideoElement>;

  readonly content = input.required<HomeHeroContent>();

  ngAfterViewInit(): void {
    this.ensureVideoMuted();
  }

  ensureVideoMuted(): void {
    const video = this.demoVideo?.nativeElement;

    if (!video) {
      return;
    }

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;

    void video.play().catch(() => undefined);
  }
}
