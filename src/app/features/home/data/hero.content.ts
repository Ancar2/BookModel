import { HomeHeroContent } from '../components/home-hero/home-hero.component';

const whatsappMessage = encodeURIComponent(
  'Hola, quiero contactar a Mafe Ayala para solicitar informacion sobre booking y colaboraciones.'
);

export const HERO_CONTENT: HomeHeroContent = {
  eyebrow: 'Editorial & Commercial',
  title: 'Mafe',
  highlight: 'Ayala',
  description:
    'Un portafolio visual creado para moda, belleza y campañas de marca.',
  primaryCtaLabel: 'Ver galeria',
  primaryCtaLink: '#galeria',
  secondaryCtaLabel: 'Contactar',
  secondaryCtaLink: `https://wa.me/573226091149?text=${whatsappMessage}`,
  photoCard: {
    src: '/photos/cardHero.jpg'
  },
  videoCard: {
    src: '/videos/video1.MOV',
    label: 'Reel Model',
    duration: '00:28',
    ariaLabel: 'Video demo de pasarela'
  },
  socialLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/mafe13284?igsh=andic2h1d3h4azdx' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@mafeayala86?_r=1&_t=ZS-97Mj2WWbycM' },
    { label: 'WhatsApp', href: `https://wa.me/573226091149?text=${whatsappMessage}` }
  ]
};
