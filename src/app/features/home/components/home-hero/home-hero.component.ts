import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HomeHeroStat {
  readonly label: string;
  readonly value: string;
}

export interface HomeHeroContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly highlight: string;
  readonly description: string;
  readonly primaryCtaLabel: string;
  readonly primaryCtaLink: string;
  readonly secondaryCtaLabel: string;
  readonly secondaryCtaLink: string;
  readonly metrics: readonly HomeHeroStat[];
  readonly showcaseTag: string;
  readonly showcaseTitle: string;
  readonly showcaseSubtitle: string;
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
export class HomeHeroComponent {
  readonly content = input.required<HomeHeroContent>();
}
