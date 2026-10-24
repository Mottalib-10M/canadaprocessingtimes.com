import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Entrée express, vue d'ensemble : normes de service d'IRCC (Inventaire des services du GC), invitations par
 * programme (candidats invités) et admissions de résidents permanents (données ouvertes, OGL-Canada 2.0).
 * Le délai affiché par IRCC dans son outil n'est pas repris : le lecteur le recopie dans le simulateur. */
const E = K.en, F = K.fr;
const PROGS = ['cec', 'fsw', 'pnp-ee'] as const;
const KEY: Record<(typeof PROGS)[number], string> = { cec: 'cec', fsw: 'fsw', 'pnp-ee': 'pnp' };
const std = Object.fromEntries(PROGS.map((p) => [p, K.stdOf(p)!])) as Record<(typeof PROGS)[number], NonNullable<ReturnType<typeof K.stdOf>>>;
const years = K.EE_YEARS.slice(-4);
const full = K.EE_FULL, cur = K.EE_CUR;
const inv = (y: string, k = 'all') => K.eeYear(y, k);
const prevFull = String(Number(full) - 1);
const chFull = K.pctOf(inv(full) - inv(prevFull), inv(prevFull));
const cecShare = K.pctOf(inv(full, 'cec'), inv(full));
const pnpShare = K.pctOf(inv(full, 'pnp'), inv(full));
const cec12 = K.pr12('cec'), fsw12 = K.pr12('fsw'), qsw12 = K.pr12('qsw'), pnp12 = K.pr12('pnp');
const fedFsw = fsw12.last != null && qsw12.last != null ? fsw12.last - qsw12.last : null;
const best = [...PROGS].sort((a, b) => (std[b].cur.perf ?? 0) - (std[a].cur.perf ?? 0));
const pnpBelow = (std['pnp-ee'].cur.perf ?? 0) < 80;
const top = K.eeTop(full, 3);
// Titre et description disent « six mois » pour les trois programmes : vrai tant que cette garde passe.
if (PROGS.some((p) => std[p].cur.n !== 6 || std[p].cur.u !== 'm')) throw new Error('express-entry : une norme n’est plus de six mois, revoir le texte');

function stdRows(h: Helpers) {
  return PROGS.map((p) => [h.a(K.PAGE_OF[p], K.progName(p, h.lang)), K.fmtStd(std[p].cur, h.lang), `${h.pct(std[p].cur.perf)} (${h.n(std[p].cur.total)})`, std[p].prev ? h.pct(std[p].prev!.perf) : '']);
}
function invRows(h: Helpers) {
  return years.map((y) => [y === cur ? (h.lang === 'fr' ? `${y} (année en cours)` : `${y} (year to date)`) : y, h.n(inv(y, 'cec')), h.n(inv(y, 'fsw')), h.n(inv(y, 'pnp')), h.n(inv(y))]);
}

const chEn = (x: number | null) => (x == null ? 'unchanged' : Math.abs(x) < 0.5 ? 'stable' : `${x > 0 ? 'up' : 'down'} ${K.en.pa(x)}`);
const chFr = (x: number | null) => (x == null ? 'stable' : Math.abs(x) < 0.5 ? 'stable' : `${x > 0 ? 'en hausse' : 'en baisse'} de ${K.fr.pa(x)}`);

export default defineGuide({
  id: 'express-entry', group: 'pr', order: 40,
  tool: 'delai', toolArg: { g: 'cec', only: 'cec,fsw,pnp-ee' },
  related: ['cec', 'fsw', 'pnp', 'express-entry-draws', 'quebec-skilled-worker', 'pr-card'],
  sources: ['ptimes', 'od-std', 'od-ee', 'od-pr', 'express-entry', 'ee-rounds', 'ogl'],
  en: {
    slug: 'express-entry-processing-time',
    nav: 'Express Entry', card: 'CEC, FSW and PNP after the invitation: standards, invitations, admissions',
    title: 'Express Entry Processing Time After an ITA in 2026',
    description: 'Express Entry after an invitation in 2026: IRCC’s six-month standard and how often it is met, invitations by program and a decision date from the time you read.',
    h1: 'Express Entry after the invitation: standard, invitations and your date',
    intro: `IRCC’s service standard for the three Express Entry programs is ${K.fmtStd(std.cec.cur, 'en')}; in ${K.fmtFy(std.cec.fy, 'en')} it met it for ${E.pct(std.cec.cur.perf)} of Canadian Experience Class files.`,
    resume: `Once you have received an invitation and submitted your permanent residence application, IRCC shows the time it expects for your program on its “Check processing times” tool; copy that figure into the calculator above with the day IRCC received your application and you get an estimated decision date. Beside that figure, IRCC publishes as open data a service standard of ${K.fmtStd(std.cec.cur, 'en')} for 80% of electronic applications under the Canadian Experience Class, the Federal Skilled Worker Program and the Express Entry stream of the Provincial Nominee Program. In ${K.fmtFy(std.cec.fy, 'en')} it met that standard for ${E.pct(std.cec.cur.perf)} of ${E.n(std.cec.cur.total)} CEC applications, ${E.pct(std.fsw.cur.perf)} of ${E.n(std.fsw.cur.total)} FSW applications and ${E.pct(std['pnp-ee'].cur.perf)} of ${E.n(std['pnp-ee'].cur.total)} provincial nominee applications. IRCC invited ${E.n(inv(full))} candidates in ${full}, ${E.pct(cecShare)} of them under the Canadian Experience Class, and ${E.n(inv(cur))} so far in ${cur}. From ${E.w12(K.PRD.months)}, ${E.n(cec12.last)} people became permanent residents through the CEC.`,
    faqs: [
      { q: 'When does the Express Entry processing clock start?', a: 'It starts on the day IRCC receives your complete electronic application for permanent residence, after the invitation, not when you create your profile or enter the pool. The time on IRCC’s tool and the six-month service standard both run from that day to the final decision, and they leave out the time needed to give biometrics or answer a request.' },
      { q: 'Do the three Express Entry programs share the same service standard?', a: `Yes. In the service inventory IRCC publishes as open data, the Canadian Experience Class, the Federal Skilled Worker Program and the Express Entry stream for provincial nominees all have a standard of ${K.fmtStd(std.cec.cur, 'en')} for 80% of applications. What differs is how often IRCC meets it: ${E.pct(std[best[0]].cur.perf)} for the best of the three in ${K.fmtFy(std.cec.fy, 'en')}, ${E.pct(std[best[2]].cur.perf)} for the lowest.` },
      { q: 'How many Express Entry invitations did IRCC issue last year?', a: `IRCC’s open data on invited candidates counts ${E.n(inv(full))} invitations in ${full}: ${E.n(inv(full, 'cec'))} under the Canadian Experience Class, ${E.n(inv(full, 'fsw'))} under the Federal Skilled Worker Program and ${E.n(inv(full, 'pnp'))} for provincial nominees. Figures are rounded to the nearest 5. The round-by-round list, with dates and cut-off scores, is on IRCC’s rounds page.` },
      { q: 'Can I see the queue for my Express Entry month of filing on this site?', a: 'No. IRCC shows that queue on its own processing times tool, and this site does not copy it. Open IRCC’s tool for your program, note the time it shows, then enter it here with your filing date: the calculator gives the estimated decision date, the share of the time already elapsed and the days left.' },
    ],
    body: (h) => `
<h2>From the time IRCC shows to your decision date</h2>
<p>After an invitation to apply, the wait that matters is the one between the day IRCC receives your permanent residence application and its decision. IRCC shows that time for each program on its ${h.src('ptimes', 'Check processing times tool')}, where it is a forward-looking figure: what IRCC expects for an application received today, given the files already waiting. This site does not reproduce it. Copy it into the calculator with its unit and your filing date. A time in months is added as calendar months, so an application received on the 31st lands on the last day of a shorter month rather than drifting by a few days.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'cec', m: 'none' }, t: 'Your Express Entry application: estimated decision date' })}
<h2>One standard for three programs</h2>
<p>IRCC sets a service standard for each Express Entry program and reports every year how many applications it processed within it, in the Government of Canada service inventory released as ${h.src('od-std', 'open data')}. The three programs share the same target, ${K.fmtStd(std.cec.cur, 'en')} for 80% of electronic applications. The provincial nominee standard covers only IRCC’s federal stage: the time the province takes to nominate you comes before it.</p>
${h.table(['Program', 'Service standard', `Within the standard, ${K.fmtFy(std.cec.fy, 'en')}`, K.fmtFy(std.cec.pfy!, 'en')], stdRows(h), `IRCC service standards for Express Entry and share of applications processed within them. Source: GC Service Inventory, open data.`, ['l', 'r', 'r', 'r'])}
<p>The ${h.a(K.PAGE_OF[best[0]], K.progName(best[0], 'en'))} had the best result in ${K.fmtFy(std.cec.fy, 'en')}, at ${h.pct(std[best[0]].cur.perf)}. ${pnpBelow ? `Provincial nominees coming through Express Entry stayed under the 80% target, at ${h.pct(std['pnp-ee'].cur.perf)}, a reminder that a nomination adds checks of its own.` : `Provincial nominees coming through Express Entry reached ${h.pct(std['pnp-ee'].cur.perf)}, above the 80% target.`} These are yearly results for all files, so they say nothing about your own application, but they show whether the time on IRCC’s tool is close to the target or far from it.</p>
<h2>Invitations by program</h2>
<p>IRCC’s open data on ${h.src('od-ee', 'invited candidates')} counts invitations by year and by the program under which each candidate was invited. The table covers the last four years; ${cur} is still under way. The round-by-round list, with dates, categories and minimum scores, stays on ${h.src('ee-rounds', 'IRCC’s rounds of invitations page')}, and the ${h.a('express-entry-draws', 'invitations by score band')} page breaks these totals down by score.</p>
${h.table(['Year', 'Canadian Experience Class', 'Federal Skilled Worker', 'Provincial nominees', 'All programs'], invRows(h), 'Express Entry candidates invited, by program. Source: IRCC, Express Entry invited candidates, open data; figures rounded to 5.', ['l', 'r', 'r', 'r', 'r'])}
<p>In ${full}, IRCC invited ${h.n(inv(full))} candidates, ${chFull != null && chFull < 0 ? `${h.pa(chFull)} fewer than` : `${h.pa(chFull)} more than`} in ${prevFull}. The Canadian Experience Class took ${h.pct(cecShare)} of them and provincial nominees ${h.pct(pnpShare)}. By citizenship, the largest groups invited in ${full} were citizens of ${h.cn(top[0][0])}, ${h.cn(top[1][0])} and ${h.cn(top[2][0])}.</p>
<h2>After the decision: admissions</h2>
<p>An approved application ends with a confirmation of permanent residence and, once you land or confirm in Canada, an admission counted in IRCC’s ${h.src('od-pr', 'permanent residents open data')}. From ${h.w12(K.PRD.months)}, ${h.n(cec12.last)} people were admitted under the Canadian Experience Class, ${h.lang === 'fr' ? chFr(cec12.change) : chEn(cec12.change)} on the twelve months before, and ${h.n(fedFsw)} skilled workers were admitted outside Quebec. Those counts include spouses and children who came with the principal applicant, and they mix Express Entry with other routes for provincial nominees (${h.n(pnp12.last)} admissions in all), so they are a measure of the flow, not of the time.</p>
<h2>What can stretch the wait</h2>
<p>The clock runs from a complete application. An incomplete upload can lead IRCC to return it, and a new submission restarts the count. Biometrics, a medical exam or a police certificate requested later add their own delay. If you change jobs or a family member is added, tell IRCC: updates can lengthen the review but hiding them is worse. Past the date the calculator gives, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} explain how to check your status and when to write to IRCC.</p>
`,
  },
  fr: {
    slug: 'delai-entree-express',
    nav: 'Entrée express', card: 'CEC, TQF et candidats des provinces : normes, invitations, admissions',
    title: 'Délai de l’Entrée express après l’invitation en 2026',
    description: 'Entrée express après l’invitation en 2026 : norme de six mois d’IRCC et taux de respect, invitations par programme et date de décision selon le délai lu.',
    h1: 'Entrée express après l’invitation : norme, invitations et votre date',
    intro: `La norme de service d’IRCC pour les trois programmes de l’Entrée express est de ${K.fmtStd(std.cec.cur, 'fr')} ; en ${K.fmtFy(std.cec.fy, 'fr')}, elle a été tenue pour ${F.pct(std.cec.cur.perf)} des dossiers de l’expérience canadienne.`,
    resume: `Une fois l’invitation reçue et la demande de résidence permanente envoyée, IRCC affiche dans son outil « Vérifier les délais de traitement » le délai qu’il prévoit pour votre programme ; recopiez ce chiffre dans le calculateur ci-dessus avec le jour où IRCC a reçu votre demande et vous obtenez une date de décision estimée. À côté de ce chiffre, IRCC publie en données ouvertes une norme de service de ${K.fmtStd(std.cec.cur, 'fr')} pour 80 % des demandes électroniques de la catégorie de l’expérience canadienne, du Programme des travailleurs qualifiés du fédéral et du volet Entrée express des candidats des provinces. En ${K.fmtFy(std.cec.fy, 'fr')}, la norme a été tenue pour ${F.pct(std.cec.cur.perf)} des ${F.n(std.cec.cur.total)} demandes de l’expérience canadienne, ${F.pct(std.fsw.cur.perf)} des ${F.n(std.fsw.cur.total)} demandes de travailleurs qualifiés et ${F.pct(std['pnp-ee'].cur.perf)} des ${F.n(std['pnp-ee'].cur.total)} demandes de candidats des provinces. IRCC a invité ${F.n(inv(full))} candidats en ${full}, dont ${F.pct(cecShare)} au titre de l’expérience canadienne, et ${F.n(inv(cur))} depuis le début de ${cur}. De ${F.w12(K.PRD.months)}, ${F.n(cec12.last)} personnes sont devenues résidents permanents par l’expérience canadienne.`,
    faqs: [
      { q: 'À partir de quand court le délai de l’Entrée express ?', a: 'Il court à partir du jour où IRCC reçoit votre demande électronique complète de résidence permanente, après l’invitation, et non à la création du profil ou à l’entrée dans le bassin. Le délai de l’outil d’IRCC comme la norme de six mois vont de ce jour à la décision finale, sans compter la biométrie ni les réponses à une demande de documents.' },
      { q: 'Les trois programmes de l’Entrée express ont-ils la même norme de service ?', a: `Oui. Dans l’inventaire des services publié en données ouvertes, l’expérience canadienne, les travailleurs qualifiés du fédéral et le volet Entrée express des candidats des provinces ont tous une norme de ${K.fmtStd(std.cec.cur, 'fr')} pour 80 % des demandes. Ce qui change, c’est la fréquence à laquelle IRCC la tient : ${F.pct(std[best[0]].cur.perf)} pour le meilleur des trois en ${K.fmtFy(std.cec.fy, 'fr')}, ${F.pct(std[best[2]].cur.perf)} pour le plus bas.` },
      { q: 'Combien d’invitations de l’Entrée express IRCC a-t-il envoyées l’an dernier ?', a: `Les données ouvertes sur les candidats invités comptent ${F.n(inv(full))} invitations en ${full} : ${F.n(inv(full, 'cec'))} au titre de l’expérience canadienne, ${F.n(inv(full, 'fsw'))} pour les travailleurs qualifiés du fédéral et ${F.n(inv(full, 'pnp'))} pour les candidats des provinces. Les chiffres sont arrondis à 5 près. La liste ronde par ronde, avec dates et scores minimaux, se trouve sur la page des rondes d’IRCC.` },
      { q: 'Ce site montre-t-il la file d’attente de mon mois de dépôt à l’Entrée express ?', a: 'Non. IRCC affiche cette file dans son propre outil de délais, et ce site ne la recopie pas. Ouvrez l’outil d’IRCC pour votre programme, notez le délai indiqué, puis saisissez-le ici avec votre date de dépôt : le calculateur donne la date de décision estimée, la part du délai déjà écoulée et les jours qui restent.' },
    ],
    body: (h) => `
<h2>Du délai affiché par IRCC à votre date de décision</h2>
<p>Après une invitation à présenter une demande, l’attente qui compte va du jour où IRCC reçoit votre demande de résidence permanente jusqu’à sa décision. IRCC affiche ce délai pour chaque programme dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}, où c’est un chiffre prospectif : ce qu’il prévoit pour une demande reçue aujourd’hui, compte tenu des dossiers déjà en attente. Ce site ne le reproduit pas. Recopiez-le dans le calculateur avec son unité et votre date de dépôt. Un délai en mois s’ajoute en mois de calendrier : une demande reçue un 31 tombe sur le dernier jour d’un mois plus court au lieu de glisser de quelques jours.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'cec', m: 'none' }, t: 'Votre demande d’Entrée express : date de décision estimée' })}
<h2>Une seule norme pour trois programmes</h2>
<p>IRCC fixe une norme de service pour chaque programme de l’Entrée express et publie chaque année le nombre de demandes traitées dans ce délai, dans l’inventaire des services du gouvernement du Canada diffusé en ${h.src('od-std', 'données ouvertes')}. Les trois programmes ont la même cible, ${K.fmtStd(std.cec.cur, 'fr')} pour 80 % des demandes électroniques. Pour les candidats des provinces, la norme ne couvre que l’étape fédérale d’IRCC : le temps que met la province à vous désigner vient avant.</p>
${h.table(['Programme', 'Norme de service', `Dans la norme, ${K.fmtFy(std.cec.fy, 'fr')}`, K.fmtFy(std.cec.pfy!, 'fr')], stdRows(h), 'Normes de service d’IRCC pour l’Entrée express et part des demandes traitées dans la norme. Source : Inventaire des services du GC, données ouvertes.', ['l', 'r', 'r', 'r'])}
<p>En ${K.fmtFy(std.cec.fy, 'fr')}, le meilleur résultat revient au programme « ${h.a(K.PAGE_OF[best[0]], K.progName(best[0], 'fr'))} », à ${h.pct(std[best[0]].cur.perf)}. ${pnpBelow ? `Les candidats des provinces passés par l’Entrée express sont restés sous la cible de 80 %, à ${h.pct(std['pnp-ee'].cur.perf)} : une désignation ajoute ses propres vérifications.` : `Les candidats des provinces passés par l’Entrée express ont atteint ${h.pct(std['pnp-ee'].cur.perf)}, au-dessus de la cible de 80 %.`} Ce sont des résultats annuels sur l’ensemble des dossiers : ils ne disent rien du vôtre, mais ils montrent si le délai de l’outil d’IRCC est proche de la cible ou loin derrière.</p>
<h2>Les invitations par programme</h2>
<p>Les données ouvertes d’IRCC sur les ${h.src('od-ee', 'candidats invités')} comptent les invitations par année et par programme d’invitation. Le tableau couvre les quatre dernières années ; ${cur} est en cours. La liste ronde par ronde, avec dates, catégories et scores minimaux, reste sur la ${h.src('ee-rounds', 'page des rondes d’invitations d’IRCC')}, et la page des ${h.a('express-entry-draws', 'invitations par tranche de score')} détaille ces totaux selon le score.</p>
${h.table(['Année', 'Expérience canadienne', 'Travailleurs qualifiés du fédéral', 'Candidats des provinces', 'Tous programmes'], invRows(h), 'Candidats de l’Entrée express invités, par programme. Source : IRCC, Entrée express, candidats invités, données ouvertes ; chiffres arrondis à 5.', ['l', 'r', 'r', 'r', 'r'])}
<p>En ${full}, IRCC a invité ${h.n(inv(full))} candidats, ${chFull != null && chFull < 0 ? `soit ${h.pa(chFull)} de moins` : `soit ${h.pa(chFull)} de plus`} qu’en ${prevFull}. L’expérience canadienne en a reçu ${h.pct(cecShare)} et les candidats des provinces ${h.pct(pnpShare)}. Par citoyenneté, les trois groupes les plus nombreux invités en ${full} viennent, dans cet ordre, des pays suivants : ${h.cn(top[0][0])}, ${h.cn(top[1][0])} et ${h.cn(top[2][0])}.</p>
<h2>Après la décision : les admissions</h2>
<p>Une demande acceptée se termine par une confirmation de résidence permanente puis, à l’arrivée ou à la confirmation au Canada, par une admission comptée dans les ${h.src('od-pr', 'données ouvertes sur les résidents permanents')}. De ${h.w12(K.PRD.months)}, ${h.n(cec12.last)} personnes ont été admises au titre de l’expérience canadienne, ${h.lang === 'fr' ? chFr(cec12.change) : chEn(cec12.change)} par rapport aux douze mois d’avant, et ${h.n(fedFsw)} travailleurs qualifiés ont été admis hors du Québec. Ces nombres comprennent les époux et enfants arrivés avec le demandeur principal et, pour les candidats des provinces (${h.n(pnp12.last)} admissions en tout), mêlent l’Entrée express aux autres voies : ils mesurent le flux, pas le délai.</p>
<h2>Ce qui peut allonger l’attente</h2>
<p>Le compteur part d’une demande complète. Un document manquant peut amener IRCC à renvoyer la demande, et un nouvel envoi remet le compteur à zéro. La biométrie, un examen médical ou un certificat de police demandés plus tard ajoutent leur propre délai. Un changement d’emploi ou un nouveau membre de la famille doit être déclaré : la mise à jour peut allonger l’examen, mais la taire serait pire. Une fois passée la date du calculateur, les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} expliquent comment vérifier l’état du dossier et quand écrire à IRCC.</p>
`,
  },
});
