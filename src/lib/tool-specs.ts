/**
 * Les simulateurs du site, dans les deux langues. Les chiffres de contexte viennent des données ouvertes d'IRCC
 * (src/lib/data.ts, Licence du gouvernement ouvert – Canada) ; le délai de traitement, lui, est saisi par le lecteur
 * tel qu'il l'a lu dans l'outil d'IRCC : le site ne reproduit pas les délais publiés sur canada.ca.
 * Une spec liste ses champs (visibles d'abord, `adv` repliés) et une fonction `run` qui rend la carte de résultat.
 * « Aujourd'hui » = date de lecture des fichiers (READ) : même résultat au build et dans le navigateur.
 */
import type { ToolSpec, V, Opt, ToolOut } from './tool-types';
import { resolve } from './tool-types';
import type { Lang } from './format';
import {
  PROGS, byName, progById, countryName, COUNTRIES, MAJOR, READ, O, LAST, CIT_RULE, EE_YEARS, EE_PROG, EED,
  opsSeries, ops12, approval12, net12, rank12, prSeries, pr12, prName, impSeries, imp12, impName, PRD, IMPD,
  fmtN, fmtPct, fmtChange, fmtTime, num, day, monthYear, whenAt, window12, eeYear, eeBands, eeBandShare, eeCountry,
  stdOf, fmtStd, fmtFy,
  type Family, type Metric,
} from './data';
import { addDays, addTime, citizenship, dateOf, estimate, type Unit } from './engine/times';

export type Args = Record<string, number | string>;
const T = (l: Lang, fr: string, en: string) => (l === 'fr' ? fr : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');

const FAM: Record<Family, { en: string; fr: string }> = {
  visit: { en: 'Visit', fr: 'Visite' }, study: { en: 'Study', fr: 'Études' }, work: { en: 'Work', fr: 'Travail' },
  pr: { en: 'Permanent residence', fr: 'Résidence permanente' }, family: { en: 'Family and refugees', fr: 'Famille et réfugiés' }, cit: { en: 'Citizenship and PR card', fr: 'Citoyenneté et carte RP' },
};
const progOpts = (l: Lang, only?: string[]): Opt[] => PROGS.filter((g) => !only || only.includes(g.id)).map((g) => ({ value: g.id, label: `${FAM[g.family][l]} · ${g.name[l]}` }));
const countryOpts = (l: Lang): Opt[] => COUNTRIES.map((c) => ({ value: c, label: countryName(c, l) })).sort((a, b) => byName(a.label, b.label));
const unitOpts = (l: Lang): Opt[] => [{ value: 'd', label: T(l, 'jours', 'days') }, { value: 'w', label: T(l, 'semaines', 'weeks') }, { value: 'm', label: T(l, 'mois', 'months') }];
/** Mois de dépôt proposés : « pas encore » puis les 36 derniers mois. */
const monthOpts = (l: Lang): Opt[] => {
  const out: Opt[] = [{ value: 'none', label: T(l, 'Pas encore déposée', 'Not applied yet') }];
  const [y, m] = READ.split('-').map(Number);
  for (let i = 0; i < 36; i++) { const d = new Date(Date.UTC(y, m - 1 - i, 15)); const ym = d.toISOString().slice(0, 7); const lab = monthYear(`${ym}-15`, l); out.push({ value: ym, label: lab.charAt(0).toUpperCase() + lab.slice(1) }); }
  return out;
};
/** Exemple de délai pré-rempli selon l'unité habituelle : un exemple à remplacer, pas un délai publié. */
const EXAMPLE: Record<Unit, number> = { d: 60, w: 12, m: 12 };
const label = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

/** Tableau des 12 derniers mois d'une série mensuelle. */
function monthTable(caption: string, head: string, months: string[], v: Array<number | null>, l: Lang): ToolOut['table'] {
  const k = Math.max(0, months.length - 12);
  return { caption, headers: [T(l, 'Mois', 'Month'), head], rows: months.slice(k).map((m, i) => [label(monthYear(`${m}-15`, l)), fmtN(v[k + i] ?? null, l)]).reverse(), align: ['l', 'r'] };
}
/** Contexte tiré des données ouvertes pour un type de demande (et un pays de citoyenneté). */
function context(g: string, c: string, l: Lang): { rows: ToolOut['rows']; table?: ToolOut['table'] } {
  const prog = progById(g), k = prog.ctx, w = window12(O.months, l);
  const rows: ToolOut['rows'] = [];
  if (k.kind === 'tr' || k.kind === 'visit' || k.kind === 'study') {
    const a = approval12(c), nt = net12(c);
    rows.push([T(l, `Demandes de résidence temporaire finalisées, ${countryName(c, 'fr')} (${w})`, `Temporary residence applications finalized, ${countryName(c, 'en')} (${w})`), fmtN(a.fin, l)]);
    rows.push([T(l, 'Part approuvée sur ces douze mois', 'Share approved over these twelve months'), fmtPct(a.rate, l)]);
    if (a.prevRate != null) rows.push([T(l, 'Part approuvée, douze mois d’avant', 'Share approved, previous twelve months'), fmtPct(a.prevRate, l)]);
    if (nt.net != null) rows.push([T(l, 'Reçues moins finalisées (douze mois)', 'Received minus finalized (twelve months)'), `${nt.net > 0 ? '+' : ''}${num(nt.net, l)}`]);
    const m: Metric = k.kind === 'visit' ? 'v1' : k.kind === 'study' ? 'spFin' : 'trFin';
    if (m !== 'trFin') { const y = ops12(m, c); rows.push([T(l, `${m === 'v1' ? 'Visas de visiteur approuvés' : 'Demandes de permis d’études finalisées'}, ${countryName(c, 'fr')}`, `${m === 'v1' ? 'Visitor visas approved' : 'Study permit applications finalized'}, ${countryName(c, 'en')}`), `${fmtN(y.last, l)} (${fmtChange(y.change, l)})`]); }
    return { rows, table: monthTable(T(l, `${m === 'v1' ? 'Visas de visiteur (V-1) approuvés' : m === 'spFin' ? 'Nouvelles demandes de permis d’études finalisées' : 'Demandes de résidence temporaire finalisées'}, citoyens de ${countryName(c, 'fr')}, par mois. Source : IRCC, données ouvertes (OGL-Canada 2.0).`, `${m === 'v1' ? 'Visitor visas (V-1) approved' : m === 'spFin' ? 'New study permit applications finalized' : 'Temporary residence applications finalized'}, citizens of ${countryName(c, 'en')}, by month. Source: IRCC open data (OGL-Canada 2.0).`), T(l, 'Personnes', 'People'), O.months, opsSeries(m, c), l) };
  }
  if (k.kind === 'pr') {
    const y = pr12(k.key!);
    rows.push([T(l, `Admissions de résidents permanents : ${prName(k.key!, 'fr')} (${window12(PRD.months, 'fr')})`, `Permanent resident admissions: ${prName(k.key!, 'en')} (${window12(PRD.months, 'en')})`), fmtN(y.last, l)]);
    rows.push([T(l, 'Écart avec les douze mois d’avant', 'Change from the previous twelve months'), fmtChange(y.change, l)]);
    return { rows, table: monthTable(T(l, `Admissions de résidents permanents par mois, ${prName(k.key!, 'fr')}. Source : IRCC, données ouvertes (OGL-Canada 2.0).`, `Permanent resident admissions by month, ${prName(k.key!, 'en')}. Source: IRCC open data (OGL-Canada 2.0).`), T(l, 'Admissions', 'Admissions'), PRD.months, prSeries(k.key!), l) };
  }
  if (k.kind === 'imp') {
    const y = imp12(k.key!);
    rows.push([T(l, `Permis entrés en vigueur : ${impName(k.key!, 'fr')} (${window12(IMPD.months, 'fr')})`, `Permits that took effect: ${impName(k.key!, 'en')} (${window12(IMPD.months, 'en')})`), fmtN(y.last, l)]);
    rows.push([T(l, 'Écart avec les douze mois d’avant', 'Change from the previous twelve months'), fmtChange(y.change, l)]);
    return { rows, table: monthTable(T(l, `Permis entrés en vigueur par mois, ${impName(k.key!, 'fr')}. Source : IRCC, données ouvertes (OGL-Canada 2.0).`, `Permits that took effect by month, ${impName(k.key!, 'en')}. Source: IRCC open data (OGL-Canada 2.0).`), T(l, 'Permis', 'Permits'), IMPD.months, impSeries(k.key!), l) };
  }
  if (k.kind === 'cit') {
    const y = ops12('cit');
    rows.push([T(l, `Nouveaux citoyens canadiens (${w})`, `New Canadian citizens (${w})`), fmtN(y.last, l)]);
    rows.push([T(l, 'Écart avec les douze mois d’avant', 'Change from the previous twelve months'), fmtChange(y.change, l)]);
    return { rows, table: monthTable(T(l, 'Nouveaux citoyens canadiens par mois. Source : IRCC, données ouvertes (OGL-Canada 2.0).', 'New Canadian citizens by month. Source: IRCC open data (OGL-Canada 2.0).'), T(l, 'Personnes', 'People'), O.months, opsSeries('cit'), l) };
  }
  return { rows };
}

function delai(l: Lang, arg?: Args): ToolSpec {
  const only = arg?.only ? String(arg.only).split(',') : undefined;
  const g0 = progById(String(arg?.g ?? 'visitor'));
  // Pré-réglage : la norme de service publiée par IRCC pour ce type de demande (données ouvertes), sinon un exemple.
  const s0 = stdOf(g0.id)?.cur, preset = s0?.n && (s0.u === 'd' || s0.u === 'm') ? { n: s0.n, u: s0.u as Unit } : { n: EXAMPLE[g0.unit], u: g0.unit };
  return {
    inputs: [
      { kind: 'select', id: 'g', label: T(l, 'Type de demande', 'Application type'), def: g0.id, options: progOpts(l, only), wide: true },
      { id: 'n', label: T(l, 'Délai affiché par IRCC', 'Time shown by IRCC'), def: Number(arg?.n ?? preset.n), max: 999, wide: true, help: T(l, 'Recopiez le délai que l’outil « Vérifier les délais de traitement » d’IRCC affiche pour votre demande (pré-rempli : norme de service d’IRCC ou exemple)', 'Copy the time IRCC’s “Check processing times” tool shows for your application (filled in: IRCC’s service standard or an example)') },
      { kind: 'select', id: 'u', label: T(l, 'Unité', 'Unit'), def: String(arg?.u ?? preset.u), options: unitOpts(l) },
      { kind: 'select', id: 'm', label: T(l, 'Mois de votre demande', 'Month you applied'), def: String(arg?.m ?? 'none'), options: monthOpts(l) },
      { id: 'd', label: T(l, 'Jour de la demande', 'Day you applied'), def: Number(arg?.d ?? 15), max: 31, help: T(l, 'Jour où IRCC a reçu la demande complète', 'Day IRCC received your complete application') },
      { kind: 'select', id: 'c', label: T(l, 'Pays de citoyenneté (contexte)', 'Country of citizenship (context)'), def: String(arg?.c ?? 'IN'), options: countryOpts(l), help: T(l, 'Sert seulement aux volumes publiés par IRCC pour vos concitoyens', 'Only used for the volumes IRCC publishes for your fellow citizens'), adv: true, wide: true },
    ],
    run: (v) => {
      const g = s(v, 'g'), prog = progById(g), c = s(v, 'c') || 'IN';
      const u = (['d', 'w', 'm'].includes(s(v, 'u')) ? s(v, 'u') : prog.unit) as Unit;
      const t = { n: Math.max(0, Math.round(n(v, 'n'))), u };
      const applied = s(v, 'm') === 'none' ? null : dateOf(s(v, 'm'), n(v, 'd'));
      const rows: ToolOut['rows'] = [[T(l, 'Délai saisi', 'Time entered'), fmtTime(t.n, u, l)]];
      let value: string, lab: string;
      if (applied) {
        const e = estimate(applied, t, READ);
        rows.push([T(l, 'Demande reçue le', 'Application received on'), day(applied, l)]);
        rows.push([T(l, `Temps écoulé au ${day(READ, l)}`, `Time elapsed as of ${day(READ, l)}`), `${num(e.elapsed, l)} ${T(l, 'jours', 'days')}`]);
        rows.push([T(l, 'Part du délai déjà écoulée', 'Share of the time already elapsed'), fmtPct(e.share, l)]);
        rows.push(e.overdue ? [T(l, 'Au-delà du délai saisi de', 'Beyond the time entered by'), `${num(-e.remaining, l)} ${T(l, 'jours', 'days')}`] : [T(l, 'Reste, si le délai se maintient', 'Left, if the time holds'), `${num(e.remaining, l)} ${T(l, 'jours', 'days')}`]);
        lab = T(l, 'Décision estimée', 'Estimated decision'); value = e.overdue ? T(l, 'délai dépassé', 'past the time entered') : whenAt(e.date, u, l);
      } else {
        const d = addTime(READ, t);
        rows.push([T(l, `Demande déposée le ${day(READ, l)} : décision vers`, `Applying on ${day(READ, l)}: decision around`), whenAt(d, u, l)]);
        lab = T(l, 'Décision vers, si vous déposez aujourd’hui', 'Decision around, if you apply today'); value = whenAt(d, u, l);
      }
      const st = stdOf(g);
      if (st?.cur.n) {
        rows.push([T(l, 'Norme de service d’IRCC', 'IRCC service standard'), T(l, `${fmtStd(st.cur, l)} pour ${fmtPct((st.cur.target ?? 0.8) * 100, l)} des demandes`, `${fmtStd(st.cur, l)} for ${fmtPct((st.cur.target ?? 0.8) * 100, l)} of applications`)]);
        rows.push([T(l, `Demandes traitées dans la norme en ${fmtFy(st.fy, l)}`, `Applications processed within the standard in ${fmtFy(st.fy, l)}`), `${fmtPct(st.cur.perf, l)} ${T(l, 'sur', 'of')} ${fmtN(st.cur.total, l)}`]);
      }
      const ctx = context(g, c, l);
      rows.push(...ctx.rows);
      const sub = prog.method === 'past'
        ? T(l, `${prog.name.fr}. IRCC affiche ici un délai passé : le temps qu’il lui a fallu pour traiter 80 % des demandes récentes.`, `${prog.name.en}. IRCC shows a past time here: how long it took to process 80% of recent applications.`)
        : T(l, `${prog.name.fr}. IRCC affiche ici un délai prospectif : le temps qu’il prévoit pour une demande reçue aujourd’hui.`, `${prog.name.en}. IRCC shows a forward-looking time here: what it expects for an application received today.`);
      return {
        label: lab, value, sub, rows, table: ctx.table,
        note: T(l, 'Estimation, pas une promesse : le délai vient de vous (copié de l’outil d’IRCC), la date est le jour de réception de la demande complète, et la biométrie ou une demande de documents s’ajoutent. Normes de service et volumes : données ouvertes du gouvernement du Canada (Licence du gouvernement ouvert du Canada).', 'An estimate, not a promise: the time comes from you (copied from IRCC’s tool), the date is the day IRCC received the complete application, and biometrics or a request for documents come on top. Service standards and volumes: Government of Canada open data (Open Government Licence of Canada).'),
      };
    },
  };
}

function citoyennete(l: Lang, arg?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'pr', label: T(l, 'Jours au Canada comme résident permanent', 'Days in Canada as a permanent resident'), def: Number(arg?.pr ?? 900), max: 1825, unit: T(l, 'jours', 'days'), help: T(l, 'Dans les 5 ans avant la date de la demande, absences retirées', 'Within the 5 years before you apply, absences removed') },
      { id: 'tmp', label: T(l, 'Jours au Canada avant la résidence permanente', 'Days in Canada before permanent residence'), def: Number(arg?.tmp ?? 400), max: 1825, unit: T(l, 'jours', 'days'), help: T(l, 'Comme visiteur, étudiant, travailleur ou personne protégée, dans les mêmes 5 ans', 'As a visitor, student, worker or protected person, within the same 5 years') },
      { id: 'n', label: T(l, 'Délai affiché par IRCC pour la citoyenneté', 'Citizenship time shown by IRCC'), def: Number(arg?.n ?? 0), max: 120, unit: T(l, 'mois', 'months'), help: T(l, 'Facultatif : recopiez le délai de l’outil d’IRCC pour estimer la date du serment', 'Optional: copy the time from IRCC’s tool to estimate the oath date'), adv: true },
    ],
    run: (v) => {
      const c = citizenship({ prDays: n(v, 'pr'), tempDays: n(v, 'tmp') }, CIT_RULE);
      const earliest = addDays(READ, c.missing);
      const rows: ToolOut['rows'] = [
        [T(l, 'Jours comme résident permanent', 'Days as a permanent resident'), num(c.pr, l), c.pr],
        [T(l, `Jours d’avant, comptés pour moitié (${num(CIT_RULE.tempCap, l)} au plus)`, `Earlier days, counted at half (${num(CIT_RULE.tempCap, l)} at most)`), num(c.tempCredit, l), c.tempCredit],
        [T(l, `Total retenu sur ${num(CIT_RULE.required, l)} exigés`, `Total counted, of ${num(CIT_RULE.required, l)} required`), num(c.total, l)],
      ];
      if (!c.eligible) rows.push([T(l, 'Jours manquants', 'Days missing'), num(c.missing, l)], [T(l, 'Première date possible, sans nouvelle absence', 'Earliest date, with no further absence'), day(earliest, l)]);
      const t = Math.round(n(v, 'n'));
      if (t > 0) rows.push([T(l, `Serment vers, avec un délai de ${num(t, l)} mois`, `Oath around, with a ${num(t, l)}-month time`), monthYear(addTime(c.eligible ? READ : earliest, { n: t, u: 'm' }), l)]);
      const y = ops12('cit');
      rows.push([T(l, `Nouveaux citoyens canadiens (${window12(O.months, 'fr')})`, `New Canadian citizens (${window12(O.months, 'en')})`), fmtN(y.last, l)]);
      return {
        label: T(l, 'Présence effective retenue', 'Physical presence counted'),
        value: c.eligible ? T(l, 'Seuil atteint', 'Threshold met') : T(l, `${num(c.missing, l)} jours manquants`, `${num(c.missing, l)} days short`),
        sub: T(l, `${num(c.total, l)} jours sur ${num(CIT_RULE.required, l)}, au ${day(READ, l)}`, `${num(c.total, l)} of ${num(CIT_RULE.required, l)} days, as of ${day(READ, l)}`),
        rows,
        note: T(l, 'La fenêtre de 5 ans glisse : chaque jour qui passe en fait sortir un ancien. Le calculateur officiel d’IRCC, avec vos dates exactes de voyage, fait foi avant de déposer.', 'The 5-year window slides: each new day pushes an old one out. IRCC’s official calculator, with your exact travel dates, is the one to trust before you apply.'),
      };
    },
  };
}

function entreeExpress(l: Lang, arg?: Args): ToolSpec {
  const years = [...EE_YEARS].reverse().slice(0, 6);
  return {
    inputs: [
      { id: 'crs', label: T(l, 'Votre score CRS', 'Your CRS score'), def: Number(arg?.crs ?? 480), max: 1200, help: T(l, 'Score affiché dans votre profil Entrée express', 'Score shown in your Express Entry profile') },
      { kind: 'select', id: 'k', label: T(l, 'Programme d’invitation', 'Invitation program'), def: String(arg?.k ?? 'all'), options: ['all', 'cec', 'fsw', 'pnp'].map((k) => ({ value: k, label: EE_PROG[k][l] })) },
      { kind: 'select', id: 'y', label: T(l, 'Année', 'Year'), def: String(arg?.y ?? years[1] ?? years[0]), options: years.map((y) => ({ value: y, label: y === LAST.ops.slice(0, 4) ? T(l, `${y} (année en cours)`, `${y} (year to date)`) : y })) },
    ],
    run: (v) => {
      const k = s(v, 'k'), y = s(v, 'y'), score = n(v, 'crs');
      const b = eeBandShare(y, k, score), total = eeYear(y, k);
      const rows: ToolOut['rows'] = [
        [T(l, `Invitations ${y}, ${EE_PROG[k].fr}`, `Invitations in ${y}, ${EE_PROG[k].en}`), fmtN(total, l)],
        [T(l, 'Votre tranche de score', 'Your score band'), b.band ? b.band.replace('-', T(l, ' à ', ' to ')) : T(l, 'hors des tranches publiées', 'outside the published bands')],
        [T(l, 'Invitations sous votre tranche', 'Invitations below your band'), fmtPct(b.below, l)],
        [T(l, 'Invitations dans votre tranche', 'Invitations in your band'), fmtPct(b.inBand, l)],
        [T(l, 'Invitations au-dessus de votre tranche', 'Invitations above your band'), fmtPct(b.above, l)],
      ];
      const counts = eeBands(y, k);
      const bl = (x: string) => x.replace('-', T(l, ' à ', ' to '));
      const rowsT = EED.bandOrder.map((band, i) => [band === b.band ? `<strong>${bl(band)}</strong>` : bl(band), fmtN(counts[i], l)]).filter((_, i) => counts[i] > 0).reverse();
      return {
        label: T(l, 'Invitations allées à des scores égaux ou inférieurs à votre tranche', 'Invitations that went to scores in or below your band'),
        value: b.band ? fmtPct(Math.round((b.below + b.inBand) * 10) / 10, l) : T(l, 'non calculable', 'not available'),
        sub: T(l, `${EE_PROG[k].fr}, score ${num(score, l)}, ${y}`, `${EE_PROG[k].en}, score ${num(score, l)}, ${y}`),
        rows,
        table: { caption: T(l, `Candidats invités en ${y} par tranche de score, ${EE_PROG[k].fr}. Source : IRCC, Entrée express, candidats invités (OGL-Canada 2.0), chiffres arrondis.`, `Candidates invited in ${y} by score band, ${EE_PROG[k].en}. Source: IRCC Express Entry invited candidates (OGL-Canada 2.0), rounded figures.`), headers: [T(l, 'Tranche de score', 'Score band'), T(l, 'Invitations', 'Invitations')], rows: rowsT, align: ['l', 'r'] },
        note: T(l, 'Une année passée ne dit pas où tombera la prochaine ronde : IRCC choisit la catégorie et le nombre d’invitations à chaque ronde. Ce site ne calcule pas votre score.', 'A past year does not tell where the next round will fall: IRCC picks the category and the number of invitations each time. This site does not compute your score.'),
      };
    },
  };
}

/** Profil d'un pays de citoyenneté : les indicateurs mensuels d'IRCC sur douze mois, comparés aux douze d'avant. */
function pays(l: Lang, arg?: Args): ToolSpec {
  return {
    inputs: [{ kind: 'select', id: 'c', label: T(l, 'Pays de citoyenneté', 'Country of citizenship'), def: String(arg?.c ?? 'IN'), options: countryOpts(l), wide: true }],
    run: (v) => {
      const c = s(v, 'c') || 'IN';
      const a = approval12(c), nt = net12(c), r = rank12('trFin', c);
      const M: Metric[] = ['trIn', 'trFin', 'trOk', 'spFin', 'v1', 'prIn', 'copr', 'cit'];
      const NAME: Record<Metric, [string, string]> = {
        trIn: ['Résidence temporaire : demandes reçues', 'Temporary residence: applications received'], trFin: ['Résidence temporaire : demandes finalisées', 'Temporary residence: applications finalized'],
        trOk: ['Résidence temporaire : demandes approuvées', 'Temporary residence: applications approved'], spFin: ['Permis d’études : nouvelles demandes finalisées', 'Study permits: new applications finalized'],
        v1: ['Visas de visiteur approuvés (V-1)', 'Visitor visas approved (V-1)'], prIn: ['Résidence permanente : demandes reçues', 'Permanent residence: applications received'],
        copr: ['Résidence permanente : autorisations délivrées', 'Permanent residence: authorizations issued'], cit: ['Nouveaux citoyens (pays de naissance)', 'New citizens (country of birth)'],
      };
      const rowsT = M.map((m) => { const y = ops12(m, c); return [T(l, NAME[m][0], NAME[m][1]), fmtN(y.last, l), fmtN(y.prev, l), fmtChange(y.change, l)]; });
      return {
        label: T(l, `Part approuvée, résidence temporaire, ${countryName(c, 'fr')}`, `Share approved, temporary residence, ${countryName(c, 'en')}`),
        value: fmtPct(a.rate, l),
        sub: T(l, `Demandes approuvées ÷ demandes finalisées, ${window12(O.months, 'fr')}`, `Applications approved ÷ applications finalized, ${window12(O.months, 'en')}`),
        rows: [
          [T(l, 'Demandes finalisées sur douze mois', 'Applications finalized over twelve months'), fmtN(a.fin, l)],
          [T(l, 'Rang parmi les pays de citoyenneté', 'Rank among countries of citizenship'), r.rank ? `${num(r.rank, l)} ${T(l, 'sur', 'of')} ${num(r.of, l)}` : T(l, 'non classé', 'not ranked')],
          [T(l, 'Part approuvée, douze mois d’avant', 'Share approved, previous twelve months'), fmtPct(a.prevRate, l)],
          [T(l, 'Reçues moins finalisées', 'Received minus finalized'), nt.net == null ? fmtN(null, l) : `${nt.net > 0 ? '+' : ''}${num(nt.net, l)}`],
        ],
        table: { caption: T(l, `Citoyens de ${countryName(c, 'fr')} : douze derniers mois (${window12(O.months, 'fr')}) et douze mois d’avant. Source : IRCC, Operational Processing (OGL-Canada 2.0), chiffres arrondis à 5.`, `Citizens of ${countryName(c, 'en')}: last twelve months (${window12(O.months, 'en')}) and the twelve before. Source: IRCC Operational Processing (OGL-Canada 2.0), figures rounded to 5.`), headers: [T(l, 'Indicateur', 'Indicator'), T(l, '12 derniers mois', 'Last 12 months'), T(l, '12 mois d’avant', 'Previous 12 months'), T(l, 'Écart', 'Change')], rows: rowsT, align: ['l', 'r', 'r', 'r'] },
        note: T(l, 'Volumes en personnes, par pays de citoyenneté (de naissance pour les nouveaux citoyens). Une part approuvée élevée ne dit rien de votre propre dossier, et les volumes ne sont pas des délais.', 'Volumes in people, by country of citizenship (of birth for new citizens). A high approval share says nothing about your own file, and volumes are not processing times.'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = { delai, citoyennete, entree: entreeExpress, pays };
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
// MAJOR, eeCountry : réexportés pour les pages (trousse).
export { MAJOR, eeCountry };
