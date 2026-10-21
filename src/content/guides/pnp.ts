import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Programme des candidats des provinces : volet Entrée express et volet de base, fichier prospectif d'IRCC (flpt). */
const EE = K.readingOf('pnp-ee'), BA = K.readingOf('pnp-base');
const TE = K.fullTrend(EE.series)!, TB = K.fullTrend(BA.series)!;
const D = EE.date;
const QB = BA.queue ?? [], QE = EE.queue ?? [];
const bLast = QB[QB.length - 1], eLast = QE[QE.length - 1];
const bOpen = QB.filter((q) => typeof q[1] === 'number');
const bOldestOpen = bOpen[0];
const yAgo = (q: typeof QB) => q[Math.max(0, q.length - 13)];
const since = `${Number(K.READ.slice(0, 4)) - 1}${K.READ.slice(4)}`;
const st = K.eeStats(K.ROUNDS, 'pnp', 0, since);
const highest = st.list.filter((x) => x.crs != null).reduce((a, x) => (x.crs! > a.crs! ? x : a), st.list[0]);
const ratio = (BA.waiting ?? 0) / Math.max(1, EE.waiting ?? 1);
const tE = K.isTime(EE.t) ? EE.t : null, tB = K.isTime(BA.t) ? BA.t : null;
const dE = tE ? K.addTime(K.READ, tE) : K.READ, dB = tB ? K.addTime(K.READ, tB) : K.READ;
const E = K.en, F = K.fr;

function doors(h: Helpers) {
  const fr = h.lang === 'fr';
  return [
    [h.a('express-entry', fr ? 'Volet Entrée express' : 'Express Entry stream'), h.t(EE.t), h.n(EE.waiting ?? 0), `${h.d(TE.first!, 'm')} (${h.day(TE.firstDate!)})`],
    [fr ? 'Volet de base' : 'Base stream', h.t(BA.t), h.n(BA.waiting ?? 0), `${h.d(TB.first!, 'm')} (${h.day(TB.firstDate!)})`],
  ];
}
function baseQueue(h: Helpers) {
  const pick = QB.filter((_, i) => (QB.length - 1 - i) % 4 === 0).slice(-7).reverse();
  return pick.map((q) => [h.my(`${q[0]}-15`), typeof q[1] === 'number' ? h.d(q[1] * 365.25 / 12, 'm') : (h.lang === 'fr' ? 'délai prévu dépassé' : 'past the expected time'), K.fmtAhead(q[2], h.lang)]);
}

export default defineGuide({
  id: 'pnp', group: 'pr', order: 43,
  tool: 'delai', toolArg: { g: 'pnp-ee', only: 'pnp-ee,pnp-base' },
  related: ['express-entry', 'cec', 'fsw', 'atlantic', 'express-entry-draws', 'work-permit-extension'],
  sources: ['ptimes-flpt', 'pnp', 'express-entry', 'ee-rounds'],
  en: {
    slug: 'provincial-nominee-program-processing-time',
    nav: 'Provincial Nominee Program', card: 'Express Entry stream against base stream',
    title: 'PNP Processing Time 2026, Express Entry and Base Streams',
    description: 'Provincial Nominee Program processing time in 2026 at IRCC: Express Entry stream against base (paper) stream, applications waiting, queue and trend since 2025.',
    h1: 'Provincial Nominee Program processing time at IRCC',
    intro: `On ${E.day(D)}, IRCC expected ${K.fmtTime(EE.t, 'en')} for a nominee who applies through Express Entry and ${K.fmtTime(BA.t, 'en')} through the base stream.`,
    resume: `After a province or territory has nominated you, IRCC’s permanent residence step currently takes ${K.fmtTime(EE.t, 'en')} if you apply through Express Entry and ${K.fmtTime(BA.t, 'en')} if you apply through the base stream, according to the forward-looking times IRCC published on ${E.day(D)}. The gap is about volume: about ${E.n(BA.waiting ?? 0)} base stream applications were waiting, against ${E.n(EE.waiting ?? 0)} in the Express Entry stream, roughly ${E.n(ratio)} times as many. The base stream figure has come down since our first dated copy, from ${E.d(TB.first!, 'm')} on ${E.day(TB.firstDate!)} to ${E.d(TB.last, 'm')}, while the Express Entry stream has stayed between ${E.d(TE.min, 'm')} and ${E.d(TE.max, 'm')}. Neither number includes the province’s own nomination process, which comes first and has its own times. In the twelve months to ${E.day(K.READ)}, IRCC held ${E.n(st.n)} Express Entry rounds for provincial nominees and sent ${E.n(st.total)} invitations. The tool above reads IRCC’s queue for your month of filing in either stream.`,
    faqs: [
      { q: 'Why is the PNP base stream so much slower than the Express Entry stream?', a: `Mostly because of the size of the line. On ${E.day(D)}, IRCC counted about ${E.n(BA.waiting ?? 0)} base stream applications waiting against ${E.n(EE.waiting ?? 0)} through Express Entry. A nomination in the base stream does not move into Express Entry by itself: the stream depends on how the province nominated you.` },
      { q: 'Does the PNP processing time include the province’s nomination?', a: 'No. The figures on this page start when IRCC receives your permanent residence application, after the province or territory has nominated you. Each province runs its own intake and publishes, or not, its own processing times. Quebec has no provincial nominee program and selects its immigrants through its own system.' },
      { q: 'How many people are ahead of me in the PNP base stream queue?', a: `IRCC publishes a rounded count for each month of filing. In its update of ${E.day(D)}, files received in ${E.my(`${bLast[0]}-15`)} had ${K.fmtAhead(bLast[2], 'en')} applications ahead, and the oldest month still given a remaining time was ${E.my(`${bOldestOpen[0]}-15`)}. Choose your month of filing in the tool to read your line.` },
    ],
    body: (h) => `
<h2>Two doors after the nomination</h2>
<p>A provincial nomination leads to IRCC in one of two ways, chosen by the province when it nominates you. In the Express Entry stream, the nomination is attached to an Express Entry profile, the candidate is invited in a round and files online. In the base stream, the candidate applies to IRCC outside Express Entry. The table compares the two lines in IRCC’s update of ${h.day(D)} with our oldest dated copy.</p>
${h.table(['Stream', 'Time for a file received now', 'Applications waiting', 'Oldest copy kept'], doors(h), `Provincial nominees, IRCC forward-looking file of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>The base stream line holds about ${h.n(ratio)} times as many applications. Its figure nonetheless fell across the readings we kept, reaching a low of ${h.d(TB.min, 'm')} on ${h.day(TB.minDate)}. The Express Entry stream barely moved, alternating between ${h.d(TE.min, 'm')} and ${h.d(TE.max, 'm')}. Both are forward-looking figures, IRCC’s estimate for a file received on the day of the update; the ${h.a('method', 'method page')} explains what that means.</p>
<h2>The base stream reading by reading</h2>
${h.hist(BA.series, { max: 12, unit: 'm' })}
<p>Each line comes from a dated copy of IRCC’s file, read directly or through the Internet Archive. Our series starts in October 2025, with the first copy of this file we could date; no earlier month is filled in.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'pnp-base', m: yAgo(QB)[0], d: 15 }, t: 'Your PNP application: where your month of filing stands' })}
<h2>The base stream queue</h2>
<p>IRCC’s queue for the base stream shows how far back the line reaches. In the update of ${h.day(D)}, the oldest month still given a remaining time is ${h.my(`${bOldestOpen[0]}-15`)}, and every later month has months left to run. Files received in ${h.my(`${bLast[0]}-15`)} have ${h.d((bLast[1] as number) * 365.25 / 12, 'm')} left with ${K.fmtAhead(bLast[2], h.lang)} applications ahead. The table keeps one month in four.</p>
${h.table(['Month filed', 'Time left', 'Applications ahead'], baseQueue(h), `Provincial nominee base stream queue, IRCC update of ${h.day(D)}.`, ['l', 'r', 'r'])}
<p>In the Express Entry stream, the same table is much shorter: for ${h.my(`${eLast[0]}-15`)}, IRCC gives ${h.d((eLast[1] as number) * 365.25 / 12, 'm')} left with ${K.fmtAhead(eLast[2], h.lang)} applications ahead. Choose the stream and your month in the tool to see your own row.</p>
<h2>Rounds for provincial nominees</h2>
<p>A nominee in the Express Entry stream still needs an invitation. IRCC holds rounds reserved to provincial nominees, and the nomination adds 600 points to the candidate’s score, which is why their cut-offs sit far above other rounds. In the twelve months to ${h.day(K.READ)}, IRCC held ${h.n(st.n)} such rounds and sent ${h.n(st.total)} invitations, with cut-offs from ${st.lowest?.crs} to ${highest.crs}. The most recent one, on ${st.last ? h.day(st.last.date) : ''}, invited ${st.last ? h.n(st.last.size) : ''} candidates. Rounds of every kind are listed on the ${h.a('express-entry-draws', 'Express Entry draws page')}.</p>
<h2>What the two figures mean for a plan</h2>
<p>Put the figures side by side on a calendar. A complete application received by IRCC on ${h.day(K.READ)} would, at today’s pace, be decided around ${h.my(dE)} in the Express Entry stream and around ${h.my(dB)} in the base stream. That is a planning horizon, not a date: IRCC revises both numbers at each update, and the base stream has moved by several months within a single year. Anyone whose temporary status, job offer or lease depends on the decision should plan for the longer end and check the figure again after each monthly update.</p>
<p>The stream is not a free choice. Some provinces nominate only through Express Entry for certain programs and only through the base stream for others, and a candidate without an Express Entry profile can be nominated only in the base stream. When both doors are open to you, the difference in time is real but it is only one factor; the province’s own requirements and intake periods weigh as much.</p>
<h2>Staying in Canada during the wait</h2>
<p>Many nominees already work in the province that nominated them. A worker whose permit is running out may be able to extend it or get a bridging open work permit while IRCC decides, under the conditions IRCC sets; the ${h.a('work-permit-extension', 'work permit extension page')} gives the time for those requests. The ${h.a('atlantic', 'Atlantic Immigration Program')} is a separate employer-driven route for the four Atlantic provinces, with its own line in IRCC’s file. Nominees who also qualify for the ${h.a('cec', 'Canadian Experience Class')} can compare that line before choosing how to apply.</p>
`,
  },
  fr: {
    slug: 'delai-candidats-provinces',
    nav: 'Candidats des provinces', card: 'Volet Entrée express et volet de base',
    title: 'Délai du PCP en 2026, volet Entrée express et volet de base',
    description: 'Délai du Programme des candidats des provinces en 2026 : volet Entrée express et volet de base, demandes en attente, file et tendance depuis octobre 2025.',
    h1: 'Délai du Programme des candidats des provinces chez IRCC',
    intro: `Le ${F.day(D)}, IRCC prévoyait ${K.fmtTime(EE.t, 'fr')} pour un candidat d’une province qui passe par l’Entrée express et ${K.fmtTime(BA.t, 'fr')} par le volet de base.`,
    resume: `Une fois la désignation obtenue d’une province ou d’un territoire, l’étape de la résidence permanente chez IRCC prend aujourd’hui ${K.fmtTime(EE.t, 'fr')} par le volet Entrée express et ${K.fmtTime(BA.t, 'fr')} par le volet de base, selon les délais prospectifs publiés par IRCC le ${F.day(D)}. L’écart tient au volume : environ ${F.n(BA.waiting ?? 0)} demandes du volet de base attendaient, contre ${F.n(EE.waiting ?? 0)} dans le volet Entrée express, soit à peu près ${F.n(ratio)} fois plus. Le délai du volet de base a baissé depuis notre première copie datée, de ${F.d(TB.first!, 'm')} le ${F.day(TB.firstDate!)} à ${F.d(TB.last, 'm')}, alors que celui du volet Entrée express est resté entre ${F.d(TE.min, 'm')} et ${F.d(TE.max, 'm')}. Aucun des deux ne compte la désignation par la province, qui vient d’abord et a ses propres délais. Sur les douze mois au ${F.day(K.READ)}, IRCC a tenu ${F.n(st.n)} rondes de l’Entrée express pour les candidats des provinces et envoyé ${F.n(st.total)} invitations. L’outil ci-dessus lit la file d’IRCC pour votre mois de dépôt, dans l’un ou l’autre volet.`,
    faqs: [
      { q: 'Pourquoi le volet de base du PCP est-il beaucoup plus lent que le volet Entrée express ?', a: `Surtout à cause de la taille de la file. Le ${F.day(D)}, IRCC comptait environ ${F.n(BA.waiting ?? 0)} demandes du volet de base en attente, contre ${F.n(EE.waiting ?? 0)} par l’Entrée express. Une désignation du volet de base ne passe pas d’elle-même dans l’Entrée express : le volet dépend de la façon dont la province vous a désigné.` },
      { q: 'Le délai du PCP comprend-il la désignation par la province ?', a: 'Non. Les chiffres de cette page démarrent quand IRCC reçoit la demande de résidence permanente, après la désignation par la province ou le territoire. Chaque province gère ses propres entrées et publie, ou non, ses propres délais. Le Québec n’a pas de programme des candidats des provinces : il sélectionne ses immigrants par son propre système.' },
      { q: 'Combien de personnes sont devant moi dans la file du volet de base du PCP ?', a: `IRCC publie un nombre arrondi pour chaque mois de dépôt. Dans sa mise à jour du ${F.day(D)}, les dossiers reçus en ${F.my(`${bLast[0]}-15`)} avaient ${K.fmtAhead(bLast[2], 'fr')} demandes devant, et le plus ancien mois auquel IRCC donne encore un temps restant était ${F.my(`${bOldestOpen[0]}-15`)}. Choisissez votre mois de dépôt dans l’outil pour lire votre ligne.` },
    ],
    body: (h) => `
<h2>Deux portes après la désignation</h2>
<p>Une désignation provinciale mène à IRCC par l’une de deux voies, choisie par la province au moment de la désignation. Dans le volet Entrée express, la désignation est rattachée à un profil de l’Entrée express : le candidat est invité lors d’une ronde et dépose en ligne. Dans le volet de base, le candidat présente sa demande à IRCC hors de l’Entrée express. Le tableau compare les deux files dans la mise à jour d’IRCC du ${h.day(D)} avec notre plus ancienne copie datée.</p>
${h.table(['Volet', 'Délai pour une demande reçue aujourd’hui', 'Demandes en attente', 'Plus ancienne copie'], doors(h), `Candidats des provinces, fichier prospectif d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>La file du volet de base compte environ ${h.n(ratio)} fois plus de demandes. Son délai a pourtant baissé au fil des relevés conservés, jusqu’à un plus bas de ${h.d(TB.min, 'm')} le ${h.day(TB.minDate)}. Le volet Entrée express a très peu bougé, entre ${h.d(TE.min, 'm')} et ${h.d(TE.max, 'm')}. Les deux sont des délais prospectifs, l’estimation d’IRCC pour un dossier reçu le jour de la mise à jour ; la ${h.a('method', 'page de méthode')} explique ce que cela veut dire.</p>
<h2>Le volet de base, relevé par relevé</h2>
${h.hist(BA.series, { max: 12, unit: 'm' })}
<p>Chaque ligne vient d’une copie datée du fichier d’IRCC, lue directement ou par l’Internet Archive. Notre série commence en octobre 2025, avec la première copie de ce fichier que nous avons pu dater ; aucun mois antérieur n’est complété.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'pnp-base', m: yAgo(QB)[0], d: 15 }, t: 'Votre demande PCP : où en est votre mois de dépôt' })}
<h2>La file du volet de base</h2>
<p>La file d’IRCC pour le volet de base montre jusqu’où elle remonte. Dans la mise à jour du ${h.day(D)}, le plus ancien mois qui a encore un temps restant est ${h.my(`${bOldestOpen[0]}-15`)}, et tous les mois suivants ont des mois à courir. Les dossiers reçus en ${h.my(`${bLast[0]}-15`)} ont encore ${h.d((bLast[1] as number) * 365.25 / 12, 'm')} devant eux, avec ${K.fmtAhead(bLast[2], h.lang)} demandes devant. Le tableau garde un mois sur quatre.</p>
${h.table(['Mois de dépôt', 'Temps restant', 'Demandes devant'], baseQueue(h), `File du volet de base des candidats des provinces, mise à jour d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r'])}
<p>Dans le volet Entrée express, le même tableau est bien plus court : pour ${h.my(`${eLast[0]}-15`)}, IRCC donne ${h.d((eLast[1] as number) * 365.25 / 12, 'm')} restants, avec ${K.fmtAhead(eLast[2], h.lang)} demandes devant. Choisissez le volet et votre mois dans l’outil pour voir votre propre ligne.</p>
<h2>Les rondes des candidats des provinces</h2>
<p>Un candidat désigné dans le volet Entrée express a toujours besoin d’une invitation. IRCC tient des rondes réservées aux candidats des provinces, et la désignation ajoute 600 points au score, ce qui explique des scores minimaux bien au-dessus des autres rondes. Sur les douze mois au ${h.day(K.READ)}, IRCC a tenu ${h.n(st.n)} rondes de ce type et envoyé ${h.n(st.total)} invitations, avec des scores minimaux de ${st.lowest?.crs} à ${highest.crs}. La plus récente, le ${st.last ? h.day(st.last.date) : ''}, a invité ${st.last ? h.n(st.last.size) : ''} candidats. Les rondes de tous les types sont listées sur la ${h.a('express-entry-draws', 'page des rondes de l’Entrée express')}.</p>
<h2>Ce que les deux chiffres donnent sur un calendrier</h2>
<p>Placez les deux chiffres sur un calendrier. Une demande complète reçue par IRCC le ${h.day(K.READ)} serait, au rythme actuel, tranchée vers ${h.my(dE)} dans le volet Entrée express et vers ${h.my(dB)} dans le volet de base. C’est un horizon de planification, pas une date : IRCC revoit les deux chiffres à chaque mise à jour, et le volet de base a bougé de plusieurs mois en une seule année. Si votre statut temporaire, une offre d’emploi ou un bail dépend de la décision, prévoyez le haut de la fourchette et vérifiez le chiffre après chaque mise à jour mensuelle.</p>
<p>Le volet ne se choisit pas librement. Certaines provinces ne désignent que par l’Entrée express pour certains programmes et que par le volet de base pour d’autres, et un candidat sans profil de l’Entrée express ne peut être désigné que dans le volet de base. Quand les deux portes vous sont ouvertes, l’écart de délai est réel, mais ce n’est qu’un facteur parmi d’autres ; les exigences de la province et ses périodes de réception de demandes pèsent autant.</p>
<h2>Rester au Canada pendant l’attente</h2>
<p>Beaucoup de candidats désignés travaillent déjà dans la province qui les a choisis. Un travailleur dont le permis arrive à échéance peut, aux conditions fixées par IRCC, le prolonger ou obtenir un permis de travail ouvert transitoire pendant la décision ; la ${h.a('work-permit-extension', 'page de la prolongation du permis de travail')} donne le délai de ces demandes. Le ${h.a('atlantic', 'Programme d’immigration au Canada atlantique')} est une voie distincte, menée par les employeurs des quatre provinces de l’Atlantique, avec sa propre file dans le fichier d’IRCC. Les candidats qui remplissent aussi les conditions de l’${h.a('cec', 'expérience canadienne')} peuvent comparer cette file avant de choisir leur voie.</p>
`,
  },
});
