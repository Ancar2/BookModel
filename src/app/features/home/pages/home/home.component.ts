import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeHeroComponent } from '../../components/home-hero/home-hero.component';
import { HomeIntroComponent } from '../../components/home-intro/home-intro.component';
import { HomeMeasurementsComponent } from '../../components/home-measurements/home-measurements.component';
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
import { HERO_CONTENT } from '../../data/hero.content';
import { HOME_MEASUREMENTS } from '../../data/measurements.content';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeIntroComponent, HomeNavbarComponent, HomeHeroComponent, HomeMeasurementsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  protected readonly heroContent = HERO_CONTENT;
  protected readonly measurements = HOME_MEASUREMENTS;
}
