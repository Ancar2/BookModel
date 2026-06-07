import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import {
  HomeHeroComponent,
  HomeHeroContent
} from '../../components/home-hero/home-hero.component';
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeNavbarComponent, HomeHeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {
  protected readonly showIntro = signal(true);

  private readonly introDurationMs = 3000;
  private readonly introExitDurationMs = 320;
  private readonly introTimeout = window.setTimeout(() => {
    this.showIntro.set(false);
  }, this.introDurationMs + this.introExitDurationMs);

  protected readonly heroContent: HomeHeroContent = {
    eyebrow: 'Editorial & Commercial',
    title: 'Mafe',
    highlight: 'Ayala',
    description:
      'Un portafolio visual creado para moda, belleza y campanas de marca.',
    primaryCtaLabel: 'Ver portafolio',
    primaryCtaLink: '/auth/register',
    secondaryCtaLabel: 'Solicitar book',
    secondaryCtaLink: '/auth/login',
    metrics: [
      { label: 'Editoriales', value: '24+' },
      { label: 'Campanas', value: '12' },
      { label: 'Ciudades', value: 'Bogota / CDMX / Miami' }
    ],
    showcaseTag: 'Portafolio destacado',
    showcaseTitle: 'Una identidad visual que conecta con moda, campanas y contenido editorial.',
    showcaseSubtitle:
      'Explora una seleccion de imagenes y video donde Mafe Ayala proyecta versatilidad, caracter y una presencia lista para nuevas oportunidades.',
    socialLinks: [
      { label: 'Instagram', href: 'https://instagram.com/' },
      { label: 'TikTok', href: 'https://tiktok.com/' },
      { label: 'Email', href: 'mailto:booking@mafeayala.com' }
    ]
  };

  ngOnDestroy(): void {
    window.clearTimeout(this.introTimeout);
  }
}
