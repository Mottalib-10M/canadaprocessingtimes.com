/**
 * Outils communs des pages de pays en anglais (Inde, Philippines, Nigeria, Chine, Pakistan, Iran, Vietnam,
 * Mexique, Brésil). Fichier préfixé « _ » : hors du registre des pages. Aucun texte partagé : seulement des calculs,
 * pour que chaque page garde son plan et ses phrases. Tous les chiffres viennent de la trousse (données ouvertes d'IRCC).
 */
import { KIT as K } from '../../lib/kit';
import type { Metric } from '../../lib/data';

/** « 1st », « 2nd », « 23rd ». */
export const ord = (n: number | null) => {
  if (n == null) return 'unranked';
  const o = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
  return `${n}${o}`;
};
/** « up » / « down » / « flat » selon un écart en pour cent. */
export const dir = (x: number | null | undefined, up = 'up', down = 'down', flat = 'about flat') => (x == null || Math.abs(x) < 0.5 ? flat : x > 0 ? up : down);
/** Rang d'un pays (1 = le plus de demandes) sur douze mois. */
export const rank = (m: Metric, c: string) => K.rank12(m, c).rank;
/** Total d'une année civile pour un pays (permis d'études entrés en vigueur). */
export const studyYear = (c: string, y: string) => K.yearSum(K.studySeries(c), K.STD.months, y);
/** Les mois publiés d'une année dans les séries Operational Processing (pour dire « January to August 2026 »). */
export const partial = (y: string) => K.monthsOfYear(y);
/** Différence en points de pourcentage entre deux parts. */
export const pts = (a: number | null, b: number | null) => (a == null || b == null ? null : Math.round((a - b) * 10) / 10);
