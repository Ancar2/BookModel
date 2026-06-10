import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
export class HomeAboutComponent {
  readonly content = input.required<HomeAboutContent>();
}
