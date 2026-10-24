/**
 * Moteur pur (testé dans tests/engine.test.ts) : arithmétique des dates, sommes glissantes des séries
 * mensuelles des données ouvertes d'IRCC, parts par tranche de score d'Entrée express, règle de présence
 * effective de la citoyenneté. Aucun chiffre ici : les données viennent de src/data/ogl/ (OGL-Canada 2.0).
 */
export type Unit = 'd' | 'w' | 'm';
export interface Time { n: number; u: Unit }
export const DAYS_PER: Record<Unit, number> = { d: 1, w: 7, m: 365.25 / 12 };
export const daysOf = (t: Time): number => t.n * DAYS_PER[t.u];

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
export function addDays(date: string, n: number): string { return iso(new Date(D(date).getTime() + Math.round(n) * 864e5)); }
export function addMonths(date: string, n: number): string {
  const d = D(date); const y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return iso(new Date(Date.UTC(y, m, Math.min(day, last))));
}
export function daysBetween(a: string, b: string): number { return Math.round((D(b).getTime() - D(a).getTime()) / 864e5); }
/** Date de dépôt + délai, dans l'unité saisie : des mois s'ajoutent en mois de calendrier, jamais convertis en jours. */
export function addTime(date: string, t: Time): string {
  if (t.u === 'm') return addMonths(date, t.n);
  return addDays(date, t.n * DAYS_PER[t.u]);
}
/** Date valide (année-mois, jour) ; le jour est ramené au dernier jour du mois. */
export function dateOf(ym: string, day: number): string {
  const [y, m] = ym.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const d = Math.max(1, Math.min(last, Math.round(day) || 1));
  return `${ym}-${String(d).padStart(2, '0')}`;
}
/** Estimation : date de décision = dépôt + délai ; temps écoulé et restant au jour donné. */
export function estimate(applied: string, t: Time, today: string) {
  const date = addTime(applied, t);
  const elapsed = Math.max(0, daysBetween(applied, today));
  const remaining = daysBetween(today, date);
  const share = daysOf(t) > 0 ? Math.min(999, Math.round((elapsed / daysOf(t)) * 100)) : 0;
  return { date, elapsed, remaining, share, overdue: remaining < 0 };
}

/* ---------- séries mensuelles ---------- */
export type Series = Array<number | null>;
/** Somme de `n` mois finissant à l'indice `end` (inclus) ; null si un seul mois manque de données publiées. */
export function sumWindow(v: Series | undefined, end: number, n = 12): number | null {
  if (!v || end - n + 1 < 0) return null;
  let s = 0, seen = 0;
  for (let i = end - n + 1; i <= end; i++) { const x = v[i]; if (x != null) { s += x; seen++; } }
  return seen ? s : null;
}
/** Douze derniers mois, douze mois d'avant, écart en pourcentage. */
export function yearOverYear(v: Series | undefined, end: number) {
  const last = sumWindow(v, end, 12), prev = sumWindow(v, end - 12, 12);
  const change = last != null && prev ? Math.round(((last - prev) / prev) * 1000) / 10 : null;
  return { last, prev, change };
}
/** Part en pour cent, à une décimale ; null sans dénominateur. */
export const pct = (a: number | null, b: number | null): number | null => (a == null || !b ? null : Math.round((a / b) * 1000) / 10);
/** Mois le plus haut et le plus bas d'une série (valeurs publiées seulement). */
export function extremes(v: Series, months: string[]) {
  let hi: [string, number] | null = null, lo: [string, number] | null = null;
  v.forEach((x, i) => { if (x == null) return; if (!hi || x > hi[1]) hi = [months[i], x]; if (!lo || x < lo[1]) lo = [months[i], x]; });
  return { hi: hi as [string, number] | null, lo: lo as [string, number] | null };
}

/* ---------- Entrée express : invitations par tranche de score ---------- */
/** Tranche « 451-500 » qui contient le score, et parts des invitations sous, dans et au-dessus de cette tranche. */
export function bandShare(counts: number[], order: string[], score: number) {
  const idx = order.findIndex((b) => { const [lo, hi] = b.split('-').map(Number); return score >= lo && score <= hi; });
  const total = counts.reduce((a, x) => a + x, 0);
  if (idx < 0 || !total) return { idx, band: null as string | null, total, below: 0, inBand: 0, above: 0 };
  const below = counts.slice(0, idx).reduce((a, x) => a + x, 0), inBand = counts[idx], above = counts.slice(idx + 1).reduce((a, x) => a + x, 0);
  return { idx, band: order[idx], total, below: pct(below, total)!, inBand: pct(inBand, total)!, above: pct(above, total)! };
}

/* ---------- citoyenneté ---------- */
/** Présence effective (Loi sur la citoyenneté, art. 5(1)c)) : 1 095 jours en 5 ans ; chaque jour comme résident
 *  temporaire ou personne protégée avant la résidence permanente compte pour une demi-journée, 365 jours au plus. */
export interface CitIn { prDays: number; tempDays: number }
export interface CitRule { required: number; tempRatio: number; tempCap: number; window: number }
export function citizenship({ prDays, tempDays }: CitIn, r: CitRule) {
  const pr = Math.max(0, Math.min(prDays, r.window));
  const temp = Math.max(0, Math.min(tempDays, r.window - pr));
  const tempCredit = Math.min(r.tempCap, Math.floor(temp * r.tempRatio));
  const total = pr + tempCredit;
  const missing = Math.max(0, r.required - total);
  return { pr, temp, tempCredit, total, missing, eligible: missing === 0, tempCapped: temp * r.tempRatio > r.tempCap };
}
