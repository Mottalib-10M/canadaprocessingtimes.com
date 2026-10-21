/**
 * Données du site, lues dans les fichiers relus par scripts/ircc/update-data.mjs :
 *   src/data/ircc/latest.json  dernier relevé de chaque fichier IRCC (délai par programme, par pays, files d'attente)
 *   src/data/ircc/recent.json  extrait de l'historique daté (tendances des simulateurs)
 *   src/data/ircc/ee.json      rondes d'Entrée express depuis 2024
 * Ce module est chargé dans le navigateur (simulateurs) : il n'importe jamais l'historique complet (lib/hist.ts).
 */
import LATEST from '../data/ircc/latest.json';
import RECENT from '../data/ircc/recent.json';
import EE from '../data/ircc/ee.json';
import COUNTRIES from '../data/ircc/countries.json';
import P from '../data/params-2026.json';
import { displayDate, formatNumber, type Lang } from './format';
import { addTime, addMonths, isTime, daysOf, trendOf, type Pub, type Time, type QueueRow, type Round, type Trend } from './engine/times';

export type Src = 'country' | 'noncountry' | 'flpt' | 'tr';
export type Family = 'visit' | 'study' | 'work' | 'pr' | 'family' | 'cit';
export interface Prog {
  id: string; src: Src; key: string; family: Family;
  name: { en: string; fr: string };
  /** Pays imposé (demande faite au Canada : code « CA » du fichier par pays). */
  fixed?: string;
  /** Délai passé (80 % des demandes traitées) ou prospectif (si la demande arrivait aujourd'hui). */
  method: 'past' | 'forward';
  /** Délai « passé » complémentaire publié pour le même type de demande (prolongations). */
  alt?: { src: Src; key: string };
}
const p = (id: string, src: Src, key: string, family: Family, en: string, fr: string, more: Partial<Prog> = {}): Prog =>
  ({ id, src, key, family, name: { en, fr }, method: src === 'flpt' || src === 'tr' ? 'forward' : 'past', ...more });

/** Les types de demande suivis, dans l'ordre du menu. */
export const PROGS: Prog[] = [
  p('visitor', 'country', 'visitor-outside-canada', 'visit', 'Visitor visa (applying from outside Canada)', 'Visa de visiteur (demande hors du Canada)'),
  p('super-visa', 'country', 'supervisa', 'visit', 'Parent and grandparent super visa', 'Super visa pour parents et grands-parents'),
  p('visitor-inside', 'noncountry', 'visitor_inside_canada', 'visit', 'Visitor visa (applying from inside Canada)', 'Visa de visiteur (demande au Canada)'),
  p('visitor-record', 'noncountry', 'visitor_extension', 'visit', 'Visitor record (extend a visit)', 'Fiche du visiteur (prolonger un séjour)'),
  p('eta', 'noncountry', 'eta', 'visit', 'Electronic Travel Authorization (eTA)', 'Autorisation de voyage électronique (AVE)'),
  p('study', 'country', 'study', 'study', 'Study permit (applying from outside Canada)', 'Permis d’études (demande hors du Canada)'),
  p('study-inside', 'country', 'study', 'study', 'Study permit (applying from inside Canada)', 'Permis d’études (demande au Canada)', { fixed: 'CA' }),
  p('study-ext', 'tr', 'SP-EXT', 'study', 'Study permit extension', 'Prolongation du permis d’études', { alt: { src: 'noncountry', key: 'study_extension' } }),
  p('work', 'country', 'work', 'work', 'Work permit (applying from outside Canada)', 'Permis de travail (demande hors du Canada)'),
  p('work-inside', 'country', 'work', 'work', 'Work permit (applying from inside Canada)', 'Permis de travail (demande au Canada)', { fixed: 'CA' }),
  p('work-ext', 'tr', 'WP-EXT', 'work', 'Work permit extension', 'Prolongation du permis de travail', { alt: { src: 'noncountry', key: 'work_extension' } }),
  p('iec', 'noncountry', 'iec', 'work', 'International Experience Canada (work permit)', 'Expérience internationale Canada (permis de travail)'),
  p('cec', 'flpt', 'cec', 'pr', 'Canadian Experience Class (Express Entry)', 'Catégorie de l’expérience canadienne (Entrée express)'),
  p('fsw', 'flpt', 'fsw', 'pr', 'Federal Skilled Worker (Express Entry)', 'Travailleurs qualifiés du fédéral (Entrée express)'),
  p('pnp-ee', 'flpt', 'pnp-ee', 'pr', 'Provincial nominee, through Express Entry', 'Candidat d’une province, par Entrée express'),
  p('pnp-base', 'flpt', 'pnp-base', 'pr', 'Provincial nominee, paper (base) stream', 'Candidat d’une province, volet de base (hors Entrée express)'),
  p('qsw', 'flpt', 'qsw', 'pr', 'Quebec-selected skilled worker', 'Travailleur qualifié sélectionné par le Québec'),
  p('aip', 'flpt', 'aip', 'pr', 'Atlantic Immigration Program', 'Programme d’immigration au Canada atlantique'),
  p('caregiver', 'flpt', 'caregiver', 'pr', 'Caregivers (permanent residence)', 'Aides familiaux (résidence permanente)'),
  p('startup-visa', 'flpt', 'startup-visa', 'pr', 'Start-up Visa', 'Visa pour démarrage d’entreprise'),
  p('spousal-in-roc', 'flpt', 'spousal-canada-roc', 'family', 'Spouse or partner living in Canada (outside Quebec)', 'Époux ou conjoint vivant au Canada (hors Québec)'),
  p('spousal-in-qc', 'flpt', 'spousal-canada-quebec', 'family', 'Spouse or partner living in Canada (Quebec)', 'Époux ou conjoint vivant au Canada (Québec)'),
  p('spousal-out-roc', 'flpt', 'spousal-abroad-roc', 'family', 'Spouse or partner living abroad (outside Quebec)', 'Époux ou conjoint vivant à l’étranger (hors Québec)'),
  p('spousal-out-qc', 'flpt', 'spousal-abroad-quebec', 'family', 'Spouse or partner living abroad (Quebec)', 'Époux ou conjoint vivant à l’étranger (Québec)'),
  p('child', 'country', 'child_dependent', 'family', 'Dependent child sponsorship', 'Parrainage d’un enfant à charge'),
  p('pgp-roc', 'flpt', 'pgp-roc', 'family', 'Parents and grandparents (outside Quebec)', 'Parents et grands-parents (hors Québec)'),
  p('pgp-qc', 'flpt', 'pgp-quebec', 'family', 'Parents and grandparents (Quebec)', 'Parents et grands-parents (Québec)'),
  p('refugees-gov', 'flpt', 'government-refugees-roc', 'family', 'Government-assisted refugees (outside Quebec)', 'Réfugiés pris en charge par le gouvernement (hors Québec)'),
  p('refugees-priv', 'flpt', 'private-refugees-roc', 'family', 'Privately sponsored refugees (outside Quebec)', 'Réfugiés parrainés par le secteur privé (hors Québec)'),
  p('protected', 'flpt', 'protected-persons-in-canada-roc', 'family', 'Protected persons in Canada (outside Quebec)', 'Personnes protégées au Canada (hors Québec)'),
  p('citizenship', 'flpt', 'citizen-grants', 'cit', 'Citizenship grant (adults)', 'Attribution de la citoyenneté (adultes)'),
  p('cit-proof', 'flpt', 'citizen-proofs', 'cit', 'Proof of citizenship (certificate)', 'Preuve de citoyenneté (certificat)'),
  p('cit-search', 'noncountry', 'cit_search', 'cit', 'Search of citizenship records', 'Recherche dans les registres de citoyenneté'),
  p('pr-card-new', 'noncountry', 'new_pr', 'cit', 'First PR card (new permanent resident)', 'Première carte RP (nouveau résident permanent)'),
  p('pr-card-renew', 'noncountry', 'existing_pr', 'cit', 'PR card renewal or replacement', 'Renouvellement ou remplacement de la carte RP'),
];
export const progById = (id: string): Prog => { const x = PROGS.find((q) => q.id === id); if (!x) throw new Error(`programme inconnu : ${id}`); return x; };
export const PROG_IDS = PROGS.map((q) => q.id);

type Latest = {
  read: string; dates: Record<Src, string>;
  country: Record<string, Record<string, Pub>>;
  noncountry: Record<string, Pub>;
  flpt: Record<string, { cur: Pub; waiting: number | null; queue: QueueRow[] }>;
  tr: Record<string, { cur: Pub; waiting: number | null; queue: QueueRow[] }>;
};
export const L = LATEST as unknown as Latest;
export const ROUNDS = (EE as { read: string; rounds: Round[] }).rounds;
export const EE_READ = (EE as { read: string }).read;
const R = RECENT as unknown as { dates: Record<Src, string[]>; s: Record<string, Array<number | null>> };
export const CIT_RULE = (P as unknown as { citizenship: { required: number; tempRatio: number; tempCap: number; window: number } }).citizenship;
/** Date de lecture des fichiers : « aujourd'hui » de tous les calculs (même résultat au build et dans le navigateur). */
export const READ = L.read;

/* ---------- pays ---------- */
/** Noms figés au relevé (scripts/ircc/countries.mjs) : identiques au build et dans le navigateur. */
const NAMES = COUNTRIES as Record<string, { en: string; fr: string }>;
export const countryName = (code: string, l: Lang): string => NAMES[code]?.[l] ?? code;
/** Tri stable et identique partout (sans localeCompare, dont l'ordre dépend du moteur) : accents retirés. */
const fold = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const byName = (a: string, b: string) => { const x = fold(a), y = fold(b); return x < y ? -1 : x > y ? 1 : 0; };
/** Pays où un délai est publié pour ce programme (Canada exclu des demandes faites hors du Canada). */
export function countriesOf(progId: string): string[] {
  const g = progById(progId);
  if (g.src !== 'country' || g.fixed) return [];
  return Object.keys(L.country[g.key] ?? {}).filter((c) => c !== 'CA');
}
/** Grands pays de dépôt, toujours montrés dans le tableau comparatif. */
export const MAJOR = ['IN', 'PH', 'NG', 'CN', 'PK', 'IR', 'VN', 'MX', 'BR', 'BD', 'MA', 'DZ', 'CM', 'FR', 'US', 'GB'];

/* ---------- lecture d'un délai ---------- */
export interface Reading { t: Pub; date: string; series: string; waiting?: number | null; queue?: QueueRow[] }
export function seriesKey(g: Prog, country?: string): string {
  if (g.src === 'country') return `c:${g.key}:${g.fixed ?? country}`;
  return `${{ noncountry: 'n', flpt: 'f', tr: 't' }[g.src]}:${g.key}`;
}
export function readingOf(progId: string, country = 'IN'): Reading {
  const g = progById(progId);
  if (g.src === 'country') { const c = g.fixed ?? country; return { t: L.country[g.key]?.[c] ?? null, date: L.dates.country, series: seriesKey(g, c) }; }
  if (g.src === 'noncountry') return { t: L.noncountry[g.key] ?? null, date: L.dates.noncountry, series: seriesKey(g) };
  const f = L[g.src][g.key];
  return { t: f?.cur ?? null, date: L.dates[g.src], series: seriesKey(g), waiting: f?.waiting ?? null, queue: f?.queue ?? [] };
}
export const altOf = (progId: string): Reading | null => {
  const a = progById(progId).alt; if (!a) return null;
  return { t: L.noncountry[a.key] ?? null, date: L.dates.noncountry, series: `n:${a.key}` };
};
const fileOfSeries = (k: string): Src => (k.startsWith('c:') ? 'country' : k.startsWith('n:') ? 'noncountry' : k.startsWith('t:') ? 'tr' : 'flpt');
/** Tendance sur l'extrait récent (simulateurs). */
export const recentTrend = (series: string): Trend | null => (R.s[series] ? trendOf(R.s[series], R.dates[fileOfSeries(series)]) : null);
export const recentPoints = (series: string): Array<[string, number]> => {
  const d = R.dates[fileOfSeries(series)], v = R.s[series] ?? [];
  return v.map((x, i) => [d[i], x] as [string, number | null]).filter((q): q is [string, number] => q[1] != null);
};

/* ---------- mise en forme ---------- */
const UNIT: Record<Lang, Record<string, [string, string]>> = {
  en: { min: ['minute', 'minutes'], d: ['day', 'days'], w: ['week', 'weeks'], m: ['month', 'months'], y: ['year', 'years'] },
  fr: { min: ['minute', 'minutes'], d: ['jour', 'jours'], w: ['semaine', 'semaines'], m: ['mois', 'mois'], y: ['an', 'ans'] },
};
export const num = (x: number, l: Lang, d = 0) => formatNumber(x, d, l);
export const unitWord = (n: number, u: string, l: Lang) => UNIT[l][u][n === 1 ? 0 : 1];
/** « 8 weeks », « 17 mois », « more than 10 years », « not published ». */
export function fmtTime(t: Pub, l: Lang): string {
  if (!t) return l === 'fr' ? 'non publié' : 'not published';
  if (!isTime(t)) return t.x === 'na' ? (l === 'fr' ? 'pas de délai publié' : 'no time published') : (l === 'fr' ? 'pas assez de données' : 'not enough data');
  const s = `${num(t.n, l)} ${unitWord(t.n, t.u, l)}`;
  return t.gt ? (l === 'fr' ? `plus de ${s}` : `more than ${s}`) : s;
}
/** Une valeur d'historique (jours) dans l'unité du délai publié : 183 j → « 6 mois ». */
export function fmtDays(days: number, u: string, l: Lang): string {
  if (u === 'm' || u === 'y') { const m = Math.round(days / (365.25 / 12)); return `${num(m, l)} ${unitWord(m, 'm', l)}`; }
  if (u === 'w' && Math.abs(days / 7 - Math.round(days / 7)) < 0.01) { const w = Math.round(days / 7); return `${num(w, l)} ${unitWord(w, 'w', l)}`; }
  if (u === 'min') return l === 'fr' ? 'quelques minutes' : 'a few minutes';
  const d = Math.round(days); return `${num(d, l)} ${unitWord(d, 'd', l)}`;
}
export const day = (iso: string, l: Lang) => displayDate(iso, l === 'fr' ? 'fr-CA' : 'en-CA');
export const monthYear = (iso: string, l: Lang) => new Date(`${iso.slice(0, 7)}-15T00:00:00Z`).toLocaleDateString(l === 'fr' ? 'fr-CA' : 'en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
/** Date à la précision du délai : au mois près pour un délai en mois, au jour près sinon. */
export const whenAt = (iso: string, t: Time, l: Lang) => (t.u === 'm' || t.u === 'y' ? monthYear(iso, l) : day(iso, l));
/** Écart de tendance en clair : « +7 days », « −2 months », « unchanged ». */
export function fmtDelta(delta: number, u: string, l: Lang): string {
  if (Math.abs(delta) < 0.5) return l === 'fr' ? 'inchangé' : 'unchanged';
  const s = fmtDays(Math.abs(delta), u, l);
  return `${delta > 0 ? '+' : '-'}${s}`;
}
export const progName = (id: string, l: Lang) => progById(id).name[l];

/* ---------- estimation d'une date de décision ---------- */
export interface Estimate {
  t: Time | null; from: string;
  /** Date estimée : date de dépôt (ou aujourd'hui) + délai publié. */
  date?: string;
  /** File d'IRCC pour le mois (ou la semaine) de dépôt : temps restant, personnes devant, date qui en découle. */
  queue?: { key: string; left: number | 'late' | string | null; ahead: number | null; unit: 'm' | 'w'; date?: string };
  elapsed?: number; remaining?: number;
}
/** Semaine du mois au sens des fichiers hebdomadaires d'IRCC (1 à 7 → 01, 8 à 14 → 02…). */
export const weekKey = (iso: string) => `${iso.slice(0, 7)}-${String(Math.min(5, Math.ceil(Number(iso.slice(8, 10)) / 7))).padStart(2, '0')}`;
export function estimate(progId: string, country: string, applied: string | null): Estimate {
  const g = progById(progId), r = readingOf(progId, country);
  const t = isTime(r.t) ? r.t : null;
  const from = applied ?? READ;
  const e: Estimate = { t, from };
  if (t) e.date = addTime(from, t);
  if (applied) {
    e.elapsed = Math.max(0, Math.round((Date.parse(READ) - Date.parse(applied)) / 864e5));
    if (e.date) e.remaining = Math.round((Date.parse(e.date) - Date.parse(READ)) / 864e5);
    if (r.queue?.length) {
      const key = g.src === 'tr' ? weekKey(applied) : applied.slice(0, 7);
      const row = r.queue.find((q) => q[0] === key) ?? (g.src === 'tr' ? r.queue.filter((q) => q[0].startsWith(applied.slice(0, 7))).pop() : undefined);
      if (row) {
        const unit = g.src === 'tr' ? 'w' : 'm';
        const q: Estimate['queue'] = { key: row[0], left: row[1], ahead: row[2], unit };
        if (typeof row[1] === 'number') q.date = unit === 'm' ? addMonths(r.date, row[1]) : addTime(r.date, { n: row[1], u: 'w' });
        e.queue = q;
      }
    }
  }
  return e;
}
/** Nombre de personnes « devant », en clair (IRCC publie « moins de 100 » en négatif dans notre fichier). */
export const fmtAhead = (n: number | null, l: Lang) => (n == null ? '' : n < 0 ? (l === 'fr' ? `moins de ${num(-n, l)}` : `fewer than ${num(-n, l)}`) : (l === 'fr' ? `environ ${num(n, l)}` : `about ${num(n, l)}`));
export { daysOf, isTime };

/** Page du site qui traite chaque type de demande (liens des tableaux). */
export const PAGE_OF: Record<string, string> = {
  visitor: 'visitor-visa', 'super-visa': 'super-visa', 'visitor-inside': 'visitor-visa', 'visitor-record': 'visitor-record', eta: 'eta',
  study: 'study-permit', 'study-inside': 'study-permit', 'study-ext': 'study-permit-extension', work: 'work-permit', 'work-inside': 'pgwp', 'work-ext': 'work-permit-extension', iec: 'iec',
  cec: 'cec', fsw: 'fsw', 'pnp-ee': 'pnp', 'pnp-base': 'pnp', qsw: 'quebec-skilled-worker', aip: 'atlantic', caregiver: 'caregiver', 'startup-visa': 'express-entry',
  'spousal-in-roc': 'spousal-sponsorship', 'spousal-in-qc': 'spousal-sponsorship', 'spousal-out-roc': 'spousal-sponsorship', 'spousal-out-qc': 'spousal-sponsorship',
  child: 'dependent-child', 'pgp-roc': 'parents-grandparents', 'pgp-qc': 'parents-grandparents', 'refugees-gov': 'refugees', 'refugees-priv': 'refugees', protected: 'refugees',
  citizenship: 'citizenship', 'cit-proof': 'citizenship', 'cit-search': 'citizenship', 'pr-card-new': 'pr-card', 'pr-card-renew': 'pr-card',
};
/** Délai le plus court et le plus long publiés, tous pays confondus (programmes par pays). */
export function rangeOf(progId: string): { lo: [string, Pub]; hi: [string, Pub]; n: number } | null {
  const cs = countriesOf(progId).map((c) => [c, readingOf(progId, c).t] as [string, Pub]).filter((x) => isTime(x[1]));
  if (!cs.length) return null;
  cs.sort((a, b) => (daysOf(a[1]) ?? 0) - (daysOf(b[1]) ?? 0));
  return { lo: cs[0], hi: cs[cs.length - 1], n: cs.length };
}
/** Plus fortes variations entre les deux derniers relevés, toutes séries (accueil, page historique). */
export function biggestMoves(limit = 8, dir: 'up' | 'down' | 'any' = 'any') {
  const out: Array<{ series: string; prog?: Prog; country?: string; delta: number; last: number; prev: number; prevDate: string; lastDate: string }> = [];
  for (const g of PROGS) {
    // Grands pays de dépôt seulement : un petit pays peut passer de 20 à 800 jours sur quelques dossiers.
    const keys = g.src === 'country' && !g.fixed ? countriesOf(g.id).filter((c) => MAJOR.includes(c)).map((c) => [seriesKey(g, c), c] as const) : [[seriesKey(g), undefined] as const];
    const ds = R.dates[g.src];
    for (const [k, c] of keys) {
      const t = recentTrend(k);
      if (!t || t.delta == null || t.prev == null || !t.prevDate || t.dir === 'flat') continue;
      // Les deux derniers relevés du fichier, rien de plus ancien : une série qui s'est arrêtée n'a pas « bougé ».
      if (t.lastDate !== ds[ds.length - 1] || t.prevDate !== ds[ds.length - 2]) continue;
      if (dir !== 'any' && t.dir !== dir) continue;
      out.push({ series: k, prog: g, country: c, delta: t.delta, last: t.last, prev: t.prev, prevDate: t.prevDate, lastDate: t.lastDate });
    }
  }
  return out.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, limit);
}
/** Pages par pays du site (code ISO → id de page). */
export const COUNTRY_PAGE: Record<string, string> = {
  IN: 'india', PH: 'philippines', NG: 'nigeria', CN: 'china', PK: 'pakistan', IR: 'iran', VN: 'vietnam', MX: 'mexico', BR: 'brazil',
  MA: 'morocco', DZ: 'algeria', CM: 'cameroon', TN: 'tunisia', FR: 'france', HT: 'haiti',
};
