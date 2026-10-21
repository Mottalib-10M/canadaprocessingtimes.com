/**
 * Outils communs des pages de pays francophones (Maroc, Algérie, Cameroun, Tunisie, France, Haïti).
 * Fichier préfixé « _ » : hors du registre des pages. Tous les chiffres viennent de la trousse.
 */
import { KIT as K } from '../../lib/kit';
import type { Helpers } from '../../lib/page-types';
import type { Lang } from '../../lib/format';

/** « depuis le Maroc », « from Morocco ». */
export const DEPUIS: Record<string, string> = { MA: 'depuis le Maroc', DZ: 'depuis l’Algérie', CM: 'depuis le Cameroun', TN: 'depuis la Tunisie', FR: 'depuis la France', HT: 'depuis Haïti' };
export const G5 = ['visitor', 'super-visa', 'study', 'work', 'child'] as const;
export type G5 = (typeof G5)[number];
const KEY: Record<G5, string> = { visitor: 'visitor-outside-canada', 'super-visa': 'supervisa', study: 'study', work: 'work', child: 'child_dependent' };
export const ser = (g: G5, c: string) => `c:${KEY[g]}:${c}`;
export const tm = (g: G5, c: string) => K.readingOf(g, c).t;
export const unit = (g: G5, c: string) => { const x = tm(g, c); return x && 'u' in x ? x.u : 'd'; };
export const tr = (g: G5, c: string) => K.fullTrend(ser(g, c));
const known = (g: G5) => K.countriesOf(g).map((x) => K.daysOf(tm(g, x))).filter((v): v is number => v != null).sort((a, b) => a - b);
/** Rang parmi les pays chiffrés (1 = le plus rapide), ex aequo compris. */
export function rankOf(g: G5, c: string): { pos: number; of: number } | null {
  const all = known(g), mine = K.daysOf(tm(g, c));
  if (mine == null) return null;
  return { pos: all.filter((v) => v < mine).length + 1, of: all.length };
}
export function rankText(g: G5, c: string, l: Lang): string {
  const r = rankOf(g, c);
  if (!r) return l === 'fr' ? 'non classé' : 'not ranked';
  if (l === 'fr') return `${r.pos === 1 ? '1er' : `${K.fr.n(r.pos)}e`} rang sur ${K.fr.n(r.of)}`;
  const o = r.pos % 100 >= 11 && r.pos % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[r.pos % 10] ?? 'th';
  return r.pos === 1 ? `fastest of ${K.en.n(r.of)}` : `${r.pos}${o} fastest of ${K.en.n(r.of)}`;
}
export const median = (g: G5) => { const a = known(g); return a[Math.floor(a.length / 2)]; };
/** Tableau des cinq lignes d'un pays : délai, rang, plus ancienne copie gardée. */
export function lines(h: Helpers, c: string, order: readonly G5[] = G5) {
  const fr = h.lang === 'fr';
  const rows = order.map((g) => {
    const t = tr(g, c);
    return [h.a(K.PAGE_OF[g], K.progName(g, h.lang)), h.t(tm(g, c)), rankText(g, c, h.lang), t?.firstDate ? `${h.d(t.first!, unit(g, c))} (${h.day(t.firstDate)})` : ''];
  });
  return h.table([fr ? 'Demande' : 'Application', fr ? 'Délai publié' : 'Published time', fr ? 'Rang' : 'Rank', fr ? 'Plus ancienne copie' : 'Oldest copy kept'], rows,
    fr ? `Demandes déposées ${DEPUIS[c]}, fichier par pays d’IRCC du ${h.day(K.L.dates.country)}. Rang : 1 = délai le plus court parmi les pays chiffrés.` : `Applications filed from ${K.countryName(c, 'en')}, IRCC country file of ${h.day(K.L.dates.country)}. Rank: 1 = shortest time among the countries with a figure.`,
    ['l', 'r', 'l', 'r']);
}
