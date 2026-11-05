import { describe, expect, it } from 'vitest';
import { profile } from '../../src/data/profile.ts';
import { experiences } from '../../src/data/experience.ts';
import { certifications } from '../../src/data/certifications.ts';
import { education } from '../../src/data/education.ts';
import { siteIdentity } from '../../src/data/site.ts';
import { pageSeo, resolveSiteUrl, seoFiles } from '../../src/lib/seo.ts';
import { escapeHtml, publicCvHtml } from '../../src/lib/public-cv.ts';
import { formatPeriod } from '../../src/lib/presentation.ts';

describe('publication origin and metadata', () => {
  it('does not fabricate an origin when the production domain is missing', () => {
    expect(resolveSiteUrl(undefined)).toBeUndefined();
    expect(resolveSiteUrl('  ')).toBeUndefined();
    expect(pageSeo(undefined, '/')).toEqual({ canonical: undefined, robots: 'noindex, nofollow' });
    expect(seoFiles(undefined)).toEqual({ robots: 'User-agent: *\nDisallow: /\n' });
  });
  it('normalizes only an explicit HTTP(S) origin and rejects unsafe configuration', () => {
    expect(resolveSiteUrl(' https://portfolio.example.test ')).toBe(
      'https://portfolio.example.test/',
    );
    for (const value of [
      'not-a-url',
      'javascript:alert(1)',
      'file:///tmp/site',
      'https://user:pass@portfolio.example.test',
      'https://portfolio.example.test/path',
      'https://portfolio.example.test/?preview=1',
      'https://portfolio.example.test/#inicio',
    ]) {
      expect(() => resolveSiteUrl(value)).toThrow(/SITE_URL/);
    }
  });
  it('enables canonical, crawling and the one-page sitemap only with an origin', () => {
    const site = new URL('https://portfolio.example.test/');
    expect(pageSeo(site, '/')).toEqual({ canonical: site.href, robots: 'index, follow' });
    expect(pageSeo(site, '/404.html', true)).toEqual({
      canonical: undefined,
      robots: 'noindex, nofollow',
    });
    const files = seoFiles(site.href);
    expect(files.robots).toContain('Sitemap: https://portfolio.example.test/sitemap.xml');
    expect(files.sitemap).toContain('<loc>https://portfolio.example.test/</loc>');
    expect(files.sitemap).not.toMatch(/404|\.pdf/);
    expect(files.sitemap?.match(/<url>/g)).toHaveLength(1);
  });
  it('rejects empty query and fragment delimiters instead of leaking them into the sitemap', () => {
    for (const value of ['https://portfolio.example.test/?', 'https://portfolio.example.test/#']) {
      expect(() => resolveSiteUrl(value)).toThrow(/SITE_URL/);
      expect(() => seoFiles(value)).toThrow(/SITE_URL/);
    }
  });
});

describe('positive-allowlist public CV', () => {
  it('retains every reviewed contribution, period, qualification and certificate', () => {
    const html = publicCvHtml();
    for (const entry of Object.values(experiences)) {
      expect(html).toContain(escapeHtml(entry.organization));
      expect(html).toContain(escapeHtml(formatPeriod(entry.period)));
      for (const contribution of entry.contributions)
        expect(html).toContain(escapeHtml(contribution.text));
    }
    for (const entry of education)
      for (const q of entry.qualifications) expect(html).toContain(escapeHtml(q.title));
    for (const certificate of certifications) expect(html).toContain(escapeHtml(certificate.title));
    expect(html).toContain('20 %');
    expect(html).toContain('aproximadamente 38');
    expect(html).toContain('no se afirma desarrollo ni administración dentro de Murex');
  });
  it('contains only approved contact channels and no administrative/source fields', () => {
    const html = publicCvHtml();
    expect(html).toContain(profile.email);
    expect(html).toContain(profile.githubUrl);
    expect(html).toContain(profile.linkedinUrl);
    expect(html).not.toMatch(
      /\bRFC\b|\bCURP\b|\bNSS\b|estado civil|domicilio|teléfono|\bTEL\s*:|pet\/|src\/editorial|file:\/\/|sourceLocation|credentialId/i,
    );
    expect(html).not.toMatch(/\b[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3,8}\b|\b\d{10,13}\b/);
    expect(html).toContain('<html lang="es">');
    expect(siteIdentity.cv.path).not.toBe('/Edgar Sanchez Flores.pdf');
  });
  it('escapes text before creating the printable document', () => {
    expect(escapeHtml('<a href="x">&\'</a>')).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;',
    );
  });
});
