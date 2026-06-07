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
    eyebrow: 'Mafe Ayala',
    title: 'Imagen, actitud y presencia',
    highlight: 'para editoriales y campanas.',
    description:
      'Descubre el book de Mafe Ayala, una propuesta visual pensada para marcas, agencias y proyectos que buscan una presencia autentica, versatil y lista para destacar frente a camara.',
    primaryCtaLabel: 'Ver book',
    primaryCtaLink: '/auth/register',
    secondaryCtaLabel: 'Contactar',
    secondaryCtaLink: '/auth/login',
    metrics: [
      { label: 'Editoriales', value: '24+' },
      { label: 'Campanas', value: '12' },
      { label: 'Ciudades', value: 'Bogota / CDMX / Miami' }
    ],
    showcaseTag: 'Portafolio destacado',
    showcaseTitle: 'Una identidad visual que conecta con moda, campanas y contenido editorial.',
    showcaseSubtitle:
      'Explora una seleccion de imagenes y video donde Mafe Ayala proyecta versatilidad, caracter y una presencia lista para nuevas oportunidades.'
  };
}
