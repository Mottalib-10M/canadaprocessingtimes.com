/**
 * Trousse de rédaction (CONTRIBUTING-PAGES.md) : tout chiffre écrit dans une page vient d'ici, jamais tapé à la main.
 * Sources : jeux de données ouverts d'IRCC (open.canada.ca), Licence du gouvernement ouvert – Canada (OGL-Canada 2.0).
 *   Douze mois (navigateur et build) : K.ops12(indicateur, pays), K.approval12(pays), K.net12(pays), K.rank12(ind., pays),
 *     K.pr12(catégorie), K.imp12(programme), K.study12(pays) → { last, prev, change }
 *   Séries complètes (build) : K.full(ind., pays), K.pointsOf(ind., pays), K.fullYoY(ind., pays, recul), K.fullYear(ind., pays, année),
 *     K.fullExtremes(ind., pays) ; K.prSeries(cat.), K.impSeries(prog.), K.studySeries(pays) avec K.PRD.months, K.IMPD.months, K.STD.months
 *   Entrée express : K.eeYear(année, prog.), K.eeBands(année, prog.), K.eeBandShare(année, prog., score), K.eeCountry(année, pays), K.eeTop(année)
 *   K.PROGS, K.progName(id, l), K.countryName(code, l), K.MAJOR, K.COUNTRY_PAGE, K.CIT_RULE (règle des 1 095 jours)
 *   K.tool(kind, lang, args, valeurs)  lance un simulateur de tool-specs.ts et rend sa carte de résultat
 *   K.fr / K.en  formats : n (nombre), pct (pour cent), ch (écart signé), pa (écart sans signe), day (date), my (mois et année), w12 (fenêtre de douze mois)
 * Les délais de traitement publiés sur canada.ca ne sont pas repris (Avis du gouvernement du Canada) : une page les
 * renvoie à l'outil d'IRCC (h.src('ptimes')) et le simulateur prend le délai que le lecteur y lit.
 */
import P from '../data/params-2026.json';
import * as D from './data';
import * as F from './ogl-full';
import { citizenship, addTime, addDays, addMonths, estimate, bandShare, yearOverYear, sumWindow, pct } from './engine/times';
import { runTool } from './tool-specs';
import { formatNumber, type Lang } from './format';

const fmt = (l: Lang) => ({
  n: (x: number | null | undefined, d = 0) => (x == null ? D.fmtN(null, l) : formatNumber(x, d, l)),
  pct: (x: number | null | undefined) => D.fmtPct(x, l),
  ch: (x: number | null | undefined) => D.fmtChange(x, l),
  /** Écart sans signe, pour « en hausse de 12,4 % » / « down 3.1% ». */
  pa: (x: number | null | undefined) => D.fmtPct(x == null ? x : Math.abs(x), l),
  day: (iso: string) => D.day(iso, l),
  my: (iso: string) => D.monthYear(iso.length === 7 ? `${iso}-15` : iso, l),
  w12: (months: string[] = F.MONTHS, back = 0) => D.window12(months, l, back),
});
export const KIT = {
  ...D, ...F, P, citizenship, addTime, addDays, addMonths, estimate, bandShare, yearOverYear, sumWindow, pctOf: pct,
  tool: runTool,
  fr: fmt('fr'), en: fmt('en'), fmt,
};
export type Kit = typeof KIT;
