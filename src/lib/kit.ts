/**
 * Trousse de rédaction (CONTRIBUTING-PAGES.md) : tout chiffre écrit dans une page vient d'ici, jamais tapé à la main.
 *   K.readingOf(prog, pays)      délai publié (t), date IRCC, série ; K.fmtTime(t, l) ; K.daysOf(t)
 *   K.estimate(prog, pays, date) date de décision estimée, file d'attente
 *   K.points(série) / K.fullTrend(série) / K.valueNear(série, date)   historique complet, provenance citée
 *   K.countriesOf(prog), K.countryName(code, l), K.MAJOR, K.PROGS, K.progName(id, l)
 *   K.ROUNDS (Entrée express), K.eeStats(...), K.catOf(nom), K.catName(cat, l)
 *   K.tool(kind, lang, args, valeurs)  lance un simulateur de tool-specs.ts et rend sa carte de résultat
 *   K.fr / K.en                  formats : n (nombre), day (date), my (mois et année), t (délai), d (jours dans une unité)
 */
import P from '../data/params-2026.json';
import * as D from './data';
import * as Hh from './hist';
import { eeStats, catOf, citizenship, addTime, addDays, addMonths, trendOf } from './engine/times';
import { runTool, catName } from './tool-specs';
import { formatNumber, type Lang } from './format';

const fmt = (l: Lang) => ({
  n: (x: number, d = 0) => formatNumber(x, d, l),
  day: (iso: string) => D.day(iso, l),
  my: (iso: string) => D.monthYear(iso, l),
  t: (t: D.Reading['t']) => D.fmtTime(t, l),
  d: (days: number, u = 'd') => D.fmtDays(days, u, l),
});
export const KIT = {
  ...D, ...Hh, P, eeStats, catOf, catName, citizenship, addTime, addDays, addMonths, trendOf,
  tool: runTool,
  fr: fmt('fr'), en: fmt('en'), fmt,
};
export type Kit = typeof KIT;
