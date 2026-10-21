import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Citoyenneté : délai prospectif (fichier flpt, relevé mensuel), file par mois de dépôt, preuve et recherche. */
const G = K.readingOf('citizenship');
const Q = G.queue ?? [];
const gT = K.fullTrend('f:citizen-grants')!;
const wT = K.fullTrend('w:citizen-grants')!;
const PR = K.readingOf('cit-proof');
const pT = K.fullTrend('f:citizen-proofs')!;
const pW = K.fullTrend('w:citizen-proofs')!;
const SR = K.readingOf('cit-search');
const sT = K.fullTrend('n:cit_search')!;
const OPEN = Q.filter((r) => typeof r[1] === 'number'), LATE = Q.filter((r) => r[1] === 'late');
const oldest = OPEN[0] ?? Q[0], newest = Q[Q.length - 1];
const yearAgoKey = `${Number(G.date.slice(0, 4)) - 1}${G.date.slice(4, 7)}`;
const yearAgo = Q.find((r) => r[0] === yearAgoKey) ?? oldest;
const nRead = K.points('f:citizen-grants').length;
const E = K.en, F = K.fr;
/* Plus forte hausse entre deux relevés consécutifs du certificat. */
const pP = K.points('f:citizen-proofs');
const jump = pP.slice(1).reduce((b, x, i) => (x.v - pP[i].v > b.d ? { d: x.v - pP[i].v, from: pP[i].date, to: x.date } : b), { d: -Infinity, from: pP[0].date, to: pP[0].date });
const gNow = gT.last === gT.min, sTop = sT.last === sT.max, pDown = pW.last < pW.max;
const left = (x: unknown, l: 'en' | 'fr') => (typeof x === 'number' ? `${K.num(x, l)} ${l === 'fr' ? 'mois' : x === 1 ? 'month' : 'months'}` : x === 'late' ? (l === 'fr' ? 'délai prévu dépassé' : 'past the expected time') : '');
const ahead = (n: number | null, l: 'en' | 'fr') => K.fmtAhead(n, l);
const mon = (k: string, l: 'en' | 'fr') => K.monthYear(`${k}-15`, l);
const deFr = (k: string) => { const m = mon(k, 'fr'); return /^[aeiouéh]/i.test(m) ? `d’${m}` : `de ${m}`; };

function queueRows(h: Helpers) {
  const l = h.lang as 'en' | 'fr';
  return Q.slice(-8).reverse().map((r) => [mon(r[0], l), left(r[1], l), ahead(r[2], l)]);
}
function linesRows(h: Helpers) {
  const l = h.lang as 'en' | 'fr';
  return [
    [h.a('citizenship', K.progName('citizenship', l)), h.t(G.t), h.day(G.date), G.waiting ? ahead(G.waiting, l) : ''],
    [K.progName('cit-proof', l), h.t(PR.t), h.day(PR.date), PR.waiting ? ahead(PR.waiting, l) : ''],
    [K.progName('cit-search', l), h.t(SR.t), h.day(SR.date), ''],
  ];
}

export default defineGuide({
  id: 'citizenship', group: 'cit', order: 60,
  tool: 'delai', toolArg: { g: 'citizenship', m: 'none', only: 'citizenship,cit-proof,cit-search' },
  related: ['citizenship-calculator', 'pr-card', 'beyond-processing-time', 'history', 'express-entry'],
  sources: ['ptimes-flpt', 'ptimes-noncountry', 'citizenship-eligibility', 'citizenship-proof', 'check-status'],
  en: {
    slug: 'citizenship-processing-time',
    nav: 'Citizenship', card: 'Grant, certificate and records search, queue by month',
    title: 'Citizenship Application Processing Time, Canada 2026',
    description: 'Canadian citizenship processing time in 2026: the forward-looking time IRCC publishes, the queue by month of filing, proof of citizenship and records search.',
    h1: 'Citizenship processing time and the queue behind it',
    intro: `IRCC’s forward-looking figure for a citizenship grant, dated ${E.day(G.date)}, is ${K.fmtTime(G.t, 'en')}, with ${K.fmtAhead(G.waiting ?? null, 'en')} applications waiting.`,
    resume: `An adult applying for a Canadian citizenship grant today should expect about ${K.fmtTime(G.t, 'en')} until the oath, according to the forward-looking time IRCC published on ${E.day(G.date)}. Unlike visa figures, this one looks ahead: it is IRCC’s projection for an application received now, given the files already in line. That line holds ${K.fmtAhead(G.waiting ?? null, 'en')} applications, up from ${E.n(wT.first!)} in the copy of ${E.day(wT.firstDate!)}. IRCC also publishes a queue by month of filing: an application sent in ${mon(yearAgo[0], 'en')} has ${left(yearAgo[1], 'en')} left, one sent in ${mon(newest[0], 'en')} has ${left(newest[1], 'en')}. The proof of citizenship certificate has become the slowest line in this family, at ${K.fmtTime(PR.t, 'en')} against ${E.d(pT.first!, 'm')} in ${E.my(pT.firstDate!)}. A search of citizenship records takes ${K.fmtTime(SR.t, 'en')}. The tool above adds the time to your filing month and reads your row of the queue.`,
    faqs: [
      { q: 'How long does a Canadian citizenship grant take in 2026 once the application is sent?', a: `IRCC’s forward-looking time of ${E.day(G.date)} is ${K.fmtTime(G.t, 'en')} for an adult grant, measured from receipt to the oath ceremony. In our ${E.n(nRead)} monthly readings since ${E.day(gT.firstDate!)}, the figure has stayed between ${E.d(gT.min, 'm')} and ${E.d(gT.max, 'm')}. The test, any interview and the oath scheduling all happen inside that time.` },
      { q: 'What does the citizenship queue by month of filing tell me?', a: `For each month of filing, IRCC publishes the time it expects is left and how many applications are ahead. In the ${E.day(G.date)} file, the ${mon(oldest[0], 'en')} cohort has ${left(oldest[1], 'en')} left, while the ${mon(newest[0], 'en')} cohort has ${left(newest[1], 'en')}. Pick your month in the tool to see your own row.` },
      { q: 'Why is the proof of citizenship certificate so slow compared with the grant?', a: `The certificate line has its own staff and inventory. Its forward-looking time rose from ${E.d(pT.first!, 'm')} on ${E.day(pT.firstDate!)} to ${K.fmtTime(PR.t, 'en')} on ${E.day(PR.date)}, while the applications waiting went from ${E.n(pW.first!)} to ${E.n(pW.last)}. IRCC does not give a reason in the file; the figures only show the line growing faster than it is cleared.` },
      { q: 'Is the citizenship processing time counted until the oath or until the decision?', a: 'The forward-looking time for a citizenship grant runs from the day IRCC receives the complete application to the oath ceremony, which is when you become a citizen. A decision letter alone is not the end point. If IRCC asks for documents, fingerprints or a residence questionnaire, the waiting for your answer adds to the time.' },
    ],
    body: (h) => `
<h2>Three citizenship lines, three different clocks</h2>
<p>IRCC publishes the grant of citizenship and the proof of citizenship in its forward-looking file, refreshed about once a month, and the search of records in the weekly file of past times. The three do not measure the same thing, which is why they are listed side by side here with the date of each figure.</p>
${h.table(['Application', 'Published time', 'IRCC date', 'Applications waiting'], linesRows(h), 'Citizenship lines in the IRCC files, latest reading of each.', ['l', 'r', 'r', 'r'])}
<p>A forward-looking time is IRCC’s projection for a file that arrives today: it divides the applications already waiting by the pace at which the office expects to finish them. A past time, used for the records search, reports how long recent files took. The ${h.a('method', 'method page')} explains how each file is read and dated.</p>
<h2>The grant queue, month by month</h2>
<p>The most useful part of the citizenship file is the queue. For every month of filing still open, IRCC states how many months it expects are left and how many applications sit ahead. This is more precise than the headline figure for someone who applied a while ago, because it reflects the progress already made on that cohort.</p>
${h.table(['Month filed', 'Time left', 'Applications ahead'], queueRows(h), `Citizenship grant queue published by IRCC on ${h.day(G.date)}, latest eight months of filing.`, ['l', 'r', 'r'])}
<p>Read the table from the top: the newest cohort carries the full ${h.t(G.t)}, and each older month has less to go. The count of applications ahead falls in step. The oldest month that still has a projection, ${mon(oldest[0], 'en')}, shows ${left(oldest[1], 'en')} left with ${ahead(oldest[2], 'en')} ahead. ${LATE.length ? `The file also keeps ${h.n(LATE.length)} older months, from ${mon(LATE[0][0], 'en')} to ${mon(LATE[LATE.length - 1][0], 'en')}, marked past the expected time: IRCC gives no date for them, only the number still open, ${ahead(LATE[0][2], 'en')} in the oldest. ` : ''}A file in that situation is where the ${h.a('beyond-processing-time', 'follow-up steps for late files')} apply.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'citizenship', m: yearAgo[0] }, t: 'Your citizenship file: months left in IRCC’s queue' })}
<h2>How the grant time has moved</h2>
<p>We have ${h.n(nRead)} dated copies of the forward-looking file, the first from ${h.day(gT.firstDate!)}. The series is short, about a year, so it shows a level more than a long trend. Within it, the grant time peaked at ${h.d(gT.max, 'm')} in the copy of ${h.day(gT.maxDate)} and came back to ${h.d(gT.min, 'm')} by ${h.day(gT.minDate)}${gNow ? ', where it stands now' : `, before reaching ${h.d(gT.last, 'm')} in the latest copy`}.</p>
${h.hist('f:citizen-grants', { unit: 'm', max: 12 })}
<p>The stability of the headline figure hides growth in the line itself. Applications waiting for a grant went from ${h.n(wT.first!)} on ${h.day(wT.firstDate!)} to ${h.n(wT.max)} at the highest reading, on ${h.day(wT.maxDate)}, and stand at ${h.n(wT.last)} now. A longer line that keeps the same projected time means IRCC expects to finish more files each month.</p>
<h2>Proof of citizenship: the line that grew</h2>
<p>People born abroad to a Canadian parent, or who need a certificate to get a first passport, apply for proof of citizenship. Its forward-looking time went from ${h.d(pT.first!, 'm')} in the copy of ${h.day(pT.firstDate!)} to ${h.t(PR.t)} today, the largest single jump coming between the readings of ${h.day(jump.from)} and ${h.day(jump.to)}. The applications waiting rose from ${h.n(pW.first!)} to ${h.n(pW.max)} at the peak on ${h.day(pW.maxDate)}${pDown ? `, before a first drop to ${h.n(pW.last)}` : ''}.</p>
${h.hist('f:citizen-proofs', { unit: 'm', max: 8 })}
<p>The certificate rules themselves are set out on ${h.src('citizenship-proof', 'IRCC’s proof of citizenship page')}. The timing here is only the time IRCC projects for a new application; it says nothing about whether a given person is a citizen.</p>
<h2>Search of citizenship records</h2>
<p>A records search confirms whether someone was ever a Canadian citizen, often for genealogy or for a descendant’s own claim. It is a past time, published weekly, and has the longest history of the three: ${h.d(sT.first!, 'm')} in our first reading of ${h.day(sT.firstDate!)}, a low of ${h.d(sT.min, 'm')} on ${h.day(sT.minDate)}, and ${h.t(SR.t)} now${sTop ? ', the highest in the series' : ''}.</p>
<h2>Before you count the months</h2>
<p>The clock only starts on a complete application, which means meeting the residence rule on the day you sign. The ${h.a('citizenship-calculator', 'physical presence calculator')} counts your days against the ${h.n(K.P.citizenship.required)}-day threshold. The other conditions, such as tax filing and, for adults aged 18 to 54, the language proof and the test, are listed on ${h.src('citizenship-eligibility', 'IRCC’s eligibility page')}. Your ${h.a('pr-card', 'PR card')} does not have to be valid to apply, but you must still be a permanent resident.</p>
`,
  },
  fr: {
    slug: 'delai-citoyennete',
    nav: 'Citoyenneté', card: 'Attribution, certificat et recherche, file par mois',
    title: 'Délai de la demande de citoyenneté canadienne, 2026',
    description: 'Délai de traitement de la citoyenneté canadienne en 2026 : délai prospectif d’IRCC, file par mois de dépôt, certificat de citoyenneté, recherche de registres.',
    h1: 'Délai de citoyenneté et file d’attente qui le fonde',
    intro: `Le délai prospectif d’IRCC pour l’attribution de la citoyenneté, daté du ${F.day(G.date)}, est de ${K.fmtTime(G.t, 'fr')}, avec ${K.fmtAhead(G.waiting ?? null, 'fr')} demandes en attente.`,
    resume: `Un adulte qui demande aujourd’hui la citoyenneté canadienne doit compter environ ${K.fmtTime(G.t, 'fr')} jusqu’à la cérémonie, selon le délai prospectif publié par IRCC le ${F.day(G.date)}. Contrairement aux délais des visas, celui-ci regarde devant : c’est la projection d’IRCC pour une demande reçue maintenant, compte tenu des dossiers déjà en file. Cette file compte ${K.fmtAhead(G.waiting ?? null, 'fr')} demandes, contre ${F.n(wT.first!)} dans la copie du ${F.day(wT.firstDate!)}. IRCC publie aussi une file par mois de dépôt : une demande envoyée en ${mon(yearAgo[0], 'fr')} a encore ${left(yearAgo[1], 'fr')} devant elle, une demande envoyée en ${mon(newest[0], 'fr')}, ${left(newest[1], 'fr')}. Le certificat de citoyenneté est devenu la ligne la plus lente de cette famille, à ${K.fmtTime(PR.t, 'fr')} contre ${F.d(pT.first!, 'm')} en ${F.my(pT.firstDate!)}. Une recherche dans les registres prend ${K.fmtTime(SR.t, 'fr')}. L’outil ci-dessus ajoute le délai à votre mois de dépôt et lit votre ligne de la file.`,
    faqs: [
      { q: 'Combien de temps prend l’attribution de la citoyenneté canadienne en 2026 ?', a: `Le délai prospectif d’IRCC du ${F.day(G.date)} est de ${K.fmtTime(G.t, 'fr')} pour un adulte, de la réception de la demande à la cérémonie. Dans nos ${F.n(nRead)} relevés mensuels depuis le ${F.day(gT.firstDate!)}, le chiffre est resté entre ${F.d(gT.min, 'm')} et ${F.d(gT.max, 'm')}. L’examen, une éventuelle entrevue et la convocation au serment sont compris dans ce délai.` },
      { q: 'Que montre la file de citoyenneté par mois de dépôt ?', a: `Pour chaque mois de dépôt, IRCC publie le temps qu’il prévoit encore et le nombre de demandes devant. Dans le fichier du ${F.day(G.date)}, il reste ${left(oldest[1], 'fr')} à la cohorte ${deFr(oldest[0])} et ${left(newest[1], 'fr')} à celle ${deFr(newest[0])}. Choisissez votre mois dans l’outil pour voir votre ligne.` },
      { q: 'Pourquoi le certificat de citoyenneté est-il si long par rapport à l’attribution ?', a: `Le certificat a sa propre file et son propre personnel. Son délai prospectif est passé de ${F.d(pT.first!, 'm')} le ${F.day(pT.firstDate!)} à ${K.fmtTime(PR.t, 'fr')} le ${F.day(PR.date)}, et les demandes en attente de ${F.n(pW.first!)} à ${F.n(pW.last)}. IRCC n’en donne pas la raison dans son fichier ; les chiffres montrent seulement une file qui grossit plus vite qu’elle ne se vide.` },
      { q: 'Le délai de citoyenneté court-il jusqu’au serment ou jusqu’à la décision ?', a: 'Le délai prospectif de l’attribution de la citoyenneté va de la réception de la demande complète à la cérémonie de citoyenneté, moment où l’on devient citoyen. Une lettre de décision ne marque pas la fin. Si IRCC demande des documents, des empreintes ou un questionnaire sur la résidence, le temps de votre réponse s’ajoute.' },
    ],
    body: (h) => `
<h2>Trois lignes, trois horloges différentes</h2>
<p>IRCC publie l’attribution de la citoyenneté et la preuve de citoyenneté dans son fichier prospectif, mis à jour environ une fois par mois, et la recherche dans les registres dans le fichier hebdomadaire des délais passés. Les trois ne mesurent pas la même chose : on les présente donc côte à côte, chacune avec la date de son chiffre.</p>
${h.table(['Demande', 'Délai publié', 'Date IRCC', 'Demandes en attente'], linesRows(h), 'Lignes de citoyenneté des fichiers d’IRCC, dernier relevé de chacune.', ['l', 'r', 'r', 'r'])}
<p>Un délai prospectif est la projection d’IRCC pour un dossier qui arrive aujourd’hui : il rapporte les demandes déjà en attente au rythme auquel le bureau prévoit de les terminer. Un délai passé, utilisé pour la recherche dans les registres, indique combien de temps ont pris les dossiers récents. La ${h.a('method', 'page de méthode')} explique comment chaque fichier est lu et daté.</p>
<h2>La file de l’attribution, mois par mois</h2>
<p>La partie la plus utile du fichier est la file. Pour chaque mois de dépôt encore ouvert, IRCC indique combien de mois il prévoit encore et combien de demandes se trouvent devant. C’est plus précis que le chiffre principal pour qui a déposé il y a un moment, car cela tient compte du travail déjà fait sur cette cohorte.</p>
${h.table(['Mois de dépôt', 'Temps restant', 'Demandes devant'], queueRows(h), `File de l’attribution de la citoyenneté publiée par IRCC le ${h.day(G.date)}, huit derniers mois de dépôt.`, ['l', 'r', 'r'])}
<p>Le tableau se lit de haut en bas : la cohorte la plus récente porte le délai complet de ${h.t(G.t)}, et chaque mois plus ancien a moins à attendre. Le nombre de demandes devant baisse au même rythme. Pour le plus ancien mois qui a encore une projection, ${mon(oldest[0], 'fr')}, il reste ${left(oldest[1], 'fr')}, avec ${ahead(oldest[2], 'fr')} demandes devant. ${LATE.length ? `Le fichier garde aussi ${h.n(LATE.length)} mois plus anciens, ${deFr(LATE[0][0])} à ${mon(LATE[LATE.length - 1][0], 'fr')}, marqués « délai prévu dépassé » : IRCC ne leur donne plus de date, seulement le nombre de dossiers encore ouverts, ${ahead(LATE[0][2], 'fr')} pour le plus ancien. ` : ''}C’est dans cette situation que s’appliquent les ${h.a('beyond-processing-time', 'démarches pour un dossier en retard')}.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'citizenship', m: yearAgo[0] }, t: 'Votre demande de citoyenneté : mois restants dans la file d’IRCC' })}
<h2>L’évolution du délai d’attribution</h2>
<p>Nous avons ${h.n(nRead)} copies datées du fichier prospectif, la première du ${h.day(gT.firstDate!)}. La série est courte, environ un an : elle montre un niveau plus qu’une tendance longue. Le délai y a culminé à ${h.d(gT.max, 'm')} dans la copie du ${h.day(gT.maxDate)}, puis il est revenu à ${h.d(gT.min, 'm')} dès le ${h.day(gT.minDate)}${gNow ? ', où il se trouve encore' : `, avant d’atteindre ${h.d(gT.last, 'm')} dans la dernière copie`}.</p>
${h.hist('f:citizen-grants', { unit: 'm', max: 12 })}
<p>La stabilité du chiffre principal cache une file qui s’allonge. Les demandes en attente sont passées de ${h.n(wT.first!)} le ${h.day(wT.firstDate!)} à ${h.n(wT.max)} au plus haut, le ${h.day(wT.maxDate)}, et en sont à ${h.n(wT.last)} aujourd’hui. Une file plus longue avec le même délai projeté veut dire qu’IRCC prévoit de terminer plus de dossiers chaque mois.</p>
<h2>Le certificat de citoyenneté : la ligne qui a grossi</h2>
<p>Les personnes nées à l’étranger d’un parent canadien, ou qui ont besoin d’un certificat pour un premier passeport, demandent une preuve de citoyenneté. Son délai prospectif est passé de ${h.d(pT.first!, 'm')} dans la copie du ${h.day(pT.firstDate!)} à ${h.t(PR.t)} aujourd’hui, la plus forte hausse d’un relevé à l’autre se situant entre ceux du ${h.day(jump.from)} et ${h.day(jump.to)}. Les demandes en attente sont montées de ${h.n(pW.first!)} à ${h.n(pW.max)} au sommet du ${h.day(pW.maxDate)}${pDown ? `, avant un premier recul à ${h.n(pW.last)}` : ''}.</p>
${h.hist('f:citizen-proofs', { unit: 'm', max: 8 })}
<p>Les règles du certificat sont décrites sur la ${h.src('citizenship-proof', 'page d’IRCC sur la preuve de citoyenneté')}. Le délai donné ici est seulement celui qu’IRCC projette pour une nouvelle demande ; il ne dit rien de la citoyenneté d’une personne en particulier.</p>
<h2>La recherche dans les registres</h2>
<p>Une recherche confirme si une personne a déjà été citoyenne canadienne, souvent pour la généalogie ou pour la propre demande d’un descendant. C’est un délai passé, publié chaque semaine, et la série la plus longue des trois : ${h.d(sT.first!, 'm')} à notre premier relevé du ${h.day(sT.firstDate!)}, un plus bas de ${h.d(sT.min, 'm')} le ${h.day(sT.minDate)}, et ${h.t(SR.t)} aujourd’hui${sTop ? ', le plus haut de la série' : ''}.</p>
<h2>Avant de compter les mois</h2>
<p>Le compteur ne part qu’avec une demande complète, ce qui suppose de respecter la règle de présence le jour de la signature. Le ${h.a('citizenship-calculator', 'calculateur de présence effective')} compte vos jours par rapport au seuil de ${h.n(K.P.citizenship.required)} jours. Les autres conditions, comme les déclarations de revenus et, pour les adultes de 18 à 54 ans, la preuve de langue et l’examen, sont sur la ${h.src('citizenship-eligibility', 'page d’admissibilité d’IRCC')}. Votre ${h.a('pr-card', 'carte RP')} n’a pas à être valide pour déposer, mais vous devez toujours être résident permanent.</p>
`,
  },
});
