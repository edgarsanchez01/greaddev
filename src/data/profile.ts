import type { Profile } from '../types/content.ts';

export const profile: Profile = {
  brand: 'GreadDev',
  name: 'Edgar Sánchez Flores',
  role: 'Full-Stack Developer / Backend-focused Software Engineer',
  summary:
    'Desarrollador Full-Stack con enfoque backend. Desarrollo APIs REST, sistemas empresariales y aplicaciones de comercio electrónico con Java, Spring y bases de datos, con experiencia en seguridad, integración de servicios y modernización de sistemas legacy.',
  about:
    'Tengo experiencia en sistemas de punto de venta, comercio electrónico y reportes de riesgos financieros. He trabajado en desarrollo backend, integración de APIs y aplicaciones web, participando en equipos Scrum.',
  collaboration:
    'Trabajo en equipo con comunicación clara y respetuosa, adaptándome a distintos entornos de colaboración.',
  email: 'edgar.sanchez8999@gmail.com',
  githubUrl: 'https://github.com/edgarsanchez01',
  linkedinUrl: 'https://www.linkedin.com/in/edgar-sanchez01',
  languages: [
    {
      name: 'Inglés',
      level: 'Intermedio',
      context: 'Técnico',
      sources: [{ source: 'cv', page: 2, section: 'Idiomas' }],
    },
  ],
  sources: [
    { source: 'prd', section: '5. Public identity' },
    { source: 'cv', page: 1, section: 'Acerca de mí y Experiencia' },
    { source: 'cv', page: 2, section: 'Experiencia y Habilidades Sociales' },
  ],
};
