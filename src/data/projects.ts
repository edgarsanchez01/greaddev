import type { Project, ProjectId } from '../types/content.ts';

/** Approved featured order. Resolve role, period and contributions through experienceId. */
export const projects = {
  'belomora-ecommerce': {
    title: 'Belomora — E-commerce',
    summary:
      'Plataforma de comercio electrónico con backend modular, seguridad por roles, inventario con control de concurrencia e integración de pagos.',
    experienceId: 'belomora',
    featured: true,
    technologyIds: ['java', 'spring-boot', 'spring-security', 'postgresql', 'react', 'typescript', 'docker'],
    contributionIds: [
      'modular-backend',
      'commerce-apis',
      'role-based-security',
      'inventory-concurrency',
      'payment-integration',
      'react-frontend',
      'security-debugging',
      'development-environment',
    ],
  },
  'financial-risk-migration': {
    title: 'Migración de Sistemas de Riesgos',
    summary:
      'Contribuciones a la evolución de reportes de riesgos financieros y a una transición gradual desde Sybase hacia CSV generados por Murex, compatible con el sistema legacy.',
    experienceId: 'nfq-advisory',
    featured: true,
    technologyIds: ['java', 'spring-framework', 'maven', 'sybase', 'csv', 'feature-flags'],
    contributionIds: [
      'gradual-execution',
      'csv-processing',
      'legacy-procedure-analysis',
      'layout-mapping',
      'legacy-maintenance',
    ],
  },
  'mobile-device-comparison': {
    title: 'Plataforma de comparación móvil',
    summary:
      'Backend para comparar dispositivos móviles, con APIs conectadas a MySQL y optimización de consultas e índices para las búsquedas.',
    experienceId: 'carlos-vassan',
    featured: true,
    technologyIds: ['javascript', 'node-js', 'mysql', 'sql', 'rest'],
    contributionIds: ['device-apis', 'search-optimization', 'rest-operations', 'server-automation'],
  },
  'pos-ecommerce': {
    title: 'Punto de venta / e-commerce',
    summary:
      'Contribuciones a un punto de venta y tienda online de productos de cómputo, con APIs REST, datos Oracle, interfaz Angular y despliegue en contenedores.',
    experienceId: 'sistemas-ec',
    featured: true,
    technologyIds: ['spring-boot', 'angular', 'oracle', 'pl-sql', 'docker', 'kubernetes'],
    contributionIds: [
      'pos-maintenance',
      'oracle-data',
      'external-catalogs',
      'service-integration',
      'angular-crud',
      'api-security',
      'testing-documentation',
      'container-deployment',
      'software-quality',
    ],
  },
} as const satisfies Record<ProjectId, Project>;
