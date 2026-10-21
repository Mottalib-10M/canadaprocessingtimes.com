import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Prolongation du permis de travail : file hebdomadaire prospective (t:WP-EXT, w:WP-EXT) et délai passé
 * (n:work_extension), tous deux lus dans les fichiers d'IRCC. */
const G = 'work-ext';
const r = K.readingOf(G);
const fw = K.fullTrend(r.series)!;
const past = K.altOf(G)!;
const pt = K.fullTrend(past.series)!;
const ppts = K.points(past.series);
const recentLow = ppts.slice(-12).reduce((a, b) => (b.v < a.v ? b : a));
const wait = K.fullTrend('w:WP-EXT')!;
const q = r.queue ?? [];
const numeric = q.filter((x) => typeof x[1] === 'number') as Array<[string, number, number | null]>;
const late = q.filter((x) => x[1] === 'late').length;
const newest = numeric[numeric.length - 1], oldestNum = numeric[0];
const nTr = K.readingsCount('tr');
const E = K.en, F = K.fr;
const wk = (k: string, l: 'en' | 'fr') => (l === 'fr' ? `${K.monthYear(`${k.slice(0, 7)}-15`, 'fr')}, semaine ${Number(k.slice(8))}` : `${K.monthYear(`${k.slice(0, 7)}-15`, 'en')}, week ${Number(k.slice(8))}`);

function queueRows(h: Helpers) {
  const l = h.lang;
  return q.slice(-10).reverse().map((x) => [wk(x[0], l), x[1] === 'late' ? (l === 'fr' ? 'délai prévu dépassé' : 'past the expected time') : typeof x[1] === 'number' ? `${h.n(x[1])} ${l === 'fr' ? (x[1] === 1 ? 'semaine' : 'semaines') : (x[1] === 1 ? 'week' : 'weeks')}` : '', K.fmtAhead(x[2], l)]);
}

export default defineGuide({
  id: 'work-permit-extension', group: 'work', order: 32,
  tool: 'delai', toolArg: { g: 'work-ext', only: 'work-ext,work-inside,study-ext' },
  related: ['work-permit', 'pgwp', 'study-permit-extension', 'beyond-processing-time', 'cec', 'history'],
  sources: ['ptimes-week', 'ptimes-noncountry', 'extend-work', 'check-status', 'wayback'],
  en: {
    slug: 'work-permit-extension-processing-time',
    nav: 'Work permit extension', card: 'Weekly queue, people ahead, past time',
    title: 'Work Permit Extension Processing Time, Canada 2026',
    description: 'Work permit extension processing time in 2026: IRCC’s weekly queue by filing week, the number of people ahead and the past processing time since 2024.',
    h1: 'Work permit extension: queue and processing time',
    intro: `For a work permit extension filed now, IRCC expects ${K.fmtTime(r.t, 'en')} (file of ${E.day(r.date)}), with ${K.fmtAhead(r.waiting ?? null, 'en')} applications in the line.`,
    resume: `IRCC publishes two figures for a work permit extension, and they do not say the same thing. The forward-looking figure, from the weekly file dated ${E.day(r.date)}, is ${K.fmtTime(r.t, 'en')}: what IRCC expects for an application received now. The past figure, read on ${E.day(past.date)}, is ${K.fmtTime(past.t, 'en')}: how long it took to finish 80% of the extensions decided recently. The weekly file also lists, for each week of filing, the time IRCC expects is left and how many people are ahead; it counts ${K.fmtAhead(r.waiting ?? null, 'en')} applications waiting in total. For a file sent in ${wk(newest[0], 'en')}, it shows ${E.n(newest[1])} weeks left and ${K.fmtAhead(newest[2], 'en')} people ahead. The past figure has swung widely since 2024, from ${E.d(pt.first!)} on ${E.day(pt.firstDate!)} to a high of ${E.d(pt.max)} on ${E.day(pt.maxDate)}. The tool above finds your filing week in the queue and gives the matching date.`,
    faqs: [
      { q: 'Can I keep working while my work permit extension is processed?', a: 'IRCC’s page on extending a work permit explains maintained status: if you apply before your current permit expires, you can stay in Canada and keep working under the same conditions until a decision is made, as long as you stay in the country. If the permit had already expired when you applied, that protection does not apply.' },
      { q: 'What does “people ahead” mean in the work permit extension queue?', a: `For each week of filing, IRCC’s weekly file gives an estimate of how many extension applications are ahead of one received that week. It is rounded and it is a queue size, not a rank. On ${E.day(r.date)} the total waiting was ${K.fmtAhead(r.waiting ?? null, 'en')}, against ${K.fmtAhead(wait.first!, 'en')} on ${E.day(wait.firstDate!)}.` },
      { q: 'Why is the past work permit extension time longer than the forward one?', a: `The past figure (${K.fmtTime(past.t, 'en')}) describes files already decided, many of them sent months ago when the line was longer. The forward figure (${K.fmtTime(r.t, 'en')}) is IRCC’s projection for a file received now. When a backlog is shrinking, the past figure stays higher for a while; when it grows, the forward one moves first.` },
    ],
    body: (h) => `
<h2>The weekly queue IRCC publishes</h2>
<p>IRCC’s weekly file for permit extensions breaks the line down by week of filing. Weeks are counted within each month: days 1 to 7 are week 1, days 8 to 14 week 2, and so on. For each week the file gives the time IRCC expects is still left and an estimate of the applications ahead. The table shows the latest weeks as published on ${h.day(r.date)}.</p>
${h.table(['Week filed', 'Time left', 'People ahead'], queueRows(h), `Work permit extension queue, IRCC weekly file of ${h.day(r.date)}, newest week first.`, ['l', 'r', 'r'])}
<p>The pattern is regular: the earlier you filed, the less time is left and the fewer people are ahead. A file from ${wk(oldestNum[0], 'en')} has ${h.n(oldestNum[1])} weeks left; one from ${wk(newest[0], 'en')} has ${h.n(newest[1])}.${late ? ` For ${h.n(late)} older weeks the file says the expected time has already passed, which means files from those weeks still undecided are behind IRCC’s own schedule.` : ''}</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'work-ext', m: 'none' }, t: 'Your extension: decision date from IRCC’s queue' })}
<h2>A short series so far</h2>
<p>This weekly file is recent in our archive. We hold ${h.n(nTr)} readings, the first dated ${h.day(K.firstReading('tr'))}. Across them the forward time went from ${h.d(fw.first!, 'w')} to ${h.t(r.t)}, and the total waiting from ${K.fmtAhead(wait.first!, 'en')} to ${K.fmtAhead(wait.last, 'en')}. ${h.n(nTr)} readings are enough to describe the current state, not to call a trend; we will extend the table as new copies come in.</p>
${h.hist(r.series, { unit: 'w' })}
<p>Each row carries the date IRCC printed in the file, not the day we read it. The latest weekly file is dated ${h.day(r.date)}, while the file not split by country is dated ${h.day(past.date)}: the two figures on this page are therefore a few days apart, and the tool shows each one with its own date so that nothing is mixed silently.</p>
<h2>The past processing time since 2024</h2>
<p>The other file, not split by country, carries a past time for work permit extensions with a much longer history. It started at ${h.d(pt.first!)} on ${h.day(pt.firstDate!)}, climbed to ${h.d(pt.max)} on ${h.day(pt.maxDate)}, then fell to ${h.d(recentLow.v)} on ${h.day(recentLow.date)}. It reads ${h.t(past.t)} on ${h.day(past.date)}.</p>
${h.hist(past.series, { max: 12 })}
<p>The two measures answer different questions. The past time is a fact about files already closed; the queue is IRCC’s projection for files still open. When they diverge, the queue is the better guide for an application you are about to send, and the past time is the better check on whether IRCC’s projections have held up.</p>
<h2>Filing well and on time</h2>
<p>Apply before your current permit expires. That keeps you on maintained status, described on IRCC’s ${h.src('extend-work', 'extension page')}, and lets you keep working under the same conditions while you wait. If you leave Canada during that time, the protection ends and you may need a new permit to come back to work.</p>
<p>The date to enter in the tool is the date IRCC received the complete application, shown on your submission confirmation. If IRCC asks for a new job offer, a passport valid for longer or a medical exam, the file pauses until you answer. Status messages appear in your IRCC account; the ${h.src('check-status', 'status page')} explains where to look. When you are well past the week’s expected date, the ${h.a('beyond-processing-time', 'steps for a file past the processing time')} apply. Graduates looking for their first permit after studies should read the ${h.a('pgwp', 'post-graduation work permit page')} instead, since that is a new permit rather than an extension.</p>
`,
  },
  fr: {
    slug: 'delai-prolongation-permis-de-travail',
    nav: 'Prolongation du permis de travail', card: 'File hebdomadaire, personnes devant, délai passé',
    title: 'Délai de prolongation du permis de travail, relevé 2026',
    description: 'Délai 2026 de prolongation du permis de travail : file hebdomadaire d’IRCC par semaine de dépôt, nombre de personnes devant et délai passé depuis 2024.',
    h1: 'Prolongation du permis de travail : file et délai',
    intro: `Pour une prolongation déposée maintenant, IRCC prévoit ${K.fmtTime(r.t, 'fr')} (fichier du ${F.day(r.date)}), avec ${K.fmtAhead(r.waiting ?? null, 'fr')} demandes dans la file.`,
    resume: `IRCC publie deux chiffres pour la prolongation d’un permis de travail, et ils ne disent pas la même chose. Le chiffre prospectif, tiré du fichier hebdomadaire daté du ${F.day(r.date)}, est de ${K.fmtTime(r.t, 'fr')} : ce qu’IRCC prévoit pour une demande reçue maintenant. Le chiffre passé, relevé le ${F.day(past.date)}, est de ${K.fmtTime(past.t, 'fr')} : le temps qu’il a fallu pour terminer 80 % des prolongations tranchées récemment. Le fichier hebdomadaire donne aussi, pour chaque semaine de dépôt, le temps restant prévu et le nombre de personnes devant ; il compte au total ${K.fmtAhead(r.waiting ?? null, 'fr')} demandes en attente. Pour un dossier envoyé en ${wk(newest[0], 'fr')}, il indique ${F.n(newest[1])} semaines restantes et ${K.fmtAhead(newest[2], 'fr')} personnes devant. Le délai passé a beaucoup varié depuis 2024, de ${F.d(pt.first!)} le ${F.day(pt.firstDate!)} à un sommet de ${F.d(pt.max)} le ${F.day(pt.maxDate)}. L’outil retrouve votre semaine de dépôt dans la file et donne la date correspondante.`,
    faqs: [
      { q: 'Puis-je continuer à travailler pendant le traitement de ma prolongation de permis de travail ?', a: 'La page d’IRCC sur la prolongation du permis de travail décrit le statut maintenu : si vous déposez avant l’expiration de votre permis, vous pouvez rester au Canada et continuer à travailler aux mêmes conditions jusqu’à la décision, tant que vous ne quittez pas le pays. Si le permis était déjà expiré au moment du dépôt, cette protection ne s’applique pas.' },
      { q: 'Que veut dire « personnes devant » dans la file des prolongations de permis de travail ?', a: `Pour chaque semaine de dépôt, le fichier hebdomadaire d’IRCC estime combien de demandes de prolongation précèdent un dossier reçu cette semaine-là. Le chiffre est arrondi : c’est une taille de file, pas un rang. Le ${F.day(r.date)}, le total en attente était de ${K.fmtAhead(r.waiting ?? null, 'fr')}, contre ${K.fmtAhead(wait.first!, 'fr')} le ${F.day(wait.firstDate!)}.` },
      { q: 'Pourquoi le délai passé de prolongation du permis de travail dépasse-t-il le délai prospectif ?', a: `Le délai passé (${K.fmtTime(past.t, 'fr')}) décrit des dossiers déjà tranchés, souvent envoyés il y a des mois, quand la file était plus longue. Le délai prospectif (${K.fmtTime(r.t, 'fr')}) est la projection d’IRCC pour un dossier reçu maintenant. Quand un retard se résorbe, le délai passé reste plus haut un moment ; quand il grossit, c’est le prospectif qui bouge d’abord.` },
    ],
    body: (h) => `
<h2>La file hebdomadaire publiée par IRCC</h2>
<p>Le fichier hebdomadaire d’IRCC sur les prolongations de permis découpe la file par semaine de dépôt. Les semaines se comptent à l’intérieur du mois : du 1er au 7, semaine 1 ; du 8 au 14, semaine 2 ; et ainsi de suite. Pour chaque semaine, le fichier donne le temps restant prévu par IRCC et une estimation des demandes devant. Le tableau reprend les dernières semaines publiées le ${h.day(r.date)}.</p>
${h.table(['Semaine de dépôt', 'Temps restant', 'Personnes devant'], queueRows(h), `File des prolongations de permis de travail, fichier hebdomadaire d’IRCC du ${h.day(r.date)}, semaine la plus récente en premier.`, ['l', 'r', 'r'])}
<p>La logique est régulière : plus le dépôt est ancien, moins il reste de temps et moins il y a de monde devant. Un dossier de ${wk(oldestNum[0], 'fr')} a ${h.n(oldestNum[1])} semaines restantes ; un dossier de ${wk(newest[0], 'fr')} en a ${h.n(newest[1])}.${late ? ` Pour ${h.n(late)} semaines plus anciennes, le fichier indique que le délai prévu est déjà dépassé : les dossiers de ces semaines encore en attente sont en retard sur le calendrier d’IRCC lui-même.` : ''}</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'work-ext', m: 'none' }, t: 'Votre prolongation : date de décision selon la file d’IRCC' })}
<h2>Une série encore courte</h2>
<p>Ce fichier hebdomadaire est récent dans notre archive : nous en avons ${h.n(nTr)} relevés, le premier daté du ${h.day(K.firstReading('tr'))}. Sur ces relevés, le délai prospectif est passé de ${h.d(fw.first!, 'w')} à ${h.t(r.t)}, et le total en attente de ${K.fmtAhead(wait.first!, 'fr')} à ${K.fmtAhead(wait.last, 'fr')}. Ces ${h.n(nTr)} relevés suffisent à décrire la situation, pas à parler de tendance ; le tableau s’allongera avec les nouvelles copies.</p>
${h.hist(r.series, { unit: 'w' })}
<p>Chaque ligne porte la date imprimée par IRCC dans le fichier, pas le jour de notre lecture. Le dernier fichier hebdomadaire est daté du ${h.day(r.date)}, alors que le fichier non découpé par pays est daté du ${h.day(past.date)} : les deux chiffres de cette page ont donc quelques jours d’écart, et l’outil affiche chacun avec sa propre date pour ne rien mélanger en silence.</p>
<h2>Le délai passé depuis 2024</h2>
<p>L’autre fichier, qui n’est pas découpé par pays, porte un délai passé pour les prolongations de permis de travail, avec un historique bien plus long. Il partait de ${h.d(pt.first!)} le ${h.day(pt.firstDate!)}, est monté à ${h.d(pt.max)} le ${h.day(pt.maxDate)}, puis est redescendu à ${h.d(recentLow.v)} le ${h.day(recentLow.date)}. Il indique ${h.t(past.t)} au ${h.day(past.date)}.</p>
${h.hist(past.series, { max: 12 })}
<p>Les deux mesures répondent à des questions différentes. Le délai passé est un constat sur des dossiers fermés ; la file est la projection d’IRCC pour des dossiers ouverts. Quand ils s’écartent, la file guide mieux une demande que vous allez envoyer, et le délai passé permet de vérifier si les projections d’IRCC se sont confirmées.</p>
<h2>Déposer à temps et correctement</h2>
<p>Déposez avant l’expiration du permis en cours. Vous restez ainsi en statut maintenu, décrit sur la ${h.src('extend-work', 'page d’IRCC sur la prolongation')}, et vous continuez à travailler aux mêmes conditions pendant l’attente. Si vous quittez le Canada entre-temps, cette protection prend fin et un nouveau permis peut être nécessaire pour revenir travailler.</p>
<p>La date à indiquer dans l’outil est celle où IRCC a reçu la demande complète, inscrite sur la confirmation d’envoi. Si IRCC demande une nouvelle offre d’emploi, un passeport valide plus longtemps ou un examen médical, le dossier attend votre réponse. Les messages arrivent dans votre compte IRCC ; la ${h.src('check-status', 'page sur l’état des demandes')} indique où regarder. Si vous dépassez nettement la date prévue pour votre semaine, les ${h.a('beyond-processing-time', 'démarches pour un dossier hors délai')} s’appliquent. Les diplômés qui cherchent leur premier permis après les études liront plutôt la ${h.a('pgwp', 'page du permis post-diplôme')}, car il s’agit d’un nouveau permis et non d’une prolongation.</p>
`,
  },
});
