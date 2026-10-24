/**
 * Séries complètes (rendues au build, jamais chargées dans le navigateur) : src/data/ogl/ops.json, tous les mois
 * publiés par IRCC depuis janvier 2023 dans le jeu « Operational Processing – Monthly IRCC Updates » (OGL-Canada 2.0).
 */
import FULL from '../data/ogl/ops.json';
import type { Metric } from './data';
import { yearOverYear, extremes, type Series } from './engine/times';

type Ops = { read: string; asOf: string; months: string[]; data: Record<Metric, Record<string, Series>> };
export const OF = FULL as unknown as Ops;
export const MONTHS = OF.months;
/** Série mensuelle complète d'un indicateur, pour un pays ou 'ALL'. */
export const full = (m: Metric, code = 'ALL'): Series => OF.data[m]?.[code] ?? [];
/** Points publiés d'une série : [mois, valeur], du plus ancien au plus récent (mois masqués écartés). */
export const pointsOf = (m: Metric, code = 'ALL'): Array<[string, number]> => full(m, code).map((v, i) => [MONTHS[i], v] as [string, number | null]).filter((x): x is [string, number] => x[1] != null);
/** Douze mois finissant `back` mois avant le dernier mois publié. */
export const fullYoY = (m: Metric, code = 'ALL', back = 0) => yearOverYear(full(m, code), MONTHS.length - 1 - back);
export const fullExtremes = (m: Metric, code = 'ALL') => extremes(full(m, code), MONTHS);
/** Somme d'une année civile (null si l'année n'est pas publiée). */
export function fullYear(m: Metric, code: string, y: string): number | null {
  let s = 0, seen = 0; MONTHS.forEach((mo, i) => { const v = full(m, code)[i]; if (mo.startsWith(y) && v != null) { s += v; seen++; } });
  return seen ? s : null;
}
/** Mois publiés d'une année (pour dire « janvier à août 2026 »). */
export const monthsOfYear = (y: string) => MONTHS.filter((m) => m.startsWith(y));
