import { HomeHeroContent } from '../components/home-hero/home-hero.component';

export const HERO_CONTENT: HomeHeroContent = {
  eyebrow: 'Editorial & Commercial',
  title: 'Mafe',
  highlight: 'Ayala',
  description:
    'Un portafolio visual creado para moda, belleza y campañas de marca.',
  primaryCtaLabel: 'Ver portafolio',
  primaryCtaLink: '/auth/register',
  secondaryCtaLabel: 'Solicitar book',
  secondaryCtaLink: '/auth/login',
  photoCard: {
    src: '/photos/cardHero.jpg'
  },
  videoCard: {
    src: '/videos/demo-all.MOV',
    label: 'Reel Model',
    duration: '00:28',
    ariaLabel: 'Video demo de pasarela'
  },
  socialLinks: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'TikTok', href: 'https://tiktok.com/' },
    { label: 'Email', href: 'mailto:booking@mafeayala.com' }
  ]
};
