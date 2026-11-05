import type { Experience, ExperienceId } from '../types/content.ts';

/** Insertion order is reverse chronological; periods and contributions live here only. */
export const experiences = {
  'nfq-advisory': {
    organization: 'NFQ Advisory',
    role: 'Programador Back-end',
    period: {
      start: { precision: 'month', year: 2026, month: 1 },
      end: { precision: 'month', year: 2026, month: 7 },
    },
    summary:
      'Participación en la evolución de reportes de riesgos financieros y en una estrategia de transición desde Sybase hacia archivos CSV generados por Murex, manteniendo compatibilidad con el sistema legacy.',
    contributions: [
      {
        id: 'gradual-execution',
        text: 'Colaboré en una estrategia de ejecución mediante feature flags en archivos .properties, con modalidades Legacy, Murex y Paralelo para facilitar una migración gradual sin modificar el flujo principal de la aplicación.',
      },
      {
        id: 'csv-processing',
        text: 'Desarrollé componentes Java para la lectura, validación y procesamiento de archivos CSV provenientes de Murex.',
      },
      {
        id: 'legacy-procedure-analysis',
        text: 'Participé en el análisis de aproximadamente 38 procedimientos almacenados del sistema legacy para comprender la lógica de negocio y contrastar los datos utilizados por los reportes.',
      },
      {
        id: 'layout-mapping',
        text: 'Colaboré en el análisis y mapeo de layouts CSV y TXT, documentando la correspondencia entre los datos técnicos y la información de los reportes operativos.',
      },
      {
        id: 'legacy-maintenance',
        text: 'Realicé mantenimiento y refactorización de aplicaciones Java legacy, externalizando configuraciones a archivos .properties para distintos ambientes.',
      },
    ],
    technologies: [
      { id: 'java', version: '8' },
      { id: 'spring-framework' },
      { id: 'maven' },
      { id: 'git' },
      { id: 'sybase' },
      { id: 'csv' },
      { id: 'txt' },
      { id: 'properties' },
      { id: 'feature-flags' },
      { id: 'murex', context: 'Sistema generador de los CSV; no implica desarrollo dentro de Murex.' },
      { id: 'scrum' },
    ],
    sources: [{ source: 'cv', page: 1, section: 'Experiencia / Nfq Advisory' }],
  },
  'sistemas-ec': {
    organization: 'Consultoría SISTEMAS-EC',
    role: 'Programador Back-end',
    period: {
      start: { precision: 'month', year: 2025, month: 1 },
      end: { precision: 'month', year: 2025, month: 12 },
    },
    summary:
      'Colaboración en un sistema de punto de venta y tienda online de productos de cómputo, dentro de un equipo de ocho programadores que trabajaba con Scrum.',
    contributions: [
      {
        id: 'pos-maintenance',
        text: 'Colaboré en el desarrollo y mantenimiento del punto de venta y la tienda online, incorporando nuevas funciones con APIs REST en Spring Boot e interfaz Angular.',
      },
      {
        id: 'oracle-data',
        text: 'Participé en la creación de bases de datos Oracle y consultas con PL/SQL, incluidos procedimientos almacenados y triggers.',
      },
      {
        id: 'external-catalogs',
        text: 'Consumí APIs externas para crear catálogos de productos.',
      },
      {
        id: 'service-integration',
        text: 'Trabajé con Feign para consumir APIs REST y con Eureka Server para el registro de microservicios.',
      },
      {
        id: 'angular-crud',
        text: 'Desarrollé consumo de APIs, formularios CRUD y módulos de consulta con Angular.',
      },
      {
        id: 'api-security',
        text: 'Desarrollé APIs REST con Spring Security, autenticación JWT y manejo de roles.',
      },
      {
        id: 'testing-documentation',
        text: 'Desarrollé pruebas de integración de APIs REST y trabajé con documentación Swagger y control de versiones Git.',
      },
      {
        id: 'container-deployment',
        text: 'Creé contenedores Docker y participé en despliegues en pods de Kubernetes.',
      },
      {
        id: 'software-quality',
        text: 'Trabajé con SonarQube para la calidad del software.',
      },
    ],
    technologies: [
      { id: 'spring-boot' },
      { id: 'spring-security' },
      { id: 'jwt' },
      { id: 'oracle' },
      { id: 'pl-sql' },
      { id: 'angular' },
      { id: 'rest' },
      { id: 'feign' },
      { id: 'eureka' },
      { id: 'swagger' },
      { id: 'git' },
      { id: 'integration-testing' },
      { id: 'docker' },
      { id: 'kubernetes' },
      { id: 'sonarqube' },
      { id: 'spring-tool-suite' },
      { id: 'eclipse' },
      { id: 'vs-code', context: 'Editor mencionado en el CV; no acredita una contribución React.' },
      { id: 'scrum' },
    ],
    sources: [{ source: 'cv', page: 1, section: 'Experiencia / Consultoría SISTEMAS-EC' }],
  },
  belomora: {
    organization: 'Belomora',
    role: 'Desarrollador Full-Stack',
    period: {
      start: { precision: 'month', year: 2024, month: 6 },
      end: { precision: 'month', year: 2025, month: 1 },
    },
    summary:
      'Desarrollo de una plataforma e-commerce Full-Stack con enfoque backend y arquitectura modular orientada por dominios.',
    contributions: [
      {
        id: 'modular-backend',
        text: 'Desarrollé el backend modular orientado por dominios con Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate y PostgreSQL.',
      },
      {
        id: 'commerce-apis',
        text: 'Diseñé y desarrollé APIs REST para usuarios, autenticación, productos, categorías, variantes, carrito, direcciones, pedidos, pagos e inventario.',
      },
      {
        id: 'role-based-security',
        text: 'Implementé autenticación y autorización mediante JWT, Spring Security y RBAC, con @PreAuthorize para el control de acceso por roles.',
      },
      {
        id: 'inventory-concurrency',
        text: 'Implementé gestión de inventario con movimientos de stock, ventas, devoluciones, reabastecimientos y ajustes, con control de concurrencia para evitar inconsistencias.',
      },
      {
        id: 'payment-integration',
        text: 'Integré Mercado Pago mediante su SDK y webhooks para la creación de preferencias y actualización de estados de pago.',
      },
      {
        id: 'react-frontend',
        text: 'Desarrollé el frontend con React, TypeScript, Vite, React Router, TanStack Query, Zustand, Axios y Tailwind CSS, integrándolo con las APIs REST del backend.',
      },
      {
        id: 'security-debugging',
        text: 'Analicé y corregí un problema en el flujo 401/403 de Spring Security y el error dispatch de Tomcat mediante logs, cURL y Java Flight Recorder.',
      },
      {
        id: 'development-environment',
        text: 'Utilicé Maven, Docker, Docker Compose, Git/GitHub, Postman e IntelliJ IDEA para desarrollo, pruebas, control de versiones y configuración del entorno.',
      },
    ],
    technologies: [
      { id: 'java' },
      { id: 'spring-boot' },
      { id: 'spring-security' },
      { id: 'spring-data-jpa' },
      { id: 'jpa' },
      { id: 'hibernate' },
      { id: 'postgresql' },
      { id: 'rest' },
      { id: 'jwt' },
      { id: 'rbac' },
      { id: 'mercado-pago' },
      { id: 'webhooks' },
      { id: 'react' },
      { id: 'typescript' },
      { id: 'vite' },
      { id: 'react-router' },
      { id: 'tanstack-query' },
      { id: 'zustand' },
      { id: 'axios' },
      { id: 'tailwind-css' },
      { id: 'maven' },
      { id: 'docker' },
      { id: 'docker-compose' },
      { id: 'git' },
      { id: 'github' },
      { id: 'postman' },
      { id: 'intellij-idea' },
      { id: 'curl' },
      { id: 'java-flight-recorder' },
      { id: 'apache-tomcat', context: 'Diagnóstico del error dispatch; no se afirma administración del servidor.' },
    ],
    sources: [{ source: 'cv', page: 2, section: 'Experiencia / Belomora' }],
  },
  'carlos-vassan': {
    organization: 'Carlos Vassan',
    role: 'Desarrollador Backend',
    period: {
      start: { precision: 'month', year: 2024, month: 1 },
      end: { precision: 'month', year: 2024, month: 6 },
    },
    summary:
      'Desarrollo backend para una plataforma de comparación de dispositivos móviles, con APIs Node.js conectadas a MySQL.',
    contributions: [
      {
        id: 'device-apis',
        text: 'Desarrollé funcionalidades backend con JavaScript ES6 y Node.js, creando APIs conectadas a MySQL para gestionar la información de dispositivos.',
      },
      {
        id: 'search-optimization',
        text: 'Optimicé consultas SQL e índices, reduciendo los tiempos de búsqueda en un 20 %, según el CV.',
      },
      {
        id: 'rest-operations',
        text: 'Creé operaciones REST GET, PUT, DELETE y POST para peticiones y consultas a la base de datos.',
      },
      {
        id: 'server-automation',
        text: 'Automaticé tareas del servidor mediante scripts personalizados para mejorar la estabilidad del sistema.',
      },
    ],
    technologies: [
      { id: 'javascript', version: 'ES6' },
      { id: 'node-js' },
      { id: 'mysql' },
      { id: 'sql' },
      { id: 'rest' },
      { id: 'scrum' },
    ],
    sources: [{ source: 'cv', page: 2, section: 'Experiencia / Carlos Vassan' }],
  },
} as const satisfies Record<ExperienceId, Experience>;
