/** Moteur des délais, archive et simulateurs : ce que la page de méthode annonce comme vérifié. */
import { describe, expect, it } from 'vitest';
import { addTime, addMonths, addDays, dateOf, trendOf, citizenship, catOf, eeStats, daysOf } from '../src/lib/engine/times';
import { L, PROGS, readingOf, estimate, weekKey, fmtTime, fmtDays, countriesOf, ROUNDS, CIT_RULE } from '../src/lib/data';
import { HIST, points, fileOf } from '../src/lib/hist';
import { runTool, TOOL_KINDS } from '../src/lib/tool-specs';
import { readCountry, readNonCountry, readFlpt, parseTime, leftOf, countOf } from '../scripts/ircc/lib.mjs';

describe('dates', () => {
  it('ajoute des mois de calendrier, ramenés au dernier jour du mois', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(addMonths('2026-10-21', 17)).toBe('2028-03-21');
  });
  it('ajoute un délai dans son unité', () => {
    expect(addTime('2026-10-21', { n: 29, u: 'd' })).toBe('2026-11-19');
    expect(addTime('2026-10-21', { n: 8, u: 'w' })).toBe('2026-12-16');
    expect(addTime('2026-10-21', { n: 6, u: 'm' })).toBe('2027-04-21');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
  it('construit une date valide', () => { expect(dateOf('2026-02', 31)).toBe('2026-02-28'); expect(dateOf('2026-03', 0)).toBe('2026-03-01'); });
  it('semaine du mois au sens d’IRCC', () => { expect(weekKey('2026-10-01')).toBe('2026-10-01'); expect(weekKey('2026-10-08')).toBe('2026-10-02'); expect(weekKey('2026-10-31')).toBe('2026-10-05'); });
});

describe('lecture des fichiers IRCC', () => {
  it('unités et cas sans chiffre', () => {
    expect(parseTime('29 days')).toEqual({ n: 29, u: 'd' });
    expect(parseTime('About 6 months')).toEqual({ n: 6, u: 'm' });
    expect(parseTime('More than 10 years')).toMatchObject({ n: 10, u: 'y', gt: true });
    expect(parseTime('No processing time available')).toEqual({ x: 'na' });
    expect(parseTime('Not enough data')).toEqual({ x: 'nd' });
  });
  it('files d’attente', () => {
    expect(leftOf('6 months left')).toBe(6);
    expect(leftOf('About 1 month left')).toBe(1);
    expect(leftOf('We need more time to process your application')).toBe('late');
    expect(countOf('About 53,900 people ahead of you')).toBe(53900);
    expect(countOf('Less than 100 people ahead of you')).toBe(-100);
  });
  it('fichiers factices', () => {
    const c = readCountry({ study: { IN: '8 weeks', lastupdated: 'October 21, 2026' } });
    expect(c).toEqual({ date: '2026-10-21', data: { study: { IN: { n: 8, u: 'w' } } } });
    const n = readNonCountry({ 'default-update': { lastupdated: 'October 21, 2026' }, eta: { eta: '5 minutes' } });
    expect(n.data.eta).toEqual({ n: 5, u: 'min' });
    const f = readFlpt({ 'default-update': { flpt_lastupdated: 'October 9, 2026' }, 'current-flpt': { cec: 'About 6 months' }, 'total-people': { cec: 'About 53,900 people waiting' }, 'wait-times': { 'cec-2026/09': '6 months left', 'cec-2024/01': 'We need more time to process your application' }, 'people-ahead': { 'cec-2026/09': 'About 1,000 people ahead of you' } });
    expect(f.date).toBe('2026-10-09');
    expect(f.data.cec.queue).toEqual([['2024-01', 'late', null], ['2026-09', 6, 1000]]);
  });
});

describe('archive', () => {
  it('chaque série est alignée sur les relevés de son fichier', () => {
    for (const [k, v] of Object.entries(HIST.s)) expect(v.length, k).toBe(HIST.readings[fileOf(k)].length);
  });
  it('relevés datés, triés, sans doublon, provenance citée', () => {
    for (const R of Object.values(HIST.readings)) {
      const d = R.map((r) => r.ircc);
      expect([...d].sort()).toEqual(d);
      expect(new Set(d).size).toBe(d.length);
      for (const r of R) expect(r.via).toMatch(/^(direct \d{4}-\d{2}-\d{2}|web\.archive\.org\/web\/\d{14})$/);
    }
  });
  it('le dernier relevé est celui de latest.json', () => {
    for (const f of ['country', 'noncountry', 'flpt', 'tr'] as const) expect(HIST.readings[f].at(-1)!.ircc).toBe(L.dates[f]);
  });
  it('les points cités pointent vers une copie', () => { for (const p of points('c:study:IN')) expect(p.url).toMatch(/^https:\/\//); });
});

describe('tendance', () => {
  it('stable sous 5 % et 2 jours, hausse sinon', () => {
    expect(trendOf([30, 31], ['a', 'b'])!.dir).toBe('flat');
    expect(trendOf([30, 40], ['a', 'b'])!.dir).toBe('up');
    expect(trendOf([null, 40, null, 30], ['a', 'b', 'c', 'd'])).toMatchObject({ prev: 40, last: 30, dir: 'down', prevDate: 'b' });
    expect(trendOf([5], ['a'])!.dir).toBeUndefined();
  });
});

describe('citoyenneté', () => {
  it('demi-journée plafonnée', () => {
    expect(citizenship({ prDays: 900, tempDays: 400 }, CIT_RULE)).toMatchObject({ tempCredit: 200, total: 1100, eligible: true });
    expect(citizenship({ prDays: 700, tempDays: 1000 }, CIT_RULE)).toMatchObject({ tempCredit: 365, total: 1065, missing: 30, eligible: false, tempCapped: true });
    expect(citizenship({ prDays: 2000, tempDays: 0 }, CIT_RULE).pr).toBe(1825);
  });
});

describe('Entrée express', () => {
  it('catégories', () => {
    expect(catOf('Canadian Experience Class')).toBe('cec');
    expect(catOf('French-Language proficiency 2026-Version 2')).toBe('french');
    expect(catOf('Physicians with Canadian Work Experience, 2026-Version 1')).toBe('physicians');
    expect(catOf('Provincial Nominee Program')).toBe('pnp');
  });
  it('statistiques sur un score', () => {
    const r = [{ n: 2, date: '2026-10-15', name: 'Canadian Experience Class', size: 2500, crs: 519 }, { n: 1, date: '2026-10-01', name: 'Canadian Experience Class', size: 2000, crs: 500 }];
    expect(eeStats(r, 'cec', 510, '2026-01-01')).toMatchObject({ n: 2, invitedIn: 1, total: 4500 });
    expect(ROUNDS.length).toBeGreaterThan(50);
  });
});

describe('simulateurs', () => {
  it('chaque programme rend un résultat lisible, avec ou sans date de dépôt', () => {
    for (const g of PROGS) for (const m of ['none', '2026-03']) for (const l of ['en', 'fr'] as const) {
      const c = countriesOf(g.id)[0] ?? '-';
      const o = runTool('delai', l, { g: g.id, c }, { m });
      expect(JSON.stringify(o), `${g.id} ${m} ${l}`).not.toMatch(/undefined|NaN|null|Infinity|\[object/);
    }
  });
  it('estimation : dépôt + délai publié', () => {
    const r = readingOf('visitor', 'IN');
    const e = estimate('visitor', 'IN', '2026-09-15');
    expect(e.date).toBe(addTime('2026-09-15', r.t as { n: number; u: 'd' }));
    expect(daysOf(r.t)).toBeGreaterThan(0);
  });
  it('mise en forme', () => {
    expect(fmtTime({ n: 1, u: 'd' }, 'en')).toBe('1 day');
    expect(fmtTime({ n: 10, u: 'y', gt: true }, 'fr')).toBe('plus de 10 ans');
    expect(fmtDays(183, 'm', 'en')).toBe('6 months');
    expect(fmtDays(56, 'w', 'fr')).toBe('8 semaines');
  });
  it('tous les simulateurs tournent', () => { for (const k of TOOL_KINDS) for (const l of ['en', 'fr'] as const) expect(runTool(k, l).value).toBeTruthy(); });
});
