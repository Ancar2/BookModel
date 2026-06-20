import { HomeContactContent } from '../components/home-contact/home-contact.component';

const whatsappMessage = encodeURIComponent(
  'Hola, quiero contactar a Mafe Ayala para solicitar informacion sobre booking y colaboraciones.'
);

export const HOME_CONTACT_CONTENT: HomeContactContent = {
  eyebrow: 'Bookings | Contacto',
  title: 'Hablemos de',
  highlight: 'tu proximo booking',
  description:
    'Si buscas una presencia editorial cuidada, actitud frente a camara y una imagen premium para tu marca, campaña o produccion, conversemos directo por WhatsApp.',
  ctaLabel: 'Escribir por WhatsApp',
  whatsappHref: `https://wa.me/573226091149?text=${whatsappMessage}`,
  phoneLabel: '+57 322 609 1149'
};
