/**
 * Les simulateurs du site, dans les deux langues. Chaque chiffre vient des fichiers IRCC relus (src/lib/data.ts)
 * et du moteur pur src/lib/engine/times.ts. Une spec liste ses champs (visibles d'abord, `adv` repliés) et une
 * fonction `run` qui rend la carte de résultat. « Aujourd'hui » = date de lecture des fichiers (READ).
 */
import type { ToolSpec, V, Opt, ToolOut } from './tool-types';
import { resolve } from './tool-types';
import type { Lang } from './format';
import {
  PROGS, byName, progById, readingOf, altOf, countriesOf, countryName, MAJOR, READ, ROUNDS, EE_READ, CIT_RULE, L,
  fmtTime, fmtDays, fmtDelta, fmtAhead, day, monthYear, whenAt, num, recentTrend, recentPoints, estimate, isTime, daysOf, type Family,
} from './data';
import { addDays, addTime, citizenship, catOf, eeStats, CATS, dateOf, type Cat } from './engine/times';

export type Args = Record<string, number | string>;
const T = (l: Lang, fr: string, en: string) => (l === 'fr' ? fr : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');

const FAM: Record<Family, { en: string; fr: string }> = {
  visit: { en: 'Visit', fr: 'Visite' }, study: { en: 'Study', fr: 'Études' }, work: { en: 'Work', fr: 'Travail' },
  pr: { en: 'Permanent residence', fr: 'Résidence permanente' }, family: { en: 'Family and refugees', fr: 'Famille et réfugiés' }, cit: { en: 'Citizenship and PR card', fr: 'Citoyenneté et carte RP' },
};
const progOpts = (l: Lang, only?: string[]): Opt[] => PROGS.filter((g) => !only || only.includes(g.id)).map((g) => ({ value: g.id, label: `${FAM[g.family][l]} · ${g.name[l]}` }));
const countryOpts = (g: string, l: Lang): Opt[] => {
  const cs = countriesOf(g);
  if (!cs.length) return [{ value: '-', label: T(l, 'Sans objet pour cette demande', 'Not used for this application') }];
  return cs.map((c) => ({ value: c, label: countryName(c, l) })).sort((a, b) => byName(a.label, b.label));
};
/** Mois de dépôt proposés : « pas encore » puis les 36 derniers mois. */
const monthOpts = (l: Lang): Opt[] => {
  const out: Opt[] = [{ value: 'none', label: T(l, 'Pas encore déposée', 'Not applied yet') }];
  const [y, m] = READ.split('-').map(Number);
  for (let i = 0; i < 36; i++) { const d = new Date(Date.UTC(y, m - 1 - i, 15)); const ym = d.toISOString().slice(0, 7); const lab = monthYear(`${ym}-15`, l); out.push({ value: ym, label: lab.charAt(0).toUpperCase() + lab.slice(1) }); }
  return out;
};
const unitOf = (t: unknown) => (t && typeof t === 'object' && 'u' in (t as object) ? (t as { u: string }).u : 'd');

/** Tableau comparatif des grands pays de dépôt pour un programme par pays. */
function compareTable(g: string, c: string, l: Lang): ToolOut['table'] {
  const prog = progById(g);
  const codes = [...new Set([c, ...MAJOR])].filter((x) => countriesOf(g).includes(x));
  const rows = codes.map((x) => {
    const r = readingOf(g, x), tr = recentTrend(r.series), d = daysOf(r.t);
    return { x, d: d ?? Infinity, row: [x === c ? `<strong>${countryName(x, l)}</strong>` : countryName(x, l), fmtTime(r.t, l), tr?.prev != null ? fmtDays(tr.prev, unitOf(r.t), l) : '', tr?.delta != null ? fmtDelta(tr.delta, unitOf(r.t), l) : ''] };
  }).sort((a, b) => a.d - b.d);
  const tr0 = recentTrend(readingOf(g, c).series);
  return {
    caption: T(l, `${prog.name.fr} : délai publié par pays de dépôt, relevé du ${day(L.dates.country, l)}, comparé au relevé précédent${tr0?.prevDate ? ` (${day(tr0.prevDate, l)})` : ''}.`, `${prog.name.en}: published time by country of filing, ${day(L.dates.country, l)} reading, against the previous reading${tr0?.prevDate ? ` (${day(tr0.prevDate, l)})` : ''}.`),
    headers: [T(l, 'Pays', 'Country'), T(l, 'Délai publié', 'Published time'), T(l, 'Relevé précédent', 'Previous reading'), T(l, 'Écart', 'Change')],
    rows: rows.map((r) => r.row), align: ['l', 'r', 'r', 'r'],
  };
}
/** File d'attente publiée par IRCC (mois ou semaine de dépôt). */
function queueTable(g: string, mine: string | undefined, l: Lang): ToolOut['table'] | undefined {
  const prog = progById(g), r = readingOf(g);
  const q = r.queue ?? []; if (!q.length) return undefined;
  const weekly = prog.src === 'tr';
  const tail = q.slice(-12);
  const rows = (mine && !tail.some((x) => x[0] === mine) ? [...q.filter((x) => x[0] === mine), ...tail] : tail);
  const label = (k: string) => (weekly ? T(l, `${monthYear(`${k.slice(0, 7)}-15`, l)}, semaine ${Number(k.slice(8))}`, `${monthYear(`${k.slice(0, 7)}-15`, l)}, week ${Number(k.slice(8))}`) : monthYear(`${k}-15`, l));
  const left = (x: unknown) => (x === 'late' ? T(l, 'délai prévu dépassé', 'past the expected time') : typeof x === 'number' ? `${num(x, l)} ${weekly ? T(l, x === 1 ? 'semaine' : 'semaines', x === 1 ? 'week' : 'weeks') : T(l, 'mois', x === 1 ? 'month' : 'months')}` : String(x ?? '').startsWith('gt') ? T(l, 'plus de 10 ans', 'more than 10 years') : '');
  return {
    caption: T(l, `File publiée par IRCC le ${day(r.date, l)} : temps restant et personnes devant, selon ${weekly ? 'la semaine' : 'le mois'} de dépôt.`, `Queue published by IRCC on ${day(r.date, l)}: time left and people ahead, by ${weekly ? 'week' : 'month'} of filing.`),
    headers: [T(l, weekly ? 'Semaine de dépôt' : 'Mois de dépôt', weekly ? 'Week filed' : 'Month filed'), T(l, 'Temps restant', 'Time left'), T(l, 'Personnes devant', 'People ahead')],
    rows: rows.map((x) => [x[0] === mine ? `<strong>${label(x[0])}</strong>` : label(x[0]), left(x[1]), fmtAhead(x[2], l)]), align: ['l', 'r', 'r'],
  };
}
/** Relevés datés de notre historique (extrait récent). */
function historyTable(series: string, u: string, l: Lang, max = 10): ToolOut['table'] | undefined {
  const pts = recentPoints(series); if (pts.length < 2) return undefined;
  const rows = pts.slice(-max).reverse().map(([d, v], i, a) => [day(d, l), fmtDays(v, u, l), i < a.length - 1 ? fmtDelta(v - a[i + 1][1], u, l) : '']);
  return {
    caption: T(l, `Nos relevés datés de ce délai (les ${Math.min(max, pts.length)} derniers), tels qu’IRCC les publiait.`, `Our dated readings of this time (latest ${Math.min(max, pts.length)}), as IRCC published them.`),
    headers: [T(l, 'Date publiée par IRCC', 'Date published by IRCC'), T(l, 'Délai', 'Time'), T(l, 'Écart', 'Change')], rows, align: ['l', 'r', 'r'],
  };
}

function delai(l: Lang, arg?: Args): ToolSpec {
  const only = arg?.only ? String(arg.only).split(',') : undefined;
  return {
    inputs: [
      { kind: 'select', id: 'g', label: T(l, 'Type de demande', 'Application type'), def: String(arg?.g ?? 'visitor'), options: progOpts(l, only), wide: true },
      { kind: 'select', id: 'c', label: T(l, 'Pays où vous déposez', 'Country you apply from'), def: String(arg?.c ?? 'IN'), options: (v: V) => countryOpts(s(v, 'g'), l), help: T(l, 'Pays de résidence pour un visa ou un permis demandé hors du Canada', 'Country of residence for a visa or permit requested from outside Canada'), wide: true },
      { kind: 'select', id: 'm', label: T(l, 'Mois de votre demande', 'Month you applied'), def: String(arg?.m ?? 'none'), options: monthOpts(l) },
      { id: 'd', label: T(l, 'Jour de la demande', 'Day you applied'), def: Number(arg?.d ?? 15), max: 31, help: T(l, 'Jour où IRCC a reçu la demande complète', 'Day IRCC received your complete application') },
    ],
    run: (v) => {
      const g = s(v, 'g'), prog = progById(g), c = s(v, 'c') === '-' ? 'IN' : s(v, 'c');
      const r = readingOf(g, c), t = isTime(r.t) ? r.t : null, u = unitOf(r.t);
      const applied = s(v, 'm') === 'none' ? null : dateOf(s(v, 'm'), n(v, 'd'));
      const e = estimate(g, c, applied);
      const tr = recentTrend(r.series);
      const where = prog.src === 'country' && !prog.fixed ? T(l, ` depuis ${countryName(c, l)}`, ` from ${countryName(c, l)}`) : '';
      const rows: ToolOut['rows'] = [[T(l, `Délai publié par IRCC (${day(r.date, l)})`, `Time published by IRCC (${day(r.date, l)})`), fmtTime(r.t, l)]];
      let value = fmtTime(r.t, l), label = T(l, `Délai publié${where}`, `Published processing time${where}`);
      if (applied) {
        rows.push([T(l, 'Demande reçue le', 'Application received on'), day(applied, l)]);
        rows.push([T(l, `Temps écoulé au ${day(READ, l)}`, `Time elapsed as of ${day(READ, l)}`), `${num(e.elapsed ?? 0, l)} ${T(l, 'jours', 'days')}`]);
        if (e.date && t) {
          rows.push([T(l, 'Date de dépôt + délai publié', 'Filing date + published time'), whenAt(e.date, t, l)]);
          const rem = e.remaining ?? 0;
          rows.push(rem >= 0 ? [T(l, 'Reste, si le délai se maintient', 'Left, if the time holds'), `${num(rem, l)} ${T(l, 'jours', 'days')}`] : [T(l, 'Au-delà du délai publié de', 'Beyond the published time by'), `${num(-rem, l)} ${T(l, 'jours', 'days')}`]);
          label = T(l, `Décision estimée${where}`, `Estimated decision${where}`); value = rem < 0 ? T(l, 'délai dépassé', 'past the published time') : whenAt(e.date, t, l);
        }
        if (e.queue) {
          const q = e.queue, unitW = q.unit === 'w';
          if (q.left === 'late') { rows.push([T(l, 'File d’IRCC pour votre période de dépôt', 'IRCC queue for your filing period'), T(l, 'délai prévu dépassé', 'past the expected time')]); value = T(l, 'délai dépassé', 'past the expected time'); label = T(l, 'Selon la file publiée par IRCC', 'According to the queue IRCC publishes'); }
          else if (typeof q.left === 'number' && q.date) {
            rows.push([T(l, 'File d’IRCC : temps restant', 'IRCC queue: time left'), `${num(q.left, l)} ${unitW ? T(l, 'semaines', 'weeks') : T(l, 'mois', 'months')}`]);
            if (q.ahead != null) rows.push([T(l, 'Personnes devant vous', 'People ahead of you'), fmtAhead(q.ahead, l)]);
            value = unitW ? day(q.date, l) : monthYear(q.date, l); label = T(l, `Décision attendue selon la file d’IRCC`, `Decision expected from IRCC’s queue`);
          }
        }
      } else if (t) {
        rows.push([T(l, `Demande déposée le ${day(READ, l)} : décision vers`, `Applying on ${day(READ, l)}: decision around`), whenAt(addTime(READ, t), t, l)]);
      }
      if (r.waiting) rows.push([T(l, 'Demandes en attente dans cette file', 'Applications waiting in this line'), fmtAhead(r.waiting, l)]);
      const alt = altOf(g);
      if (alt) rows.push([T(l, `Délai passé (80 % traitées), ${day(alt.date, l)}`, `Past time (80% processed), ${day(alt.date, l)}`), fmtTime(alt.t, l)]);
      if (tr?.delta != null && tr.prevDate) rows.push([T(l, `Écart avec le relevé du ${day(tr.prevDate, l)}`, `Change since the ${day(tr.prevDate, l)} reading`), fmtDelta(tr.delta, u, l)]);
      if (tr && tr.n >= 3 && tr.firstDate) rows.push([T(l, `Plus bas et plus haut depuis le ${day(tr.firstDate, l)}`, `Low and high since ${day(tr.firstDate, l)}`), `${fmtDays(tr.min, u, l)} · ${fmtDays(tr.max, u, l)}`]);
      const sub = prog.method === 'past'
        ? T(l, `${prog.name.fr}. Délai passé : temps qu’il a fallu à IRCC pour traiter 80 % des demandes récentes.`, `${prog.name.en}. Past time: how long IRCC took to process 80% of recent applications.`)
        : T(l, `${prog.name.fr}. Délai prospectif : temps qu’IRCC prévoit pour une demande reçue aujourd’hui.`, `${prog.name.en}. Forward-looking time: what IRCC expects for an application received today.`);
      const table = prog.src === 'country' && !prog.fixed ? compareTable(g, c, l) : queueTable(g, applied ? (prog.src === 'tr' ? e.queue?.key : applied.slice(0, 7)) : undefined, l) ?? historyTable(r.series, u, l);
      const second = table && prog.src !== 'noncountry' && !(prog.src === 'country' && prog.fixed) ? historyTable(r.series, u, l, 6) : undefined;
      return {
        label, value, sub, rows, table, tables: second ? [second] : undefined,
        note: T(l, 'Estimation, pas une promesse : IRCC traite certaines demandes plus vite ou plus lentement, et le délai ne compte pas le temps de donner vos données biométriques. Date de dépôt = jour où IRCC reçoit la demande complète.', 'An estimate, not a promise: IRCC processes some applications faster or slower, and the time does not include giving your biometrics. Filing date = the day IRCC receives the complete application.'),
      };
    },
  };
}

function citoyennete(l: Lang, arg?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'pr', label: T(l, 'Jours au Canada comme résident permanent', 'Days in Canada as a permanent resident'), def: Number(arg?.pr ?? 900), max: 1825, unit: T(l, 'jours', 'days'), help: T(l, 'Dans les 5 ans avant la date de la demande, absences retirées', 'Within the 5 years before you apply, absences removed') },
      { id: 'tmp', label: T(l, 'Jours au Canada avant la résidence permanente', 'Days in Canada before permanent residence'), def: Number(arg?.tmp ?? 400), max: 1825, unit: T(l, 'jours', 'days'), help: T(l, 'Comme visiteur, étudiant, travailleur ou personne protégée, dans les mêmes 5 ans', 'As a visitor, student, worker or protected person, within the same 5 years') },
    ],
    run: (v) => {
      const c = citizenship({ prDays: n(v, 'pr'), tempDays: n(v, 'tmp') }, CIT_RULE);
      const g = readingOf('citizenship'), t = isTime(g.t) ? g.t : null;
      const earliest = addDays(READ, c.missing);
      const rows: ToolOut['rows'] = [
        [T(l, 'Jours comme résident permanent', 'Days as a permanent resident'), num(c.pr, l), c.pr],
        [T(l, `Jours d’avant, comptés pour moitié (${num(CIT_RULE.tempCap, l)} au plus)`, `Earlier days, counted at half (${num(CIT_RULE.tempCap, l)} at most)`), num(c.tempCredit, l), c.tempCredit],
        [T(l, `Total retenu sur ${num(CIT_RULE.required, l)} exigés`, `Total counted, of ${num(CIT_RULE.required, l)} required`), num(c.total, l)],
      ];
      if (!c.eligible) rows.push([T(l, 'Jours manquants', 'Days missing'), num(c.missing, l)], [T(l, 'Première date possible, sans nouvelle absence', 'Earliest date, with no further absence'), day(earliest, l)]);
      if (t) rows.push([T(l, `Délai prévu par IRCC (${day(g.date, l)})`, `Time expected by IRCC (${day(g.date, l)})`), fmtTime(g.t, l)], [T(l, 'Serment vers, demande déposée à cette date', 'Oath around, applying on that date'), whenAt(addTime(c.eligible ? READ : earliest, t), t, l)]);
      return {
        label: T(l, 'Présence effective retenue', 'Physical presence counted'),
        value: c.eligible ? T(l, 'Seuil atteint', 'Threshold met') : T(l, `${num(c.missing, l)} jours manquants`, `${num(c.missing, l)} days short`),
        sub: T(l, `${num(c.total, l)} jours sur ${num(CIT_RULE.required, l)}, au ${day(READ, l)}`, `${num(c.total, l)} of ${num(CIT_RULE.required, l)} days, as of ${day(READ, l)}`),
        rows,
        note: T(l, 'La fenêtre de 5 ans glisse : chaque jour qui passe en fait sortir un ancien. Le calculateur officiel d’IRCC, avec vos dates exactes de voyage, fait foi avant de déposer. Le délai de traitement court jusqu’au serment.', 'The 5-year window slides: each new day pushes an old one out. IRCC’s official calculator, with your exact travel dates, is the one to trust before you apply. The processing time runs until the oath.'),
      };
    },
  };
}

const CAT_NAMES: Record<Cat | 'all', { en: string; fr: string }> = {
  all: { en: 'All rounds', fr: 'Toutes les rondes' }, cec: { en: 'Canadian Experience Class', fr: 'Expérience canadienne' }, pnp: { en: 'Provincial Nominee Program', fr: 'Candidats des provinces' },
  french: { en: 'French-language proficiency', fr: 'Connaissance du français' }, trades: { en: 'Trades occupations', fr: 'Métiers spécialisés' }, health: { en: 'Healthcare and social services', fr: 'Santé et services sociaux' },
  physicians: { en: 'Physicians with Canadian experience', fr: 'Médecins avec expérience canadienne' }, managers: { en: 'Senior managers with Canadian experience', fr: 'Cadres supérieurs avec expérience canadienne' },
  transport: { en: 'Transport occupations', fr: 'Métiers du transport' }, military: { en: 'Skilled military recruits', fr: 'Recrues militaires qualifiées' }, stem: { en: 'STEM occupations', fr: 'Sciences, technologie, génie et mathématiques' },
  education: { en: 'Education occupations', fr: 'Métiers de l’enseignement' }, agriculture: { en: 'Agriculture and agri-food', fr: 'Agriculture et agroalimentaire' }, fsw: { en: 'Federal Skilled Worker', fr: 'Travailleurs qualifiés du fédéral' },
  general: { en: 'General (all programs)', fr: 'Générale (tous programmes)' }, other: { en: 'Other categories', fr: 'Autres catégories' },
};
export const catName = (c: Cat | 'all', l: Lang) => CAT_NAMES[c][l];
const yearAgo = (iso: string) => `${Number(iso.slice(0, 4)) - 1}${iso.slice(4)}`;

function entreeExpress(l: Lang, arg?: Args): ToolSpec {
  const since = yearAgo(READ);
  const present = CATS.filter((c) => ROUNDS.some((r) => r.date >= since && catOf(r.name) === c));
  return {
    inputs: [
      { id: 'crs', label: T(l, 'Votre score CRS', 'Your CRS score'), def: Number(arg?.crs ?? 480), max: 1200, help: T(l, 'Score affiché dans votre profil Entrée express', 'Score shown in your Express Entry profile') },
      { kind: 'select', id: 'k', label: T(l, 'Catégorie de ronde', 'Round category'), def: String(arg?.k ?? 'all'), options: [{ value: 'all', label: catName('all', l) }, ...present.map((c) => ({ value: c, label: catName(c, l) }))] },
    ],
    run: (v) => {
      const k = s(v, 'k') as Cat | 'all', score = n(v, 'crs');
      const st = eeStats(ROUNDS, k, score, since);
      const rows: ToolOut['rows'] = [
        [T(l, `Rondes depuis le ${day(since, l)}`, `Rounds since ${day(since, l)}`), num(st.n, l)],
        [T(l, 'Invitations envoyées', 'Invitations issued'), num(st.total, l)],
      ];
      if (st.last) rows.push([T(l, 'Dernière ronde', 'Latest round'), `${day(st.last.date, l)} · ${num(st.last.size, l)} · ${st.last.crs ?? ''}`]);
      if (st.lowest) rows.push([T(l, 'Score minimal le plus bas', 'Lowest cut-off'), `${st.lowest.crs} (${day(st.lowest.date, l)})`]);
      const last = st.list.slice(0, 12);
      return {
        label: T(l, 'Rondes de 12 mois où votre score passait', 'Rounds in 12 months your score would have met'),
        value: `${num(st.invitedIn, l)} ${T(l, 'sur', 'of')} ${num(st.list.filter((r) => r.crs != null).length, l)}`,
        sub: T(l, `${catName(k, 'fr')}, score ${num(score, l)}, rondes publiées jusqu’au ${day(ROUNDS[0]?.date ?? EE_READ, l)}`, `${catName(k, 'en')}, score ${num(score, l)}, rounds published up to ${day(ROUNDS[0]?.date ?? EE_READ, l)}`),
        rows,
        table: last.length ? {
          caption: T(l, 'Dernières rondes de la catégorie choisie, telles qu’IRCC les publie.', 'Latest rounds in the chosen category, as IRCC publishes them.'),
          headers: [T(l, 'Date', 'Date'), T(l, 'Ronde', 'Round'), T(l, 'Invitations', 'Invitations'), T(l, 'Score minimal', 'Cut-off'), T(l, 'Votre score', 'Your score')],
          rows: last.map((r) => [day(r.date, l), `${r.n} · ${catName(catOf(r.name), l)}`, num(r.size, l), r.crs != null ? String(r.crs) : '', r.crs != null ? (score >= r.crs ? T(l, 'au-dessus', 'above') : T(l, `${num(r.crs - score, l)} de moins`, `${num(r.crs - score, l)} short`)) : '']),
          align: ['l', 'l', 'r', 'r', 'r'],
        } : undefined,
        note: T(l, 'Les rondes passées ne disent pas où tombera la prochaine : IRCC choisit la catégorie et le nombre d’invitations à chaque ronde. Ce site ne calcule pas votre score.', 'Past rounds do not tell where the next one will fall: IRCC picks the category and the number of invitations each time. This site does not compute your score.'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = { delai, citoyennete, entree: entreeExpress };
export const TOOL_KINDS = Object.keys(SPECS);
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulateur inconnu : ${kind}`);
  return f(l, arg);
}
/** Lance un simulateur avec ses valeurs par défaut (ou celles données) : sert aux pages et aux tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
