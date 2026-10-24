/**
 * Données du site, lues dans les fichiers écrits par scripts/ircc/update-data.mjs à partir des jeux de données
 * ouverts d'IRCC (open.canada.ca, Licence du gouvernement ouvert – Canada, OGL-Canada 2.0) :
 *   src/data/ogl/ops-recent.json  Operational Processing, 24 derniers mois, par pays de citoyenneté
 *   src/data/ogl/pr.json          admissions de résidents permanents par catégorie, par mois, depuis 2023
 *   src/data/ogl/imp.json         permis du Programme de mobilité internationale par programme, par mois
 *   src/data/ogl/study.json       permis d'études entrés en vigueur, par pays de citoyenneté et par mois
 *   src/data/ogl/ee.json          candidats d'Entrée express invités, par année, programme, tranche de score, pays
 *   src/data/ogl/std.json         normes de service d'IRCC et part des demandes traitées dans la norme, par exercice
 *                                 (Inventaire des services du GC, Secrétariat du Conseil du Trésor, OGL-Canada 2.0)
 *   src/data/ogl/names.json       noms des pays (anglais, français), figés au relevé
 * Les délais de traitement eux-mêmes ne sont PAS repris : IRCC les publie sur canada.ca, dont le contenu relève
 * des « Avis » du gouvernement du Canada (reproduction non commerciale). Le simulateur prend le délai que le
 * lecteur a lu chez IRCC et en tire une date estimée.
 * Ce module est chargé dans le navigateur (simulateurs) : il n'importe jamais ops.json complet (lib/ogl-full.ts).
 */
import OPS from '../data/ogl/ops-recent.json';
import PR from '../data/ogl/pr.json';
import IMP from '../data/ogl/imp.json';
import STUDY from '../data/ogl/study.json';
import EE from '../data/ogl/ee.json';
import NAMES_JSON from '../data/ogl/names.json';
import STDJ from '../data/ogl/std.json';
import P from '../data/params-2026.json';
import { displayDate, formatNumber, type Lang } from './format';
import { yearOverYear, pct, sumWindow, bandShare, type Series, type Unit } from './engine/times';

export type Family = 'visit' | 'study' | 'work' | 'pr' | 'family' | 'cit';
/** Donnée ouverte qui éclaire chaque type de demande : volumes de traitement par pays (tr), visas de visiteur
 *  approuvés (visit), demandes de permis d'études finalisées (study), admissions de résidents permanents d'une
 *  catégorie (pr), permis du PMI d'un programme (imp), nouveaux citoyens (cit). */
export type Ctx = { kind: 'tr' | 'visit' | 'study' | 'pr' | 'imp' | 'cit' | 'none'; key?: string };
export interface Prog {
  id: string; family: Family;
  name: { en: string; fr: string };
  /** Nature du délai qu'IRCC affiche pour ce type de demande : passé (80 % des demandes récentes traitées)
   *  ou prospectif (temps prévu pour une demande reçue aujourd'hui). Une définition, pas un chiffre. */
  method: 'past' | 'forward';
  /** Unité dans laquelle IRCC exprime d'habitude ce délai (pré-réglage du champ « unité »). */
  unit: Unit;
  ctx: Ctx;
  /** Le pays de citoyenneté éclaire le contexte (volumes par pays). */
  byCountry?: boolean;
}
const p = (id: string, family: Family, en: string, fr: string, method: Prog['method'], unit: Unit, ctx: Ctx, byCountry = false): Prog =>
  ({ id, family, name: { en, fr }, method, unit, ctx, byCountry });

/** Les types de demande, dans l'ordre du menu. */
export const PROGS: Prog[] = [
  p('visitor', 'visit', 'Visitor visa (applying from outside Canada)', 'Visa de visiteur (demande hors du Canada)', 'past', 'd', { kind: 'visit' }, true),
  p('super-visa', 'visit', 'Parent and grandparent super visa', 'Super visa pour parents et grands-parents', 'past', 'd', { kind: 'visit' }, true),
  p('visitor-inside', 'visit', 'Visitor visa (applying from inside Canada)', 'Visa de visiteur (demande au Canada)', 'past', 'd', { kind: 'tr' }, true),
  p('visitor-record', 'visit', 'Visitor record (extend a visit)', 'Fiche du visiteur (prolonger un séjour)', 'past', 'd', { kind: 'tr' }, true),
  p('eta', 'visit', 'Electronic Travel Authorization (eTA)', 'Autorisation de voyage électronique (AVE)', 'past', 'd', { kind: 'none' }),
  p('study', 'study', 'Study permit (applying from outside Canada)', 'Permis d’études (demande hors du Canada)', 'past', 'w', { kind: 'study' }, true),
  p('study-inside', 'study', 'Study permit (applying from inside Canada)', 'Permis d’études (demande au Canada)', 'past', 'w', { kind: 'study' }, true),
  p('study-ext', 'study', 'Study permit extension', 'Prolongation du permis d’études', 'forward', 'd', { kind: 'tr' }, true),
  p('work', 'work', 'Work permit (applying from outside Canada)', 'Permis de travail (demande hors du Canada)', 'past', 'w', { kind: 'tr' }, true),
  p('work-inside', 'work', 'Work permit (applying from inside Canada)', 'Permis de travail (demande au Canada)', 'past', 'd', { kind: 'imp', key: 'pgwp' }, true),
  p('work-ext', 'work', 'Work permit extension', 'Prolongation du permis de travail', 'forward', 'd', { kind: 'tr' }, true),
  p('iec', 'work', 'International Experience Canada (work permit)', 'Expérience internationale Canada (permis de travail)', 'past', 'w', { kind: 'imp', key: 'iec' }),
  p('cec', 'pr', 'Canadian Experience Class (Express Entry)', 'Catégorie de l’expérience canadienne (Entrée express)', 'forward', 'm', { kind: 'pr', key: 'cec' }),
  p('fsw', 'pr', 'Federal Skilled Worker (Express Entry)', 'Travailleurs qualifiés du fédéral (Entrée express)', 'forward', 'm', { kind: 'pr', key: 'fsw' }),
  p('pnp-ee', 'pr', 'Provincial nominee, through Express Entry', 'Candidat d’une province, par Entrée express', 'forward', 'm', { kind: 'pr', key: 'pnp' }),
  p('pnp-base', 'pr', 'Provincial nominee, paper (base) stream', 'Candidat d’une province, volet de base (hors Entrée express)', 'forward', 'm', { kind: 'pr', key: 'pnp' }),
  p('qsw', 'pr', 'Quebec-selected skilled worker', 'Travailleur qualifié sélectionné par le Québec', 'forward', 'm', { kind: 'pr', key: 'qsw' }),
  p('aip', 'pr', 'Atlantic Immigration Program', 'Programme d’immigration au Canada atlantique', 'forward', 'm', { kind: 'pr', key: 'aip' }),
  p('caregiver', 'pr', 'Caregivers (permanent residence)', 'Aides familiaux (résidence permanente)', 'forward', 'm', { kind: 'pr', key: 'caregiver' }),
  p('startup-visa', 'pr', 'Start-up Visa', 'Visa pour démarrage d’entreprise', 'forward', 'm', { kind: 'pr', key: 'startup' }),
  p('spousal-in-roc', 'family', 'Spouse or partner living in Canada (outside Quebec)', 'Époux ou conjoint vivant au Canada (hors Québec)', 'forward', 'm', { kind: 'pr', key: 'spouse' }),
  p('spousal-in-qc', 'family', 'Spouse or partner living in Canada (Quebec)', 'Époux ou conjoint vivant au Canada (Québec)', 'forward', 'm', { kind: 'pr', key: 'spouse' }),
  p('spousal-out-roc', 'family', 'Spouse or partner living abroad (outside Quebec)', 'Époux ou conjoint vivant à l’étranger (hors Québec)', 'forward', 'm', { kind: 'pr', key: 'spouse' }),
  p('spousal-out-qc', 'family', 'Spouse or partner living abroad (Quebec)', 'Époux ou conjoint vivant à l’étranger (Québec)', 'forward', 'm', { kind: 'pr', key: 'spouse' }),
  p('child', 'family', 'Dependent child sponsorship', 'Parrainage d’un enfant à charge', 'past', 'm', { kind: 'pr', key: 'child' }),
  p('pgp-roc', 'family', 'Parents and grandparents (outside Quebec)', 'Parents et grands-parents (hors Québec)', 'forward', 'm', { kind: 'pr', key: 'pgp' }),
  p('pgp-qc', 'family', 'Parents and grandparents (Quebec)', 'Parents et grands-parents (Québec)', 'forward', 'm', { kind: 'pr', key: 'pgp' }),
  p('refugees-gov', 'family', 'Government-assisted refugees (outside Quebec)', 'Réfugiés pris en charge par le gouvernement (hors Québec)', 'forward', 'm', { kind: 'pr', key: 'gar' }),
  p('refugees-priv', 'family', 'Privately sponsored refugees (outside Quebec)', 'Réfugiés parrainés par le secteur privé (hors Québec)', 'forward', 'm', { kind: 'pr', key: 'psr' }),
  p('protected', 'family', 'Protected persons in Canada (outside Quebec)', 'Personnes protégées au Canada (hors Québec)', 'forward', 'm', { kind: 'pr', key: 'protected' }),
  p('citizenship', 'cit', 'Citizenship grant (adults)', 'Attribution de la citoyenneté (adultes)', 'forward', 'm', { kind: 'cit' }),
  p('cit-proof', 'cit', 'Proof of citizenship (certificate)', 'Preuve de citoyenneté (certificat)', 'forward', 'm', { kind: 'cit' }),
  p('cit-search', 'cit', 'Search of citizenship records', 'Recherche dans les registres de citoyenneté', 'past', 'm', { kind: 'none' }),
  p('pr-card-new', 'cit', 'First PR card (new permanent resident)', 'Première carte RP (nouveau résident permanent)', 'past', 'd', { kind: 'pr', key: 'all' }),
  p('pr-card-renew', 'cit', 'PR card renewal or replacement', 'Renouvellement ou remplacement de la carte RP', 'past', 'd', { kind: 'none' }),
];
export const progById = (id: string): Prog => { const x = PROGS.find((q) => q.id === id); if (!x) throw new Error(`programme inconnu : ${id}`); return x; };
export const PROG_IDS = PROGS.map((q) => q.id);
export const progName = (id: string, l: Lang) => progById(id).name[l];

/* ---------- jeux de données ---------- */
export type Metric = 'trIn' | 'trFin' | 'trOk' | 'spFin' | 'v1' | 'prIn' | 'copr' | 'cit';
type Ops = { read: string; asOf: string; months: string[]; data: Record<Metric, Record<string, Series>> };
export const O = OPS as unknown as Ops;
type Cats = { read: string; months: string[]; names: Record<string, { en: string; fr: string }>; v: Record<string, number[]> };
export const PRD = PR as unknown as Cats;
export const IMPD = IMP as unknown as Cats;
export const STD = STUDY as unknown as { read: string; months: string[]; all: number[]; byC: Record<string, number[]> };
type Ee = { read: string; years: string[]; byYear: Record<string, Record<string, number>>; bands: Record<string, Record<string, number[]>>; bandOrder: string[]; citz: Record<string, Record<string, number>> };
export const EED = EE as unknown as Ee;
export const CIT_RULE = (P as unknown as { citizenship: { required: number; tempRatio: number; tempCap: number; window: number } }).citizenship;
/** Date de la dernière lecture des fichiers : « aujourd'hui » de tous les calculs (même résultat au build et dans le navigateur). */
export const READ = O.read;
/** Date d'extraction annoncée par IRCC dans les fichiers Operational Processing (« Data Source: … as of »). */
export const AS_OF = O.asOf;
/** Dernier mois publié de chaque jeu. */
export const LAST = { ops: O.months[O.months.length - 1], pr: PRD.months[PRD.months.length - 1], imp: IMPD.months[IMPD.months.length - 1], study: STD.months[STD.months.length - 1] };
export const EE_YEARS = EED.years;
/** Dernière année complète d'Entrée express (l'année en cours est partielle). */
export const EE_FULL = String(Number(LAST.ops.slice(0, 4)) - 1);
export const EE_CUR = LAST.ops.slice(0, 4);

/* ---------- libellés ---------- */
export const METRIC: Record<Metric, { en: string; fr: string }> = {
  trIn: { en: 'Temporary residence applications received', fr: 'Demandes de résidence temporaire reçues' },
  trFin: { en: 'Temporary residence applications finalized', fr: 'Demandes de résidence temporaire finalisées' },
  trOk: { en: 'Temporary residence applications approved', fr: 'Demandes de résidence temporaire approuvées' },
  spFin: { en: 'New study permit applications finalized', fr: 'Nouvelles demandes de permis d’études finalisées' },
  v1: { en: 'Visitor visas approved (V-1)', fr: 'Visas de visiteur approuvés (V-1)' },
  prIn: { en: 'Permanent residence applications received', fr: 'Demandes de résidence permanente reçues' },
  copr: { en: 'Permanent residence authorizations and visas issued', fr: 'Autorisations et visas de résidence permanente délivrés' },
  cit: { en: 'New Canadian citizens (by country of birth)', fr: 'Nouveaux citoyens canadiens (par pays de naissance)' },
};
const PR_NAMES: Record<string, { en: string; fr: string }> = {
  all: { en: 'All permanent residents', fr: 'Tous les résidents permanents' }, cec: { en: 'Canadian Experience Class', fr: 'Catégorie de l’expérience canadienne' },
  fsw: { en: 'Skilled workers (federal and Quebec)', fr: 'Travailleurs qualifiés (fédéral et Québec)' }, qsw: { en: 'Skilled workers admitted to Quebec', fr: 'Travailleurs qualifiés admis au Québec' },
  pnp: { en: 'Provincial Nominee Program', fr: 'Programme des candidats des provinces' }, aip: { en: 'Atlantic Immigration Program', fr: 'Programme d’immigration au Canada atlantique' },
  caregiver: { en: 'Caregivers', fr: 'Aides familiaux' }, startup: { en: 'Start-up Business', fr: 'Démarrage d’entreprise' }, spouse: { en: 'Sponsored spouses and partners', fr: 'Époux et conjoints parrainés' },
  child: { en: 'Sponsored children', fr: 'Enfants parrainés' }, pgp: { en: 'Sponsored parents and grandparents', fr: 'Parents et grands-parents parrainés' },
  gar: { en: 'Government-assisted refugees', fr: 'Réfugiés pris en charge par le gouvernement' }, psr: { en: 'Privately sponsored refugees', fr: 'Réfugiés parrainés par le secteur privé' },
  protected: { en: 'Protected persons in Canada', fr: 'Personnes protégées au Canada' }, protectedDep: { en: 'Dependants of protected persons', fr: 'Personnes à charge de personnes protégées' },
  hc: { en: 'Humanitarian and compassionate grounds', fr: 'Circonstances d’ordre humanitaire' }, rnip: { en: 'Rural and northern immigration', fr: 'Immigration dans les communautés rurales et du Nord' },
  tr2pr: { en: 'Temporary to permanent residence pathway', fr: 'Voie d’accès de la résidence temporaire à la résidence permanente' }, agri: { en: 'Agri-food pilot', fr: 'Projet pilote agroalimentaire' },
  fst: { en: 'Skilled trades', fr: 'Métiers spécialisés' }, selfemp: { en: 'Self-employed persons', fr: 'Travailleurs autonomes' }, bvor: { en: 'Blended sponsorship refugees', fr: 'Réfugiés du parrainage mixte' },
};
export const prName = (k: string, l: Lang) => PR_NAMES[k]?.[l] ?? PRD.names[k]?.[l] ?? k;
const IMP_NAMES: Record<string, { en: string; fr: string }> = {
  all: { en: 'All International Mobility Program permits', fr: 'Tous les permis du Programme de mobilité internationale' }, pgwp: { en: 'Post-graduation work permits', fr: 'Permis de travail postdiplôme' },
  iec: { en: 'International Experience Canada', fr: 'Expérience internationale Canada' }, spouseWorker: { en: 'Spouses of skilled workers', fr: 'Conjoints de travailleurs qualifiés' },
  spouseStudent: { en: 'Spouses of students', fr: 'Conjoints d’étudiants' }, ict: { en: 'Intra-company transfers', fr: 'Mutations à l’intérieur d’une entreprise' },
  bowp: { en: 'Bridging open work permits', fr: 'Permis de travail ouverts transitoires' },
};
export const impName = (k: string, l: Lang) => IMP_NAMES[k]?.[l] ?? k;
export const EE_PROG: Record<string, { en: string; fr: string }> = {
  all: { en: 'All programs', fr: 'Tous les programmes' }, cec: { en: 'Canadian Experience Class', fr: 'Catégorie de l’expérience canadienne' },
  fsw: { en: 'Federal Skilled Worker', fr: 'Travailleurs qualifiés du fédéral' }, pnp: { en: 'Provincial Nominee Program', fr: 'Programme des candidats des provinces' },
  fst: { en: 'Federal Skilled Trades', fr: 'Métiers spécialisés du fédéral' },
};

/* ---------- pays ---------- */
const NAMES = NAMES_JSON as Record<string, { en: string; fr: string }>;
export const countryName = (code: string, l: Lang): string => (code === 'ALL' ? (l === 'fr' ? 'Tous les pays' : 'All countries') : NAMES[code]?.[l] ?? code);
/** Tri stable et identique partout (sans localeCompare, dont l'ordre dépend du moteur) : accents retirés. */
const fold = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const byName = (a: string, b: string) => { const x = fold(a), y = fold(b); return x < y ? -1 : x > y ? 1 : 0; };
/** Pays de citoyenneté présents dans les volumes de résidence temporaire (codes ISO seulement). */
export const COUNTRIES = Object.keys(O.data.trFin).filter((c) => c !== 'ALL' && !c.startsWith('X-'));
/** Grands pays de dépôt, toujours montrés dans les tableaux comparatifs. */
export const MAJOR = ['IN', 'PH', 'NG', 'CN', 'PK', 'IR', 'VN', 'MX', 'BR', 'BD', 'MA', 'DZ', 'CM', 'FR', 'US', 'GB'];
/** Pages par pays du site (code ISO → id de page). */
export const COUNTRY_PAGE: Record<string, string> = {
  IN: 'india', PH: 'philippines', NG: 'nigeria', CN: 'china', PK: 'pakistan', IR: 'iran', VN: 'vietnam', MX: 'mexico', BR: 'brazil',
  MA: 'morocco', DZ: 'algeria', CM: 'cameroon', TN: 'tunisia', FR: 'france', HT: 'haiti',
};

/* ---------- lectures ---------- */
const lastIdx = O.months.length - 1;
/** Série mensuelle (24 derniers mois) d'un indicateur pour un pays, ou 'ALL'. */
export const opsSeries = (m: Metric, code = 'ALL'): Series => O.data[m]?.[code] ?? [];
/** Douze derniers mois publiés, douze mois d'avant, écart. */
export const ops12 = (m: Metric, code = 'ALL') => yearOverYear(opsSeries(m, code), lastIdx);
/** Part des demandes de résidence temporaire finalisées qui ont été approuvées, sur douze mois. */
export function approval12(code = 'ALL') {
  const ok = sumWindow(opsSeries('trOk', code), lastIdx), fin = sumWindow(opsSeries('trFin', code), lastIdx);
  const okP = sumWindow(opsSeries('trOk', code), lastIdx - 12), finP = sumWindow(opsSeries('trFin', code), lastIdx - 12);
  return { ok, fin, rate: pct(ok, fin), prevRate: pct(okP, finP) };
}
/** Demandes reçues moins demandes finalisées sur douze mois : positif, le stock en attente a grossi. */
export function net12(code = 'ALL') {
  const rin = sumWindow(opsSeries('trIn', code), lastIdx), fin = sumWindow(opsSeries('trFin', code), lastIdx);
  return { rin, fin, net: rin != null && fin != null ? rin - fin : null };
}
/** Rang d'un pays parmi tous (1 = le plus de demandes) pour un indicateur sur douze mois. */
export function rank12(m: Metric, code: string) {
  const all = COUNTRIES.map((c) => [c, sumWindow(opsSeries(m, c), lastIdx) ?? 0] as const).sort((a, b) => b[1] - a[1]);
  const i = all.findIndex(([c]) => c === code);
  return { rank: i < 0 ? null : i + 1, of: all.length };
}
const catSeries = (D: Cats, k: string) => D.v[k] ?? [];
export const prSeries = (k: string) => catSeries(PRD, k);
export const pr12 = (k: string) => yearOverYear(prSeries(k), PRD.months.length - 1);
export const impSeries = (k: string) => catSeries(IMPD, k);
export const imp12 = (k: string) => yearOverYear(impSeries(k), IMPD.months.length - 1);
export const studySeries = (code = 'ALL') => (code === 'ALL' ? STD.all : STD.byC[code] ?? []);
export const study12 = (code = 'ALL') => yearOverYear(studySeries(code), STD.months.length - 1);
/** Somme d'une année civile dans une série mensuelle. */
export function yearSum(v: Series, months: string[], y: string): number | null {
  let s = 0, seen = 0; months.forEach((m, i) => { if (m.startsWith(y) && v[i] != null) { s += v[i] as number; seen++; } });
  return seen ? s : null;
}
/** Invitations d'Entrée express d'une année : total, par programme, par tranche de score. */
export const eeYear = (y: string, prog = 'all') => EED.byYear[y]?.[prog] ?? 0;
export const eeBands = (y: string, prog = 'all') => EED.bands[y]?.[prog] ?? EED.bandOrder.map(() => 0);
export const eeBandShare = (y: string, prog: string, score: number) => bandShare(eeBands(y, prog), EED.bandOrder, score);
export const eeCountry = (y: string, code: string) => EED.citz[y]?.[code] ?? 0;
export function eeTop(y: string, n = 10) { return Object.entries(EED.citz[y] ?? {}).filter(([c]) => !c.startsWith('X-')).sort((a, b) => b[1] - a[1]).slice(0, n); }

/* ---------- normes de service ---------- */
export interface Std { en: string; fr: string; n: number | null; u: 'min' | 'd' | 'm' | null; target: number | null; met: number | null; total: number | null; perf: number | null }
const STDS = STDJ as unknown as { read: string; years: string[]; std: Record<string, Record<string, Std>> };
export const STD_YEARS = STDS.years;
/** Exercice le plus récent publié (« 2024-2025 »). */
export const STD_FY = STDS.years[STDS.years.length - 1];
const STD_KEY: Record<string, string> = { 'spousal-out-roc': 'family-overseas', 'spousal-out-qc': 'family-overseas', child: 'family-overseas' };
/** Norme de service d'IRCC pour un type de demande : délai visé, part des demandes traitées dans ce délai, pour
 *  l'exercice le plus récent et le précédent. null si IRCC ne publie pas de norme pour ce type de demande. */
export function stdOf(progId: string) {
  const o = STDS.std[STD_KEY[progId] ?? progId]; if (!o) return null;
  const ys = Object.keys(o).sort(), fy = ys[ys.length - 1], pfy = ys[ys.length - 2];
  return { fy, cur: o[fy], pfy: pfy ?? null, prev: pfy ? o[pfy] : null };
}
/** « 14 jours », « 2 mois », « 5 minutes ». */
export function fmtStd(x: Std, l: Lang) {
  if (x.n == null || !x.u) return '';
  const w = x.u === 'min' ? (l === 'fr' ? ['minute', 'minutes'] : ['minute', 'minutes']) : UNIT[l][x.u];
  return `${num(x.n, l)} ${w[x.n === 1 ? 0 : 1]}`;
}
/** « 2024-2025 » → « 2024-25 » (en), « 2024-2025 » (fr). */
export const fmtFy = (fy: string, l: Lang) => (l === 'en' ? `${fy.slice(0, 4)}-${fy.slice(7, 9)}` : fy);

/* ---------- mise en forme ---------- */
export const num = (x: number, l: Lang, d = 0) => formatNumber(x, d, l);
export const fmtN = (x: number | null | undefined, l: Lang) => (x == null ? (l === 'fr' ? 'non publié' : 'not published') : num(x, l));
export const fmtPct = (x: number | null | undefined, l: Lang) => (x == null ? (l === 'fr' ? 'non calculable' : 'not available') : `${num(x, l, 1)}${l === 'fr' ? ' %' : '%'}`);
/** « +12,4 % », « −3.1% », « stable ». */
export function fmtChange(x: number | null | undefined, l: Lang): string {
  if (x == null) return l === 'fr' ? 'non calculable' : 'not available';
  if (Math.abs(x) < 0.5) return l === 'fr' ? 'stable' : 'stable';
  return `${x > 0 ? '+' : '-'}${fmtPct(Math.abs(x), l)}`;
}
const UNIT: Record<Lang, Record<Unit, [string, string]>> = {
  en: { d: ['day', 'days'], w: ['week', 'weeks'], m: ['month', 'months'] },
  fr: { d: ['jour', 'jours'], w: ['semaine', 'semaines'], m: ['mois', 'mois'] },
};
export const unitWord = (n: number, u: Unit, l: Lang) => UNIT[l][u][n === 1 ? 0 : 1];
export const fmtTime = (n: number, u: Unit, l: Lang) => `${num(n, l)} ${unitWord(n, u, l)}`;
export const day = (iso: string, l: Lang) => displayDate(iso, l === 'fr' ? 'fr-CA' : 'en-CA');
export const monthYear = (iso: string, l: Lang) => new Date(`${iso.slice(0, 7)}-15T00:00:00Z`).toLocaleDateString(l === 'fr' ? 'fr-CA' : 'en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
/** « septembre 2025 à août 2026 » : la fenêtre des douze derniers mois publiés. */
export function window12(months: string[], l: Lang, back = 0) {
  const end = months.length - 1 - back, start = end - 11;
  if (start < 0) return '';
  return l === 'fr' ? `${monthYear(months[start], l)} à ${monthYear(months[end], l)}` : `${monthYear(months[start], l)} to ${monthYear(months[end], l)}`;
}
/** Date à la précision de l'unité : au mois près pour des mois, au jour près sinon. */
export const whenAt = (iso: string, u: Unit, l: Lang) => (u === 'm' ? monthYear(iso, l) : day(iso, l));

/** Page du site qui traite chaque type de demande (liens des tableaux). */
export const PAGE_OF: Record<string, string> = {
  visitor: 'visitor-visa', 'super-visa': 'super-visa', 'visitor-inside': 'visitor-visa', 'visitor-record': 'visitor-record', eta: 'eta',
  study: 'study-permit', 'study-inside': 'study-permit', 'study-ext': 'study-permit-extension', work: 'work-permit', 'work-inside': 'pgwp', 'work-ext': 'work-permit-extension', iec: 'iec',
  cec: 'cec', fsw: 'fsw', 'pnp-ee': 'pnp', 'pnp-base': 'pnp', qsw: 'quebec-skilled-worker', aip: 'atlantic', caregiver: 'caregiver', 'startup-visa': 'express-entry',
  'spousal-in-roc': 'spousal-sponsorship', 'spousal-in-qc': 'spousal-sponsorship', 'spousal-out-roc': 'spousal-sponsorship', 'spousal-out-qc': 'spousal-sponsorship',
  child: 'dependent-child', 'pgp-roc': 'parents-grandparents', 'pgp-qc': 'parents-grandparents', 'refugees-gov': 'refugees', 'refugees-priv': 'refugees', protected: 'refugees',
  citizenship: 'citizenship', 'cit-proof': 'citizenship', 'cit-search': 'citizenship', 'pr-card-new': 'pr-card', 'pr-card-renew': 'pr-card',
};
