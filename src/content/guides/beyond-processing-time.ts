import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Demande qui dépasse le délai : dates limites calculées à partir des délais publiés (aujourd'hui = date de lecture). */
const TODAY = K.READ;
const E = K.en, F = K.fr;
type Line = { id: string; c?: string };
const LINES: Line[] = [
  { id: 'visitor', c: 'IN' }, { id: 'super-visa', c: 'IN' }, { id: 'visitor-record' }, { id: 'study', c: 'IN' }, { id: 'study-ext' },
  { id: 'work', c: 'IN' }, { id: 'work-inside' }, { id: 'work-ext' }, { id: 'iec' }, { id: 'citizenship' }, { id: 'pr-card-new' },
];
/* Date de réception à partir de laquelle une demande déposée plus tôt dépasse déjà le délai publié. */
const cutoff = (id: string, c = 'IN') => {
  const t = K.readingOf(id, c).t;
  if (!K.isTime(t) || t.u === 'min') return null;
  return K.addTime(TODAY, { n: -t.n, u: t.u });
};
function cutRows(h: Helpers, l: 'en' | 'fr') {
  return LINES.map(({ id, c }) => {
    const g = K.progById(id), r = K.readingOf(id, c), cut = cutoff(id, c);
    const name = `${h.a(K.PAGE_OF[id], g.name[l])}${c && g.src === 'country' && !g.fixed ? ` (${h.cn(c)})` : ''}`;
    return [name, h.t(r.t), cut ? h.day(cut) : '', g.method === 'past' ? (l === 'fr' ? 'passé' : 'past') : (l === 'fr' ? 'prospectif' : 'forward')];
  });
}
/* Files hebdomadaires ou mensuelles : périodes de dépôt qu'IRCC marque lui-même « délai prévu dépassé ». */
const lateRows = (id: string) => (K.readingOf(id).queue ?? []).filter((q) => q[1] === 'late');
const spLate = lateRows('study-ext'), wpLate = lateRows('work-ext'), citLate = lateRows('citizenship');
const sx = K.readingOf('study-ext');
const vIn = K.readingOf('visitor', 'IN'), vr = K.readingOf('visitor-record');
const cutV = cutoff('visitor', 'IN')!, cutVR = cutoff('visitor-record')!;
const ago = K.addMonths(TODAY, -8).slice(0, 7);
const weekLabel = (k: string, l: 'en' | 'fr') => (l === 'fr' ? `semaine ${Number(k.slice(8))} de ${K.monthYear(`${k.slice(0, 7)}-15`, 'fr')}` : `week ${Number(k.slice(8))} of ${K.monthYear(`${k.slice(0, 7)}-15`, 'en')}`);

export default defineGuide({
  id: 'beyond-processing-time', group: 'tools', order: 72,
  tool: 'delai', toolArg: { g: 'visitor', c: 'IN', m: ago, d: 1 },
  related: ['visitor-visa', 'visitor-record', 'study-permit-extension', 'work-permit-extension', 'citizenship', 'history'],
  sources: ['check-status', 'account', 'biometrics', 'ptimes', 'ptimes-week'],
  en: {
    slug: 'application-past-processing-time',
    nav: 'Past the processing time', card: 'Checks and steps when your file takes longer',
    title: 'Application Past the Processing Time: Steps for 2026',
    description: 'Application past IRCC processing time in 2026: the date that counts, biometrics, document requests, your account, the web form and how to get your file notes.',
    h1: 'Your application is past the processing time',
    intro: `On ${E.day(TODAY)}, a visitor visa from India received before ${E.day(cutV)} was already past IRCC's published time of ${K.fmtTime(vIn.t, 'en')}.`,
    resume: `An application is past the processing time when more time has gone by since IRCC received it than the figure IRCC publishes for that type of application. On ${E.day(TODAY)}, that meant a visitor visa from India received before ${E.day(cutV)}, given the published ${K.fmtTime(vIn.t, 'en')}, or a visitor record request received before ${E.day(cutVR)}, given ${K.fmtTime(vr.t, 'en')}. Being past the time is common and is not a sign of refusal: for most temporary residence lines, the figure is the time within which 80% of recent applications were decided, so one in five took longer. Before doing anything, check four things: the date IRCC counts from, whether biometrics were given, whether IRCC asked for a document or an exam you have not sent, and what your IRCC account shows. If the file is still clearly beyond the published time after those checks, IRCC's web form is the channel for an enquiry about a specific application. Anyone entitled to file a request under the Access to Information Act or the Privacy Act can also ask for the notes officers wrote on their file.`,
    faqs: [
      { q: 'From which date should I count when checking if I am past the time?', a: 'Count from the day IRCC received the complete application. For an online application, that is the submission date shown on the confirmation. For a paper application, it is the day the processing centre logged it, not the day you mailed it. If IRCC returned the file as incomplete, the count restarts from the new submission.' },
      { q: 'Does using the IRCC web form speed up a late application?', a: 'No. The web form lets you ask about an application that is outside the normal processing time, and an agent may tell you whether something is missing. It does not move the file up the queue. Sending the same question several times creates more messages to answer, not a faster decision.' },
      { q: 'What are GCMS notes and who can request them?', a: 'GCMS is the system IRCC uses to manage files, and the notes are what officers recorded about yours. They can be requested under the Access to Information Act or the Privacy Act. Only Canadian citizens, permanent residents and people or companies present in Canada can file such requests, so someone abroad needs a person in Canada to file with their consent.' },
      { q: 'Should I send a new application if mine is far past the processing time?', a: 'Generally not. A second application for the same thing does not replace the first or join it; it is a new file at the back of the queue, with new fees. It can also cause confusion if IRCC decides the first one in the meantime. A new application makes sense mostly when the first one was refused or withdrawn.' },
    ],
    body: (h) => `
<h2>Are you past the time today?</h2>
<p>The table turns each published time into a date. If IRCC received your application on or before the date in the third column, you are already past the published time as of ${h.day(TODAY)}. Lines that depend on the country are shown for India; the tool above gives the date for any country. Forward lines, marked as such, are IRCC's own estimate for a file received now, so they are a less exact test for an application filed months ago.</p>
${h.table(['Application', 'Published time', 'Received on or before', 'Type of figure'], cutRows(h, 'en'), `Published times read on ${h.day(TODAY)}; dates computed by us in IRCC's unit (days, weeks or months).`, ['l', 'r', 'r', 'l'])}
<p>For the two permit extensions and for citizenship, IRCC is more direct: its queue by period of filing flags the periods that are already past the expected time. On ${h.day(sx.date)}, the study permit extension queue flagged ${h.n(spLate.length)} weekly period${spLate.length === 1 ? '' : 's'}${spLate.length ? `, the most recent being ${weekLabel(spLate[spLate.length - 1][0], 'en')}` : ''}; the work permit extension queue flagged ${h.n(wpLate.length)}, and the citizenship queue ${h.n(citLate.length)} monthly period${citLate.length === 1 ? '' : 's'}${citLate.length ? `, up to ${K.monthYear(`${citLate[citLate.length - 1][0]}-15`, 'en')}` : ''}. If your period is one of them, IRCC itself considers the file late.</p>
${h.mini('delai', { p: ['g', 'c', 'm', 'd'], d: { g: 'visitor-record', m: ago, d: 1 }, t: 'Enter your filing date: are you past the time?' })}
<h2>Pauses the published time does not count</h2>
<p>Several steps stop the file while it waits for you, and none of them is inside the published figure. Biometrics come first: after the biometric instruction letter, you normally have 30 days to give fingerprints and a photo, and the file does not move until they are received. The ${h.src('biometrics', 'biometrics page')} lists who must give them and who is exempt. A medical exam works the same way: the officer cannot decide until the panel physician's results arrive.</p>
<p>A request for documents, a procedural fairness letter or an interview invitation also pauses the file, from the day IRCC sends it until the day you reply. Look for these in your IRCC account messages rather than in your email alone, because the account is where IRCC posts letters. If you answered late, add that delay to the published time before concluding that your file is past it.</p>
<h2>What your IRCC account tells you</h2>
<p>Sign in to the account you applied with through ${h.src('account', 'the IRCC sign-in page')}. The status and the messages section show whether biometrics were recorded, whether an eligibility or background review has started and whether a letter is waiting. "In progress" for months is common and does not by itself mean anything is wrong. For some permanent residence and citizenship applications, IRCC also offers an application status tracker with more detail; the ${h.src('check-status', 'status page')} explains which tool applies to which application.</p>
<h2>Asking IRCC about your file</h2>
<p>When the checks above are done and the file is still past the published time, IRCC's web form is the official channel for a question about a specific application. Give the application number, the date received and a short, factual question. IRCC answers by email or through the account; the reply may confirm that the file is in review, or point to a missing item. One enquiry is enough; follow up only if the situation changes, for example a trip that cannot be moved.</p>
<p>People living in Canada can also contact the constituency office of their Member of Parliament, whose staff can make enquiries to IRCC for constituents. Like the web form, this gets information; it does not change the order in which files are decided.</p>
<h2>Getting the notes on your own file</h2>
<p>Officers record their steps in IRCC's case management system, known as GCMS. A request under the Access to Information Act or the Privacy Act returns a copy of those notes, which often show the exact stage the file has reached, for example a security check or a pending review. These are government requests filed directly with IRCC. Only Canadian citizens, permanent residents and people or companies present in Canada may file them, so an applicant abroad needs someone in Canada to file with written consent. The answer takes weeks, so this is a step for files that are well past the time, not for a few days of delay.</p>
<h2>Applicants inside Canada</h2>
<p>A student, worker or visitor who applied to extend before the status expired keeps maintained status while the file is pending, under the same conditions. That status ends if you leave Canada. For these applicants, a long delay is mostly a question of planning around travel, not of legality. The figures behind every date on this page are explained on the ${h.a('method', 'method page')}.</p>
`,
  },
  fr: {
    slug: 'demande-qui-depasse-le-delai',
    nav: 'Délai dépassé', card: 'Vérifications et démarches quand le dossier tarde',
    title: 'Demande qui dépasse le délai de traitement, étapes 2026',
    description: 'Demande IRCC qui dépasse le délai en 2026 : date qui compte, biométrie, demandes de documents, compte en ligne, formulaire Web et notes de votre dossier.',
    h1: 'Votre demande dépasse le délai de traitement',
    intro: `Au ${F.day(TODAY)}, une fiche du visiteur reçue avant le ${F.day(cutVR)} dépassait déjà le délai publié par IRCC, soit ${K.fmtTime(vr.t, 'fr')}.`,
    resume: `Une demande dépasse le délai de traitement quand le temps écoulé depuis sa réception par IRCC est plus long que le chiffre publié pour ce type de demande. Au ${F.day(TODAY)}, c’était le cas d’une fiche du visiteur reçue avant le ${F.day(cutVR)}, le délai publié étant de ${K.fmtTime(vr.t, 'fr')}, ou d’un visa de visiteur demandé depuis l’Inde et reçu avant le ${F.day(cutV)}, pour un délai de ${K.fmtTime(vIn.t, 'fr')}. Dépasser le délai est courant et n’annonce pas un refus : pour la plupart des demandes de résidence temporaire, le chiffre correspond au temps dans lequel 80 % des demandes récentes ont été tranchées, si bien qu’une sur cinq a pris plus longtemps. Avant toute démarche, vérifiez quatre points : la date à partir de laquelle IRCC compte, la biométrie, une éventuelle demande de document ou d’examen restée sans réponse, et ce qu’affiche votre compte IRCC. Si le dossier dépasse toujours nettement le délai après ces vérifications, le formulaire Web d’IRCC sert aux questions sur une demande précise. Toute personne qui a le droit de présenter une demande d’accès à l’information ou de protection des renseignements personnels peut aussi obtenir les notes des agents sur son dossier.`,
    faqs: [
      { q: 'À partir de quelle date compter pour savoir si le délai est dépassé ?', a: 'Comptez à partir du jour où IRCC a reçu la demande complète. Pour une demande en ligne, c’est la date d’envoi indiquée sur la confirmation. Pour une demande papier, c’est le jour où le centre de traitement l’a enregistrée, pas celui de l’envoi postal. Si IRCC a renvoyé le dossier comme incomplet, le compte repart du nouvel envoi.' },
      { q: 'Le formulaire Web d’IRCC fait-il avancer une demande en retard ?', a: 'Non. Le formulaire Web permet de poser une question sur une demande qui dépasse les délais normaux, et l’agent peut signaler un élément manquant. Il ne fait pas remonter le dossier dans la file. Envoyer plusieurs fois la même question crée des messages à traiter, pas une décision plus rapide.' },
      { q: 'Que sont les notes du SMGC et qui peut les demander ?', a: 'Le SMGC est le système qu’IRCC utilise pour gérer les dossiers, et les notes sont ce que les agents ont consigné sur le vôtre. On les obtient par une demande d’accès à l’information ou de protection des renseignements personnels. Seuls les citoyens canadiens, les résidents permanents et les personnes ou sociétés présentes au Canada peuvent la présenter ; depuis l’étranger, il faut une personne au Canada, avec votre consentement.' },
      { q: 'Faut-il déposer une nouvelle demande quand la première tarde beaucoup ?', a: 'En général, non. Une seconde demande pour la même chose ne remplace pas la première et ne s’y ajoute pas : c’est un nouveau dossier en fin de file, avec de nouveaux frais. Elle peut aussi semer la confusion si IRCC tranche la première entre-temps. Une nouvelle demande se justifie surtout après un refus ou un retrait.' },
    ],
    body: (h) => `
<h2>Dépassez-vous le délai aujourd’hui ?</h2>
<p>Le tableau traduit chaque délai publié en date. Si IRCC a reçu votre demande à la date de la troisième colonne ou avant, vous dépassez déjà le délai publié au ${h.day(TODAY)}. Les lignes qui dépendent du pays sont calculées pour l’Inde ; l’outil en haut de page donne la date pour n’importe quel pays. Les délais prospectifs, signalés comme tels, sont l’estimation d’IRCC pour un dossier reçu aujourd’hui : pour une demande déposée il y a des mois, le test est moins exact.</p>
${h.table(['Demande', 'Délai publié', 'Reçue au plus tard le', 'Nature du chiffre'], cutRows(h, 'fr'), `Délais publiés lus le ${h.day(TODAY)} ; dates calculées par nous dans l’unité d’IRCC (jours, semaines ou mois).`, ['l', 'r', 'r', 'l'])}
<p>Pour les deux prolongations de permis et pour la citoyenneté, IRCC est plus direct : sa file par période de dépôt signale les périodes qui ont déjà dépassé le délai prévu. Au ${h.day(sx.date)}, la file des prolongations de permis d’études en signalait ${h.n(spLate.length)} semaines de dépôt${spLate.length ? `, la plus récente étant la ${weekLabel(spLate[spLate.length - 1][0], 'fr')}` : ''} ; celle des prolongations de permis de travail en signalait ${h.n(wpLate.length)} et celle de la citoyenneté ${h.n(citLate.length)} mois de dépôt${citLate.length ? `, jusqu’à ${K.monthYear(`${citLate[citLate.length - 1][0]}-15`, 'fr')}` : ''}. Si votre période en fait partie, IRCC considère lui-même que le dossier est en retard.</p>
${h.mini('delai', { p: ['g', 'c', 'm', 'd'], d: { g: 'visitor-record', m: ago, d: 1 }, t: 'Indiquez votre date de dépôt : le délai est-il dépassé ?' })}
<h2>Les pauses que le délai publié ne compte pas</h2>
<p>Plusieurs étapes arrêtent le dossier pendant qu’il vous attend, et aucune n’entre dans le chiffre publié. La biométrie d’abord : après la lettre de convocation, vous avez normalement 30 jours pour donner vos empreintes et votre photo, et le dossier ne bouge pas tant qu’elles ne sont pas reçues. La ${h.src('biometrics', 'page sur la biométrie')} précise qui doit la fournir et qui en est dispensé. L’examen médical fonctionne de la même façon : l’agent ne peut pas trancher avant de recevoir les résultats du médecin désigné.</p>
<p>Une demande de documents, une lettre d’équité procédurale ou une convocation à une entrevue mettent aussi le dossier en pause, du jour de l’envoi par IRCC au jour de votre réponse. Cherchez ces lettres dans les messages de votre compte IRCC plutôt que dans vos seuls courriels : c’est là qu’IRCC les dépose. Si vous avez répondu tard, ajoutez ce retard au délai publié avant de conclure que le dossier le dépasse.</p>
<h2>Ce que montre votre compte IRCC</h2>
<p>Connectez-vous au compte qui a servi à déposer, depuis ${h.src('account', 'la page de connexion d’IRCC')}. L’état de la demande et la section des messages indiquent si la biométrie a été enregistrée, si l’examen de l’admissibilité ou des antécédents a commencé et si une lettre attend une réponse. La mention « en cours » pendant des mois est fréquente et ne signale rien à elle seule. Pour certaines demandes de résidence permanente et de citoyenneté, IRCC offre aussi un outil de suivi plus détaillé ; la ${h.src('check-status', 'page sur l’état des demandes')} indique quel outil vaut pour quelle demande.</p>
<h2>Interroger IRCC sur votre dossier</h2>
<p>Une fois ces vérifications faites, si le dossier dépasse toujours le délai publié, le formulaire Web d’IRCC est la voie officielle pour une question sur une demande précise. Donnez le numéro de demande, la date de réception et une question courte et factuelle. IRCC répond par courriel ou dans le compte ; la réponse peut confirmer que le dossier est à l’étude ou signaler une pièce manquante. Une seule question suffit ; relancez seulement si la situation change, par exemple un voyage impossible à déplacer.</p>
<p>Les personnes qui vivent au Canada peuvent aussi joindre le bureau de circonscription de leur député fédéral, dont le personnel peut se renseigner auprès d’IRCC pour ses électeurs. Comme le formulaire Web, cette démarche apporte des nouvelles ; elle ne change pas l’ordre de traitement.</p>
<h2>Obtenir les notes de votre propre dossier</h2>
<p>Les agents consignent leurs étapes dans le Système mondial de gestion des cas (SMGC) d’IRCC. Une demande présentée en vertu de la Loi sur l’accès à l’information ou de la Loi sur la protection des renseignements personnels permet d’en recevoir une copie, qui montre souvent l’étape exacte du dossier, par exemple une vérification de sécurité ou un examen en attente. Ces demandes se présentent directement à IRCC. Seuls les citoyens canadiens, les résidents permanents et les personnes ou sociétés présentes au Canada peuvent les déposer ; depuis l’étranger, il faut une personne au Canada munie de votre consentement écrit. La réponse prend des semaines : c’est une démarche pour un dossier très en retard, pas pour quelques jours.</p>
<h2>Si vous êtes déjà au Canada</h2>
<p>L’étudiant, le travailleur ou le visiteur qui a demandé une prolongation avant l’expiration de son statut garde un statut maintenu pendant l’examen, aux mêmes conditions. Ce statut prend fin s’il quitte le Canada. Pour ces personnes, un long délai pose surtout une question de voyages à organiser, pas de légalité du séjour. Les chiffres derrière chaque date de cette page sont expliqués sur la ${h.a('method', 'page de méthode')}.</p>
`,
  },
});
