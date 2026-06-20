import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  private readonly document = inject(DOCUMENT);
  private readonly whatsappMessage = encodeURIComponent(
    'Hola, quiero contactar a Mafe Ayala para solicitar informacion sobre booking y colaboraciones.'
  );

  protected readonly menuOpen = signal(false);

  protected readonly navigationItems: readonly NavbarItem[] = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Sobre Mi', href: '#sobre-mi' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Reels', href: '#reels' }
  ];
  protected readonly whatsappHref = `https://wa.me/573226091149?text=${this.whatsappMessage}`;

  protected toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected scrollToSection(event: Event, href: string): void {
    event.preventDefault();
    this.closeMenu();

    const targetId = href.replace('#', '');
    const target = this.document.getElementById(targetId);

    if (!target) {
      return;
    }

    const navbarHeight = this.getNavbarHeight();
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth'
    });
  }

  private getNavbarHeight(): number {
    const rootStyles = getComputedStyle(this.document.documentElement);
    const navbarHeight = rootStyles.getPropertyValue('--home-navbar-height').trim();
    const parsedHeight = Number.parseFloat(navbarHeight);

    if (Number.isNaN(parsedHeight)) {
      return 72;
    }

    return navbarHeight.endsWith('rem')
      ? parsedHeight * Number.parseFloat(getComputedStyle(this.document.documentElement).fontSize)
      : parsedHeight;
  }
}
