import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Historique : volumes mensuels d'IRCC depuis janvier 2023 et résultats des normes de service sur deux exercices
 * (données ouvertes, OGL-Canada 2.0). IRCC ne publie pas l'historique de ses délais de traitement en données ouvertes,
 * et la page n'en reprend aucun. */
const E = K.en, F = K.fr;
type M = 'trIn' | 'trFin' | 'trOk' | 'v1' | 'spFin' | 'prIn' | 'copr' | 'cit';
const METRICS: M[] = ['trIn', 'trFin', 'trOk', 'v1', 'spFin', 'prIn', 'copr', 'cit'];
const YEARS = [...new Set(K.MONTHS.map((m) => m.slice(0, 4)))];
const first = K.MONTHS[0], last = K.MONTHS[K.MONTHS.length - 1];
const cy = YEARS[YEARS.length - 1], py = YEARS[YEARS.length - 2];
const nCur = K.monthsOfYear(cy).length;
const partial = nCur < 12;
/* Même période de l'année d'avant : les nCur premiers mois. */
const ytd = (m: M, y: string) => K.yearSum(K.full(m), K.MONTHS, y) == null ? null : K.monthsOfYear(y).slice(0, nCur).reduce((s, mm) => s + (K.full(m)[K.MONTHS.indexOf(mm)] ?? 0), 0);
const ytdCh = (m: M) => { const a = ytd(m, cy), b = ytd(m, py); return a != null && b ? ((a - b) / b) * 100 : null; };
const y = (m: M, yy: string) => K.fullYear(m, 'ALL', yy);
const trInExt = K.fullExtremes('trIn'), citExt = K.fullExtremes('cit'), prExt = K.fullExtremes('prIn');
const trIn0 = y('trIn', YEARS[0]), trIn1 = y('trIn', YEARS[YEARS.length - 2]);
const trDown = trIn0 != null && trIn1 != null && trIn1 < trIn0;
const citUp = ytdCh('cit'), prInCh = ytdCh('prIn'), trInCh = ytdCh('trIn');

/* Normes de service : les lignes publiées dans l'inventaire des services, sur les deux exercices disponibles. */
const STD_IDS = ['eta', 'visitor', 'super-visa', 'study', 'study-inside', 'work', 'work-inside', 'cec', 'fsw', 'pnp-ee', 'pnp-base', 'qsw', 'spousal-out-roc', 'citizenship'];
const stds = STD_IDS.map((id) => ({ id, s: K.stdOf(id)! })).filter((x) => x.s && x.s.prev);
const met = (x: { cur?: { perf: number | null; target: number | null } | null }) => x.cur?.perf != null && x.cur.target != null && x.cur.perf >= x.cur.target * 100;
const metCur = stds.filter((x) => met({ cur: x.s.cur })).length, metPrev = stds.filter((x) => met({ cur: x.s.prev })).length;
const delta = (x: (typeof stds)[number]) => (x.s.cur.perf ?? 0) - (x.s.prev!.perf ?? 0);
const best = [...stds].sort((a, b) => delta(b) - delta(a))[0], worst = [...stds].sort((a, b) => (a.s.cur.perf ?? 0) - (b.s.cur.perf ?? 0))[0];
const fy = stds[0].s.fy, pfy = stds[0].s.pfy!;
if (stds.some((x) => x.s.fy !== fy || x.s.pfy !== pfy)) throw new Error('history : les normes ne portent pas toutes sur les mêmes exercices');
if (!(delta(best) > 0)) throw new Error('history : aucune norme ne progresse, réécrire le paragraphe');
const lc = (x: string) => x.charAt(0).toLowerCase() + x.slice(1);
const nm = (id: string, l: 'en' | 'fr') => (id === 'spousal-out-roc' ? (l === 'fr' ? 'Regroupement familial à l’étranger (époux, conjoints, enfants)' : 'Family class from abroad (spouses, partners, children)') : K.progName(id, l));

function yearRows(h: Helpers, l: 'en' | 'fr') {
  return METRICS.map((m) => [K.METRIC[m][l], ...YEARS.map((yy) => h.n(y(m, yy))), h.ch(ytdCh(m))]);
}
function stdRows(h: Helpers, l: 'en' | 'fr') {
  return stds.map((x) => [K.PAGE_OF[x.id] ? h.a(K.PAGE_OF[x.id], nm(x.id, l)) : nm(x.id, l), K.fmtStd(x.s.cur, l), h.pct(x.s.prev!.perf), h.pct(x.s.cur.perf), h.n(x.s.cur.total)]);
}

export default defineGuide({
  id: 'history', group: 'tools', order: 71,
  tool: 'delai', toolArg: { g: 'visitor-record', only: 'visitor-record,cit-search,study-ext,work-ext,study,visitor,pgp-roc' },
  related: ['method', 'visitor-record', 'citizenship', 'study-permit', 'nigeria', 'parents-grandparents'],
  sources: ['open-data', 'od-std', 'od-pr', 'ptimes', 'ogl'],
  en: {
    slug: 'processing-time-history',
    nav: 'History', card: 'IRCC volumes month by month since 2023, and service standards year on year',
    title: 'IRCC Workload History, Month by Month Since 2023 (2026)',
    description: 'IRCC open data since January 2023: applications received, finalized and approved each year, new citizens, and how often IRCC met its service standards, 2026.',
    h1: 'IRCC history: volumes since 2023 and service standards year on year',
    intro: `IRCC’s monthly open data runs from ${E.my(first)} to ${E.my(last)}; IRCC publishes no history of its processing times.`,
    resume: `This page brings together the history IRCC actually publishes as open data under the Open Government Licence of Canada. IRCC does not publish a history of its processing times: the “Check processing times” tool only shows today’s figure, so past times cannot be quoted from an official open source, and this page does not try. What IRCC does publish is monthly volumes, from ${E.my(first)} to ${E.my(last)}: temporary residence applications received, finalized and approved, visitor visas, study permits, permanent residence applications and admissions, and new citizens. In ${py}, it received ${E.n(y('trIn', py))} temporary residence applications and welcomed ${E.n(y('cit', py))} new citizens. The Government of Canada service inventory adds a second history: for each service standard, the share of applications IRCC processed on time. Of the ${E.n(stds.length)} standards shown below, IRCC met its target for ${E.n(metCur)} in ${K.fmtFy(fy, 'en')}, against ${E.n(metPrev)} in ${K.fmtFy(pfy, 'en')}.`,
    faqs: [
      { q: 'Does IRCC publish past processing times?', a: 'Not as open data. The “Check processing times” tool on canada.ca shows the current figure only and replaces it when IRCC updates it. To follow your own file, note the time shown on the day you apply and keep it. The monthly volumes and the yearly service standard results on this page are the history IRCC does publish openly.' },
      { q: 'Did IRCC receive fewer temporary residence applications after 2023?', a: `In ${YEARS[0]}, IRCC received ${E.n(trIn0)} temporary residence applications; in ${py}, ${E.n(trIn1)}. ${partial ? `For the first ${E.n(nCur)} months of ${cy}, receipts were ${E.ch(trInCh)} compared with the same months of ${py}.` : `In ${cy}, receipts changed by ${E.ch(trInCh)} on ${py}.`} The figures cover every temporary residence file, from visitor visas to work permit extensions.` },
      { q: 'Which IRCC service standard improved the most recently?', a: `Between ${K.fmtFy(pfy, 'en')} and ${K.fmtFy(fy, 'en')}, the largest gain was for ${lc(nm(best.id, 'en'))}: ${E.pct(best.s.prev!.perf)} of applications processed within ${K.fmtStd(best.s.cur, 'en')}, then ${E.pct(best.s.cur.perf)}. The lowest result in ${K.fmtFy(fy, 'en')} was for ${lc(nm(worst.id, 'en'))}, at ${E.pct(worst.s.cur.perf)}, far below the target IRCC sets for itself.` },
    ],
    body: (h) => `
<h2>What history exists, and what does not</h2>
<p>IRCC updates the times on its ${h.src('ptimes', '“Check processing times” tool')} regularly and keeps no public record of the previous figures. There is no open dataset of past processing times, so this page does not reconstruct one. If you want to compare, note the time IRCC shows on the day you apply: the calculator above takes that figure and the day IRCC received your file, and tells you where you stand today.</p>
<p>Two official histories are open. The first is IRCC’s ${h.src('open-data', 'monthly operational data')}: how many applications came in, how many were decided and how many were approved, every month since ${h.my(first)}. The second is the ${h.src('od-std', 'service inventory')} of the Government of Canada, which reports each year how often IRCC met the processing standard it set for each service. Neither is a processing time, but together they show when the system was under pressure and whether it kept its own promises.</p>
<h2>Year by year</h2>
<p>The table sums each calendar year. ${partial ? `The last column is ${cy}, which only covers ${h.n(nCur)} months so far, so the change shown compares those months with the same months of ${py}.` : `The change column compares ${cy} with ${py}.`} Temporary residence covers visitor visas, visitor records, study and work permits and their extensions; permanent residence covers all economic, family and humanitarian classes.</p>
${h.table(['Indicator', ...YEARS, partial ? `${cy} vs ${py}, same months` : `${cy} vs ${py}`], yearRows(h, 'en'), `IRCC open data, ${h.my(first)} to ${h.my(last)}${partial ? `; ${cy} covers ${h.n(nCur)} months` : ''}. Figures rounded to 5. Source: IRCC, Operational Processing and permanent residents datasets.`, ['l', ...YEARS.map(() => 'r' as const), 'r'])}
<p>${trDown ? `Temporary residence receipts fell from ${h.n(trIn0)} in ${YEARS[0]} to ${h.n(trIn1)} in ${py}, a period that includes the cap IRCC placed on new study permits.` : `Temporary residence receipts went from ${h.n(trIn0)} in ${YEARS[0]} to ${h.n(trIn1)} in ${py}.`} The busiest single month for new temporary residence applications was ${h.my(trInExt.hi[0])}, with ${h.n(trInExt.hi[1])}, and the quietest ${h.my(trInExt.lo[0])}, with ${h.n(trInExt.lo[1])}. Permanent residence applications peaked in ${h.my(prExt.hi[0])} at ${h.n(prExt.hi[1])}. Citizenship moved on its own rhythm: the record month for new citizens was ${h.my(citExt.hi[0])}, with ${h.n(citExt.hi[1])}, and ${partial ? `the first ${h.n(nCur)} months of ${cy} are ${h.ch(citUp)} on the same months of ${py}` : `${cy} is ${h.ch(citUp)} on ${py}`}. Permanent residence receipts over the same comparison are ${h.ch(prInCh)}.</p>
<h2>The last two years, month by month</h2>
${h.months(K.MONTHS, [['TR received', K.full('trIn')], ['TR finalized', K.full('trFin')], ['PR received', K.full('prIn')], ['New citizens', K.full('cit')]], { max: 24, caption: 'IRCC monthly volumes, all countries (TR: temporary residence; PR: permanent residence). Source: IRCC open data; figures rounded to 5.' })}
<p>A month where finalized files exceed received files is a month where the queue shrank; the reverse means it grew. That balance, more than any single figure, is what later shows up as a longer or shorter time on IRCC’s tool. A single month can also mislead: one large batch of decisions, or a pause in ceremonies, moves the figure without saying anything about the trend. That is why the yearly totals above come first, and why the table keeps two full years side by side.</p>
<h2>Service standards, year on year</h2>
<p>For each standard, IRCC sets a target, ${h.pct((stds[0].s.cur.target ?? 0) * 100)} of applications within the stated time, and reports the share it achieved. In ${K.fmtFy(fy, 'en')}, it met the target for ${h.n(metCur)} of these ${h.n(stds.length)} standards, against ${h.n(metPrev)} in ${K.fmtFy(pfy, 'en')}. The largest gain was for ${lc(nm(best.id, 'en'))}, up ${h.n(delta(best), 1)} percentage points; the weakest result was for ${lc(nm(worst.id, 'en'))}, at ${h.pct(worst.s.cur.perf)}.</p>
${h.table(['Service', 'Standard', `Within standard, ${K.fmtFy(pfy, 'en')}`, `Within standard, ${K.fmtFy(fy, 'en')}`, `Applications, ${K.fmtFy(fy, 'en')}`], stdRows(h, 'en'), `IRCC service standards and results by fiscal year. Source: Government of Canada service inventory, open data.`, ['l', 'l', 'r', 'r', 'r'])}
${h.mini('delai', { p: ['g', 'n', 'u', 'm', 'd'], d: { g: 'citizenship', m: 'none' }, t: 'Today’s time against the standard: your date' })}
<p>A standard met for most applications still leaves a minority waiting longer, and those are the files people ask about. If yours is one of them, the guide to an ${h.a('beyond-processing-time', 'application past the processing time')} lists the checks to make before writing to IRCC.</p>
<p>To go further for one country, the ${h.a('nigeria', 'Nigeria page')} and the other country pages break these volumes down by citizenship; the ${h.a('method', 'method page')} explains how each figure is read and rounded.</p>
`,
  },
  fr: {
    slug: 'historique-delais',
    nav: 'Historique', card: 'Les volumes d’IRCC mois par mois depuis 2023, et les normes de service d’une année à l’autre',
    title: 'Historique d’IRCC, volumes mois par mois depuis 2023 (2026)',
    description: 'Données ouvertes d’IRCC depuis janvier 2023 : demandes reçues, finalisées et approuvées par année, nouveaux citoyens et normes de service tenues, édition 2026.',
    h1: 'Historique d’IRCC : volumes depuis 2023 et normes de service d’une année à l’autre',
    intro: `Les données ouvertes mensuelles d’IRCC vont de ${F.my(first)} à ${F.my(last)} ; IRCC ne publie aucun historique de ses délais de traitement.`,
    resume: `Cette page rassemble l’historique qu’IRCC publie réellement en données ouvertes, sous la Licence du gouvernement ouvert du Canada. IRCC ne publie pas d’historique de ses délais de traitement : l’outil « Vérifier les délais de traitement » n’affiche que le chiffre du jour, si bien qu’aucun délai passé ne peut être cité d’après une source officielle ouverte, et cette page ne s’y essaie pas. Ce qu’IRCC publie, ce sont des volumes mensuels, de ${F.my(first)} à ${F.my(last)} : demandes de résidence temporaire reçues, finalisées et approuvées, visas de visiteur, permis d’études, demandes et admissions de résidence permanente, nouveaux citoyens. En ${py}, il a reçu ${F.n(y('trIn', py))} demandes de résidence temporaire et accueilli ${F.n(y('cit', py))} nouveaux citoyens. L’inventaire des services du gouvernement du Canada ajoute un second historique : pour chaque norme de service, la part des demandes traitées dans les temps. Sur les ${F.n(stds.length)} normes présentées plus bas, IRCC a atteint sa cible pour ${F.n(metCur)} en ${K.fmtFy(fy, 'fr')}, contre ${F.n(metPrev)} en ${K.fmtFy(pfy, 'fr')}.`,
    faqs: [
      { q: 'IRCC publie-t-il les délais de traitement passés ?', a: 'Pas en données ouvertes. L’outil « Vérifier les délais de traitement » de canada.ca n’affiche que le chiffre en cours et le remplace à chaque mise à jour. Pour suivre votre dossier, notez le délai affiché le jour de la demande et gardez-le. Les volumes mensuels et les résultats annuels des normes de service de cette page sont l’historique qu’IRCC publie ouvertement.' },
      { q: 'IRCC a-t-il reçu moins de demandes de résidence temporaire après 2023 ?', a: `En ${YEARS[0]}, IRCC a reçu ${F.n(trIn0)} demandes de résidence temporaire ; en ${py}, ${F.n(trIn1)}. ${partial ? `Sur les ${F.n(nCur)} premiers mois de ${cy}, l’écart des réceptions avec les mêmes mois de ${py} est le suivant : ${F.ch(trInCh)}.` : `En ${cy}, l’écart avec ${py} est de ${F.ch(trInCh)}.`} Ces chiffres couvrent tous les dossiers de résidence temporaire, du visa de visiteur à la prolongation de permis de travail.` },
      { q: 'Quelle norme de service d’IRCC a le plus progressé récemment ?', a: `Entre ${K.fmtFy(pfy, 'fr')} et ${K.fmtFy(fy, 'fr')}, la plus forte hausse concerne la ligne ${lc(nm(best.id, 'fr'))} : ${F.pct(best.s.prev!.perf)} des demandes traitées en ${K.fmtStd(best.s.cur, 'fr')}, puis ${F.pct(best.s.cur.perf)}. Le résultat le plus faible en ${K.fmtFy(fy, 'fr')} est celui de la ligne ${lc(nm(worst.id, 'fr'))}, à ${F.pct(worst.s.cur.perf)}.` },
    ],
    body: (h) => `
<h2>Ce qui existe comme historique, et ce qui manque</h2>
<p>IRCC met régulièrement à jour les délais de son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} et ne garde aucune trace publique des chiffres précédents. Il n’existe pas de jeu de données ouvert des délais passés : cette page n’en reconstitue donc pas. Pour comparer, notez le délai qu’IRCC affiche le jour de votre demande : le calculateur ci-dessus prend ce chiffre et le jour où IRCC a reçu le dossier, et vous dit où vous en êtes aujourd’hui.</p>
<p>Deux historiques officiels sont ouverts. Le premier, ce sont les ${h.src('open-data', 'données opérationnelles mensuelles')} d’IRCC : combien de demandes sont arrivées, combien ont été tranchées et combien approuvées, chaque mois depuis ${h.my(first)}. Le second, c’est l’${h.src('od-std', 'inventaire des services')} du gouvernement du Canada, qui indique chaque année à quelle fréquence IRCC a tenu la norme de traitement fixée pour chaque service. Aucun des deux n’est un délai, mais ensemble ils montrent quand le système était sous pression et s’il a tenu ses propres engagements.</p>
<h2>Année par année</h2>
<p>Le tableau additionne chaque année civile. ${partial ? `La dernière colonne, ${cy}, ne couvre encore que ${h.n(nCur)} mois : l’écart affiché compare donc ces mois aux mêmes mois de ${py}.` : `La colonne d’écart compare ${cy} à ${py}.`} La résidence temporaire regroupe les visas de visiteur, les fiches du visiteur, les permis d’études et de travail et leurs prolongations ; la résidence permanente couvre toutes les catégories économiques, familiales et humanitaires.</p>
${h.table(['Indicateur', ...YEARS, partial ? `${cy} contre ${py}, mêmes mois` : `${cy} contre ${py}`], yearRows(h, 'fr'), `Données ouvertes d’IRCC, ${h.my(first)} à ${h.my(last)}${partial ? ` ; ${cy} couvre ${h.n(nCur)} mois` : ''}. Chiffres arrondis à 5. Source : IRCC, jeux Traitement opérationnel et résidents permanents.`, ['l', ...YEARS.map(() => 'r' as const), 'r'])}
<p>${trDown ? `Les demandes de résidence temporaire reçues sont passées de ${h.n(trIn0)} en ${YEARS[0]} à ${h.n(trIn1)} en ${py}, une période qui comprend le plafond fixé par IRCC pour les nouveaux permis d’études.` : `Les demandes de résidence temporaire reçues sont passées de ${h.n(trIn0)} en ${YEARS[0]} à ${h.n(trIn1)} en ${py}.`} Le mois le plus chargé en nouvelles demandes de résidence temporaire a été ${h.my(trInExt.hi[0])}, avec ${h.n(trInExt.hi[1])}, et le plus calme ${h.my(trInExt.lo[0])}, avec ${h.n(trInExt.lo[1])}. Les demandes de résidence permanente ont culminé en ${h.my(prExt.hi[0])}, à ${h.n(prExt.hi[1])}. La citoyenneté suit son propre rythme : le mois record pour les nouveaux citoyens a été ${h.my(citExt.hi[0])}, avec ${h.n(citExt.hi[1])}, et ${partial ? `l’écart des ${h.n(nCur)} premiers mois de ${cy} avec les mêmes mois de ${py} est le suivant : ${h.ch(citUp)}` : `l’écart de ${cy} avec ${py} est le suivant : ${h.ch(citUp)}`}. Sur la même comparaison, l’écart pour les demandes de résidence permanente est le suivant : ${h.ch(prInCh)}.</p>
<h2>Les deux dernières années, mois par mois</h2>
${h.months(K.MONTHS, [['RT reçues', K.full('trIn')], ['RT finalisées', K.full('trFin')], ['RP reçues', K.full('prIn')], ['Nouveaux citoyens', K.full('cit')]], { max: 24, caption: 'Volumes mensuels d’IRCC, tous pays (RT : résidence temporaire ; RP : résidence permanente). Source : données ouvertes d’IRCC ; chiffres arrondis à 5.' })}
<p>Un mois où les dossiers finalisés dépassent les dossiers reçus est un mois où la file a raccourci ; l’inverse veut dire qu’elle s’est allongée. Cet équilibre, plus qu’un chiffre isolé, est ce qui se traduit ensuite par un délai plus long ou plus court dans l’outil d’IRCC.</p>
<h2>Les normes de service d’une année à l’autre</h2>
<p>Pour chaque norme, IRCC fixe une cible, ${h.pct((stds[0].s.cur.target ?? 0) * 100)} des demandes dans le délai annoncé, et publie la part atteinte. En ${K.fmtFy(fy, 'fr')}, il a atteint la cible pour ${h.n(metCur)} de ces ${h.n(stds.length)} normes, contre ${h.n(metPrev)} en ${K.fmtFy(pfy, 'fr')}. La plus forte hausse concerne la ligne ${lc(nm(best.id, 'fr'))}, avec ${h.n(delta(best), 1)} points de pourcentage de plus ; le résultat le plus faible est celui de la ligne ${lc(nm(worst.id, 'fr'))}, à ${h.pct(worst.s.cur.perf)}.</p>
${h.table(['Service', 'Norme', `Dans la norme, ${K.fmtFy(pfy, 'fr')}`, `Dans la norme, ${K.fmtFy(fy, 'fr')}`, `Demandes, ${K.fmtFy(fy, 'fr')}`], stdRows(h, 'fr'), `Normes de service d’IRCC et résultats par exercice. Source : inventaire des services du gouvernement du Canada, données ouvertes.`, ['l', 'l', 'r', 'r', 'r'])}
${h.mini('delai', { p: ['g', 'n', 'u', 'm', 'd'], d: { g: 'citizenship', m: 'none', c: 'FR' }, t: 'Le délai du jour face à la norme : votre date' })}
<p>Pour aller plus loin sur un pays, la ${h.a('nigeria', 'page Nigeria')} et les autres pages par pays détaillent ces volumes par citoyenneté ; la ${h.a('method', 'page de méthode')} explique comment chaque chiffre est lu et arrondi.</p>
`,
  },
});
