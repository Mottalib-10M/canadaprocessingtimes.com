/**
 * Relevé de la semaine (workflow .github/workflows/update-data.yml, lundi et jeudi) :
 * relit les fichiers publiés par IRCC, écrit l'instantané src/data/ircc/latest.json, ajoute une ligne datée
 * à l'historique quand IRCC a publié une nouvelle date, et met à jour les rondes d'Entrée express.
 * Si un fichier ne se lit pas, l'ancien est gardé tel quel : la page affiche toujours la date réellement lue.
 */
import fs from 'node:fs';
import { FILES, API_BASE, getJSON, readCountry, readNonCountry, readFlpt, readEE } from './lib.mjs';
import { load, save, addReading } from './history.mjs';
import { writeRecent } from './recent.mjs';
import { writeCountries } from './countries.mjs';

const OUT = new URL('../../src/data/ircc/', import.meta.url);
fs.mkdirSync(OUT, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const prev = (() => { try { return JSON.parse(fs.readFileSync(new URL('latest.json', OUT), 'utf8')); } catch { return null; } })();
const h = load();
const raw = {};
for (const kind of ['country', 'noncountry', 'flpt', 'tr', 'ee']) {
  try { raw[kind] = await getJSON(API_BASE + FILES[kind]); console.log(`lu : ${FILES[kind]}`); }
  catch (e) { console.warn(`ÉCHEC ${FILES[kind]} : ${e.message} (ancienne valeur gardée)`); }
}
// Une file d'attente sur 3 ans suffit pour les dates de dépôt qu'un demandeur saisit encore.
const keepFrom = `${Number(today.slice(0, 4)) - 3}-${today.slice(5, 7)}`;
const c = raw.country ? readCountry(raw.country) : null;
const n = raw.noncountry ? readNonCountry(raw.noncountry) : null;
const f = raw.flpt ? readFlpt(raw.flpt, keepFrom) : null;
const t = raw.tr ? readFlpt(raw.tr, keepFrom) : null;
const latest = {
  read: today,
  dates: { country: c?.date ?? prev?.dates.country, noncountry: n?.date ?? prev?.dates.noncountry, flpt: f?.date ?? prev?.dates.flpt, tr: t?.date ?? prev?.dates.tr },
  country: c?.data ?? prev?.country, noncountry: n?.data ?? prev?.noncountry, flpt: f?.data ?? prev?.flpt, tr: t?.data ?? prev?.tr,
};
fs.writeFileSync(new URL('latest.json', OUT), `${JSON.stringify(latest)}\n`);
console.log(`pays : ${writeCountries(latest)} noms`);
for (const k of ['country', 'noncountry', 'flpt', 'tr']) if (raw[k] && addReading(h, k, raw[k], `direct ${today}`)) console.log(`historique : nouveau relevé ${k}`);
save(h);
writeRecent(h);
if (raw.ee) {
  const rounds = readEE(raw.ee);
  fs.writeFileSync(new URL('ee.json', OUT), `${JSON.stringify({ read: today, rounds })}\n`);
  console.log(`Entrée express : ${rounds.length} rondes depuis 2024, dernière le ${rounds[0]?.date}`);
}

// Date de mise à jour du site (pied de page, sitemap, schémas) : la dernière date publiée par IRCC parmi les fichiers lus.
const newest = Object.values(latest.dates).filter(Boolean).sort().pop();
if (newest) {
  const cfg = new URL('../../src/data/site-config.ts', import.meta.url);
  const src = fs.readFileSync(cfg, 'utf8');
  const next = src.replace(/export const LAST_UPDATED = '[^']*';/, `export const LAST_UPDATED = '${newest}';`);
  if (next !== src) { fs.writeFileSync(cfg, next); console.log(`LAST_UPDATED = ${newest}`); }
}
