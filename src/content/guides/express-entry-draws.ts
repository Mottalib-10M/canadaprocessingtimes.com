import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Invitations d'Entrée express par année, programme et tranche de score CRS, d'après les données ouvertes
 * « candidats invités » d'IRCC (OGL-Canada 2.0). La liste ronde par ronde (dates, tailles, scores minimaux)
 * reste sur la page des rondes d'IRCC : elle n'est pas reproduite ici. */
const E = K.en, F = K.fr;
const full = K.EE_FULL, cur = K.EE_CUR, prevFull = String(Number(full) - 1);
const order = K.EED.bandOrder;
const at = (b: string) => { const i = order.indexOf(b); if (i < 0) throw new Error(`tranche absente : ${b}`); return i; };
const sum = (v: number[], from: number, to = v.length) => v.slice(from, to).reduce((a, x) => a + x, 0);
const share = (y: string, k: string, from: number, to?: number) => K.pctOf(sum(K.eeBands(y, k), from, to), K.eeYear(y, k));
const i451 = at('451-500'), i501 = at('501-600'), i601 = at('601-700');
/** Tranche qui a reçu le plus d'invitations. */
const mode = (y: string, k: string) => { const v = K.eeBands(y, k); return order[v.indexOf(Math.max(...v))]; };
/** Tranche la plus basse où le programme a reçu des invitations. */
const lowest = (y: string, k: string) => order[K.eeBands(y, k).findIndex((x) => x > 0)];
const hi = { full: share(full, 'all', i601), cur: share(cur, 'all', i601) };
const below451 = { full: share(full, 'all', 0, i451), cur: share(cur, 'all', 0, i451) };
const cecTop = share(full, 'cec', i501, i601), fswLow = share(full, 'fsw', 0, i501);
const pnpLow = lowest(full, 'pnp');
if (Number(pnpLow.split('-')[0]) < 601) throw new Error('express-entry-draws : des candidats des provinces invités sous 601 points, revoir le texte');
const s480 = K.eeBandShare(full, 'all', 480);
const chFull = K.pctOf(K.eeYear(full) - K.eeYear(prevFull), K.eeYear(prevFull));
const top = K.eeTop(full, 3);
const years = K.EE_YEARS.slice(-4);
const bl = (b: string, l: 'en' | 'fr') => b.replace('-', l === 'fr' ? ' à ' : ' to ');

function bandRows(h: Helpers) {
  const cols: Array<[string, string]> = [[full, 'all'], [cur, 'all'], [full, 'cec'], [full, 'fsw'], [full, 'pnp']];
  return order.map((b, i) => [bl(b, h.lang), ...cols.map(([y, k]) => K.eeBands(y, k)[i])] as const)
    .filter((r) => r.slice(1).some((x) => (x as number) > 0)).reverse().map((r) => [r[0], ...r.slice(1).map((x) => h.n(x as number))]);
}
function yearRows(h: Helpers) {
  return years.map((y) => [y === cur ? (h.lang === 'fr' ? `${y} (en cours)` : `${y} (to date)`) : y, h.n(K.eeYear(y)), h.pct(share(y, 'all', 0, i451)), h.pct(share(y, 'all', i451, i601)), h.pct(share(y, 'all', i601)), bl(mode(y, 'all'), h.lang)]);
}

export default defineGuide({
  id: 'express-entry-draws', group: 'tools', order: 70,
  tool: 'entree', toolArg: { crs: 480, k: 'all' },
  related: ['express-entry', 'cec', 'fsw', 'pnp', 'history', 'method'],
  sources: ['od-ee', 'ee-rounds', 'express-entry', 'ogl'],
  en: {
    slug: 'express-entry-draws',
    nav: 'Express Entry draws', card: 'Invitations by year, program and CRS score band, and where your score falls',
    title: 'Express Entry Invitations by CRS Score Band in 2026',
    description: 'Express Entry invitations in 2026 by year, program and CRS score band, from IRCC open data: see what share of invited candidates scored below or above yours.',
    h1: 'Express Entry invitations by year, program and score band',
    intro: `In ${full}, IRCC invited ${E.n(K.eeYear(full))} Express Entry candidates; the band that received the most invitations was ${bl(mode(full, 'all'), 'en')} points.`,
    resume: `IRCC publishes as open data the number of Express Entry candidates it invited each year, broken down by the program under which they were invited and by CRS score band. In ${full}, the last full year, it invited ${E.n(K.eeYear(full))} candidates, ${chFull != null && chFull < 0 ? `${E.pa(chFull)} fewer than` : `${E.pa(chFull)} more than`} in ${prevFull}: ${E.n(K.eeYear(full, 'cec'))} under the Canadian Experience Class, ${E.n(K.eeYear(full, 'fsw'))} under the Federal Skilled Worker Program and ${E.n(K.eeYear(full, 'pnp'))} provincial nominees. ${E.pct(below451.full)} of those invitations went to scores under 451 and ${E.pct(hi.full)} to scores above 600, almost all of them nominees whose nomination added points. For a score of 480, ${E.pct(s480.below)} of the ${full} invitations went to lower bands and ${E.pct(s480.above)} to higher ones. So far in ${cur}, IRCC has invited ${E.n(K.eeYear(cur))} candidates. Enter your own score above to place it.`,
    faqs: [
      { q: 'What does the share below my CRS band actually tell me?', a: 'It tells you how many of the year’s invitations went to candidates who scored less than you, across all rounds. A high share means many rounds reached below your score, often through category-based draws. It is not a probability of being invited: each round has its own cut-off, category and size, set by IRCC on the day.' },
      { q: 'Why do Express Entry scores above 600 belong almost only to provincial nominees?', a: `A provincial nomination obtained through an Express Entry stream adds 600 points to the CRS score, which lifts a nominee far above other candidates. In IRCC’s ${full} data, provincial nominee invitations start in the ${bl(pnpLow, 'en')} band, while Canadian Experience Class and Federal Skilled Worker invitations sit almost entirely below 601.` },
      { q: 'Where can I find the date and cut-off score of each Express Entry round?', a: 'On IRCC’s rounds of invitations page, which lists every round with its date, category, number of invitations and minimum score. This site does not copy that list. It works from IRCC’s yearly open data on invited candidates, which counts invitations by program, score band and citizenship.' },
      { q: 'Are the Express Entry invitation counts exact?', a: `No. IRCC rounds each figure in its open data on invited candidates to the nearest 5, so small bands can show 0 or 5 when a handful of people were invited. Totals by year and program are therefore close but not exact. The ${cur} figures cover only the months IRCC has published so far.` },
    ],
    body: (h) => `
<h2>What this page measures</h2>
<p>Each Express Entry round invites candidates above a minimum Comprehensive Ranking System score, sometimes among all candidates, sometimes within a category such as French speakers or a group of occupations. IRCC lists each round on its ${h.src('ee-rounds', 'rounds of invitations page')}. Separately, it publishes as ${h.src('od-ee', 'open data')} the number of candidates invited over a whole year, by program and by score band. That yearly view is what this page uses: it does not tell you the cut-off of the next round, but it shows where invitations actually went once every round of the year is added up.</p>
${h.mini('entree', { p: ['crs', 'k'], d: { crs: 480, k: 'all' }, t: 'Your CRS score against last year’s invitations' })}
<h2>Invitations by score band</h2>
<p>The table gives the count of invited candidates in each band for ${full} and for ${cur} so far, then for ${full} by program. Bands with no invitation in any column are left out.</p>
${h.table(['CRS band', `All, ${full}`, `All, ${cur}`, `CEC, ${full}`, `FSW, ${full}`, `Nominees, ${full}`], bandRows(h), 'Express Entry candidates invited, by CRS score band. Source: IRCC, Express Entry invited candidates, open data; figures rounded to 5.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>In ${full}, the Canadian Experience Class drew ${h.pct(cecTop)} of its invitations from the ${bl('501-600', 'en')} band, while ${h.pct(fswLow)} of Federal Skilled Worker invitations went to scores under 501. That gap follows from how the rounds were run: candidates with Canadian work experience tend to score higher, and category rounds can reach further down the ranking for a targeted group. Provincial nominees start at ${bl(pnpLow, 'en')}, the effect of the points a nomination adds.</p>
<h2>Year by year</h2>
<p>The same data over four years shows how the spread of scores moves as IRCC changes the size and type of its rounds.</p>
${h.table(['Year', 'Invitations', 'Under 451', '451 to 600', 'Above 600', 'Busiest band'], yearRows(h), 'Express Entry invitations by year and score range. Source: IRCC open data; shares computed by this site.', ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>The share of invitations under 451 went ${below451.cur != null && below451.full != null && below451.cur > below451.full ? 'up' : 'down'} from ${h.pct(below451.full)} in ${full} to ${h.pct(below451.cur)} in ${cur} so far, and the share above 600 went ${hi.cur != null && hi.full != null && hi.cur > hi.full ? 'up' : 'down'} from ${h.pct(hi.full)} to ${h.pct(hi.cur)}. A partial year can still shift as later rounds are added, so read ${cur} as a trend in progress. A rising share at the low end usually means more category rounds, which invite a targeted group at a lower cut-off than general rounds.</p>
<h2>Reading your score against these counts</h2>
<p>The calculator places your score in its band and adds up the invitations below, inside and above it for the year and program you choose. If most invitations of a year went to bands under yours, your score was competitive that year for that program; if most went above, you would have needed a category round or more points. Points can still move: a language test retaken, a further year of skilled work, a spouse’s credentials or a job offer can each shift your band. The score that counts is the one on the day of a round, not the one you entered when you joined.</p>
<h2>Who was invited</h2>
<p>By citizenship, the three largest groups invited in ${full} were citizens of ${h.cn(top[0][0])}, ${h.cn(top[1][0])} and ${h.cn(top[2][0])}, with ${h.n(top[0][1])}, ${h.n(top[1][1])} and ${h.n(top[2][1])} invitations. These counts cover principal applicants only: spouses and children are added later, when the permanent residence application is filed.</p>
<h2>After the invitation</h2>
<p>An invitation gives you a fixed window to submit a complete application; the processing time starts only once IRCC receives it. For that stage, the ${h.a('express-entry', 'Express Entry processing time')} page sets out IRCC’s service standard and turns the time shown on IRCC’s ${h.src('ptimes', 'Check processing times tool')} into a date. The ${h.a('cec', 'Canadian Experience Class')}, ${h.a('fsw', 'Federal Skilled Worker')} and ${h.a('pnp', 'provincial nominee')} pages give the detail by program.</p>
`,
  },
  fr: {
    slug: 'rondes-entree-express',
    nav: 'Rondes d’Entrée express', card: 'Invitations par année, programme et tranche de score SCG, et la place de votre score',
    title: 'Rondes d’Entrée express par tranche de score en 2026',
    description: 'Rondes d’Entrée express en 2026 : invitations par année, programme et tranche de score SCG selon les données ouvertes d’IRCC, et la part allée sous votre score.',
    h1: 'Invitations de l’Entrée express par année, programme et tranche de score',
    intro: `En ${full}, IRCC a invité ${F.n(K.eeYear(full))} candidats de l’Entrée express ; la tranche qui a reçu le plus d’invitations est celle de ${bl(mode(full, 'all'), 'fr')} points.`,
    resume: `IRCC publie en données ouvertes le nombre de candidats de l’Entrée express invités chaque année, ventilé par programme d’invitation et par tranche de score du Système de classement global. En ${full}, dernière année complète, il a invité ${F.n(K.eeYear(full))} candidats, ${chFull != null && chFull < 0 ? `soit ${F.pa(chFull)} de moins` : `soit ${F.pa(chFull)} de plus`} qu’en ${prevFull} : ${F.n(K.eeYear(full, 'cec'))} au titre de l’expérience canadienne, ${F.n(K.eeYear(full, 'fsw'))} pour les travailleurs qualifiés du fédéral et ${F.n(K.eeYear(full, 'pnp'))} candidats des provinces. ${F.pct(below451.full)} de ces invitations sont allées à des scores inférieurs à 451 et ${F.pct(hi.full)} à des scores au-dessus de 600, presque tous des candidats désignés par une province. Pour un score de 480, ${F.pct(s480.below)} des invitations de ${full} sont allées à des tranches plus basses et ${F.pct(s480.above)} à des tranches plus hautes. Depuis le début de ${cur}, IRCC a invité ${F.n(K.eeYear(cur))} candidats. Saisissez votre score ci-dessus pour le situer.`,
    faqs: [
      { q: 'Que m’apprend la part des invitations sous ma tranche de score SCG ?', a: 'Elle indique combien d’invitations de l’année sont allées à des candidats moins bien classés que vous, toutes rondes confondues. Une part élevée signifie que beaucoup de rondes sont descendues sous votre score, souvent par des rondes ciblées. Ce n’est pas une probabilité d’invitation : chaque ronde a son propre seuil, sa catégorie et sa taille, fixés par IRCC le jour même.' },
      { q: 'Pourquoi les scores au-dessus de 600 sont-ils presque tous des candidats des provinces ?', a: `Une désignation provinciale obtenue par un volet Entrée express ajoute 600 points au score SCG, ce qui place le candidat désigné très au-dessus des autres. Dans les données d’IRCC pour ${full}, les invitations de candidats des provinces commencent à la tranche ${bl(pnpLow, 'fr')}, alors que celles de l’expérience canadienne et des travailleurs qualifiés restent presque toutes sous 601.` },
      { q: 'Où trouver la date et le score minimal de chaque ronde d’Entrée express ?', a: 'Sur la page des rondes d’invitations d’IRCC, qui donne chaque ronde avec sa date, sa catégorie, son nombre d’invitations et son score minimal. Ce site ne recopie pas cette liste. Il s’appuie sur les données ouvertes annuelles d’IRCC sur les candidats invités, comptés par programme, tranche de score et citoyenneté.' },
      { q: 'Les nombres d’invitations de l’Entrée express sont-ils exacts ?', a: `Non. IRCC arrondit chaque chiffre de ses données ouvertes sur les candidats invités à 5 près : une petite tranche peut afficher 0 ou 5 quand quelques personnes seulement ont été invitées. Les totaux par année et par programme sont donc proches, sans être exacts. Les chiffres de ${cur} ne couvrent que les mois déjà publiés.` },
    ],
    body: (h) => `
<h2>Ce que mesure cette page</h2>
<p>Chaque ronde de l’Entrée express invite les candidats au-dessus d’un score minimal du Système de classement global, parfois parmi tous les candidats, parfois dans une catégorie comme les francophones ou un groupe de professions. IRCC publie chaque ronde sur sa ${h.src('ee-rounds', 'page des rondes d’invitations')}. À part, il diffuse en ${h.src('od-ee', 'données ouvertes')} le nombre de candidats invités sur une année entière, par programme et par tranche de score. C’est cette vue annuelle que la page utilise : elle ne donne pas le seuil de la prochaine ronde, mais elle montre où sont réellement allées les invitations une fois toutes les rondes de l’année additionnées.</p>
${h.mini('entree', { p: ['crs', 'k'], d: { crs: 480, k: 'all' }, t: 'Votre score SCG face aux invitations de l’an dernier' })}
<h2>Les invitations par tranche de score</h2>
<p>Le tableau donne le nombre de candidats invités dans chaque tranche pour ${full} et pour ${cur} jusqu’ici, puis pour ${full} par programme. Les tranches sans aucune invitation sont omises.</p>
${h.table(['Tranche SCG', `Tous, ${full}`, `Tous, ${cur}`, `Exp. canadienne, ${full}`, `TQF, ${full}`, `Provinces, ${full}`], bandRows(h), 'Candidats de l’Entrée express invités, par tranche de score SCG. Source : IRCC, Entrée express, candidats invités, données ouvertes ; chiffres arrondis à 5.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>En ${full}, l’expérience canadienne a tiré ${h.pct(cecTop)} de ses invitations de la tranche ${bl('501-600', 'fr')}, tandis que ${h.pct(fswLow)} des invitations des travailleurs qualifiés du fédéral sont allées à des scores inférieurs à 501. L’écart tient à la façon dont les rondes ont été menées : les candidats qui ont une expérience de travail au Canada obtiennent en général plus de points, et les rondes ciblées peuvent descendre plus bas dans le classement pour un groupe donné. Les candidats des provinces commencent à ${bl(pnpLow, 'fr')}, effet des points qu’apporte la désignation.</p>
<h2>Année par année</h2>
<p>Les mêmes données sur quatre ans montrent comment la répartition des scores bouge quand IRCC change la taille et le type de ses rondes.</p>
${h.table(['Année', 'Invitations', 'Sous 451', '451 à 600', 'Au-dessus de 600', 'Tranche la plus fournie'], yearRows(h), 'Invitations de l’Entrée express par année et par plage de score. Source : données ouvertes d’IRCC ; parts calculées par ce site.', ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>La part des invitations sous 451 est ${below451.cur != null && below451.full != null && below451.cur > below451.full ? 'montée' : 'descendue'} de ${h.pct(below451.full)} en ${full} à ${h.pct(below451.cur)} en ${cur} jusqu’ici, et la part au-dessus de 600 est ${hi.cur != null && hi.full != null && hi.cur > hi.full ? 'montée' : 'descendue'} de ${h.pct(hi.full)} à ${h.pct(hi.cur)}. Une année partielle peut encore bouger avec les rondes suivantes : lisez ${cur} comme une tendance en cours.</p>
<h2>Lire votre score face à ces nombres</h2>
<p>Le calculateur place votre score dans sa tranche et additionne les invitations allées sous elle, dans elle et au-dessus, pour l’année et le programme choisis. Si la plupart des invitations d’une année sont allées à des tranches inférieures à la vôtre, votre score était compétitif cette année-là pour ce programme ; si elles sont allées au-dessus, il aurait fallu une ronde ciblée ou davantage de points. Les points peuvent encore bouger : un test de langue repassé, une année de plus de travail qualifié, les diplômes d’un époux ou une offre d’emploi peuvent chacun changer votre tranche. Le score qui compte est celui du jour de la ronde, pas celui saisi à l’entrée dans le bassin.</p>
<h2>Qui a été invité</h2>
<p>Par citoyenneté, les trois groupes les plus nombreux invités en ${full} viennent, dans cet ordre, des pays suivants : ${h.cn(top[0][0])}, ${h.cn(top[1][0])} et ${h.cn(top[2][0])}, avec ${h.n(top[0][1])}, ${h.n(top[1][1])} et ${h.n(top[2][1])} invitations. Ces nombres ne comptent que les demandeurs principaux : époux et enfants s’ajoutent plus tard, au dépôt de la demande de résidence permanente.</p>
<h2>Après l’invitation</h2>
<p>Une invitation ouvre un délai fixe pour envoyer une demande complète ; le délai de traitement ne commence qu’à sa réception par IRCC. Pour cette étape, la page du ${h.a('express-entry', 'délai de l’Entrée express')} présente la norme de service d’IRCC et transforme le délai affiché par l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} en une date. Les pages ${h.a('cec', 'expérience canadienne')}, ${h.a('fsw', 'travailleurs qualifiés du fédéral')} et ${h.a('pnp', 'candidats des provinces')} détaillent chaque programme.</p>
`,
  },
});
