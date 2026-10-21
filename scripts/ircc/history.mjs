/**
 * Historique des délais (notre donnée propre) : src/data/ircc/history.json.
 *   readings.<fichier> : un relevé par date publiée par IRCC, avec sa provenance (lecture directe datée, ou
 *                        capture de la Wayback Machine citée par son horodatage) ;
 *   s.<série>          : les délais en jours, alignés sur les relevés de son fichier (null = pas de chiffre).
 * Séries : c:<programme>:<pays>, n:<clé>, f:<clé> (délai prospectif), w:<clé> (personnes en attente), t:<clé>.
 */
import fs from 'node:fs';
import { readCountry, readNonCountry, readFlpt, daysOf } from './lib.mjs';

export const HISTORY = new URL('../../src/data/ircc/history.json', import.meta.url);
export const COUNTRY_PROGS = ['visitor-outside-canada', 'supervisa', 'study', 'work', 'child_dependent'];

export function load() {
  try { return JSON.parse(fs.readFileSync(HISTORY, 'utf8')); } catch { return { readings: { country: [], noncountry: [], flpt: [], tr: [] }, s: {} }; }
}
export function save(h) {
  // Ordre stable : relevés par date, séries par clé ; une ligne par série pour des différences lisibles.
  const keys = Object.keys(h.s).sort();
  const body = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(h.s[k])}`).join(',\n');
  fs.mkdirSync(new URL('.', HISTORY), { recursive: true });
  fs.writeFileSync(HISTORY, `{\n "readings": ${JSON.stringify(h.readings)},\n "s": {\n${body}\n }\n}\n`);
}
const r1 = (x) => (x == null ? null : Math.round(x));

/** Séries extraites d'un fichier lu. */
export function seriesOf(kind, json) {
  const out = {};
  if (kind === 'country') {
    const { date, data } = readCountry(json);
    for (const p of COUNTRY_PROGS) for (const [c, t] of Object.entries(data[p] ?? {})) out[`c:${p}:${c}`] = r1(daysOf(t));
    return { date, out };
  }
  if (kind === 'noncountry') {
    const { date, data } = readNonCountry(json);
    for (const [k, t] of Object.entries(data)) out[`n:${k}`] = r1(daysOf(t));
    return { date, out };
  }
  const { date, data } = readFlpt(json, '9999');
  const pre = kind === 'tr' ? 't' : 'f';
  for (const [k, v] of Object.entries(data)) { out[`${pre}:${k}`] = r1(daysOf(v.cur)); out[`w:${k}`] = v.waiting; }
  return { date, out };
}

/** Ajoute un relevé (ou complète celui de la même date IRCC) ; garde l'ordre chronologique. Rend vrai si nouveau. */
export function addReading(h, kind, json, via) {
  const { date, out } = seriesOf(kind, json);
  if (!date) return false;
  const R = h.readings[kind];
  if (R.some((r) => r.ircc === date)) return false;
  R.push({ ircc: date, via });
  R.sort((a, b) => a.ircc.localeCompare(b.ircc));
  const idx = R.findIndex((r) => r.ircc === date);
  const len = R.length;
  const mine = (k) => (kind === 'country' ? k.startsWith('c:') : kind === 'noncountry' ? k.startsWith('n:') : kind === 'tr' ? k.startsWith('t:') || ['w:SP-EXT', 'w:WP-EXT'].includes(k) : k.startsWith('f:') || (k.startsWith('w:') && !['w:SP-EXT', 'w:WP-EXT'].includes(k)));
  for (const k of Object.keys(h.s).filter(mine)) h.s[k].splice(idx, 0, k in out ? out[k] : null);
  for (const [k, v] of Object.entries(out)) if (!(k in h.s)) { const a = new Array(len).fill(null); a[idx] = v; h.s[k] = a; }
  for (const k of Object.keys(h.s).filter(mine)) if (h.s[k].length !== len) throw new Error(`série ${k} désalignée`);
  return true;
}
