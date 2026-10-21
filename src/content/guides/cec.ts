import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Catégorie de l'expérience canadienne : délai prospectif et file par mois de dépôt publiés par IRCC (flpt). */
const P = 'cec';
const R = K.readingOf(P);
const Q = R.queue ?? [];
const D = R.date;
const T = K.fullTrend(R.series)!;
const late = Q.filter((q) => q[1] === 'late');
const open = Q.filter((q) => typeof q[1] === 'number');
const firstOpen = open[0];
const lastRow = Q[Q.length - 1];
const lastLate = late[late.length - 1];
const since = `${Number(K.READ.slice(0, 4)) - 1}${K.READ.slice(4)}`;
const st = K.eeStats(K.ROUNDS, 'cec', 0, since);
const highest = st.list.filter((x) => x.crs != null).reduce((a, x) => (x.crs! > a.crs! ? x : a), st.list[0]);
const sample = Q[Math.max(0, Q.length - 6)];
const sampleEst = K.estimate(P, 'IN', `${sample[0]}-15`);
const fsw = K.readingOf('fsw');
const E = K.en, F = K.fr;

function queueRows(h: Helpers) {
  return Q.slice(-12).reverse().map((q) => [
    h.my(`${q[0]}-15`),
    typeof q[1] === 'number' ? h.d(q[1] * 365.25 / 12, 'm') : (h.lang === 'fr' ? 'délai prévu dépassé' : 'past the expected time'),
    typeof q[1] === 'number' ? h.my(K.addMonths(D, q[1])) : '',
    K.fmtAhead(q[2], h.lang),
  ]);
}

export default defineGuide({
  id: 'cec', group: 'pr', order: 41,
  tool: 'delai', toolArg: { g: 'cec' },
  related: ['express-entry', 'fsw', 'pnp', 'express-entry-draws', 'work-permit-extension', 'beyond-processing-time'],
  sources: ['ptimes-flpt', 'express-entry', 'ee-rounds', 'check-status'],
  en: {
    slug: 'canadian-experience-class-processing-time',
    nav: 'Canadian Experience Class', card: 'Queue by month of filing, people ahead, trend',
    title: 'CEC Processing Time 2026, Queue and People Ahead by Month',
    description: 'CEC processing time in 2026: the months IRCC still expects for your month of filing, people ahead of you, the CEC figure since October 2025 and recent rounds.',
    h1: 'Canadian Experience Class processing time, month by month',
    intro: `IRCC expects ${K.fmtTime(R.t, 'en')} for a CEC application received now, in its update of ${E.day(D)}, with about ${E.n(R.waiting ?? 0)} files in line.`,
    resume: `A permanent residence application under the Canadian Experience Class received today should take ${K.fmtTime(R.t, 'en')}, according to the forward-looking time IRCC published on ${E.day(D)}. If you have already applied, the more useful figure is IRCC’s queue by month of filing: for files received in ${E.my(`${lastRow[0]}-15`)}, it expects ${E.n(lastRow[1] as number)} more months with ${K.fmtAhead(lastRow[2], 'en')} applications ahead, while every month up to ${E.my(`${lastLate[0]}-15`)} is marked as past the expected time. In total about ${E.n(R.waiting ?? 0)} CEC applications were waiting. Since our first dated copy of ${E.day(T.firstDate!)}, the headline time has moved between ${E.d(T.min, 'm')} and ${E.d(T.max, 'm')}. Over the twelve months to ${E.day(K.READ)}, IRCC held ${E.n(st.n)} rounds reserved to this class and sent ${E.n(st.total)} invitations, with cut-off scores from ${st.lowest?.crs} to ${highest.crs}. Enter your month of filing in the tool to read your own line.`,
    faqs: [
      { q: 'What does “past the expected time” mean in the CEC queue?', a: `It means IRCC no longer counts any remaining time for files received that month: they have gone beyond what IRCC planned. On ${E.day(D)}, this covered every month up to ${E.my(`${lastLate[0]}-15`)}. Most of those files are already decided; the ones still open are often waiting on a document, a check or a medical exam.` },
      { q: 'How many people are ahead of my CEC application?', a: `IRCC publishes a rounded count of applications ahead for each month of filing. For ${E.my(`${sample[0]}-15`)}, the file of ${E.day(D)} shows ${K.fmtAhead(sample[2], 'en')}; for the latest month, ${E.my(`${lastRow[0]}-15`)}, it shows ${K.fmtAhead(lastRow[2], 'en')}. The count tells you the size of the line, not the order in which officers pick files.` },
      { q: 'Can I keep working in Canada while my CEC application is processed?', a: 'Often yes. If your work permit is still valid, you keep working under it. If it is about to expire, IRCC offers a bridging open work permit to some permanent residence applicants, and applying to extend before expiry lets you keep your status while IRCC decides. Check the conditions on IRCC’s pages before your permit ends.' },
      { q: 'Is the CEC processing time shorter than the FSW one in 2026?', a: `In IRCC’s update of ${E.day(D)}, the Canadian Experience Class shows ${K.fmtTime(R.t, 'en')} and the Federal Skilled Worker Program ${K.fmtTime(fsw.t, 'en')}. The order has swapped several times since October 2025, and a one-month gap is within IRCC’s rounding, so neither line is reliably faster.` },
    ],
    body: (h) => `
<h2>Where your month of filing stands</h2>
<p>IRCC’s file does not stop at one headline time. For the Canadian Experience Class it lists every month of filing over the past three years, with the number of months it still expects and the number of applications ahead. The table shows the last twelve months as of ${h.day(D)}. The expected month is IRCC’s update date plus the months left, so it is a month, never a day.</p>
${h.table(['Month IRCC received the file', 'Time left, per IRCC', 'Expected around', 'Applications ahead'], queueRows(h), `Canadian Experience Class queue, IRCC update of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>The pattern is steep. Files received in ${h.my(`${firstOpen[0]}-15`)} have ${h.d((firstOpen[1] as number) * 365.25 / 12, 'm')} left with ${K.fmtAhead(firstOpen[2], h.lang)} ahead; for ${h.my(`${lastRow[0]}-15`)} the count rises to ${K.fmtAhead(lastRow[2], h.lang)}. Most of that gap is simply recent files that nobody has opened yet. The ${h.n(late.length)} oldest months are marked as past the expected time, which is IRCC’s way of saying it no longer plans any time for them.</p>
${h.mini('delai', { p: ['m'], d: { g: P, m: sample[0], d: 15 }, t: 'Your CEC month of filing: what IRCC expects' })}
<p>Take a file received on ${h.day(sampleEst.from)}. Adding the headline time gives ${sampleEst.date ? h.my(sampleEst.date) : ''}. IRCC’s queue for that month gives ${sampleEst.queue?.date ? h.my(sampleEst.queue.date) : ''} instead, because it reflects where those files actually sit today. When the two differ, the queue is the better guide for a file already in line, and the headline time for one not filed yet.</p>
<h2>The headline time since October 2025</h2>
<p>Our dated series for this line begins with the copy of ${h.day(T.firstDate!)}. Since then the figure has ranged from ${h.d(T.min, 'm')} to ${h.d(T.max, 'm')}, and now reads ${h.d(T.last, 'm')}. That stability hides the queue: the number of files waiting can grow while the headline time stays still, as long as IRCC expects to decide them at the same pace. How IRCC builds this kind of estimate is set out on the ${h.a('method', 'method page')}.</p>
${h.hist(R.series, { max: 12, unit: 'm' })}
<h2>Who applies under this class</h2>
<p>The Canadian Experience Class is the Express Entry program for people who already have skilled work experience in Canada: at least one year of it, gained with authorization, in the three years before applying. Many applicants are former international students on a ${h.a('pgwp', 'post-graduation work permit')} or workers on an employer-specific permit. That profile explains why the class is often invited in rounds of its own rather than in general ones.</p>
<h2>Rounds reserved to the class</h2>
<p>In the twelve months to ${h.day(K.READ)}, IRCC held ${h.n(st.n)} Canadian Experience Class rounds and issued ${h.n(st.total)} invitations in them. The lowest cut-off was ${st.lowest?.crs} on ${st.lowest ? h.day(st.lowest.date) : ''}; the most recent round, on ${st.last ? h.day(st.last.date) : ''}, invited ${st.last ? h.n(st.last.size) : ''} candidates at ${st.last?.crs}. Every round listed with its date, size and cut-off is on the ${h.a('express-entry-draws', 'Express Entry rounds page')}. A rise in invitations shows up in the queue a few months later, once the invited candidates have filed.</p>
<h2>While the file is open</h2>
<p>Keep your status valid. A worker whose permit is about to run out can ask to extend it or, under IRCC’s conditions, apply for a bridging open work permit; the ${h.a('work-permit-extension', 'work permit extension page')} gives the time for that request. Answer document requests quickly, since the file waits for you. If your month is marked past the expected time and nothing has moved for a while, the ${h.a('beyond-processing-time', 'steps for a late application')} explain how to ask IRCC about it. The other two Express Entry lines are compared on the ${h.a('express-entry', 'Express Entry overview')}.</p>
`,
  },
  fr: {
    slug: 'delai-experience-canadienne',
    nav: 'Expérience canadienne', card: 'File par mois de dépôt, personnes devant, tendance',
    title: 'Délai de l’expérience canadienne (CEC) et file d’IRCC, 2026',
    description: 'Délai de la catégorie de l’expérience canadienne en 2026 : mois restants selon votre mois de dépôt, demandes devant vous, évolution depuis octobre 2025.',
    h1: 'Délai de la catégorie de l’expérience canadienne, mois par mois',
    intro: `IRCC prévoit ${K.fmtTime(R.t, 'fr')} pour une demande de l’expérience canadienne reçue aujourd’hui, dans sa mise à jour du ${F.day(D)}, avec environ ${F.n(R.waiting ?? 0)} dossiers en file.`,
    resume: `Une demande de résidence permanente dans la catégorie de l’expérience canadienne reçue aujourd’hui devrait prendre ${K.fmtTime(R.t, 'fr')}, selon le délai prospectif publié par IRCC le ${F.day(D)}. Si vous avez déjà déposé, le chiffre le plus utile est la file d’IRCC par mois de dépôt : pour les dossiers reçus en ${F.my(`${lastRow[0]}-15`)}, elle prévoit encore ${F.n(lastRow[1] as number)} mois avec ${K.fmtAhead(lastRow[2], 'fr')} demandes devant, alors que tous les mois jusqu’à ${F.my(`${lastLate[0]}-15`)} portent la mention « délai prévu dépassé ». Au total, environ ${F.n(R.waiting ?? 0)} demandes attendaient. Depuis notre première copie datée du ${F.day(T.firstDate!)}, le délai principal a varié entre ${F.d(T.min, 'm')} et ${F.d(T.max, 'm')}. Sur les douze mois au ${F.day(K.READ)}, IRCC a tenu ${F.n(st.n)} rondes réservées à cette catégorie et envoyé ${F.n(st.total)} invitations, avec des scores minimaux de ${st.lowest?.crs} à ${highest.crs}. Indiquez votre mois de dépôt dans l’outil pour lire votre propre ligne.`,
    faqs: [
      { q: 'Que veut dire « délai prévu dépassé » dans la file de l’expérience canadienne ?', a: `IRCC ne compte plus aucun temps restant pour les dossiers reçus ce mois-là : ils ont dépassé ce qu’il avait prévu. Le ${F.day(D)}, c’était le cas de tous les mois jusqu’à ${F.my(`${lastLate[0]}-15`)}. La plupart de ces dossiers sont déjà tranchés ; ceux qui restent ouverts attendent souvent un document, une vérification ou un examen médical.` },
      { q: 'Combien de personnes sont devant ma demande de l’expérience canadienne ?', a: `IRCC publie, pour chaque mois de dépôt, un nombre arrondi de demandes devant. Pour ${F.my(`${sample[0]}-15`)}, le fichier du ${F.day(D)} indique ${K.fmtAhead(sample[2], 'fr')} ; pour le dernier mois, ${F.my(`${lastRow[0]}-15`)}, ${K.fmtAhead(lastRow[2], 'fr')}. Ce nombre donne la taille de la file, pas l’ordre dans lequel les agents prennent les dossiers.` },
      { q: 'Puis-je continuer à travailler au Canada pendant le traitement de ma demande CEC ?', a: 'Souvent, oui. Tant que votre permis de travail est valide, vous travaillez sous ce permis. S’il arrive à échéance, IRCC offre à certains demandeurs de résidence permanente un permis de travail ouvert transitoire, et une demande de prolongation faite avant l’échéance maintient votre statut pendant la décision. Vérifiez les conditions sur les pages d’IRCC avant la fin du permis.' },
      { q: 'Le délai de l’expérience canadienne est-il plus court que celui des travailleurs qualifiés du fédéral ?', a: `Dans la mise à jour d’IRCC du ${F.day(D)}, l’expérience canadienne affiche ${K.fmtTime(R.t, 'fr')} et le Programme des travailleurs qualifiés du fédéral ${K.fmtTime(fsw.t, 'fr')}. L’ordre s’est inversé plusieurs fois depuis octobre 2025, et un mois d’écart reste dans l’arrondi d’IRCC : aucune des deux files n’est plus rapide à coup sûr.` },
    ],
    body: (h) => `
<h2>Où en est votre mois de dépôt</h2>
<p>Le fichier d’IRCC ne s’arrête pas à un délai principal. Pour l’expérience canadienne, il liste chaque mois de dépôt des trois dernières années, avec le nombre de mois encore prévus et le nombre de demandes devant. Le tableau reprend les douze derniers mois au ${h.day(D)}. Le mois attendu est la date de mise à jour d’IRCC plus les mois restants : c’est un mois, jamais un jour précis.</p>
${h.table(['Mois de réception du dossier', 'Temps restant selon IRCC', 'Attendu vers', 'Demandes devant'], queueRows(h), `File de l’expérience canadienne, mise à jour d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>La pente est forte. Les dossiers reçus en ${h.my(`${firstOpen[0]}-15`)} ont encore ${h.d((firstOpen[1] as number) * 365.25 / 12, 'm')} devant eux, avec ${K.fmtAhead(firstOpen[2], h.lang)} demandes devant ; pour ${h.my(`${lastRow[0]}-15`)}, le nombre monte à ${K.fmtAhead(lastRow[2], h.lang)}. L’essentiel de cet écart, ce sont des dossiers récents que personne n’a encore ouverts. Les ${h.n(late.length)} mois les plus anciens portent la mention « délai prévu dépassé » : IRCC ne leur prévoit plus de temps.</p>
${h.mini('delai', { p: ['m'], d: { g: P, m: sample[0], d: 15 }, t: 'Votre mois de dépôt CEC : ce que prévoit IRCC' })}
<p>Prenons un dossier reçu le ${h.day(sampleEst.from)}. Le délai principal ajouté à cette date donne ${sampleEst.date ? h.my(sampleEst.date) : ''}. La file d’IRCC pour ce mois donne plutôt ${sampleEst.queue?.date ? h.my(sampleEst.queue.date) : ''}, parce qu’elle reflète la position réelle de ces dossiers aujourd’hui. Quand les deux diffèrent, la file guide mieux un dossier déjà déposé, et le délai principal un dossier à venir.</p>
<h2>Le délai principal depuis octobre 2025</h2>
<p>Notre série datée commence avec la copie du ${h.day(T.firstDate!)}. Depuis, le chiffre est allé de ${h.d(T.min, 'm')} à ${h.d(T.max, 'm')}, et il indique aujourd’hui ${h.d(T.last, 'm')}. Cette stabilité cache la file : le nombre de dossiers en attente peut grossir sans que le délai principal bouge, tant qu’IRCC prévoit de les trancher au même rythme. La façon dont IRCC construit ce genre d’estimation est décrite sur la ${h.a('method', 'page de méthode')}.</p>
${h.hist(R.series, { max: 12, unit: 'm' })}
<h2>Qui dépose dans cette catégorie</h2>
<p>La catégorie de l’expérience canadienne est le programme de l’Entrée express réservé aux personnes qui ont déjà une expérience de travail qualifié au Canada : au moins un an, acquise avec autorisation, dans les trois ans qui précèdent la demande. Beaucoup de demandeurs sont d’anciens étudiants étrangers titulaires d’un ${h.a('pgwp', 'permis de travail postdiplôme')}, ou des travailleurs liés à un employeur. Ce profil explique pourquoi la catégorie est souvent invitée dans des rondes à part plutôt que dans des rondes générales.</p>
<h2>Les rondes réservées à la catégorie</h2>
<p>Sur les douze mois au ${h.day(K.READ)}, IRCC a tenu ${h.n(st.n)} rondes de l’expérience canadienne et y a envoyé ${h.n(st.total)} invitations. Le score minimal le plus bas a été de ${st.lowest?.crs}, le ${st.lowest ? h.day(st.lowest.date) : ''} ; la ronde la plus récente, le ${st.last ? h.day(st.last.date) : ''}, a invité ${st.last ? h.n(st.last.size) : ''} candidats à partir de ${st.last?.crs}. Chaque ronde, avec sa date, sa taille et son score minimal, figure sur la ${h.a('express-entry-draws', 'page des rondes de l’Entrée express')}. Une hausse des invitations se voit dans la file quelques mois plus tard, une fois que les candidats invités ont déposé.</p>
<h2>Pendant que le dossier est ouvert</h2>
<p>Gardez un statut valide. Un travailleur dont le permis arrive à échéance peut en demander la prolongation ou, aux conditions d’IRCC, demander un permis de travail ouvert transitoire ; la ${h.a('work-permit-extension', 'page de la prolongation du permis de travail')} donne le délai de cette demande. Répondez vite aux demandes de documents : le dossier vous attend. Si votre mois porte la mention « délai prévu dépassé » et que rien ne bouge depuis un moment, les ${h.a('beyond-processing-time', 'démarches pour une demande en retard')} expliquent comment interroger IRCC. Les deux autres files de l’Entrée express sont comparées sur la ${h.a('express-entry', 'page d’ensemble de l’Entrée express')}.</p>
`,
  },
});
