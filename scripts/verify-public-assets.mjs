import { readFile, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { URL, fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { log } from 'node:console';
import { format } from 'prettier';
import { experiences } from '../src/data/experience.ts';
import { education } from '../src/data/education.ts';
import { certifications } from '../src/data/certifications.ts';
import { skills } from '../src/data/skills.ts';
import { profile } from '../src/data/profile.ts';
import { siteIdentity } from '../src/data/site.ts';
import { formatPeriod } from '../src/lib/presentation.ts';

// Poppler is verification tooling only, not a runtime or generation dependency.
const root = new URL('../', import.meta.url);
const file = (name) => new URL(name, root);
const pdfPath = fileURLToPath(file(`public${siteIdentity.cv.path}`));
const normalize = (value) => value.normalize('NFKC').replace(/\s+/g, ' ').trim();
const text = normalize(execFileSync('pdftotext', [pdfPath, '-'], { encoding: 'utf8' }));
const info = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
const required = [
  profile.name,
  profile.role,
  profile.email,
  profile.summary,
  profile.collaboration,
];
for (const entry of Object.values(experiences)) {
  required.push(entry.organization, entry.role, formatPeriod(entry.period), entry.summary);
  required.push(...entry.contributions.map((item) => item.text));
}
for (const entry of education)
  required.push(
    entry.institution,
    formatPeriod(entry.period),
    ...entry.qualifications.map((q) => q.title),
  );
required.push(
  ...certifications.map((c) => c.title),
  ...Object.values(skills).map((skill) => skill.name),
);
for (const value of required)
  assert(text.includes(normalize(value)), `Missing professional text: ${value}`);
assert(
  !/\b(?:RFC|CURP|NSS)\b|estado civil|domicilio|tel[eé]fono|\bTEL\s*:/i.test(text),
  'Private field label in public PDF',
);
assert(
  !/\b[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3,8}\b|\b\d{10,13}\b/.test(text),
  'Administrative identifier in public PDF',
);
assert(/Pages:\s+3\b/.test(info), 'Unexpected CV pagination');
assert(/Tagged:\s+yes/.test(info), 'Missing PDF document structure');
assert(/JavaScript:\s+no/.test(info), 'Unexpected PDF scripting');
assert(/Metadata Stream:\s+no/.test(info), 'Unexpected metadata payload');

// The ignored private source is optional in a clone. Its values never enter reports.
let privateSourceCheck = 'not available; public-field and content checks still executed';
const excludedFields = [];
try {
  await access(file('Edgar Sanchez Flores.pdf'));
  const source = execFileSync('pdftotext', [fileURLToPath(file('Edgar Sanchez Flores.pdf')), '-'], {
    encoding: 'utf8',
  });
  for (const label of ['RFC', 'CURP', 'NSS', 'ESTADO CIVIL', 'TEL']) {
    const match = source.match(new RegExp(`${label}\\s*:\\s*([^\\r\\n]+)`, 'i'));
    if (match) {
      assert(
        !text.toLowerCase().includes(normalize(match[1]).toLowerCase()),
        'Private source value present in public PDF',
      );
      excludedFields.push(label);
    }
  }
  privateSourceCheck = 'PASS; compared only in memory, no private values recorded';
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const manifest = JSON.parse(await readFile(file('docs/review/phase-6/assets.json'), 'utf8'));
for (const asset of manifest.artifacts) {
  const data = await readFile(file(`public${asset.path}`));
  assert.equal(createHash('sha256').update(data).digest('hex'), asset.sha256);
  assert.equal(data.length, asset.bytes);
}
for (const [name, width, height] of [
  [siteIdentity.social.path, 1200, 630],
  ['/favicon-32.png', 32, 32],
  ['/apple-touch-icon.png', 180, 180],
]) {
  const png = await readFile(file(`public${name}`));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [width, height]);
  assert(png.length < 250_000);
}
const report = {
  result: 'PASS',
  professionalTextChecks: required.length,
  pages: 3,
  textSelectable: true,
  tagged: true,
  javascript: false,
  copiedSourceMetadata: false,
  privateSourceCheck,
  excludedFields,
  graphics: 'PNG signatures/dimensions/size and all artifact hashes verified',
  note: 'Tagged output is not a claim of formal PDF/UA conformance',
};
await writeFile(
  file('docs/review/phase-6/asset-verification.json'),
  await format(JSON.stringify(report), { parser: 'json', printWidth: 100 }),
);
log(report);
