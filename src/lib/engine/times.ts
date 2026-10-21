/**
 * Moteur des délais (fonctions pures, testées dans tests/engine.test.ts).
 * Un délai publié par IRCC garde son unité (jours, semaines, mois) : on l'ajoute à une date comme IRCC le
 * dit (« 17 mois » = 17 mois de calendrier), jamais en le convertissant d'abord en jours.
 */
export type Unit = 'min' | 'd' | 'w' | 'm' | 'y';
export interface Time { n: number; u: Unit; gt?: boolean }
export type Pub = Time | { x: 'nd' | 'na' } | null | undefined;
export const isTime = (t: Pub): t is Time => !!t && 'u' in t;
export const DAYS_PER: Record<Unit, number> = { min: 1 / 1440, d: 1, w: 7, m: 365.25 / 12, y: 365.25 };
export const daysOf = (t: Pub): number | null => (isTime(t) ? t.n * DAYS_PER[t.u] : null);

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
export function addDays(date: string, n: number): string { return iso(new Date(D(date).getTime() + Math.round(n) * 864e5)); }
export function addMonths(date: string, n: number): string {
  const d = D(date); const y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return iso(new Date(Date.UTC(y, m, Math.min(day, last))));
}
export function daysBetween(a: string, b: string): number { return Math.round((D(b).getTime() - D(a).getTime()) / 864e5); }
/** Date de dépôt + délai publié, dans l'unité d'IRCC. */
export function addTime(date: string, t: Time): string {
  if (t.u === 'm') return addMonths(date, t.n);
  if (t.u === 'y') return addMonths(date, 12 * t.n);
  return addDays(date, t.n * DAYS_PER[t.u]);
}
/** Date valide (année, mois, jour) ; le jour est ramené au dernier jour du mois. */
export function dateOf(ym: string, day: number): string {
  const [y, m] = ym.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const d = Math.max(1, Math.min(last, Math.round(day) || 1));
  return `${ym}-${String(d).padStart(2, '0')}`;
}

export type Dir = 'up' | 'down' | 'flat';
export interface Trend {
  last: number; lastDate: string; n: number;
  prev?: number; prevDate?: string; dir?: Dir; delta?: number;
  /** Valeur la plus ancienne gardée et son écart avec la dernière. */
  first?: number; firstDate?: string; deltaFirst?: number;
  min: number; max: number; minDate: string; maxDate: string;
}
/** Tendance d'une série alignée sur ses relevés : hausse, baisse ou stable (écart de moins de 5 % et de moins
 *  de 2 jours) entre les deux derniers relevés chiffrés. Rien sous deux relevés : pas de tendance inventée. */
export function trendOf(values: Array<number | null>, dates: string[]): Trend | null {
  const pts = values.map((v, i) => [dates[i], v] as const).filter((p): p is readonly [string, number] => p[1] != null);
  if (!pts.length) return null;
  const [lastDate, last] = pts[pts.length - 1];
  let min = pts[0], max = pts[0];
  for (const p of pts) { if (p[1] < min[1]) min = p; if (p[1] > max[1]) max = p; }
  const t: Trend = { last, lastDate, n: pts.length, min: min[1], max: max[1], minDate: min[0], maxDate: max[0] };
  if (pts.length >= 2) {
    const [prevDate, prev] = pts[pts.length - 2];
    const delta = last - prev;
    t.prev = prev; t.prevDate = prevDate; t.delta = delta;
    t.dir = Math.abs(delta) < 2 || Math.abs(delta) < 0.05 * Math.max(prev, 1) ? 'flat' : delta > 0 ? 'up' : 'down';
    t.first = pts[0][1]; t.firstDate = pts[0][0]; t.deltaFirst = last - pts[0][1];
  }
  return t;
}

/** File d'attente publiée par IRCC pour un mois (ou une semaine) de dépôt : temps restant et personnes devant. */
export type Left = number | 'late' | string | null;
export type QueueRow = [string, Left, number | null];
export function queueAt(queue: QueueRow[], key: string): QueueRow | null {
  return queue.find((q) => q[0] === key) ?? null;
}

/** Présence effective pour la citoyenneté (Loi sur la citoyenneté, art. 5(1)c)) : 1 095 jours en 5 ans ; chaque jour
 *  comme résident temporaire ou personne protégée avant la résidence permanente compte pour une demi-journée,
 *  365 jours au plus. Paramètres lus dans params-2026.json. */
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

/** Rondes d'Entrée express : catégorie d'une ronde d'après son intitulé publié. */
export type Cat = 'cec' | 'pnp' | 'french' | 'trades' | 'health' | 'physicians' | 'managers' | 'transport' | 'military' | 'stem' | 'education' | 'agriculture' | 'general' | 'fsw' | 'other';
export const CATS: Cat[] = ['cec', 'pnp', 'french', 'trades', 'health', 'physicians', 'managers', 'transport', 'military', 'stem', 'education', 'agriculture', 'fsw', 'general', 'other'];
export function catOf(name: string): Cat {
  const s = name.toLowerCase();
  if (s.includes('canadian experience class')) return 'cec';
  if (s.includes('provincial nominee')) return 'pnp';
  if (s.includes('french')) return 'french';
  if (s.includes('physician')) return 'physicians';
  if (s.includes('senior manager')) return 'managers';
  if (s.includes('trade')) return 'trades';
  if (s.includes('health')) return 'health';
  if (s.includes('transport')) return 'transport';
  if (s.includes('military')) return 'military';
  if (s.includes('stem')) return 'stem';
  if (s.includes('education')) return 'education';
  if (s.includes('agricultur')) return 'agriculture';
  if (s.includes('federal skilled worker')) return 'fsw';
  if (s === 'general' || s.startsWith('no program specified')) return 'general';
  return 'other';
}
export interface Round { n: number; date: string; name: string; size: number; crs: number | null }
/** Pour un score donné : rondes d'une catégorie depuis une date, combien l'auraient invité, score minimal le plus bas. */
export function eeStats(rounds: Round[], cat: Cat | 'all', score: number, since: string) {
  const list = rounds.filter((r) => r.date >= since && (cat === 'all' || catOf(r.name) === cat));
  const scored = list.filter((r) => r.crs != null);
  const invited = scored.filter((r) => score >= (r.crs as number));
  const lowest = scored.reduce<Round | null>((a, r) => (!a || (r.crs as number) < (a.crs as number) ? r : a), null);
  const total = list.reduce((a, r) => a + r.size, 0);
  return { list, n: list.length, invitedIn: invited.length, lowest, last: list[0] ?? null, total };
}
