/**
 * Relevé mensuel des données ouvertes d'IRCC (workflow .github/workflows/update-data.yml).
 *
 * Seules sources lues : les jeux de données qu'IRCC publie sur le Portail du gouvernement ouvert
 * (open.canada.ca), sous la Licence du gouvernement ouvert – Canada (OGL-Canada 2.0), qui autorise la
 * réutilisation commerciale avec attribution. Les fichiers sont servis par www.ircc.canada.ca/opendata-donneesouvertes/.
 * Aucune page ni aucun fichier de canada.ca n'est relu : le contenu de canada.ca relève des « Avis » du
 * gouvernement du Canada (reproduction non commerciale seulement).
 *
 *   Operational Processing – Monthly IRCC Updates (9b34e712-513f-44e9-babf-9df4f7256550) : 8 fichiers XLSX par pays
 *   Permanent Residents – Monthly IRCC Updates (f7e5498e-0ad8-4417-85c9-9b8aff9b9eda) : admissions par catégorie
 *   Express Entry-Invited Candidates – Monthly IRCC Updates (593e9165-c6ce-4f9b-b519-03d315f92cd4) : invitations
 *   TFWP and IMP Work Permit Holders – Monthly IRCC Updates (360024f2-17e9-4558-bfc1-3616485d65b9) : permis du PMI
 *   Temporary Residents: Study Permit Holders – Monthly IRCC Updates (90115b00-f9b8-49e8-afa3-b4cff8facaee)
 *   GC Service Inventory (Secrétariat du Conseil du Trésor, 3ac0d080-6149-499a-8b06-7ce5f00ec56c) : normes de service
 *     d'IRCC et part des demandes traitées dans la norme, par exercice (service-std.csv, open.canada.ca)
 *
 * Écrit src/data/ogl/*.json. Si un fichier ne se lit pas, l'ancien JSON est gardé tel quel.
 * Usage : node scripts/ircc/update-data.mjs [dossier-local-des-fichiers]
 */
import fs from 'node:fs';
import path from 'node:path';
import { readXlsx } from './xlsx.mjs';

const BASE = 'https://www.ircc.canada.ca/opendata-donneesouvertes/data/';
const LOCAL = process.argv[2] ?? null;
const OUT = new URL('../../src/data/ogl/', import.meta.url);
fs.mkdirSync(OUT, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const FROM = '2023-01';

const STD_URL = 'https://open.canada.ca/data/dataset/3ac0d080-6149-499a-8b06-7ce5f00ec56c/resource/8736cd7e-9bf9-4a45-9eee-a6cb3c43c07e/download/service-std.csv';
async function get(file) {
  if (LOCAL) { const p = path.join(LOCAL, file.replace(/ /g, '_')); if (fs.existsSync(p)) return fs.readFileSync(p); }
  let last;
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(/^https:/.test(file) ? file : BASE + encodeURI(file), { signal: AbortSignal.timeout(120000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; ogl-reader/1.0)' } });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
      last = new Error(`${r.status} ${file}`);
    } catch (e) { last = e; }
    await new Promise((res) => setTimeout(res, 3000 * (i + 1)));
  }
  throw last;
}
const text = (buf) => { try { return new TextDecoder('utf-8', { fatal: true }).decode(buf).replace(/^﻿/, ''); } catch { return new TextDecoder('latin1').decode(buf); } };
function tsv(buf) {
  const lines = text(buf).split(/\r?\n/).filter(Boolean);
  const head = lines[0].split('\t').map((h) => h.trim());
  return lines.slice(1).map((l) => { const c = l.split('\t'); return Object.fromEntries(head.map((h, i) => [h, (c[i] ?? '').trim()])); });
}
/** CSV à virgules et guillemets (RFC 4180). */
function csvRows(buf) {
  const t = text(buf), out = []; let row = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; } else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); out.push(row); row = []; cell = ''; } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); out.push(row); }
  const head = out.shift() ?? [];
  return out.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}
/** « 1 234 », « 1,234 » → 1234 ; « -- » (valeur de 1 à 4 masquée) → null. */
const num = (v) => { if (v == null) return null; if (typeof v === 'number') return v; const s = String(v).replace(/[\s, ]/g, ''); return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null; };
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const ym = (y, m) => `${y}-${String(m).padStart(2, '0')}`;

/* ---------- noms de pays → codes ISO ---------- */
const DN_EN = new Intl.DisplayNames(['en-CA'], { type: 'region' }), DN_FR = new Intl.DisplayNames(['fr-CA'], { type: 'region' });
const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
const REV = new Map();
for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
  const c = String.fromCharCode(a, b);
  try { const n = DN_EN.of(c); if (n && n !== c && !REV.has(fold(n))) REV.set(fold(n), c); } catch { /* code inconnu */ }
}
const ALIAS = {
  chinapeoplesrepublicof: 'CN', china: 'CN', korearepublicof: 'KR', southkorea: 'KR', koreapeoplesdemocraticrepublicof: 'KP', northkorea: 'KP',
  iran: 'IR', iranislamicrepublicof: 'IR', yemenrepublicof: 'YE', vietnam: 'VN', vietnamsocialistrepublicof: 'VN', socialistrepublicofvietnam: 'VN',
  congodemocraticrepublicofthe: 'CD', democraticrepublicofcongo: 'CD', congorepublicofthe: 'CG', peoplesrepublicofcongo: 'CG', republicofcongo: 'CG',
  russia: 'RU', russianfederation: 'RU', syria: 'SY', syrianarabrepublic: 'SY', tanzania: 'TZ', tanzaniaunitedrepublicof: 'TZ', bolivia: 'BO',
  venezuela: 'VE', moldova: 'MD', laos: 'LA', laopeoplesdemocraticrepublic: 'LA', burma: 'MM', burmamyanmar: 'MM', myanmar: 'MM', taiwan: 'TW',
  hongkong: 'HK', hongkongsar: 'HK', macao: 'MO', macaosar: 'MO', macau: 'MO', ivorycoast: 'CI', cotedivoire: 'CI', kosovo: 'XK',
  palestinianauthoritygazawestbank: 'PS', palestinianauthority: 'PS', palestine: 'PS', gazawestbank: 'PS', westbankgaza: 'PS',
  usa: 'US', unitedstatesofamerica: 'US', unitedstates: 'US', unitedkingdom: 'GB', unitedkingdomandcolonies: 'GB', greatbritain: 'GB',
  turkey: 'TR', turkiye: 'TR', czechrepublic: 'CZ', czechia: 'CZ', swaziland: 'SZ', eswatini: 'SZ', capeverde: 'CV', caboverde: 'CV',
  gambia: 'GM', gambiathe: 'GM', bahamas: 'BS', bahamasthe: 'BS', macedonia: 'MK', northmacedonia: 'MK', republicofnorthmacedonia: 'MK',
  vaticancitystate: 'VA', holysee: 'VA', micronesia: 'FM', micronesiafederatedstatesof: 'FM', stkittsnevis: 'KN', saintkittsandnevis: 'KN',
  stlucia: 'LC', saintlucia: 'LC', stvincentandthegrenadines: 'VC', saintvincentandthegrenadines: 'VC', sttomeandprincipe: 'ST', saotomeandprincipe: 'ST',
  bosniaherzegovina: 'BA', bosniaandherzegovina: 'BA', trinidadtobago: 'TT', antiguabarbuda: 'AG', brunei: 'BN', bruneidarussalam: 'BN',
  timorleste: 'TL', congopeoplesrepublicofthe: 'CG', bosniahercegovina: 'BA', solomons: 'SB', surinam: 'SR', virginislandsbritish: 'VG',
  samoa: 'WS', slovakrepublic: 'SK', northernmarianaislands: 'MP', unitedkingdomandoverseasterritories: 'GB', unitedstatesminoroutlyingislands: 'UM',
  bahamaislands: 'BS', bahamaislandsthe: 'BS', capeverdeislands: 'CV', macausar: 'MO', easttimordemocraticrepublicof: 'TL', easttimor: 'TL', sudansouth: 'SS', southsudan: 'SS', serbiaandmontenegro: 'RS', unitedarabemirates: 'AE', curacao: 'CW',
};
const EXTRA = { XK: { en: 'Kosovo', fr: 'Kosovo' }, PS: { en: 'Palestinian Authority (Gaza and West Bank)', fr: 'Autorité palestinienne (Gaza et Cisjordanie)' } };
const unknown = new Set();
function codeOf(name) {
  const k = fold(String(name).replace(/\*/g, ''));
  if (!k) return null;
  if (ALIAS[k]) return ALIAS[k];
  if (REV.has(k)) return REV.get(k);
  // « Benin, Republic of », « Republic of Ireland », « Netherlands, The », « Gabon Republic » : on retire la forme
  // officielle et l'on cherche à nouveau (les cas ambigus, comme les deux Congo, sont dans ALIAS).
  const short = fold(String(name).replace(/\*/g, '').replace(/,?\s*\b(the\s+)?(independent state|democratic republic|people'?s republic|peoples republic|federal republic|united republic|republic|commonwealth)\s+of(\s+the)?\b/gi, ' ').replace(/^\s*the\s+|,\s*the\s*$/gi, '').replace(/\s+(republic|islands)\s*$/i, '').replace(/\s+sar$/i, ''));
  if (ALIAS[short]) return ALIAS[short];
  if (REV.has(short)) return REV.get(short);
  unknown.add(String(name).trim());
  return `X-${k}`;
}
const NAMES = {};
function nameOf(code, en, fr) {
  if (NAMES[code]) return;
  // Codes ISO : noms standard (Intl), identiques d'un fichier à l'autre ; autres entités : le nom publié par IRCC.
  if (EXTRA[code]) { NAMES[code] = { ...EXTRA[code] }; return; }
  if (!code.startsWith('X-')) {
    let fen = en?.trim(), ffr = fr?.trim();
    try { fen = DN_EN.of(code) ?? fen; } catch { /* garde le nom IRCC */ }
    try { ffr = DN_FR.of(code) ?? ffr; } catch { /* idem */ }
    NAMES[code] = { en: fen, fr: ffr ?? fen }; return;
  }
  NAMES[code] = { en: en.trim(), fr: (fr ?? en).trim() };
}
const SKIP = /^(total|other\*?|others?|not stated|unknown|stateless|country of citizenship not stated)/i;

/* ---------- Operational Processing : 8 fichiers XLSX, une ligne par pays, une colonne par mois ---------- */
const OPS = {
  trIn: 'Open Data - OPS TRV Intake en.xlsx',
  trFin: 'Open Data - OPS TR Processed en.xlsx',
  trOk: 'Open Data - OPS TR Approved en.xlsx',
  spFin: 'Open Data - OPS SP Processed en.xlsx',
  v1: 'Open Data - OPS TRV V-1 Approved en.xlsx',
  prIn: 'Open Data - OPS PR Intake en.xlsx',
  copr: 'Open Data - OPS COPR Issued en.xlsx',
  cit: 'Open Data - New Citizens by COB en.xlsx',
};
function opsTable(rows) {
  // Colonnes : soit une ligne d'années (2023, 2024…) puis une ligne de mois (« January », « Total »), soit des
  // en-têtes « 2023 / 01 ». Chaque colonne reçoit son mois ; les colonnes « Total » sont écartées.
  let col = null, start = 0, asOf = null;
  for (let i = 0; i < rows.length && !col; i++) {
    const r = rows[i];
    if (r.some((c) => typeof c === 'string' && /^\d{4} \/ \d{2}$/.test(c.trim()))) {
      col = r.map((c) => { const m = typeof c === 'string' && c.trim().match(/^(\d{4}) \/ (\d{2})$/); return m ? `${m[1]}-${m[2]}` : null; });
      start = i + 1;
    } else if (r.filter((c) => typeof c === 'number' && c > 2000 && c < 2100).length >= 2) {
      const months = rows[i + 1] ?? [];
      let y = null; col = [];
      for (let j = 0; j < Math.max(r.length, months.length); j++) {
        if (typeof r[j] === 'number') y = r[j];
        const mm = String(months[j] ?? '').trim().slice(0, 3).toLowerCase();
        col[j] = y && MON[mm] ? ym(y, MON[mm]) : null;
      }
      start = i + 2;
    }
  }
  if (!col) throw new Error('en-têtes de mois introuvables');
  for (const r of rows) for (const c of r) if (typeof c === 'string') {
    const m = c.match(/as of ([A-Za-z]+) (\d{1,2}), (\d{4})/); if (m && MON[m[1].slice(0, 3).toLowerCase()]) asOf = `${m[3]}-${String(MON[m[1].slice(0, 3).toLowerCase()]).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
  }
  const months = [...new Set(col.filter(Boolean))].sort();
  const data = {};
  for (const r of rows.slice(start)) {
    const name = typeof r[0] === 'string' ? r[0].trim() : null;
    if (!name || name.length > 60) continue;
    const vals = Object.fromEntries(months.map((m) => [m, null]));
    let any = false;
    r.forEach((c, j) => { if (col[j]) { vals[col[j]] = num(c); if (c != null) any = true; } });
    if (!any) continue;
    const code = /^total$/i.test(name) ? 'ALL' : SKIP.test(name) ? null : codeOf(name);
    if (!code) continue;
    if (code !== 'ALL') nameOf(code, name);
    data[code] = months.map((m) => vals[m]);
  }
  return { months, data, asOf };
}

/* ---------- CSV (format long, bilingue) ---------- */
const sumInto = (o, k, v) => { o[k] = (o[k] ?? 0) + (v ?? 0); };

function prCategories(rows) {
  const KEYS = {
    'Canadian Experience': 'cec', 'Skilled Worker': 'fsw', 'Skilled Trade': 'fst', 'Provincial Nominee Program': 'pnp', 'Atlantic Immigration Programs': 'aip',
    Caregiver: 'caregiver', 'Rural and Northern Immigration': 'rnip', 'Agri-Food Pilot': 'agri', 'Start-up Business': 'startup', 'Self-Employed': 'selfemp',
    'Temporary Resident to Permanent Resident Pathway': 'tr2pr', 'Sponsored Spouse or Partner': 'spouse', 'Sponsored Parent or Grandparent': 'pgp',
    'Sponsored Children': 'child', 'Government-Assisted Refugee': 'gar', 'Privately Sponsored Refugee': 'psr', 'Blended Sponsorship Refugee': 'bvor',
    'Protected Person': 'protected', 'Dependant of protected person': 'protectedDep', 'Humanitarian & Compassionate': 'hc',
  };
  const QC = { 'Skilled Worker': 'qsw' };
  const v = {}, names = {};
  for (const r of rows) {
    const y = r.EN_YEAR, m = MON[(r.EN_MONTH ?? '').slice(0, 3).toLowerCase()];
    if (!m || ym(y, m) < FROM) continue;
    const comp = r['EN_IMMIGRATION_CATEGORY-COMPONENT'];
    const t = num(r.TOTAL) ?? 0;
    const key = KEYS[comp];
    const k = ym(y, m);
    sumInto(v.all ??= {}, k, t);
    if (key) {
      names[key] ??= { en: comp, fr: r["FR_CATÉGORIE_D'IMMIGRATION-COMPOSANTE"] || comp };
      sumInto(v[key] ??= {}, k, t);
      // Les travailleurs qualifiés admis au Québec sont sélectionnés par le Québec (programme distinct).
      if (QC[comp] && /quebec|québec/i.test(r.EN_PROVINCE_TERRITORY)) { names.qsw ??= { en: 'Quebec skilled worker', fr: 'Travailleur qualifié du Québec' }; sumInto(v.qsw ??= {}, k, t); }
    }
  }
  const months = Object.keys(v.all).sort();
  return { months, names, v: Object.fromEntries(Object.entries(v).map(([k, o]) => [k, months.map((m) => o[m] ?? 0)])) };
}
function eeInvitations(rowsScore, rowsCitz) {
  const P = { 'Canadian Experience Class': 'cec', 'Federal Skilled Worker': 'fsw', 'Federal Skilled Trades': 'fst', 'Provincial Nominee Program': 'pnp' };
  const byYear = {}, bands = {}, citz = {}, bandSet = new Set();
  for (const r of rowsScore) {
    const p = P[r.EN_INVITATION_CATEGORY] ?? 'other', y = r.EN_YEAR, t = num(r.TOTAL) ?? 0;
    const b = (r.EN_ITA_SCORE.match(/(\d+)\s*-\s*(\d+)/) ?? []).slice(1).map(Number);
    if (b.length !== 2) continue;
    const bk = `${b[0]}-${b[1]}`; bandSet.add(bk);
    sumInto(byYear[y] ??= {}, p, t); sumInto(byYear[y], 'all', t);
    sumInto((bands[y] ??= {})[p] ??= {}, bk, t); sumInto(bands[y].all ??= {}, bk, t);
  }
  for (const r of rowsCitz) {
    const y = r.EN_YEAR, t = num(r.TOTAL) ?? 0, name = r.EN_COUNTRY_OF_CITIZENSHIP;
    if (!name || SKIP.test(name)) continue;
    const code = codeOf(name); nameOf(code, name, r['FR_PAYS_DE_CITOYENNETÉ']);
    sumInto(citz[y] ??= {}, code, t);
  }
  const order = [...bandSet].sort((a, b) => Number(a.split('-')[0]) - Number(b.split('-')[0]));
  return { years: Object.keys(byYear).sort(), byYear, bands: Object.fromEntries(Object.entries(bands).map(([y, o]) => [y, Object.fromEntries(Object.entries(o).map(([p, x]) => [p, order.map((k) => x[k] ?? 0)]))])), bandOrder: order, citz };
}
function impPrograms(rows) {
  const K = { 'Post-grad employment': 'pgwp', 'International Experience Canada (IEC)': 'iec', 'Spouses of skilled workers': 'spouseWorker', 'Spouses of students': 'spouseStudent', 'Intra-company transfers': 'ict' };
  const v = {}, names = {};
  for (const r of rows) {
    const m = MON[(r.EN_MONTH ?? '').slice(0, 3).toLowerCase()];
    if (!m || ym(r.EN_YEAR, m) < FROM) continue;
    const k = ym(r.EN_YEAR, m), t = num(r.TOTAL) ?? 0;
    sumInto(v.all ??= {}, k, t);
    const l4 = r.EN_PROGRAM_LEVEL_4?.replace(/ /g, ' ').trim();
    const key = K[l4] ?? (/^Bridging open work permits/i.test(l4 ?? '') ? 'bowp' : null);
    if (key) { names[key] ??= { en: l4, fr: r.FR_NIVEAU_DE_PROGRAMME_4 || l4 }; sumInto(v[key] ??= {}, k, t); }
  }
  const months = Object.keys(v.all).sort();
  return { months, names, v: Object.fromEntries(Object.entries(v).map(([k, o]) => [k, months.map((mm) => o[mm] ?? 0)])) };
}
function studyHolders(rows) {
  const nat = {}, byC = {};
  for (const r of rows) {
    const m = MON[(r.EN_MONTH ?? '').slice(0, 3).toLowerCase()];
    if (!m || ym(r.EN_YEAR, m) < FROM) continue;
    const k = ym(r.EN_YEAR, m), t = num(r.TOTAL), name = r.EN_COUNTRY_OF_CITIZENSHIP;
    sumInto(nat, k, t ?? 0);
    if (!name || SKIP.test(name)) continue;
    const code = codeOf(name); nameOf(code, name, r['FR_PAYS_DE_CITOYENNETÉ']);
    sumInto(byC[code] ??= {}, k, t ?? 0);
  }
  const months = Object.keys(nat).sort();
  return { months, all: months.map((m) => nat[m]), byC: Object.fromEntries(Object.entries(byC).map(([c, o]) => [c, months.map((m) => o[m] ?? 0)])) };
}

/** Normes de service d'IRCC (Inventaire des services du GC) : délai visé, cible, part des demandes traitées dans la
 *  norme, par exercice. Une ligne par type de demande du site ; les doublons (même norme par canal) comptent une fois. */
function serviceStandards(rows) {
  const MAP = [
    ['eta', /electronic travel authorizations within 5 minutes/i], ['visitor', /new visitor visa within/i], ['super-visa', /Super Visa/i],
    ['study', /outside Canada for a new study permit/i], ['study-inside', /study permit submitted in Canada/i],
    ['work', /outside Canada for a work permit/i], ['work-inside', /in Canada for a work permit/i],
    ['cec', /Canadian Experience Class/i], ['fsw', /Federal Skilled Worker/i], ['pnp-ee', /Express Entry, under the Provincial Nominee/i],
    ['pnp-base', /paper applications under the Provincial Nominee/i], ['qsw', /Quebec-selected/i], ['family-overseas', /Family Class \(Overseas/i],
    ['citizenship', /routine Citizenship Grants/i],
  ];
  const out = {};
  for (const r of rows) {
    if (r.owner_org !== 'cic') continue;
    const hit = MAP.find(([, re]) => re.test(r.service_standard_en)); if (!hit) continue;
    const key = hit[0], fy = r.fiscal_yr, total = num(r.total_volume), met = num(r.volume_meeting_target);
    const m = r.service_standard_en.match(/within (\d+|two|four|five) (minutes?|days?|months?)/i);
    const words = { two: 2, four: 4, five: 5 };
    const n = m ? (words[m[1].toLowerCase()] ?? Number(m[1])) : null;
    const u = m ? { minute: 'min', day: 'd', month: 'm' }[m[2].toLowerCase().replace(/s$/, '')] : null;
    const cur = (out[key] ??= {})[fy];
    if (cur && (cur.total ?? 0) >= (total ?? 0)) continue;
    out[key][fy] = { en: r.service_standard_en, fr: r.service_standard_fr, n, u, target: num(r.target), met, total, perf: total ? Math.round((met / total) * 1000) / 10 : null };
  }
  const years = [...new Set(Object.values(out).flatMap((o) => Object.keys(o)))].sort();
  return { years, std: out };
}

/* ---------- relevé ---------- */
const write = (f, o) => fs.writeFileSync(new URL(f, OUT), `${JSON.stringify(o)}\n`);
const report = [];
async function step(label, fn) {
  try { await fn(); report.push(`ok   ${label}`); } catch (e) { report.push(`ÉCHEC ${label} : ${e.message} (ancien fichier gardé)`); }
}

// Noms français : le fichier « TR Processed » français suit l'ordre alphabétique français ; on apparie ses lignes
// à la version anglaise par leur suite de valeurs, identique dans les deux langues.
let frByValues = new Map();
await step('noms français (OPS TR Processed fr)', async () => {
  const rows = readXlsx(await get('Open Data - OPS TR Processed fr.xlsx'));
  for (const r of rows) if (typeof r[0] === 'string' && r.slice(1).some((c) => typeof c === 'number')) frByValues.set(JSON.stringify(r.slice(1, 60)), r[0].trim());
});

const ops = { read: today, asOf: null, months: null, data: {} };
await step('Operational Processing (8 fichiers)', async () => {
  for (const [k, f] of Object.entries(OPS)) {
    const rows = readXlsx(await get(f));
    if (k === 'trFin') for (const r of rows) if (typeof r[0] === 'string') { const fr = frByValues.get(JSON.stringify(r.slice(1, 60))); if (fr) { const c = SKIP.test(r[0]) ? null : codeOf(r[0].trim()); if (c) nameOf(c, r[0], fr); } }
    const t = opsTable(rows);
    if (!ops.months || t.months.length > ops.months.length) ops.months = t.months;
    ops.asOf = t.asOf ?? ops.asOf;
    ops.data[k] = { months: t.months, v: t.data };
  }
  // Toutes les séries sur la même grille de mois.
  for (const k of Object.keys(ops.data)) {
    const { months, v } = ops.data[k];
    ops.data[k] = Object.fromEntries(Object.entries(v).map(([c, arr]) => [c, ops.months.map((m) => { const i = months.indexOf(m); return i < 0 ? null : arr[i]; })]));
  }
  write('ops.json', ops);
  // Extrait léger pour les simulateurs (navigateur) : les 24 derniers mois seulement.
  const cut = Math.max(0, ops.months.length - 24);
  write('ops-recent.json', { read: today, asOf: ops.asOf, months: ops.months.slice(cut), data: Object.fromEntries(Object.entries(ops.data).map(([k, o]) => [k, Object.fromEntries(Object.entries(o).map(([c, a]) => [c, a.slice(cut)]))])) });
});
await step('Résidents permanents par catégorie (ODP-PR-PT_IMMCAT.csv)', async () => write('pr.json', { read: today, ...prCategories(tsv(await get('ODP-PR-PT_IMMCAT.csv'))) }));
await step('Entrée express, candidats invités (ODP-EE_candidates-ITA_score.csv, ODP-EE_Candidates-CITZ.csv)', async () => {
  const s = tsv(await get('ODP-EE_candidates-ITA_score.csv')), c = tsv(await get('ODP-EE_Candidates-CITZ.csv'));
  let through = null;
  try { const rows = readXlsx(await get('EN_ODP-EE_Candidates-IntDest.xlsx')); const t = rows.flat().find((x) => typeof x === 'string' && /to [A-Z][a-z]+ \d{4}|\d{4} to/.test(x)); const m = t?.match(/(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\s*$/) ?? t?.match(/to (January|February|March|April|May|June|July|August|September|October|November|December),? (\d{4})/); if (m) through = ym(m[2], MON[m[1].slice(0, 3).toLowerCase()]); } catch { /* période non lue */ }
  write('ee.json', { read: today, through, ...eeInvitations(s, c) });
});
await step('Permis du Programme de mobilité internationale (ODP-TR-Work-IMP-PT_program.csv)', async () => write('imp.json', { read: today, ...impPrograms(tsv(await get('ODP-TR-Work-IMP-PT_program.csv'))) }));
await step('Titulaires de permis d’études (ODP-TR-Study-IS_CITZ.csv)', async () => write('study.json', { read: today, ...studyHolders(tsv(await get('ODP-TR-Study-IS_CITZ.csv'))) }));

await step('Normes de service d’IRCC (GC Service Inventory, service-std.csv)', async () => write('std.json', { read: today, ...serviceStandards(csvRows(await get(STD_URL))) }));

// Noms des pays, figés (identiques au build et dans le navigateur).
const names = { ...NAMES };
write('names.json', Object.fromEntries(Object.entries(names).sort(([a], [b]) => a.localeCompare(b))));

for (const l of report) console.log(l);
if (unknown.size) console.log(`noms sans code ISO (gardés tels quels) : ${[...unknown].sort().join(' · ')}`);
if (ops.asOf) {
  const cfg = new URL('../../src/data/site-config.ts', import.meta.url);
  const src = fs.readFileSync(cfg, 'utf8');
  const next = src.replace(/export const LAST_UPDATED = '[^']*';/, `export const LAST_UPDATED = '${ops.asOf}';`);
  if (next !== src) { fs.writeFileSync(cfg, next); console.log(`LAST_UPDATED = ${ops.asOf}`); }
}
if (report.some((l) => l.startsWith('ÉCHEC'))) process.exitCode = 0;
