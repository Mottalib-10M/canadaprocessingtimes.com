/**
 * Historique complet (rendu au build, jamais chargé dans le navigateur) : src/data/ircc/history.json.
 * Chaque relevé porte sa provenance : lecture directe datée, ou capture de la Wayback Machine citée par son horodatage.
 */
import H from '../data/ircc/history.json';
import { trendOf, type Trend } from './engine/times';
import type { Src } from './data';
import { FILES_URL } from './files';

type Reading = { ircc: string; via: string };
export const HIST = H as unknown as { readings: Record<Src, Reading[]>; s: Record<string, Array<number | null>> };
export const fileOf = (k: string): Src => (k.startsWith('c:') ? 'country' : k.startsWith('n:') ? 'noncountry' : k.startsWith('t:') || k === 'w:SP-EXT' || k === 'w:WP-EXT' ? 'tr' : 'flpt');
export interface Point { date: string; v: number; via: string; url: string }
/** Points chiffrés d'une série, du plus ancien au plus récent, avec l'adresse de la copie citée. */
export function points(series: string): Point[] {
  const f = fileOf(series), R = HIST.readings[f], v = HIST.s[series] ?? [];
  return R.map((r, i) => ({ date: r.ircc, v: v[i] as number, via: r.via, url: r.via.startsWith('web.archive.org') ? `https://${r.via}/${FILES_URL[f]}` : FILES_URL[f] }))
    .filter((p) => p.v != null);
}
export const fullTrend = (series: string): Trend | null => { const p = points(series); return p.length ? trendOf(p.map((x) => x.v), p.map((x) => x.date)) : null; };
/** Valeur la plus proche d'une date (au plus 45 jours d'écart), pour « il y a un an ». */
export function valueNear(series: string, iso: string): Point | null {
  let best: Point | null = null, gap = Infinity;
  for (const p of points(series)) { const g = Math.abs(Date.parse(p.date) - Date.parse(iso)) / 864e5; if (g < gap) { gap = g; best = p; } }
  return gap <= 45 ? best : null;
}
export const readingsCount = (f: Src) => HIST.readings[f].length;
export const firstReading = (f: Src) => HIST.readings[f][0]?.ircc;
export const archivedCount = (f: Src) => HIST.readings[f].filter((r) => r.via.startsWith('web.archive.org')).length;
