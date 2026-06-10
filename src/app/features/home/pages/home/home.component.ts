import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeAboutComponent } from '../../components/home-about/home-about.component';
import { HomeHeroComponent } from '../../components/home-hero/home-hero.component';
import { HomeIntroComponent } from '../../components/home-intro/home-intro.component';
import { HomeMeasurementsComponent } from '../../components/home-measurements/home-measurements.component';
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
import { HOME_ABOUT_CONTENT } from '../../data/about.content';
import { HERO_CONTENT } from '../../data/hero.content';
import { HOME_MEASUREMENTS } from '../../data/measurements.content';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeIntroComponent, HomeNavbarComponent, HomeHeroComponent, HomeMeasurementsComponent, HomeAboutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  protected readonly aboutContent = HOME_ABOUT_CONTENT;
  protected readonly heroContent = HERO_CONTENT;
  protected readonly measurements = HOME_MEASUREMENTS;

  ngAfterViewInit(): void {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }
}
