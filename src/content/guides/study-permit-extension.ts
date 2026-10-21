import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Prolongation du permis d'études : file prospective hebdomadaire (t:SP-EXT) et délai passé (n:study_extension). */
const r = K.readingOf('study-ext');
const alt = K.altOf('study-ext')!;
const q = r.queue ?? [];
const newest = q[q.length - 1];
const lateRows = q.filter((x) => x[1] === 'late');
const firstOpen = q.find((x) => typeof x[1] === 'number')!;
const fw = K.fullTrend('t:SP-EXT')!;
const wt = K.fullTrend('w:SP-EXT')!;
const pt = K.fullTrend('n:study_extension')!;
const yearAgo = K.valueNear('n:study_extension', `${Number(alt.date.slice(0, 4)) - 1}${alt.date.slice(4)}`);
const nWeekly = K.readingsCount('tr');
const E = K.en, F = K.fr;
/** « October 2026, week 2 » / « octobre 2026, semaine 2 ». */
const wk = (k: string, l: Lang) => (l === 'fr' ? `${K.monthYear(`${k.slice(0, 7)}-15`, l)}, semaine ${Number(k.slice(8))}` : `${K.monthYear(`${k.slice(0, 7)}-15`, l)}, week ${Number(k.slice(8))}`);
const left = (x: unknown, l: Lang) => (x === 'late' ? (l === 'fr' ? 'délai prévu dépassé' : 'past the expected time') : `${K.num(Number(x), l)} ${l === 'fr' ? (x === 1 ? 'semaine' : 'semaines') : x === 1 ? 'week' : 'weeks'}`);
const qRows = (l: Lang) => q.slice(-10).map((x) => [wk(x[0], l), left(x[1], l), K.fmtAhead(x[2], l)]);

export default defineGuide({
  id: 'study-permit-extension', group: 'study', order: 21,
  tool: 'delai', toolArg: { g: 'study-ext', only: 'study-ext,study-inside,work-ext' },
  related: ['study-permit', 'pgwp', 'work-permit-extension', 'beyond-processing-time'],
  sources: ['extend-study', 'ptimes-week', 'ptimes-noncountry', 'wayback'],
  en: {
    slug: 'study-permit-extension-processing-time',
    nav: 'Study permit extension', card: 'Weekly queue, people ahead, past time since 2024',
    title: 'Study Permit Extension Processing Time, Canada 2026',
    description: 'Study permit extension processing time in 2026: IRCC’s weekly queue by filing week, the number of people ahead of you and the past time recorded since 2024.',
    h1: 'Study permit extension: queue and processing time',
    intro: `IRCC’s weekly file of ${E.day(r.date)} gives ${K.fmtTime(r.t, 'en')} for an extension filed now, with ${K.fmtAhead(r.waiting ?? 0, 'en')} applications waiting.`,
    resume: `A study permit extension sent to IRCC today is expected to take ${K.fmtTime(r.t, 'en')}, according to the forward-looking file IRCC updated on ${E.day(r.date)}. That file also lists, for each week of filing, how much time is left and how many people are ahead: for applications received in ${wk(newest[0], 'en')}, IRCC shows ${left(newest[1], 'en')} left and ${K.fmtAhead(newest[2], 'en')} people ahead. In total ${K.fmtAhead(r.waiting ?? 0, 'en')} extension applications were waiting. A second figure, the past processing time, measures how long IRCC took for 80% of the extensions it recently decided: ${K.fmtTime(alt.t, 'en')} on ${E.day(alt.date)}, down from a high of ${E.d(pt.max)} on ${E.day(pt.maxDate)}. While the application is pending, a student who applied before the permit expired can usually keep studying under the same conditions, a status IRCC calls maintained status. The weekly queue is new: our archive holds only ${E.n(nWeekly)} readings of it, from ${E.day(fw.firstDate!)} onward, so no long trend can be drawn from it yet.`,
    faqs: [
      { q: 'How many people are ahead of my study permit extension?', a: `IRCC publishes it by week of filing. In its file of ${E.day(r.date)}, applications received in ${wk(newest[0], 'en')} had ${K.fmtAhead(newest[2], 'en')} people ahead, and those received in ${wk(firstOpen[0], 'en')} had ${K.fmtAhead(firstOpen[2], 'en')}. Enter your month and day of filing in the tool to see your own row.` },
      { q: 'Can I keep studying while my study permit extension is processed?', a: 'If you applied before your permit expired and stayed in Canada, you generally keep your status and can continue under the conditions of the old permit until IRCC decides. If you let the permit expire first, that protection does not apply and a restoration request is a different procedure. Check the conditions on IRCC’s extension page.' },
      { q: 'Why do the two study permit extension figures differ?', a: `The forward figure of ${K.fmtTime(r.t, 'en')} is IRCC’s projection for a file arriving now, based on its queue. The past figure of ${K.fmtTime(alt.t, 'en')} looks back at files already decided. When the queue shrinks, the projection can drop before the past time catches up, and the reverse when it grows.` },
    ],
    body: (h) => `
<h2>The weekly queue for study permit extensions</h2>
<p>For permit extensions filed inside Canada, IRCC also publishes a table by week of filing. Each row says how many weeks remain for files received that week and how many people are ahead of them. The table below is the latest version, dated ${h.day(r.date)}.</p>
${h.table(['Week filed', 'Time left', 'People ahead'], qRows(h.lang), `Study permit extensions: queue published by IRCC on ${h.day(r.date)}, latest ten weeks.`, ['l', 'r', 'r'])}
<p>${lateRows.length ? `The oldest weeks in the file, such as ${wk(lateRows[0][0], h.lang)}, are marked as past the expected time: IRCC expected to have finished them already. A file from one of those weeks still waiting is a reason to check the account and, if nothing is requested, to use IRCC’s web form.` : 'No week in the latest file is marked as past the expected time.'} The newest week, ${wk(newest[0], h.lang)}, shows ${left(newest[1], h.lang)} left.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'study-ext', m: 'none' }, t: 'Your study permit extension: expected decision' })}
<h2>A short series so far</h2>
<p>We have ${h.n(nWeekly)} dated copies of this weekly file, the first from ${h.day(fw.firstDate!)}. Across them, the projected time for a new extension went from ${h.d(fw.first!, 'w')} to ${h.d(fw.last, 'w')}, with a high of ${h.d(fw.max, 'w')} on ${h.day(fw.maxDate)}. The number of extension applications waiting moved from ${K.fmtAhead(wt.first!, h.lang)} to ${K.fmtAhead(wt.last, h.lang)}. Six readings over a few weeks show the level, not a trend.</p>
${h.hist('t:SP-EXT', { unit: 'w' })}
<h2>The past time, recorded weekly since 2024</h2>
<p>The longer record comes from IRCC’s past processing time for study permit extensions, the time within which 80% of recent decisions were made. Our first copy, dated ${h.day(pt.firstDate!)}, shows ${h.d(pt.first!)}. The figure then rose through the 2025 spring and peaked at ${h.d(pt.max)} on ${h.day(pt.maxDate)}${yearAgo ? `; a year before the latest reading, on ${h.day(yearAgo.date)}, it stood at ${h.d(yearAgo.v)}` : ''}. Since then it has come down, with a smaller rise in spring 2026, to ${h.d(pt.last)} on ${h.day(pt.lastDate)}${pt.last <= pt.min ? `, level with the lowest reading in our record, first reached on ${h.day(pt.minDate)}` : `, above the low of ${h.d(pt.min)} recorded on ${h.day(pt.minDate)}`}.</p>
${h.hist('n:study_extension', { max: 12 })}
<h2>Filing the extension</h2>
<p>An extension is filed online from inside Canada, normally at least 30 days before the permit expires, with proof of enrolment and of funds. The clock on both figures starts when IRCC receives the complete application. Biometrics given within the last ten years usually do not need to be repeated, which keeps most extensions free of an appointment; where IRCC does ask for them, the wait for the appointment is extra. A request for more documents also pauses the file until you answer.</p>
<p>Students who finish their program while the extension is pending often move next to a work permit after graduation, covered on the ${h.a('pgwp', 'PGWP page')}. The first permit requested from abroad is on the ${h.a('study-permit', 'study permit page')}, and the matching queue for workers is on the ${h.a('work-permit-extension', 'work permit extension page')}.</p>
<h2>Reading your own row</h2>
<p>Pick the month and day IRCC received your extension in the tool. It finds the matching week in the queue and turns the weeks left into a date counted from ${h.day(r.date)}, the date of IRCC’s file. Keep two limits in mind. The weeks left are a projection made by IRCC from its current workload, and they change from one weekly file to the next; a row can move by a week or two. The people ahead count every extension filed earlier and still open, including files that are waiting on the applicant for a document, so the real line in front of you may be shorter than the number shown. If your week is already marked as past the expected time, the ${h.a('beyond-processing-time', 'steps for a file past the processing time')} apply.</p>
`,
  },
  fr: {
    slug: 'delai-prolongation-permis-etudes',
    nav: 'Prolongation du permis d’études', card: 'File hebdomadaire, personnes devant, délai passé depuis 2024',
    title: 'Prolongation du permis d’études : délai d’IRCC 2026',
    description: 'Délai de prolongation du permis d’études en 2026 : file hebdomadaire d’IRCC par semaine de dépôt, personnes devant vous et délai passé relevé depuis 2024.',
    h1: 'Prolongation du permis d’études : file et délai',
    intro: `Le fichier hebdomadaire d’IRCC du ${F.day(r.date)} prévoit ${K.fmtTime(r.t, 'fr')} pour une prolongation déposée maintenant, avec ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes en attente.`,
    resume: `Une demande de prolongation du permis d’études envoyée aujourd’hui devrait prendre ${K.fmtTime(r.t, 'fr')}, selon le fichier prospectif mis à jour par IRCC le ${F.day(r.date)}. Ce fichier indique aussi, pour chaque semaine de dépôt, le temps restant et le nombre de personnes devant : pour les demandes reçues en ${wk(newest[0], 'fr')}, IRCC affiche ${left(newest[1], 'fr')} restantes et ${K.fmtAhead(newest[2], 'fr')} personnes devant. Au total, ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes de prolongation attendaient. Un second chiffre, le délai passé, mesure le temps qu’il a fallu à IRCC pour 80 % des prolongations tranchées récemment : ${K.fmtTime(alt.t, 'fr')} au ${F.day(alt.date)}, contre un sommet de ${F.d(pt.max)} le ${F.day(pt.maxDate)}. Pendant l’examen, l’étudiant qui a déposé avant l’expiration de son permis peut en général continuer ses études aux mêmes conditions : c’est le statut maintenu. La file hebdomadaire est récente : notre archive n’en compte que ${F.n(nWeekly)} relevés, à partir du ${F.day(fw.firstDate!)}, trop peu pour en tirer une tendance.`,
    faqs: [
      { q: 'Combien de personnes sont devant ma prolongation de permis d’études ?', a: `IRCC le publie par semaine de dépôt. Dans son fichier du ${F.day(r.date)}, les demandes reçues en ${wk(newest[0], 'fr')} avaient ${K.fmtAhead(newest[2], 'fr')} personnes devant elles, et celles de ${wk(firstOpen[0], 'fr')} en avaient ${K.fmtAhead(firstOpen[2], 'fr')}. Saisissez le mois et le jour de dépôt dans l’outil pour voir votre ligne.` },
      { q: 'Puis-je continuer mes cours pendant la prolongation du permis d’études ?', a: 'Si la demande a été déposée avant l’expiration du permis et que vous êtes resté au Canada, vous gardez en général votre statut et pouvez poursuivre aux conditions de l’ancien permis jusqu’à la décision. Si le permis a expiré avant le dépôt, cette protection ne joue pas et le rétablissement du statut est une autre démarche.' },
      { q: 'Pourquoi deux délais pour la prolongation du permis d’études ?', a: `Le délai prospectif de ${K.fmtTime(r.t, 'fr')} est la projection d’IRCC pour un dossier qui arrive maintenant, tirée de sa file. Le délai passé de ${K.fmtTime(alt.t, 'fr')} regarde les dossiers déjà tranchés. Quand la file se vide, la projection peut baisser avant que le délai passé ne suive, et l’inverse quand elle grossit.` },
    ],
    body: (h) => `
<h2>La file hebdomadaire des prolongations</h2>
<p>Pour les prolongations de permis déposées au Canada, IRCC publie aussi un tableau par semaine de dépôt. Chaque ligne donne le nombre de semaines restantes pour les dossiers reçus cette semaine-là et le nombre de personnes devant eux. Voici la dernière version, datée du ${h.day(r.date)}.</p>
${h.table(['Semaine de dépôt', 'Temps restant', 'Personnes devant'], qRows(h.lang), `Prolongations du permis d’études : file publiée par IRCC le ${h.day(r.date)}, dix dernières semaines.`, ['l', 'r', 'r'])}
<p>${lateRows.length ? `Les semaines les plus anciennes du fichier, comme ${wk(lateRows[0][0], h.lang)}, sont marquées comme ayant dépassé le délai prévu : IRCC comptait les avoir terminées. Un dossier de ces semaines toujours en attente justifie de vérifier le compte et, si rien n’y est demandé, d’écrire par le formulaire Web d’IRCC.` : 'Aucune semaine du dernier fichier n’est marquée comme ayant dépassé le délai prévu.'} La semaine la plus récente, ${wk(newest[0], h.lang)}, affiche ${left(newest[1], h.lang)} restantes.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'study-ext', m: 'none' }, t: 'Votre prolongation : décision attendue' })}
<h2>Une série encore courte</h2>
<p>Nous avons ${h.n(nWeekly)} copies datées de ce fichier hebdomadaire, la première du ${h.day(fw.firstDate!)}. D’une copie à l’autre, le délai prévu pour une nouvelle prolongation est passé de ${h.d(fw.first!, 'w')} à ${h.d(fw.last, 'w')}, avec un maximum de ${h.d(fw.max, 'w')} le ${h.day(fw.maxDate)}. Le nombre de demandes en attente est passé de ${K.fmtAhead(wt.first!, h.lang)} à ${K.fmtAhead(wt.last, h.lang)}. Six relevés en quelques semaines donnent un niveau, pas une tendance.</p>
${h.hist('t:SP-EXT', { unit: 'w' })}
<h2>Le délai passé, relevé chaque semaine depuis 2024</h2>
<p>La série longue est le délai passé d’IRCC pour les prolongations du permis d’études, soit le temps dans lequel 80 % des décisions récentes ont été rendues. Notre première copie, du ${h.day(pt.firstDate!)}, indique ${h.d(pt.first!)}. Le chiffre a ensuite monté au printemps 2025 jusqu’à ${h.d(pt.max)} le ${h.day(pt.maxDate)}${yearAgo ? ` ; un an avant le dernier relevé, le ${h.day(yearAgo.date)}, il était de ${h.d(yearAgo.v)}` : ''}. Depuis, il a baissé, avec une remontée plus courte au printemps 2026, jusqu’à ${h.d(pt.last)} le ${h.day(pt.lastDate)}${pt.last <= pt.min ? `, au niveau du plus bas de notre archive, atteint une première fois le ${h.day(pt.minDate)}` : `, au-dessus du plus bas de ${h.d(pt.min)} relevé le ${h.day(pt.minDate)}`}.</p>
${h.hist('n:study_extension', { max: 12 })}
<h2>Déposer la prolongation</h2>
<p>La prolongation se demande en ligne depuis le Canada, en principe au moins 30 jours avant l’expiration du permis, avec une preuve d’inscription et de ressources. Les deux compteurs démarrent à la réception de la demande complète. Des données biométriques fournies dans les dix dernières années n’ont en général pas à être redonnées ; si IRCC les redemande, l’attente du rendez-vous s’ajoute. Une demande de documents met aussi le dossier en pause jusqu’à votre réponse. Pour les études au Québec, un nouveau certificat d’acceptation du Québec peut être nécessaire avant la demande fédérale.</p>
<p>Les étudiants qui terminent leur programme pendant l’examen passent souvent ensuite au permis de travail postdiplôme, décrit sur la ${h.a('pgwp', 'page du PTPD')}. Le premier permis demandé depuis l’étranger est sur la ${h.a('study-permit', 'page du permis d’études')}, et la file des travailleurs sur la ${h.a('work-permit-extension', 'page de la prolongation du permis de travail')}.</p>
<h2>Lire votre propre ligne</h2>
<p>Choisissez dans l’outil le mois et le jour où IRCC a reçu votre prolongation. Il retrouve la semaine correspondante dans la file et convertit les semaines restantes en date, comptée à partir du ${h.day(r.date)}, date du fichier d’IRCC. Deux limites à garder en tête. Les semaines restantes sont une projection d’IRCC fondée sur sa charge actuelle : elles changent d’un fichier à l’autre et une ligne peut bouger d’une ou deux semaines. Les personnes devant comprennent toutes les prolongations déposées avant la vôtre et encore ouvertes, y compris celles qui attendent un document du demandeur : la file réelle peut donc être plus courte que le chiffre affiché. Si votre semaine est déjà marquée comme hors délai, les ${h.a('beyond-processing-time', 'démarches pour un dossier qui dépasse le délai')} s’appliquent.</p>
`,
  },
});
