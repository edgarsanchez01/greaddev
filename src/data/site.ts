import { profile } from './profile.ts';

/** Publication assets only; no production origin is assumed here. */
export const siteIdentity = {
  title: `${profile.brand} — ${profile.name} | Full-Stack & Backend Developer`,
  description:
    'Portfolio de Edgar Sánchez Flores, desarrollador Full-Stack con enfoque backend especializado en Java, Spring Boot, APIs REST, seguridad, bases de datos y aplicaciones web modernas.',
  locale: 'es_MX',
  themeColor: '#08090b',
  social: {
    path: '/og/greaddev.png',
    width: 1200,
    height: 630,
    alt: 'GreadDev — Edgar Sánchez Flores. Desarrollo Full-Stack con enfoque backend.',
    headline: 'Desarrollo Full-Stack con enfoque backend.',
  },
  cv: {
    path: '/cv/Edgar-Sanchez-Flores-CV.pdf',
    filename: 'Edgar-Sanchez-Flores-CV.pdf',
    label: 'Descargar CV (PDF)',
  },
} as const;
