import type { Certification, SourceReference } from '../types/content.ts';

const source = { source: 'cv', page: 2, section: 'Certificados' } as const satisfies SourceReference;

/** Titles are declared in the CV; no issuer, credential link or missing year is inferred. */
export const certifications = [
  {
    id: 'spring-batch',
    title: 'Spring Batch',
    issuedAt: { precision: 'year', year: 2025 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'mysql-supabase',
    title: 'MySQL desde 0 hasta SUPABASE',
    issuedAt: { precision: 'year', year: 2025 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'javascript-react',
    title: 'JavaScript Intensivo: Camino hacia React',
    issuedAt: { precision: 'year', year: 2025 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'spring-boot-rest-cloud',
    title: 'Spring Boot + API REST + Cloud',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'spring-boot-rest-containers',
    title: 'Spring Boot + API REST + Docker + Kubernetes',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'angular',
    title: 'Angular',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'spring-boot-rest',
    title: 'Spring Boot + API REST',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'spring-mvc',
    title: 'Spring Framework + MVC',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'javascript-introduction',
    title: 'Iniciación a la Programación con JavaScript',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'typescript-beginners',
    title: 'TypeScript para Principiantes',
    issuedAt: { precision: 'year', year: 2024 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'responsive-web-design-v8',
    title: 'Legacy Responsive Web Design V8',
    issuedAt: { precision: 'year', year: 2022 },
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
  {
    id: 'professional-scrum-master-i',
    title: 'Professional Scrum Master I',
    evidenceStatus: 'declared-in-cv',
    sources: [source],
  },
] as const satisfies readonly Certification[];
