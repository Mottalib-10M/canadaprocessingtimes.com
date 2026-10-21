import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Programme des travailleurs qualifiés (fédéral) : délai prospectif, file par mois de dépôt (flpt) et rondes ouvertes à ses candidats. */
const P = 'fsw';
const R = K.readingOf(P);
const Q = R.queue ?? [];
const D = R.date;
const T = K.fullTrend(R.series)!;
const late = Q.filter((q) => q[1] === 'late');
const lastLate = late[late.length - 1];
const lastRow = Q[Q.length - 1];
const yAgo = Q[Math.max(0, Q.length - 12)];
const cec = K.readingOf('cec');
const S24 = '2024-01-01';
const fswOnly = K.ROUNDS.filter((x) => K.catOf(x.name) === 'fsw');
const general = K.ROUNDS.filter((x) => K.catOf(x.name) === 'general');
const lastGeneral = general[0];
/** Rondes ouvertes aux candidats de tous les programmes (hors expérience canadienne et candidats des provinces), depuis 2024. */
const CATS = [...new Set(K.ROUNDS.filter((x) => x.date >= S24).map((x) => K.catOf(x.name)))].filter((c) => c !== 'cec' && c !== 'pnp');
const catRows = CATS.map((c) => { const s = K.eeStats(K.ROUNDS, c, 0, S24); return { c, s }; }).sort((a, b) => b.s.total - a.s.total);
const openTotal = catRows.reduce((a, x) => a + x.s.total, 0);
const top = catRows[0];
const pick = Q.filter((_, i) => (Q.length - 1 - i) % 3 === 0).slice(-8);
const E = K.en, F = K.fr;

function cats(h: Helpers) {
  return catRows.map(({ c, s }) => [K.catName(c, h.lang), h.n(s.n), h.n(s.total), s.lowest?.crs != null ? String(s.lowest.crs) : '', s.last ? h.day(s.last.date) : '']);
}
function quarterly(h: Helpers) {
  return [...pick].reverse().map((q) => [h.my(`${q[0]}-15`), typeof q[1] === 'number' ? h.d(q[1] * 365.25 / 12, 'm') : (h.lang === 'fr' ? 'délai prévu dépassé' : 'past the expected time'), K.fmtAhead(q[2], h.lang)]);
}

export default defineGuide({
  id: 'fsw', group: 'pr', order: 42,
  tool: 'delai', toolArg: { g: 'fsw' },
  related: ['express-entry', 'cec', 'pnp', 'express-entry-draws', 'quebec-skilled-worker', 'history'],
  sources: ['ptimes-flpt', 'express-entry', 'ee-rounds', 'ee-data'],
  en: {
    slug: 'federal-skilled-worker-processing-time',
    nav: 'Federal Skilled Worker', card: 'Time after the invitation, queue, rounds that invite FSW',
    title: 'Federal Skilled Worker Processing Time in 2026, FSW Queue',
    description: 'Federal Skilled Worker processing time in 2026 after an Express Entry invitation: IRCC’s figure, the queue by month of filing and the rounds that invite FSW.',
    h1: 'Federal Skilled Worker processing time',
    intro: `IRCC’s figure for a Federal Skilled Worker application received now is ${K.fmtTime(R.t, 'en')}, in its update of ${E.day(D)}.`,
    resume: `A Federal Skilled Worker application for permanent residence, filed after an Express Entry invitation, currently takes ${K.fmtTime(R.t, 'en')} according to IRCC’s forward-looking figure of ${E.day(D)}. About ${E.n(R.waiting ?? 0)} applications were in that line. IRCC’s queue by month of filing marks every month up to ${E.my(`${lastLate[0]}-15`)} as past the expected time and gives ${E.n(lastRow[1] as number)} months left for files received in ${E.my(`${lastRow[0]}-15`)}. Since our first dated copy of ${E.day(T.firstDate!)}, the headline figure has gone back and forth between ${E.d(T.min, 'm')} and ${E.d(T.max, 'm')}. Getting the invitation is the harder part: in IRCC’s list of rounds since January 2024, ${fswOnly.length ? `${E.n(fswOnly.length)} rounds were reserved to this program` : 'no round was reserved to this program'}, and the last round open to all programs took place on ${E.day(lastGeneral.date)}. Since then, candidates of this program have been invited through category rounds such as ${K.catName(top.c, 'en')}, which IRCC also opens to the other two Express Entry programs.`,
    faqs: [
      { q: 'Has IRCC held a round only for Federal Skilled Workers since 2024?', a: `${fswOnly.length ? `Yes, ${E.n(fswOnly.length)} times in IRCC’s list of rounds since January 2024.` : 'Not in IRCC’s list of rounds since January 2024.'} Candidates of this program have been invited through general rounds, the last on ${E.day(lastGeneral.date)}, and through category rounds by occupation or French ability. IRCC chooses the type of each round; past choices do not tell which categories it will pick next.` },
      { q: 'How long after an FSW invitation will I get a decision?', a: `First you have 60 days to send the complete application. From the day IRCC receives it, its figure of ${E.day(D)} is ${K.fmtTime(R.t, 'en')}. Medical exams, police certificates from each country where you lived and any request for more documents can add time that the figure does not include.` },
      { q: 'Do Federal Skilled Workers abroad wait longer than CEC applicants in Canada?', a: `Not according to the published lines: ${K.fmtTime(R.t, 'en')} for Federal Skilled Workers and ${K.fmtTime(cec.t, 'en')} for the Canadian Experience Class on ${E.day(D)}. In practice, applicants abroad add travel steps after approval, such as sending the passport for a visa and planning the landing, which the processing time does not count.` },
    ],
    body: (h) => `
<h2>The invitation comes first</h2>
<p>The Federal Skilled Worker Program is the Express Entry route for skilled workers who do not need Canadian experience. Candidates qualify on the program’s own selection grid, which weighs language, education, work experience, age, arranged employment and adaptability, and they must usually show settlement funds. Qualifying puts a profile in the pool; only an invitation lets the candidate file for permanent residence, and the processing time on this page starts after that.</p>
<p>Since January 2024, IRCC has invited Express Entry candidates in three kinds of rounds: rounds for one program, general rounds open to everyone, and category rounds by occupation or language. ${fswOnly.length ? `IRCC’s list counts ${h.n(fswOnly.length)} rounds reserved to the Federal Skilled Worker Program in that period.` : 'IRCC’s list contains no round reserved to the Federal Skilled Worker Program in that period.'} The last general round was held on ${h.day(lastGeneral.date)}. The table counts the other rounds whose invitations can reach a Federal Skilled Worker candidate, by category, since January 2024.</p>
${h.table(['Round category', 'Rounds', 'Invitations', 'Lowest cut-off', 'Latest round'], cats(h), 'Express Entry rounds since January 2024, excluding rounds reserved to the Canadian Experience Class or to provincial nominees.', ['l', 'r', 'r', 'r', 'r'])}
<p>Together these rounds sent ${h.n(openTotal)} invitations, a share of which went to candidates who then filed under another program. A candidate who fits no category waits for a general round, and none has been held since ${h.my(lastGeneral.date)}. The full list, with each date and cut-off, is on the ${h.a('express-entry-draws', 'Express Entry draws page')}.</p>
<h2>After the application: the published time</h2>
<p>The figure is forward-looking: it is IRCC’s estimate for a file received on the day of the update, explained on the ${h.a('method', 'method page')}. Our dated series begins with the copy of ${h.day(T.firstDate!)}, and over ${h.n(T.n)} readings the value has ranged from ${h.d(T.min, 'm')} to ${h.d(T.max, 'm')}. A swing of one month in a figure rounded to the month is noise, not a trend.</p>
${h.hist(R.series, { max: 12, unit: 'm' })}
${h.mini('delai', { p: ['m'], d: { g: P, m: yAgo[0], d: 1 }, t: 'Your FSW application: where your month stands' })}
<h2>The queue, one month in three</h2>
<p>IRCC’s queue lists each month of filing over three years. The table keeps one month in three to show the shape of the line on ${h.day(D)}. Files received in ${h.my(`${yAgo[0]}-15`)}, eleven months before the latest month, ${typeof yAgo[1] === 'number' ? `have ${h.d(yAgo[1] * 365.25 / 12, 'm')} left according to IRCC` : 'are already marked as past the expected time'}. The rounded count of applications ahead grows quickly toward recent months, because it adds every file received up to that month that IRCC has not yet decided.</p>
${h.table(['Month filed', 'Time left', 'Applications ahead'], quarterly(h), `Federal Skilled Worker queue, IRCC update of ${h.day(D)}, one month in three.`, ['l', 'r', 'r'])}
<h2>What usually adds time</h2>
<p>Federal Skilled Worker applicants often live outside Canada, which brings steps that applicants already in Canada can skip. Police certificates are needed from each country where you spent six months or more since age 18, and some countries take weeks to issue them. The immigration medical exam is done with a panel physician and expires after a year; if the file takes longer, IRCC may ask for a new one. After approval, applicants who need a visa send their passport to receive the counterfoil, and every applicant must land in Canada before the confirmation of permanent residence expires.</p>
<h2>Comparing with the other lines</h2>
<p>The ${h.a('cec', 'Canadian Experience Class')} currently shows ${h.t(cec.t)} and the Express Entry stream of the ${h.a('pnp', 'Provincial Nominee Program')} ${h.t(K.readingOf('pnp-ee').t)}. Skilled workers who intend to live in Quebec do not use this program at all: Quebec selects them, then IRCC handles admission, as explained on the ${h.a('quebec-skilled-worker', 'Quebec-selected skilled worker page')}. All three Express Entry lines are compared on the ${h.a('express-entry', 'Express Entry overview')}.</p>
`,
  },
  fr: {
    slug: 'delai-travailleurs-qualifies-federal',
    nav: 'Travailleurs qualifiés du fédéral', card: 'Délai après l’invitation, file, rondes qui invitent les TQF',
    title: 'Délai des travailleurs qualifiés du fédéral (TQF) en 2026',
    description: 'Délai du Programme des travailleurs qualifiés du fédéral en 2026 après une invitation : chiffre d’IRCC, file par mois de dépôt et rondes ouvertes aux TQF.',
    h1: 'Délai des travailleurs qualifiés du fédéral',
    intro: `Le chiffre d’IRCC pour une demande de travailleur qualifié du fédéral reçue aujourd’hui est de ${K.fmtTime(R.t, 'fr')}, dans sa mise à jour du ${F.day(D)}.`,
    resume: `Une demande de résidence permanente au titre du Programme des travailleurs qualifiés du fédéral, déposée après une invitation de l’Entrée express, prend aujourd’hui ${K.fmtTime(R.t, 'fr')} selon le chiffre prospectif d’IRCC du ${F.day(D)}. Environ ${F.n(R.waiting ?? 0)} demandes étaient dans cette file. La file d’IRCC par mois de dépôt indique « délai prévu dépassé » pour tous les mois jusqu’à ${F.my(`${lastLate[0]}-15`)}, et ${F.n(lastRow[1] as number)} mois restants pour les dossiers reçus en ${F.my(`${lastRow[0]}-15`)}. Depuis notre première copie datée du ${F.day(T.firstDate!)}, le chiffre principal a oscillé entre ${F.d(T.min, 'm')} et ${F.d(T.max, 'm')}. Obtenir l’invitation est l’étape la plus difficile : dans la liste des rondes d’IRCC depuis janvier 2024, ${fswOnly.length ? `${F.n(fswOnly.length)} rondes ont été réservées à ce programme` : 'aucune ronde n’a été réservée à ce programme'}, et la dernière ronde ouverte à tous les programmes date du ${F.day(lastGeneral.date)}. Depuis, ses candidats ont été invités par des rondes par catégorie, comme ${K.catName(top.c, 'fr')}, qu’IRCC ouvre aussi aux deux autres programmes de l’Entrée express.`,
    faqs: [
      { q: 'IRCC a-t-il tenu une ronde réservée aux travailleurs qualifiés du fédéral depuis 2024 ?', a: `${fswOnly.length ? `Oui, ${F.n(fswOnly.length)} fois dans la liste des rondes d’IRCC depuis janvier 2024.` : 'Pas dans la liste des rondes d’IRCC depuis janvier 2024.'} Les candidats de ce programme ont été invités par des rondes générales, la dernière le ${F.day(lastGeneral.date)}, puis par des rondes par catégorie de métier ou de connaissance du français. IRCC choisit le type de chaque ronde ; ses choix passés ne disent pas quelles catégories viendront ensuite.` },
      { q: 'Combien de temps après une invitation TQF arrive la décision ?', a: `Vous avez d’abord 60 jours pour envoyer la demande complète. À partir de sa réception par IRCC, le chiffre du ${F.day(D)} est de ${K.fmtTime(R.t, 'fr')}. Les examens médicaux, les certificats de police de chaque pays où vous avez vécu et toute demande de documents peuvent ajouter du temps que ce chiffre ne compte pas.` },
      { q: 'Les travailleurs qualifiés à l’étranger attendent-ils plus que les demandeurs CEC au Canada ?', a: `Pas d’après les files publiées : ${K.fmtTime(R.t, 'fr')} pour les travailleurs qualifiés du fédéral et ${K.fmtTime(cec.t, 'fr')} pour l’expérience canadienne le ${F.day(D)}. En pratique, les demandeurs à l’étranger ajoutent des étapes après l’approbation, comme l’envoi du passeport pour le visa et l’organisation de l’arrivée, que le délai de traitement ne compte pas.` },
    ],
    body: (h) => `
<h2>L’invitation vient d’abord</h2>
<p>Le Programme des travailleurs qualifiés du fédéral est la voie de l’Entrée express pour les travailleurs qualifiés qui n’ont pas besoin d’expérience canadienne. Les candidats se qualifient sur la grille de sélection propre au programme, qui pèse la langue, les études, l’expérience, l’âge, l’offre d’emploi réservé et la faculté d’adaptation, et ils doivent en général prouver des fonds d’établissement. Se qualifier place un profil dans le bassin ; seule une invitation permet de déposer la demande de résidence permanente, et le délai de cette page commence après.</p>
<p>Depuis janvier 2024, IRCC invite les candidats de l’Entrée express dans trois sortes de rondes : des rondes pour un seul programme, des rondes générales ouvertes à tous et des rondes par catégorie de métier ou de langue. ${fswOnly.length ? `La liste d’IRCC compte ${h.n(fswOnly.length)} rondes réservées au Programme des travailleurs qualifiés du fédéral sur cette période.` : 'La liste d’IRCC ne contient aucune ronde réservée au Programme des travailleurs qualifiés du fédéral sur cette période.'} La dernière ronde générale a eu lieu le ${h.day(lastGeneral.date)}. Le tableau compte, par catégorie et depuis janvier 2024, les autres rondes dont les invitations peuvent toucher un candidat de ce programme.</p>
${h.table(['Catégorie de ronde', 'Rondes', 'Invitations', 'Score minimal le plus bas', 'Dernière ronde'], cats(h), 'Rondes de l’Entrée express depuis janvier 2024, sans les rondes réservées à l’expérience canadienne ou aux candidats des provinces.', ['l', 'r', 'r', 'r', 'r'])}
<p>Ces rondes ont envoyé ${h.n(openTotal)} invitations en tout, dont une partie à des candidats qui ont ensuite déposé dans un autre programme. Un candidat qui n’entre dans aucune catégorie attend une ronde générale, et il n’y en a pas eu depuis ${h.my(lastGeneral.date)}. La liste complète, avec chaque date et chaque score minimal, se trouve sur la ${h.a('express-entry-draws', 'page des rondes de l’Entrée express')}.</p>
<h2>Après la demande : le délai publié</h2>
<p>Le chiffre est prospectif : c’est l’estimation d’IRCC pour un dossier reçu le jour de la mise à jour, expliquée sur la ${h.a('method', 'page de méthode')}. Notre série datée commence avec la copie du ${h.day(T.firstDate!)}, et sur ${h.n(T.n)} relevés la valeur est allée de ${h.d(T.min, 'm')} à ${h.d(T.max, 'm')}. Un écart d’un mois sur un chiffre arrondi au mois relève du bruit, pas d’une tendance.</p>
${h.hist(R.series, { max: 12, unit: 'm' })}
${h.mini('delai', { p: ['m'], d: { g: P, m: yAgo[0], d: 1 }, t: 'Votre demande TQF : où en est votre mois' })}
<h2>La file, un mois sur trois</h2>
<p>La file d’IRCC liste chaque mois de dépôt sur trois ans. Le tableau en garde un sur trois pour montrer la forme de la file au ${h.day(D)}. Les dossiers reçus en ${h.my(`${yAgo[0]}-15`)}, onze mois avant le dernier mois, ${typeof yAgo[1] === 'number' ? `ont encore ${h.d(yAgo[1] * 365.25 / 12, 'm')} devant eux selon IRCC` : 'portent déjà la mention « délai prévu dépassé »'}. Le nombre arrondi de demandes devant grossit vite vers les mois récents, parce qu’il additionne tous les dossiers reçus jusqu’à ce mois qu’IRCC n’a pas encore tranchés.</p>
${h.table(['Mois de dépôt', 'Temps restant', 'Demandes devant'], quarterly(h), `File des travailleurs qualifiés du fédéral, mise à jour d’IRCC du ${h.day(D)}, un mois sur trois.`, ['l', 'r', 'r'])}
<h2>Ce qui ajoute souvent du temps</h2>
<p>Les demandeurs de ce programme vivent souvent hors du Canada, ce qui ajoute des étapes que les demandeurs déjà au Canada évitent. Il faut un certificat de police de chaque pays où vous avez passé six mois ou plus depuis l’âge de 18 ans, et certains pays mettent des semaines à le délivrer. L’examen médical se fait chez un médecin désigné et n’est valable qu’un an ; si le dossier dure plus longtemps, IRCC peut en demander un nouveau. Après l’approbation, les demandeurs qui ont besoin d’un visa envoient leur passeport pour la vignette, et chacun doit arriver au Canada avant l’expiration de la confirmation de résidence permanente.</p>
<h2>Comparer avec les autres files</h2>
<p>L’${h.a('cec', 'expérience canadienne')} affiche aujourd’hui ${h.t(cec.t)} et le volet Entrée express du ${h.a('pnp', 'Programme des candidats des provinces')} ${h.t(K.readingOf('pnp-ee').t)}. Les travailleurs qualifiés qui veulent vivre au Québec n’utilisent pas ce programme : le Québec les sélectionne, puis IRCC traite l’admission, comme l’explique la ${h.a('quebec-skilled-worker', 'page des travailleurs qualifiés sélectionnés par le Québec')}. Les trois files de l’Entrée express sont comparées sur la ${h.a('express-entry', 'page d’ensemble de l’Entrée express')}.</p>
`,
  },
});
