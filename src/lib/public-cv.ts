import { profile } from '../data/profile.ts';
import { experiences } from '../data/experience.ts';
import { education } from '../data/education.ts';
import { certifications } from '../data/certifications.ts';
import { skills } from '../data/skills.ts';
import { formatContentDate, formatPeriod } from './presentation.ts';
import { getSkillGroups } from './professional.ts';
import type { Experience } from '../types/content.ts';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function experienceHtml(entry: Experience) {
  const technologies = entry.technologies
    .map((ref) => escapeHtml(`${skills[ref.id].name}${ref.version ? ` ${ref.version}` : ''}`))
    .join(' · ');
  return `<section class="experience">
    <h3>${escapeHtml(entry.organization)} <span>${escapeHtml(formatPeriod(entry.period))}</span></h3>
    <p class="role">${escapeHtml(entry.role)}</p>
    <p>${escapeHtml(entry.summary)}</p>
    <ul>${entry.contributions.map((item) => `<li>${escapeHtml(item.text)}</li>`).join('')}</ul>
    <p class="technologies">${technologies}</p>
  </section>`;
}

/**
 * Positive allowlist from the reviewed professional model. Never opens, embeds,
 * redacts or copies the original PDF; administrative/source fields cannot leak in.
 */
export function publicCvHtml(fontCss = '') {
  const academic = education
    .map(
      (entry) => `<section><h3>${escapeHtml(entry.institution)}</h3>
    <p>${escapeHtml(formatPeriod(entry.period))}</p>
    <ul>${entry.qualifications.map((q) => `<li>${escapeHtml(q.title)}</li>`).join('')}</ul></section>`,
    )
    .join('');
  const groups = getSkillGroups()
    .map(
      (group) => `<p><strong>${escapeHtml(group.label)}:</strong>
    ${group.entries.map(({ skill }) => escapeHtml(skill.name)).join(' · ')}</p>`,
    )
    .join('');
  const courses = certifications
    .map(
      (entry) =>
        `<li>${escapeHtml(entry.title)}${'issuedAt' in entry ? ` (${formatContentDate(entry.issuedAt)})` : ''}</li>`,
    )
    .join('');
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8">
    <title>${escapeHtml(profile.name)} — CV público</title>
    <style>${fontCss}
      @page { size: A4; margin: 15mm 17mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #161a1f; font: 10pt/1.4 Inter, sans-serif; }
      .page + .page { break-before: page; }
      h1 { font-size: 23pt; line-height: 1.15; margin: 0 0 2mm; }
      h2 { font-size: 13pt; margin: 6mm 0 3mm; padding-bottom: 1.5mm; border-bottom: 0.3mm solid #315979; }
      h3 { font-size: 10.5pt; margin: 4mm 0 1mm; }
      h3 span { float: right; font-size: 9pt; font-weight: 400; }
      p { margin: 1.5mm 0; }
      ul { padding-left: 4.5mm; margin: 2mm 0; }
      li { margin: 1mm 0; }
      a { color: #244963; text-decoration: underline; }
      .contacts { font-size: 9pt; margin: 3mm 0; }
      .contacts a { display: inline-block; margin-right: 3mm; }
      .role { font-weight: 600; }
      .technologies { font-size: 8.5pt; color: #3a424d; }
      .continuation { font-size: 10pt; color: #3a424d; border-bottom: 0.3mm solid #315979; padding-bottom: 2mm; }
      .skills { columns: 2; column-gap: 7mm; }
      .skills p, .courses li { break-inside: avoid; }
      .courses { columns: 2; column-gap: 7mm; }
      h2, h3 { break-after: avoid; }
      li { orphans: 2; widows: 2; }
    </style></head><body>
    <article class="page">
      <h1>${escapeHtml(profile.name)}</h1>
      <p class="role">${escapeHtml(profile.role)}</p>
      <p class="contacts"><a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
        <a href="${profile.githubUrl}">github.com/edgarsanchez01</a>
        <a href="${profile.linkedinUrl}">linkedin.com/in/edgar-sanchez01</a></p>
      <p>${escapeHtml(profile.summary)}</p>
      <h2>Experiencia profesional</h2>
      ${experienceHtml(experiences['nfq-advisory'])}
      ${experienceHtml(experiences['sistemas-ec'])}
    </article>
    <article class="page">
      <p class="continuation">${escapeHtml(profile.name)} · Experiencia y formación</p>
      ${experienceHtml(experiences.belomora)}
      ${experienceHtml(experiences['carlos-vassan'])}
      <h2>Formación académica</h2>${academic}
    </article>
    <article class="page">
      <p class="continuation">${escapeHtml(profile.name)} · Tecnologías y formación complementaria</p>
      <h2>Tecnologías</h2><div class="skills">${groups}</div>
      <p class="technologies">Murex: origen de los archivos CSV; no se afirma desarrollo ni administración dentro de Murex.</p>
      <h2>Cursos y certificados</h2><ul class="courses">${courses}</ul>
      <h2>Idiomas y colaboración</h2>
      ${profile.languages.map((language) => `<p>${escapeHtml(language.name)}: ${escapeHtml(language.level)}${language.context ? ` · ${escapeHtml(language.context)}` : ''}.</p>`).join('')}
      <p>${escapeHtml(profile.collaboration)}</p>
    </article>
    </body></html>`;
}
