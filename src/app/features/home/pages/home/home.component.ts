import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeAboutComponent } from '../../components/home-about/home-about.component';
import { HomeBrandsComponent } from '../../components/home-brands/home-brands.component';
import { HomeContactComponent } from '../../components/home-contact/home-contact.component';
import { HomeFooterComponent } from '../../components/home-footer/home-footer.component';
import { HomeGalleryComponent } from '../../components/home-gallery/home-gallery.component';
import { HomeHeroComponent } from '../../components/home-hero/home-hero.component';
import { HomeIntroComponent } from '../../components/home-intro/home-intro.component';
import { HomeMeasurementsComponent } from '../../components/home-measurements/home-measurements.component';
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
import { HomeReelsComponent } from '../../components/home-reels/home-reels.component';
import { HOME_ABOUT_CONTENT } from '../../data/about.content';
import { HOME_BRANDS_CONTENT } from '../../data/brands.content';
import { HOME_CONTACT_CONTENT } from '../../data/contact.content';
import { HOME_FOOTER_CONTENT } from '../../data/footer.content';
import { HOME_GALLERY_CONTENT } from '../../data/gallery.content';
import { HERO_CONTENT } from '../../data/hero.content';
import { HOME_MEASUREMENTS } from '../../data/measurements.content';
import { HOME_REELS_CONTENT } from '../../data/reels.content';
import { SeoService } from '../../../../core/services/seo.service';

const SITE_URL = 'https://mafeayala.clabs.click';
const HOME_SEO_TITLE = 'Mafe Ayala | Modelo Profesional Editorial y Comercial';
const HOME_SEO_DESCRIPTION =
  'Mafe Ayala es una modelo profesional con enfoque editorial y comercial. Explora su portafolio, book, reels y contacto para campañas, shootings y colaboraciones.';
const HOME_SEO_KEYWORDS =
  'Mafe Ayala, modelo profesional, modelo editorial, modelo comercial, book de modelo, portafolio de modelo, reels de modelo, booking de modelos, fashion model Colombia';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeIntroComponent, HomeNavbarComponent, HomeHeroComponent, HomeMeasurementsComponent, HomeAboutComponent, HomeGalleryComponent, HomeBrandsComponent, HomeReelsComponent, HomeContactComponent, HomeFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly seoService = inject(SeoService);

  protected readonly aboutContent = HOME_ABOUT_CONTENT;
  protected readonly brandsContent = HOME_BRANDS_CONTENT;
  protected readonly contactContent = HOME_CONTACT_CONTENT;
  protected readonly footerContent = HOME_FOOTER_CONTENT;
  protected readonly galleryContent = HOME_GALLERY_CONTENT;
  protected readonly heroContent = HERO_CONTENT;
  protected readonly measurements = HOME_MEASUREMENTS;
  protected readonly reelsContent = HOME_REELS_CONTENT;

  constructor() {
    this.seoService.updatePage({
      title: HOME_SEO_TITLE,
      description: HOME_SEO_DESCRIPTION,
      keywords: HOME_SEO_KEYWORDS,
      path: `${SITE_URL}/`,
      image: `${SITE_URL}/photos/hero.jpg`,
      imageAlt: 'Portafolio editorial y comercial de la modelo Mafe Ayala',
      type: 'profile',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Mafe Ayala',
          jobTitle: 'Modelo profesional',
          description: HOME_SEO_DESCRIPTION,
          image: `${SITE_URL}/photos/hero.jpg`,
          url: `${SITE_URL}/`,
          sameAs: HERO_CONTENT.socialLinks.map((item) => item.href),
          knowsAbout: ['Moda editorial', 'Modelaje comercial', 'Pasarela', 'Beauty campaigns'],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'booking',
            telephone: '+57 322 609 1149',
            availableLanguage: ['Spanish']
          }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Mafe Ayala',
          url: `${SITE_URL}/`,
          description: HOME_SEO_DESCRIPTION,
          inLanguage: 'es-CO'
        }
      ]
    });
  }

  ngAfterViewInit(): void {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }
}
