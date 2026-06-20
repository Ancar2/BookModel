import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeIntroComponent, HomeNavbarComponent, HomeHeroComponent, HomeMeasurementsComponent, HomeAboutComponent, HomeGalleryComponent, HomeBrandsComponent, HomeReelsComponent, HomeContactComponent, HomeFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  protected readonly aboutContent = HOME_ABOUT_CONTENT;
  protected readonly brandsContent = HOME_BRANDS_CONTENT;
  protected readonly contactContent = HOME_CONTACT_CONTENT;
  protected readonly footerContent = HOME_FOOTER_CONTENT;
  protected readonly galleryContent = HOME_GALLERY_CONTENT;
  protected readonly heroContent = HERO_CONTENT;
  protected readonly measurements = HOME_MEASUREMENTS;
  protected readonly reelsContent = HOME_REELS_CONTENT;

  ngAfterViewInit(): void {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }
}
