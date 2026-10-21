/**
 * Lecture des fichiers JSON publiés par IRCC pour son outil « Vérifier les délais de traitement »
 * et normalisation en un instantané compact (src/data/ircc/latest.json). Partagé par
 * update-data.mjs (relevé de la semaine) et build-history.mjs (captures de la Wayback Machine).
 * Faits seulement : un délai par programme et par pays, la date publiée par IRCC, rien d'autre.
 */
export const API_BASE = 'https://www.canada.ca/content/dam/ircc/documents/json/';
export const FILES = {
  country: 'data-ptime-en.json',
  noncountry: 'data-ptime-non-country-en.json',
  flpt: 'flpt-en.json',
  tr: 'flpt-by-week-en.json',
  ee: 'ee_rounds_123_en.json',
};

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
/** « October 21, 2026 » → « 2026-10-21 ». */
export function isoOf(s) {
  const m = String(s ?? '').trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!m) return null;
  const mo = MONTHS.indexOf(m[1].toLowerCase());
  if (mo < 0) return null;
  return `${m[3]}-${String(mo + 1).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
}

/**
 * Un délai publié, en clair : { n, u } avec u = d (jours), w (semaines), m (mois), y (années), min (minutes),
 * gt = « plus de », ou { x: 'nd' } (pas assez de données), { x: 'na' } (aucun délai publié).
 * Les jours équivalents (`days`) servent aux comparaisons ; l'affichage garde l'unité d'IRCC.
 */
export function parseTime(raw) {
  if (raw == null) return null;
  const s = String(raw).replace(/&nbsp;/g, ' ').trim();
  if (/not enough data/i.test(s)) return { x: 'nd' };
  if (/no processing time|no data available/i.test(s)) return { x: 'na' };
  const m = s.match(/(more than\s+)?(?:about\s+)?(?:part 1:\s*)?([\d,]+)\s*(minute|day|week|month|year)s?/i);
  if (!m) return { x: 'na' };
  const n = Number(m[2].replace(/,/g, ''));
  const u = { minute: 'min', day: 'd', week: 'w', month: 'm', year: 'y' }[m[3].toLowerCase()];
  const out = { n, u };
  if (m[1]) out.gt = true;
  return out;
}
export const DAYS_PER = { min: 1 / 1440, d: 1, w: 7, m: 365.25 / 12, y: 365.25 };
export const daysOf = (t) => (t && t.u ? Math.round(t.n * DAYS_PER[t.u] * 10) / 10 : null);

/** « About 53,900 people waiting » → 53900 ; « Less than 100 … » → -100 (moins de). */
export function countOf(s) {
  const m = String(s ?? '').match(/(less than\s+)?(?:about\s+)?([\d,]+)/i);
  if (!m) return null;
  const n = Number(m[2].replace(/,/g, ''));
  return m[1] ? -n : n;
}
/** « 6 months left » → 6 ; « About 1 month left » → 1 ; « 10 weeks left » → 10 ; « More than 10 years » → 'gt10y' ;
 *  « We need more time… » → 'late' (dossier qui a déjà dépassé le délai attendu) ; « No data available » → null. */
export function leftOf(s) {
  const t = String(s ?? '');
  if (/need more time/i.test(t)) return 'late';
  const y = t.match(/more than\s+(\d+)\s+years?/i);
  if (y) return `gt${y[1]}y`;
  const m = t.match(/([\d,]+)\s+(month|week)s?\s+left/i);
  return m ? Number(m[1].replace(/,/g, '')) : null;
}

/** Fichier « par pays » : { programme: { code: délai } } et la date publiée. */
export function readCountry(json) {
  const out = {}; let date = null;
  for (const [prog, byC] of Object.entries(json)) {
    if (!byC || typeof byC !== 'object') continue;
    out[prog] = {};
    for (const [code, v] of Object.entries(byC)) {
      if (code === 'lastupdated') { date = isoOf(v) ?? date; continue; }
      if (v && typeof v === 'object') out[prog][code] = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, parseTime(x)]));
      else out[prog][code] = parseTime(v);
    }
  }
  return { date, data: out };
}
/** Fichier « sans pays » : { groupe: { clé: délai } }. */
export function readNonCountry(json) {
  const out = {};
  const date = isoOf(json?.['default-update']?.lastupdated);
  for (const [grp, obj] of Object.entries(json)) {
    if (grp === 'default-update' || !obj || typeof obj !== 'object') continue;
    for (const [k, v] of Object.entries(obj)) out[k] = parseTime(v);
  }
  return { date, data: out };
}
/** Fichiers prospectifs (« flpt ») : délai attendu aujourd'hui, personnes en attente, et, par mois (ou semaine)
 *  de dépôt, le temps restant et le nombre de personnes devant. */
export function readFlpt(json, keepFrom = null) {
  const date = isoOf(json?.['default-update']?.flpt_lastupdated ?? json?.['tr-last-updated']);
  const cur = json['current-flpt'] ?? {}, tot = json['total-people'] ?? {}, wt = json['wait-times'] ?? {}, pa = json['people-ahead'] ?? {};
  const out = {};
  for (const k of Object.keys(cur)) out[k] = { cur: parseTime(cur[k]), waiting: countOf(tot[k]), queue: [] };
  for (const [key, v] of Object.entries(wt)) {
    const m = key.match(/^(.*)-(\d{4}\/\d{2}(?:\/\d{2})?)$/);
    if (!m || !out[m[1]]) continue;
    if (keepFrom && m[2].replace(/\//g, '-') < keepFrom) continue;
    out[m[1]].queue.push([m[2].replace(/\//g, '-'), leftOf(v), countOf(pa[key])]);
  }
  for (const k of Object.keys(out)) out[k].queue.sort((a, b) => a[0].localeCompare(b[0]));
  return { date, data: out };
}
/** Rondes d'Entrée express : date, intitulé, invitations, score minimal. */
export function readEE(json, from = '2024-01-01') {
  return (json?.rounds ?? []).filter((r) => r.drawDate >= from).map((r) => ({
    n: Number(r.drawNumber), date: r.drawDate, name: r.drawName, size: Number(String(r.drawSize).replace(/,/g, '')), crs: Number(String(r.drawCRS).replace(/,/g, '')) || null,
  })).sort((a, b) => b.date.localeCompare(a.date) || b.n - a.n);
}

/** Lecture réseau avec reprises (le CDN de canada.ca coupe parfois la connexion). */
export async function getJSON(url, tries = 8) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(45000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; processing-times-archive/1.0)' } });
      if (r.ok) {
        const t = await r.text();
        try { return JSON.parse(t.replace(/^﻿/, '')); } catch { last = new Error(`not JSON: ${url}`); }
      } else last = new Error(`${r.status} ${url}`);
    } catch (e) { last = e; }
    await new Promise((res) => setTimeout(res, 2500 * (i + 1)));
  }
  throw last;
}
