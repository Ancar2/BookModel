import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NavbarItem {
  readonly label: string;
  readonly href: string;
}

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeNavbarComponent {
  protected readonly menuOpen = signal(false);

  protected readonly navigationItems: readonly NavbarItem[] = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Book', href: '#book' },
    { label: 'Editorial', href: '#editorial' },
    { label: 'Contacto', href: '#contacto' }
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
