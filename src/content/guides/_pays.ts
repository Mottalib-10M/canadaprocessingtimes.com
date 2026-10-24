/**
 * Outils communs des pages de pays francophones (Maroc, Algérie, Cameroun, Tunisie, France, Haïti).
 * Fichier préfixé « _ » : hors du registre des pages. Tous les chiffres viennent de la trousse, donc des données
 * ouvertes d'IRCC (Licence du gouvernement ouvert du Canada), par pays de CITOYENNETÉ (de naissance pour les
 * nouveaux citoyens). Aucun délai de traitement de canada.ca n'est repris.
 */
import { KIT as K } from '../../lib/kit';
import type { Helpers } from '../../lib/page-types';
import type { Metric } from '../../lib/data';
import type { Lang } from '../../lib/format';

/** « des citoyens marocains », « Moroccan citizens ». */
export const CITOYENS: Record<string, { fr: string; en: string }> = {
  MA: { fr: 'citoyens marocains', en: 'Moroccan citizens' }, DZ: { fr: 'citoyens algériens', en: 'Algerian citizens' },
  CM: { fr: 'citoyens camerounais', en: 'Cameroonian citizens' }, TN: { fr: 'citoyens tunisiens', en: 'Tunisian citizens' },
  FR: { fr: 'citoyens français', en: 'French citizens' }, HT: { fr: 'citoyens haïtiens', en: 'Haitian citizens' },
};
/** Sens d'un écart en clair, pour que le texte reste vrai quand les chiffres changent. */
export const dirFr = (x: number | null | undefined, f = 'féminin' as 'féminin' | 'masculin') => (x == null || Math.abs(x) < 0.5 ? 'stable' : x > 0 ? (f === 'féminin' ? 'en hausse' : 'en hausse') : 'en baisse');
export const dirEn = (x: number | null | undefined) => (x == null || Math.abs(x) < 0.5 ? 'flat' : x > 0 ? 'up' : 'down');
/** Rang ordinal : « 3e », « 1er » ; « 3rd », « 1st ». */
export function ord(n: number | null, l: Lang): string {
  if (n == null) return l === 'fr' ? 'non classé' : 'unranked';
  if (l === 'fr') return n === 1 ? '1er' : `${K.fr.n(n)}e`;
  const o = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
  return `${n}${o}`;
}
/** Rang du pays parmi les citoyennetés des invitations d'Entrée express d'une année (1 = le plus d'invitations). */
export function eeRank(y: string, c: string): number | null {
  const all = K.eeTop(y, 500);
  const i = all.findIndex(([x]) => x === c);
  return i < 0 ? null : i + 1;
}
const NAME: Record<Metric, { fr: string; en: string }> = {
  trIn: { fr: 'Résidence temporaire : demandes reçues', en: 'Temporary residence: applications received' },
  trFin: { fr: 'Résidence temporaire : demandes finalisées', en: 'Temporary residence: applications finalized' },
  trOk: { fr: 'Résidence temporaire : demandes approuvées', en: 'Temporary residence: applications approved' },
  spFin: { fr: 'Permis d’études : nouvelles demandes finalisées', en: 'Study permits: new applications finalized' },
  v1: { fr: 'Visas de visiteur approuvés (V-1)', en: 'Visitor visas approved (V-1)' },
  prIn: { fr: 'Résidence permanente : demandes reçues', en: 'Permanent residence: applications received' },
  copr: { fr: 'Résidence permanente : autorisations délivrées', en: 'Permanent residence: authorizations issued' },
  cit: { fr: 'Nouveaux citoyens nés dans ce pays', en: 'New citizens born in this country' },
};
export const metricName = (m: Metric, l: Lang) => NAME[m][l];
/** Tableau par année civile de quelques indicateurs (2023, 2024, 2025 complètes, puis l'année en cours). */
export function yearsTable(h: Helpers, c: string, metrics: Metric[], caption: string) {
  const fr = h.lang === 'fr', cur = K.EE_CUR, n = K.monthsOfYear(cur).length;
  const years = ['2023', '2024', '2025', cur].filter((y, i, a) => a.indexOf(y) === i);
  const head = [fr ? 'Indicateur' : 'Indicator', ...years.map((y) => (y === cur ? (fr ? `${y} (${n} mois)` : `${y} (${n} months)`) : y))];
  const rows = metrics.map((m) => [NAME[m][h.lang], ...years.map((y) => h.n(K.fullYear(m, c, y)))]);
  return h.table(head, rows, caption, ['l', ...years.map(() => 'r' as const)]);
}
/** Tableau douze mois contre douze mois d'avant pour quelques indicateurs. */
export function yoyTable(h: Helpers, c: string, metrics: Metric[], caption: string) {
  const fr = h.lang === 'fr';
  const rows = metrics.map((m) => { const y = K.ops12(m, c); return [NAME[m][h.lang], h.n(y.last), h.n(y.prev), h.ch(y.change)]; });
  return h.table([fr ? 'Indicateur' : 'Indicator', fr ? '12 derniers mois' : 'Last 12 months', fr ? '12 mois d’avant' : 'Previous 12 months', fr ? 'Écart' : 'Change'], rows, caption, ['l', 'r', 'r', 'r']);
}
