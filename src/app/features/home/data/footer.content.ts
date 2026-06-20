import { HomeFooterContent } from '../components/home-footer/home-footer.component';

const whatsappMessage = encodeURIComponent(
  'Hola, quiero contactar a Mafe Ayala para solicitar informacion sobre booking y colaboraciones.'
);

export const HOME_FOOTER_CONTENT: HomeFooterContent = {
  eyebrow: 'Editorial Signature',
  title: 'Mafe Ayala',
  description:
    'Imagen editorial, actitud frente a camara y una presencia visual construida para campañas, reels, marcas y booking de alto nivel.',
  brandLogoSrc: '/logo.png',
  silhouetteSrc: '/iconos/cilueta.gif',
  ctaLabel: 'Ver galeria',
  ctaHref: '#galeria',
  secondaryLabel: 'Contactar',
  secondaryHref: `https://wa.me/573226091149?text=${whatsappMessage}`,
  links: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/mafe13284?igsh=andic2h1d3h4azdx',
      iconSrc: '/iconos/instagram.png'
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@mafeayala86?_r=1&_t=ZS-97Mj2WWbycM',
      iconSrc: '/iconos/tiktok.png'
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/573226091149?text=${whatsappMessage}`,
      iconSrc: '/iconos/whatsapp.png'
    }
  ],
  techHref: 'https://cardenaslabs.com',
  techLabel: 'Desarrollado por',
  techLogoSrc: '/logo-cardenasLABS.png',
  copyright: ''
};
