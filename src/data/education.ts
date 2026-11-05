import type { Education } from '../types/content.ts';

export const education = [
  {
    id: 'ut-tehuacan',
    institution: 'Universidad Tecnológica de Tehuacán',
    period: {
      start: { precision: 'year', year: 2021 },
      end: { precision: 'year', year: 2025 },
    },
    qualifications: [
      {
        id: 'software-engineering',
        title: 'Ingeniería en Desarrollo y Gestión de Software',
      },
      {
        id: 'multiplatform-software-tsu',
        title: 'TSU en Desarrollo de Software Multiplataforma',
      },
    ],
    sources: [{ source: 'cv', page: 1, section: 'Educación' }],
  },
] as const satisfies readonly Education[];
