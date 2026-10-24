/** Moteur, données ouvertes et simulateurs : ce que la page de méthode annonce comme vérifié. */
import zlib from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { addTime, addMonths, addDays, dateOf, daysBetween, estimate, sumWindow, yearOverYear, pct, extremes, bandShare, citizenship } from '../src/lib/engine/times';
import { PROGS, O, PRD, IMPD, STD, EED, CIT_RULE, LAST, AS_OF, ops12, approval12, stdOf, fmtStd, fmtFy, fmtTime, fmtChange, countryName, COUNTRIES, MAJOR, eeBandShare, eeYear, eeBands } from '../src/lib/data';
import { MONTHS, full, fullYear } from '../src/lib/ogl-full';
import { runTool, TOOL_KINDS } from '../src/lib/tool-specs';
import { readXlsx } from '../scripts/ircc/xlsx.mjs';

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
  it('estimation : dépôt + délai saisi, temps écoulé et restant', () => {
    const e = estimate('2026-09-01', { n: 14, u: 'd' }, '2026-09-08');
    expect(e).toMatchObject({ date: '2026-09-15', elapsed: 7, remaining: 7, share: 50, overdue: false });
    expect(estimate('2026-01-10', { n: 2, u: 'm' }, '2026-04-01')).toMatchObject({ date: '2026-03-10', overdue: true });
    expect(daysBetween('2026-01-01', '2026-12-31')).toBe(364);
  });
});

describe('séries mensuelles', () => {
  it('sommes glissantes et écart sur douze mois', () => {
    const v = [...Array(12).fill(10), ...Array(12).fill(12)];
    expect(sumWindow(v, 23)).toBe(144);
    expect(sumWindow(v, 5)).toBeNull();
    expect(yearOverYear(v, 23)).toEqual({ last: 144, prev: 120, change: 20 });
    expect(sumWindow([null, null, 3], 2, 3)).toBe(3);
    expect(sumWindow([null, null], 1, 2)).toBeNull();
  });
  it('parts et extrêmes', () => {
    expect(pct(1, 3)).toBe(33.3);
    expect(pct(1, 0)).toBeNull();
    expect(extremes([3, null, 9, 1], ['a', 'b', 'c', 'd'])).toEqual({ hi: ['c', 9], lo: ['d', 1] });
  });
});

describe('données ouvertes lues', () => {
  it('séries alignées sur leurs mois, sans trou de calendrier', () => {
    const consecutive = (ms: string[]) => ms.every((m, i) => i === 0 || addMonths(`${ms[i - 1]}-01`, 1).slice(0, 7) === m);
    for (const ms of [MONTHS, O.months, PRD.months, IMPD.months, STD.months]) expect(consecutive(ms)).toBe(true);
    for (const v of Object.values(O.data.trFin)) expect(v.length).toBe(O.months.length);
    expect(full('trFin').length).toBe(MONTHS.length);
    expect(MONTHS.at(-1)).toBe(LAST.ops);
    expect(AS_OF > `${LAST.ops}-01`).toBe(true);
  });
  it('volumes plausibles : approuvé ≤ finalisé, pays connus nommés', () => {
    const a = approval12();
    expect(a.ok).toBeGreaterThan(0);
    expect(a.ok!).toBeLessThanOrEqual(a.fin!);
    expect(ops12('trIn').last).toBeGreaterThan(0);
    for (const c of MAJOR) { expect(COUNTRIES).toContain(c); expect(countryName(c, 'en')).not.toBe(c); expect(countryName(c, 'fr')).not.toBe(c); }
    expect(fullYear('cit', 'ALL', MONTHS[0].slice(0, 4))).toBeGreaterThan(0);
  });
  it('normes de service : exercice récent et précédent', () => {
    const s = stdOf('visitor')!;
    expect(s.cur.n).toBeGreaterThan(0);
    expect(s.cur.perf).toBeGreaterThan(0);
    expect(s.cur.perf!).toBeLessThanOrEqual(100);
    expect(s.pfy).not.toBeNull();
    expect(stdOf('child')).toEqual(stdOf('spousal-out-roc'));
    expect(stdOf('aucun-programme')).toBeNull();
    expect(fmtStd({ ...s.cur, n: 2, u: 'm' }, 'fr')).toBe('2 mois');
    expect(fmtFy('2024-2025', 'en')).toBe('2024-25');
  });
});

describe('Entrée express', () => {
  it('parts sous, dans et au-dessus de la tranche du score', () => {
    const order = ['0-300', '301-400', '401-500'];
    expect(bandShare([10, 30, 60], order, 450)).toMatchObject({ band: '401-500', below: 40, inBand: 60, above: 0, total: 100 });
    expect(bandShare([10, 30, 60], order, 900).band).toBeNull();
  });
  it('les tranches publiées couvrent les invitations', () => {
    const y = EED.years.at(-2)!;
    const bands = eeBands(y);
    expect(bands.length).toBe(EED.bandOrder.length);
    expect(bands.reduce((a, x) => a + x, 0)).toBeGreaterThan(0);
    expect(eeYear(y)).toBeGreaterThan(0);
    expect(eeBandShare(y, 'all', 480).band).not.toBeNull();
  });
});

describe('citoyenneté', () => {
  it('demi-journée plafonnée', () => {
    expect(citizenship({ prDays: 900, tempDays: 400 }, CIT_RULE)).toMatchObject({ tempCredit: 200, total: 1100, eligible: true });
    expect(citizenship({ prDays: 700, tempDays: 1000 }, CIT_RULE)).toMatchObject({ tempCredit: 365, total: 1065, missing: 30, eligible: false, tempCapped: true });
    expect(citizenship({ prDays: 2000, tempDays: 0 }, CIT_RULE).pr).toBe(1825);
  });
});

/** Petite archive XLSX construite ici : répertoire central, feuille compressée, chaînes partagées. */
function zip(files: Record<string, string>): Buffer {
  const locals: Buffer[] = [], central: Buffer[] = [];
  let off = 0;
  for (const [name, text] of Object.entries(files)) {
    const data = zlib.deflateRawSync(Buffer.from(text, 'utf8')), nm = Buffer.from(name, 'utf8');
    const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(8, 8); lh.writeUInt32LE(data.length, 18); lh.writeUInt16LE(nm.length, 26);
    const ch = Buffer.alloc(46); ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(8, 10); ch.writeUInt32LE(data.length, 20); ch.writeUInt16LE(nm.length, 28); ch.writeUInt32LE(off, 42);
    locals.push(lh, nm, data); central.push(ch, nm); off += 30 + nm.length + data.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(Object.keys(files).length, 8); end.writeUInt16LE(Object.keys(files).length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...locals, cd, end]);
}

describe('lecture des fichiers XLSX d’IRCC', () => {
  it('chaînes partagées, nombres, cellules vides et entités', () => {
    const buf = zip({
      'xl/sharedStrings.xml': '<sst><si><t>Country</t></si><si><t>Côte d&apos;Ivoire</t></si><si><r><t>--</t></r></si></sst>',
      'xl/worksheets/sheet1.xml': '<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="C1"><v>2023</v></c></row><row r="2"><c r="A2" t="s"><v>1</v></c><c r="B2"><v>1235</v></c><c r="C2" t="s"><v>2</v></c></row></sheetData></worksheet>',
    });
    expect(readXlsx(buf)).toEqual([['Country', null, 2023], ["Côte d'Ivoire", 1235, '--']]);
  });
});

describe('simulateurs', () => {
  it('chaque type de demande rend un résultat lisible, avec ou sans date de dépôt', () => {
    for (const g of PROGS) for (const m of ['none', LAST.ops]) for (const l of ['en', 'fr'] as const) {
      const o = runTool('delai', l, { g: g.id }, { g: g.id, m });
      expect(JSON.stringify(o), `${g.id} ${m} ${l}`).not.toMatch(/undefined|NaN|null|Infinity|\[object/);
    }
  });
  it('mise en forme', () => {
    expect(fmtTime(1, 'd', 'en')).toBe('1 day');
    expect(fmtTime(8, 'w', 'fr')).toBe('8 semaines');
    expect(fmtChange(12.3, 'en')).toMatch(/^\+12\.3/);
  });
  it('tous les simulateurs tournent, dans les deux langues, pour chaque grand pays', () => {
    for (const k of TOOL_KINDS) for (const l of ['en', 'fr'] as const) expect(runTool(k, l).value).toBeTruthy();
    for (const c of MAJOR) for (const l of ['en', 'fr'] as const) expect(JSON.stringify(runTool('pays', l, { c }))).not.toMatch(/undefined|NaN|Infinity|\[object/);
  });
});
