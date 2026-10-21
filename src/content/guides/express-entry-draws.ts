import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { CATS, type Cat, type Round } from '../../lib/engine/times';

/* Rondes d'Entrée express (ee.json), toutes calculées au build : aucune valeur tapée à la main. */
const R = K.ROUNDS;
const since = `${Number(K.READ.slice(0, 4)) - 1}${K.READ.slice(4)}`;
const last = R[0];
const lastCat = K.catOf(last.name);
const year = R.filter((r) => r.date >= since);
const yearTotal = year.reduce((a, r) => a + r.size, 0);
const scored = (l: Round[]) => l.filter((r) => typeof r.crs === 'number') as Array<Round & { crs: number }>;
const st = (c: Cat) => K.eeStats(R, c, 0, since);
const hi = (c: Cat) => Math.max(...scored(st(c).list).map((r) => r.crs));
const present = CATS.filter((c) => st(c).n > 0).sort((a, b) => st(b).total - st(a).total);
const years = [...new Set(R.map((r) => r.date.slice(0, 4)))].sort();
const inYear = (y: string) => R.filter((r) => r.date.startsWith(y));
const sumOf = (l: Round[]) => l.reduce((a, r) => a + r.size, 0);
const oldest = R[R.length - 1];
const cec = st('cec'), pnp = st('pnp'), fr = st('french');
const lastGeneral = R.find((r) => K.catOf(r.name) === 'general');
const fswOnly = R.filter((r) => K.catOf(r.name) === 'fsw').length;
const biggest = year.reduce((a, r) => (r.size > a.size ? r : a), year[0]);
const firstY = years[0], lastY = years[years.length - 1];
const E = K.en, F = K.fr;

function catRows(h: Helpers) {
  return present.map((c) => {
    const s = st(c);
    return [K.catName(c, h.lang), s.n, s.total, s.lowest ? `${s.lowest.crs} (${h.day(s.lowest.date)})` : '', String(hi(c)), s.last ? h.day(s.last.date) : ''];
  });
}
function yearRows(h: Helpers) {
  return years.map((y) => { const l = inYear(y); const sc = scored(l).map((r) => r.crs); return [y, l.length, sumOf(l), sc.length ? `${Math.min(...sc)} · ${Math.max(...sc)}` : '']; });
}
function lastRows(h: Helpers) {
  return R.slice(0, 10).map((r) => [h.day(r.date), String(r.n), K.catName(K.catOf(r.name), h.lang), r.size, typeof r.crs === 'number' ? String(r.crs) : '']);
}

export default defineGuide({
  id: 'express-entry-draws', group: 'tools', order: 70,
  tool: 'entree', toolArg: { crs: 480, k: 'all' },
  related: ['express-entry', 'cec', 'fsw', 'pnp', 'history', 'method'],
  sources: ['ee-rounds', 'ee-data', 'express-entry'],
  en: {
    slug: 'express-entry-draws',
    nav: 'Express Entry draws', card: 'Every round since 2024, cut-offs by category',
    title: 'Express Entry Draws: Cut-offs and Invitations by Round 2026',
    description: 'Express Entry draws in 2026: latest round, lowest and highest cut-off by category over 12 months, invitations per year since 2024, from IRCC’s rounds file.',
    h1: 'Express Entry draws, round by round',
    intro: `The latest round in IRCC’s file is number ${last.n}, held on ${E.day(last.date)}: ${E.n(last.size)} invitations, ${K.catName(lastCat, 'en')}.`,
    resume: `Our reading of IRCC’s rounds file keeps ${E.n(R.length)} Express Entry draws, from ${E.day(oldest.date)} to ${E.day(last.date)}. The most recent one, round ${last.n}, was a ${K.catName(lastCat, 'en')} round on ${E.day(last.date)} with ${E.n(last.size)} invitations to apply${typeof last.crs === 'number' ? ` and a minimum score of ${last.crs}` : ''}. In the twelve months since ${E.day(since)}, IRCC held ${E.n(year.length)} rounds and sent ${E.n(yearTotal)} invitations. Canadian Experience Class rounds needed between ${cec.lowest?.crs} and ${hi('cec')} points, provincial nominee rounds between ${pnp.lowest?.crs} and ${hi('pnp')} because a nomination adds 600 points, and French-language rounds between ${fr.lowest?.crs} and ${hi('french')}. These are past results: IRCC picks the category, the size and therefore the cut-off of each round, and the next one can land well above or below the last. This site does not compute your CRS score; enter the score shown in your profile in the tool above to see how many recent rounds it would have met.`,
    faqs: [
      { q: 'What was the cut-off in the latest Express Entry draw?', a: `Round ${last.n}, on ${E.day(last.date)}, invited ${E.n(last.size)} candidates in the ${K.catName(lastCat, 'en')} category${typeof last.crs === 'number' ? `, with a lowest invited score of ${last.crs}` : ''}. A cut-off only applies to its own category: a score that misses a Canadian Experience Class round can still be enough for a French-language or trades round, and the reverse.` },
      { q: 'Why are provincial nominee draw scores above 700?', a: `A provincial nomination obtained through Express Entry adds 600 points to the profile. Over the last twelve months, nominee rounds had cut-offs from ${pnp.lowest?.crs} to ${hi('pnp')}, which means the candidates invited held between roughly ${pnp.lowest!.crs! - 600} and ${hi('pnp') - 600} points before the nomination. The figure is not comparable with other categories.` },
      { q: 'Can past Express Entry rounds tell me when I will be invited?', a: 'No. IRCC decides before each round which category to draw, how many invitations to send and when. The pool also changes every day as profiles enter, expire or improve. Past rounds show the range of scores that were invited recently; they are a description of what happened, not a schedule or a forecast.' },
      { q: 'How many Express Entry invitations were issued in 2025?', a: `IRCC’s file lists ${E.n(inYear('2025').length)} rounds in 2025 with ${E.n(sumOf(inYear('2025')))} invitations in total, against ${E.n(sumOf(inYear('2024')))} in ${E.n(inYear('2024').length)} rounds in 2024. In ${lastY} so far, up to ${E.day(last.date)}, there were ${E.n(inYear(lastY).length)} rounds and ${E.n(sumOf(inYear(lastY)))} invitations. Each invitation is one candidate, not one family.` },
    ],
    body: (h) => `
<h2>The latest rounds</h2>
<p>The table below shows the ten most recent rounds as IRCC published them, newest first. Each round has a number, a date, a category, a size and the score of the lowest-ranked candidate who was invited. When several candidates tie at that score, IRCC uses the date and time each profile was submitted to break the tie, which is why two rounds with the same cut-off can reach a different number of people.</p>
${h.table(['Date', 'Round', 'Category', 'Invitations', 'Cut-off'], lastRows(h), `Latest ten Express Entry rounds, IRCC rounds file read on ${h.day(K.EE_READ)}.`, ['l', 'l', 'l', 'r', 'r'])}
<p>Rounds now come in short bursts. A typical fortnight has a provincial nominee round, a Canadian Experience Class round and one category round, often on consecutive days. The largest single round of the last twelve months was round ${biggest.n} on ${h.day(biggest.date)}, with ${h.n(biggest.size)} invitations in the ${K.catName(K.catOf(biggest.name), h.lang)} category.</p>
<h2>Cut-offs over twelve months, by category</h2>
<p>Comparing scores across categories mixes very different pools. A French-language round draws from candidates with strong French test results, whatever their occupation; a healthcare round only considers people with recent experience in a listed occupation. The lowest score in one category says nothing about the cut-off of another.</p>
${h.table(['Category', 'Rounds', 'Invitations', 'Lowest cut-off', 'Highest cut-off', 'Latest round'], catRows(h), `Rounds held between ${h.day(since)} and ${h.day(last.date)}, by category.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Canadian Experience Class rounds have been the most regular route for candidates with a year of skilled work in Canada: ${h.n(cec.n)} rounds and ${h.n(cec.total)} invitations in twelve months. Category rounds for physicians or senior managers are small, sometimes a few hundred invitations, and their low cut-offs reflect a narrow pool rather than an easy door. ${lastGeneral ? `The last round open to every program was on ${h.day(lastGeneral.date)}.` : 'No round open to every program appears in the period.'} ${fswOnly ? `The file lists ${h.n(fswOnly)} rounds limited to Federal Skilled Worker candidates.` : 'No round in the file was limited to Federal Skilled Worker candidates, who are invited through general or category rounds.'}</p>
${h.mini('entree', { p: ['crs', 'k'], d: { crs: 500, k: 'cec' }, t: 'Your score against twelve months of rounds' })}
<h2>Reading a cut-off correctly</h2>
<p>A cut-off is the score of the last person invited, not a pass mark set in advance. If IRCC sends fewer invitations, the cut-off rises; if it sends more, it falls, even when the pool has not changed. A drop of ten points from one round to the next can come from a larger round alone. That is why the tool above counts how many recent rounds your score would have met in a category instead of quoting one threshold: the share of rounds tells more than the last number.</p>
<h2>Invitations year by year</h2>
${h.table(['Year', 'Rounds', 'Invitations', 'Lowest · highest cut-off'], yearRows(h), `All rounds in the file, ${firstY} to ${lastY} (${lastY} up to ${h.day(last.date)}).`, ['l', 'r', 'r', 'r'])}
<p>The yearly totals rise from ${h.n(sumOf(inYear(firstY)))} invitations in ${firstY} to ${h.n(sumOf(inYear('2025')))} in 2025, and ${lastY} has already reached ${h.n(sumOf(inYear(lastY)))}. The spread between the lowest and highest cut-off each year is mostly the effect of the 600 nomination points and of small category rounds, not of a general rise or fall in the scores needed.</p>
<h2>After the invitation</h2>
<p>An invitation opens a 60-day window to submit a complete application for permanent residence. From that point the processing time is the one IRCC publishes for the program you were invited under, which is a forward-looking figure: see the ${h.a('cec', 'Canadian Experience Class')}, ${h.a('fsw', 'Federal Skilled Worker')} and ${h.a('pnp', 'provincial nominee')} pages, or the ${h.a('express-entry', 'Express Entry overview')} that puts the three side by side.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'cec', m: 'none' }, t: 'After an invitation: estimated decision' })}
<h2>What this page does not do</h2>
<p>It does not compute a Comprehensive Ranking System score and does not guess the next cut-off. The numbers come from the rounds file IRCC publishes on ${h.src('ee-rounds', 'its Express Entry rounds page')}, read on ${h.day(K.EE_READ)}; the program rules are on ${h.src('express-entry', 'IRCC’s Express Entry pages')}. Radif Partners publishes this site independently of IRCC, and the ${h.a('method', 'method page')} explains how each file is read.</p>
`,
  },
  fr: {
    slug: 'rondes-entree-express',
    nav: 'Rondes d’Entrée express', card: 'Chaque ronde depuis 2024, scores par catégorie',
    title: 'Rondes d’Entrée express : scores minimaux, invitations 2026',
    description: 'Rondes d’Entrée express en 2026 : dernière ronde, score minimal le plus bas et le plus haut par catégorie sur 12 mois, invitations par année depuis 2024.',
    h1: 'Rondes d’Entrée express, une par une',
    intro: `La dernière ronde du fichier d’IRCC porte le numéro ${last.n}, le ${F.day(last.date)} : ${F.n(last.size)} invitations, catégorie ${K.catName(lastCat, 'fr')}.`,
    resume: `Notre lecture du fichier des rondes d’IRCC garde ${F.n(R.length)} rondes d’Entrée express, du ${F.day(oldest.date)} au ${F.day(last.date)}. La plus récente, la ronde ${last.n} du ${F.day(last.date)}, visait la catégorie ${K.catName(lastCat, 'fr')} et a envoyé ${F.n(last.size)} invitations à présenter une demande${typeof last.crs === 'number' ? `, avec un score minimal de ${last.crs}` : ''}. Sur les douze mois écoulés depuis le ${F.day(since)}, IRCC a tenu ${F.n(year.length)} rondes et envoyé ${F.n(yearTotal)} invitations. Les rondes de l’expérience canadienne ont demandé de ${cec.lowest?.crs} à ${hi('cec')} points, celles des candidats des provinces de ${pnp.lowest?.crs} à ${hi('pnp')}, parce qu’une désignation ajoute 600 points, et celles du français de ${fr.lowest?.crs} à ${hi('french')}. Ce sont des résultats passés : IRCC choisit la catégorie et la taille de chaque ronde, donc son score minimal, et la suivante peut tomber bien plus haut ou plus bas. Ce site ne calcule pas votre score CRS ; indiquez celui de votre profil dans l’outil ci-dessus pour voir combien de rondes récentes il aurait passées.`,
    faqs: [
      { q: 'Quel score fallait-il à la dernière ronde d’Entrée express ?', a: `La ronde ${last.n}, le ${F.day(last.date)}, a invité ${F.n(last.size)} candidats de la catégorie ${K.catName(lastCat, 'fr')}${typeof last.crs === 'number' ? `, avec un score minimal de ${last.crs}` : ''}. Un score minimal ne vaut que pour sa catégorie : un score trop bas pour une ronde de l’expérience canadienne peut suffire pour une ronde du français ou des métiers, et l’inverse.` },
      { q: 'Pourquoi les rondes des candidats des provinces dépassent-elles 700 points ?', a: `Une désignation provinciale obtenue par Entrée express ajoute 600 points au profil. Sur douze mois, ces rondes ont eu des scores minimaux de ${pnp.lowest?.crs} à ${hi('pnp')} : les candidats invités avaient donc environ ${pnp.lowest!.crs! - 600} à ${hi('pnp') - 600} points avant la désignation. Ce chiffre ne se compare pas aux autres catégories.` },
      { q: 'Les rondes passées disent-elles quand je serai invité ?', a: 'Non. Avant chaque ronde, IRCC décide de la catégorie, du nombre d’invitations et de la date. Le bassin change aussi chaque jour, avec les profils qui entrent, expirent ou s’améliorent. Les rondes passées montrent la fourchette des scores invités récemment : elles décrivent ce qui s’est passé, ce n’est ni un calendrier ni une prévision.' },
      { q: 'Combien d’invitations d’Entrée express ont été envoyées en 2025 ?', a: `Le fichier d’IRCC compte ${F.n(inYear('2025').length)} rondes en 2025 et ${F.n(sumOf(inYear('2025')))} invitations au total, contre ${F.n(sumOf(inYear('2024')))} en ${F.n(inYear('2024').length)} rondes en 2024. En ${lastY}, jusqu’au ${F.day(last.date)}, on compte ${F.n(inYear(lastY).length)} rondes et ${F.n(sumOf(inYear(lastY)))} invitations. Chaque invitation vise un candidat, pas une famille.` },
    ],
    body: (h) => `
<h2>Les dernières rondes</h2>
<p>Le tableau reprend les dix rondes les plus récentes telles qu’IRCC les publie, de la plus récente à la plus ancienne. Chaque ronde a un numéro, une date, une catégorie, un nombre d’invitations et le score du dernier candidat invité. Quand plusieurs candidats sont à égalité à ce score, IRCC les départage par la date et l’heure de création du profil ; deux rondes au même score minimal peuvent donc toucher un nombre différent de personnes.</p>
${h.table(['Date', 'Ronde', 'Catégorie', 'Invitations', 'Score minimal'], lastRows(h), `Dix dernières rondes d’Entrée express, fichier d’IRCC lu le ${h.day(K.EE_READ)}.`, ['l', 'l', 'l', 'r', 'r'])}
<p>Les rondes arrivent maintenant par petites séries. Une quinzaine type compte une ronde des candidats des provinces, une ronde de l’expérience canadienne et une ronde par catégorie, souvent sur des jours qui se suivent. La plus grosse ronde des douze derniers mois est la ronde ${biggest.n} du ${h.day(biggest.date)}, avec ${h.n(biggest.size)} invitations dans la catégorie ${K.catName(K.catOf(biggest.name), h.lang)}.</p>
<h2>Scores minimaux sur douze mois, par catégorie</h2>
<p>Comparer les scores d’une catégorie à l’autre mélange des bassins très différents. Une ronde du français puise parmi les candidats qui ont de très bons résultats au test de français, quel que soit leur métier ; une ronde de la santé ne regarde que les personnes qui ont une expérience récente dans une profession de la liste. Le score le plus bas d’une catégorie ne dit rien de celui d’une autre.</p>
${h.table(['Catégorie', 'Rondes', 'Invitations', 'Score le plus bas', 'Score le plus haut', 'Dernière ronde'], catRows(h), `Rondes tenues du ${h.day(since)} au ${h.day(last.date)}, par catégorie.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Les rondes de l’expérience canadienne restent la voie la plus régulière pour les candidats qui ont un an de travail qualifié au Canada : ${h.n(cec.n)} rondes et ${h.n(cec.total)} invitations en douze mois. Les rondes réservées aux médecins ou aux cadres supérieurs sont petites, parfois quelques centaines d’invitations, et leur score bas tient à un bassin étroit plutôt qu’à une porte facile. ${lastGeneral ? `La dernière ronde ouverte à tous les programmes date du ${h.day(lastGeneral.date)}.` : 'Aucune ronde ouverte à tous les programmes ne figure sur la période.'} ${fswOnly ? `Le fichier compte ${h.n(fswOnly)} rondes réservées aux travailleurs qualifiés du fédéral.` : 'Aucune ronde du fichier n’était réservée aux travailleurs qualifiés du fédéral, invités par les rondes générales ou par catégorie.'}</p>
${h.mini('entree', { p: ['crs', 'k'], d: { crs: 500, k: 'french' }, t: 'Votre score face à douze mois de rondes' })}
<h2>Bien lire un score minimal</h2>
<p>Le score minimal est celui du dernier candidat invité, pas une note de passage fixée à l’avance. Si IRCC envoie moins d’invitations, il monte ; s’il en envoie plus, il baisse, même quand le bassin n’a pas changé. Une baisse de dix points d’une ronde à l’autre peut venir de la seule taille de la ronde. C’est pourquoi l’outil ci-dessus compte combien de rondes récentes votre score aurait passées dans une catégorie plutôt que de citer un seuil unique : la part des rondes en dit plus que le dernier chiffre.</p>
<h2>Les invitations année par année</h2>
${h.table(['Année', 'Rondes', 'Invitations', 'Score le plus bas · le plus haut'], yearRows(h), `Toutes les rondes du fichier, de ${firstY} à ${lastY} (${lastY} jusqu’au ${h.day(last.date)}).`, ['l', 'r', 'r', 'r'])}
<p>Le total annuel passe de ${h.n(sumOf(inYear(firstY)))} invitations en ${firstY} à ${h.n(sumOf(inYear('2025')))} en 2025, et ${lastY} en compte déjà ${h.n(sumOf(inYear(lastY)))}. L’écart entre le score le plus bas et le plus haut de chaque année vient surtout des 600 points de la désignation provinciale et des petites rondes par catégorie, pas d’une hausse ou d’une baisse générale du score demandé.</p>
<h2>Après l’invitation</h2>
<p>Une invitation ouvre une fenêtre de 60 jours pour envoyer une demande complète de résidence permanente. À partir de là, le délai qui compte est celui qu’IRCC publie pour le programme de l’invitation, un délai prospectif : voir les pages de la ${h.a('cec', 'catégorie de l’expérience canadienne')}, des ${h.a('fsw', 'travailleurs qualifiés du fédéral')} et des ${h.a('pnp', 'candidats des provinces')}, ou la ${h.a('express-entry', 'vue d’ensemble d’Entrée express')} qui compare les trois.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'cec', m: 'none' }, t: 'Après l’invitation : décision estimée' })}
<h2>Ce que cette page ne fait pas</h2>
<p>Elle ne calcule pas de score du Système de classement global et ne devine pas le prochain score minimal. Les chiffres viennent du fichier des rondes qu’IRCC publie sur ${h.src('ee-rounds', 'sa page des rondes d’invitations')}, lu le ${h.day(K.EE_READ)} ; les règles du programme sont sur ${h.src('express-entry', 'les pages Entrée express d’IRCC')}. Radif Partners publie ce site sans lien avec IRCC, et la ${h.a('method', 'page de méthode')} explique comment chaque fichier est lu.</p>
`,
  },
});
