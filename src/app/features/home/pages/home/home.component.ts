import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  HomeHeroComponent,
  HomeHeroContent
} from '../../components/home-hero/home-hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeHeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  protected readonly heroContent: HomeHeroContent = {
    eyebrow: 'Model Book 2026',
    title: 'Presence that owns the frame,',
    highlight: 'story that stays with it.',
    description:
      'An editorial-first introduction for a model book that feels premium, modern and ready to scale into campaigns, polaroids, runway and contact sections.',
    primaryCtaLabel: 'View portfolio',
    primaryCtaLink: '/auth/register',
    secondaryCtaLabel: 'Book a session',
    secondaryCtaLink: '/auth/login',
    metrics: [
      { label: 'Editorials', value: '24+' },
      { label: 'Campaigns', value: '12' },
      { label: 'Cities', value: 'Bogota / CDMX / Miami' }
    ],
    showcaseTag: 'New face selection',
    showcaseTitle: 'Editorial identity with a cinematic fashion mood.',
    showcaseSubtitle:
      'Structured as a modular homepage so each next section can evolve independently without coupling layout, copy and showcase logic.'
  };
}
