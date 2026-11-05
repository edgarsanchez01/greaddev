/**
 * Development-only editorial handoff. Do not import this module into public content,
 * pages, client bundles, metadata or JSON-LD. It contains no private CV values.
 * This file records decisions; it does not implement any later phase.
 */
export const phase1Editorial = {
  phase: 1,
  scope: 'Cierre editorial y modelo de contenido; fases 2 a 8 no autorizadas.',
  professionalSource: 'Edgar Sanchez Flores.pdf, páginas 1 y 2',
  approvedDecisions: [
    {
      id: 'featured-projects',
      authority: 'Aprobación del propietario en BUILD Fase 1, sección 1.',
      decision: 'Cuatro proyectos, en orden: Belomora, NFQ Advisory, Carlos Vassan y SISTEMAS-EC. DentalClinic queda fuera del MVP.',
    },
    {
      id: 'minimalist-hero',
      appliesInPhase: 3,
      authority: 'Aprobación del propietario en BUILD Fase 1, sección 1.',
      decision: 'Conservar la distribución editorial del mockup con Sombra original como protagonista visual del lado derecho. No reproducir escritorio, portátil, ventana, taza ni planta; no modificar o regenerar la mascota.',
    },
    {
      id: 'adaptive-hero-height',
      appliesInPhase: 3,
      authority: 'Aprobación del propietario en BUILD Fase 1, sección 1.',
      decision: 'Hero compacto y adaptable, sin altura fija de 90svh; la jerarquía y el contenido determinan su altura en pantallas pequeñas.',
    },
    {
      id: 'complete-content',
      authority: 'Aprobación del propietario en BUILD Fase 1, sección 1.',
      decision: 'Conservar las cuatro experiencias, responsabilidades, tecnologías, educación y certificados. No recortar información para igualar la altura del mockup.',
    },
  ],
  publicationRules: [
    'src/data contiene solo contenido público seleccionado, nunca el texto completo del CV ni sus identificadores administrativos o teléfono.',
    'Las fuentes de cada registro señalan documento, página y sección; no importan el PDF original.',
    'Las habilidades declaradas no equivalen a dominio ni a experiencia en todas las empresas. Su uso concreto se consulta en experience.ts.',
    'Los certificados son declaraciones del CV, no credenciales verificadas de forma independiente.',
    'No publicar el CV original. La revisión y creación del CV sanitizado corresponden a la Fase 6.',
    'Los datos profesionales y las fuentes no deben serializarse indiscriminadamente a un cliente; renderizar solo campos necesarios.',
  ],
  pending: [
    {
      id: 'carlos-data-jpa',
      status: 'pending-owner-confirmation',
      affected: 'Carlos Vassan / tecnologías de la experiencia y proyecto',
      question: 'El CV menciona Data JPA junto a Node.js. ¿Existió un servicio Java separado o es una referencia incorrecta?',
      treatment: 'No asociar Java, JPA, Spring Data JPA ni Spring a Carlos Vassan mientras no se aclare. Se conserva el trabajo REST confirmado.',
    },
    {
      id: 'sistemas-react',
      status: 'pending-owner-confirmation',
      affected: 'Consultoría SISTEMAS-EC / tecnologías',
      question: 'La mención de VS Code como editor para React no describe una contribución concreta. ¿Qué trabajo React se realizó?',
      treatment: 'Conservar VS Code como herramienta mencionada; no atribuir contribuciones React a esta experiencia.',
    },
    {
      id: 'project-links-and-assets',
      status: 'pending-verification',
      affected: 'Los cuatro proyectos',
      question: 'Faltan repositorios exactos, demos, casos de estudio y capturas autorizadas.',
      treatment: 'Omitir repositoryUrl, liveUrl, caseStudyPath e image. No inferir repositorios por nombres parecidos.',
    },
    {
      id: 'professional-confidentiality',
      status: 'pending-owner-confirmation',
      affected: 'Material profesional o de clientes de los cuatro proyectos',
      question: 'Confirmar qué detalles y recursos pueden publicarse antes de ampliar el contenido derivado del CV.',
      treatment: 'Mantener resúmenes de alto nivel y contribuciones ya declaradas; no incluir código, capturas internas, clientes adicionales ni afirmar permiso de publicación de assets.',
    },
    {
      id: 'education-dates',
      status: 'pending-owner-confirmation',
      affected: 'Fechas individuales de Ingeniería y TSU',
      question: 'El CV solo presenta el periodo institucional conjunto 2021–2025.',
      treatment: 'Conservar ese periodo en la institución y omitir periodos por titulación.',
    },
    {
      id: 'certification-credentials',
      status: 'pending-verification',
      affected: 'Los trece certificados declarados',
      question: 'Faltan emisores, identificadores, enlaces verificables y el año de Professional Scrum Master I.',
      treatment: 'Campos opcionales ausentes; no convertir títulos de cursos en evidencia de experiencia profesional.',
    },
    {
      id: 'availability-and-cv',
      status: 'pending-owner-confirmation',
      affected: 'Perfil público',
      question: 'No se ha confirmado disponibilidad laboral ni aprobado un CV público sanitizado.',
      treatment: 'Omitir availability y cvUrl. El CV se prepara en la Fase 6.',
    },
    {
      id: 'production-domain',
      status: 'pending-owner-confirmation',
      affected: 'SEO y despliegue futuros',
      question: 'Faltan dominio y proveedor de hosting.',
      treatment: 'No inventar URL de producción, canonical ni sitemap.',
    },
  ],
  canonicalDiscrepancies: [
    {
      source: 'Design-System.md / 9. Components / Hero',
      discrepancy: 'El texto anterior propone pantalla completa o aproximadamente 90svh.',
      resolution: 'La aprobación explícita actual establece Hero compacto y adaptable. No se modifica el Markdown; aplicar en Fase 3.',
    },
    {
      source: 'AGENTS.md / Implementation workflow',
      discrepancy: 'La numeración documental 0–5 difiere del PLAN aprobado 0–8; su Fase 1 es Plan.',
      resolution: 'Para esta entrega se sigue el alcance explícitamente autorizado: Fase 1 del PLAN 0–8. No se ejecuta Foundation ni ninguna fase posterior.',
    },
    {
      source: 'PRD.md / 7.4 Experience',
      discrepancy: 'La propuesta de 2–4 bullets por entrada es más breve que el inventario completo de contribuciones verificadas.',
      resolution: 'Conservar todas las contribuciones en el modelo; su agrupación visual se decidirá en una fase visual autorizada, sin eliminar información.',
    },
  ],
  sombraHandoff: {
    appliesInPhase: 3,
    canonicalReference: 'pet/Sombra/references/canonical-base.png',
    approvedAtlas: 'pet/Sombra/final/spritesheet-extended.png',
    staticFallbackSource: 'pet/Sombra/final-frames/idle/00.png',
    note: 'El atlas V2 y los frames finales se inspeccionaron en PLAN. No usar frames/ como autoridad ni decoded/ o qa/ como assets de producción. No copiar ni modificar recursos en Fase 1.',
  },
} as const;
