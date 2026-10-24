import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Demande qui dépasse le délai : démarches pratiques, et la fréquence à laquelle IRCC manque ses normes de service
 * (inventaire des services, OGL-Canada 2.0). Aucun délai de canada.ca n'est repris : le simulateur prend celui du lecteur. */
const E = K.en, F = K.fr;
const ago = K.addMonths(K.READ, -8).slice(0, 7);
const IDS = ['visitor', 'super-visa', 'study', 'study-inside', 'work', 'work-inside', 'cec', 'fsw', 'pnp-base', 'spousal-out-roc', 'citizenship'];
const lines = IDS.map((id) => ({ id, s: K.stdOf(id)! })).filter((x) => x.s?.cur.total != null && x.s.cur.met != null);
const late = (x: (typeof lines)[number]) => x.s.cur.total! - x.s.cur.met!;
const lateAll = lines.reduce((t, x) => t + late(x), 0), totAll = lines.reduce((t, x) => t + x.s.cur.total!, 0);
const lateShare = K.pctOf(lateAll, totAll);
const most = [...lines].sort((a, b) => late(b) - late(a))[0];
const fy = lines[0].s.fy;
const under = lines.filter((x) => x.s.cur.perf != null && x.s.cur.target != null && x.s.cur.perf < x.s.cur.target * 100).length;
const nt = K.net12();
const grew = (nt.net ?? 0) > 0;
if (lines.some((x) => x.s.fy !== fy)) throw new Error('beyond-processing-time : normes sur des exercices différents');
const lc = (x: string) => x.charAt(0).toLowerCase() + x.slice(1);
const nm = (id: string, l: 'en' | 'fr') => (id === 'spousal-out-roc' ? (l === 'fr' ? 'Regroupement familial à l’étranger' : 'Family class from abroad') : K.progName(id, l));

function rows(h: Helpers, l: 'en' | 'fr') {
  return lines.map((x) => [K.PAGE_OF[x.id] ? h.a(K.PAGE_OF[x.id], nm(x.id, l)) : nm(x.id, l), K.fmtStd(x.s.cur, l), h.pct(x.s.cur.perf), h.n(late(x))]);
}

export default defineGuide({
  id: 'beyond-processing-time', group: 'tools', order: 72,
  tool: 'delai', toolArg: { g: 'visitor', c: 'IN', m: ago, d: 1 },
  related: ['visitor-visa', 'visitor-record', 'study-permit-extension', 'work-permit-extension', 'citizenship', 'history'],
  sources: ['check-status', 'account', 'biometrics', 'ptimes', 'od-std', 'ogl'],
  en: {
    slug: 'application-past-processing-time',
    nav: 'Past the processing time', card: 'Checks and steps when your file takes longer',
    title: 'Application Past the IRCC Processing Time: Steps for 2026',
    description: 'Your IRCC application is past the processing time in 2026? Check it with your date, then take the steps that help, and see how often IRCC misses its standards.',
    h1: 'Application past the processing time: what to check and what to do',
    intro: `In ${K.fmtFy(fy, 'en')}, about ${E.n(lateAll)} applications across ${E.n(lines.length)} IRCC services were processed outside their service standard.`,
    resume: `A file that takes longer than the time IRCC shows is common, and most of the time nothing is wrong with it. Start by checking the arithmetic: copy the time IRCC shows on its “Check processing times” tool into the calculator above, set the month and day IRCC received your complete application, and see whether you are really past it and by how many days. If you are, the steps that help are few and free: read your IRCC account and the email address on file, answer any request, check that biometrics and medical exams are recorded, then use IRCC’s web form once the time has passed. For context, the Government of Canada service inventory, published as open data under the Open Government Licence of Canada, shows that in ${K.fmtFy(fy, 'en')} about ${E.n(lateAll)} of ${E.n(totAll)} applications in the ${E.n(lines.length)} services below, ${E.pct(lateShare)}, were processed outside their standard. Being late is a frequent outcome, not a sign of refusal.`,
    faqs: [
      { q: 'When can I contact IRCC about a delayed application?', a: 'IRCC asks applicants to wait until the processing time shown for their application has passed before using its web form about a delay. Before that point, the answer is usually that the file is still within normal processing. Count from the day IRCC received the complete application, not the day you started the form, and use the calculator above to find that date.' },
      { q: 'Does a delay beyond the processing time mean a refusal is coming?', a: `No. The processing time is the time IRCC took, or expects to take, for most applications, so some files always take longer. In ${K.fmtFy(fy, 'en')}, IRCC missed its standard for about ${E.n(lateAll)} applications in the services listed on this page. Background checks, a document request or a medical exam often explain the extra time.` },
      { q: 'Can I see the notes an officer wrote on my file?', a: 'Yes. You can ask IRCC for a copy of your file through an access to information or privacy request, made online for a small fee or free for a privacy request. The answer includes the officer notes recorded in IRCC’s system. It takes weeks, so it helps more to understand a refusal or a long silence than to speed up a decision.' },
    ],
    body: (h) => `
<h2>First, check that you are really past the time</h2>
<p>Many people who think their file is late have counted from the wrong day. The processing time starts when IRCC receives a complete application, usually the day you submit it online; for applications that need biometrics, IRCC includes the time taken to give them. Copy the time IRCC shows on its ${h.src('ptimes', '“Check processing times” tool')} for your type of application, then set the month and day you applied.</p>
${h.mini('delai', { p: ['g', 'n', 'u', 'm', 'd'], d: { g: 'visitor', m: ago, d: 1 }, t: 'Am I past the processing time?' })}
<p>The time on IRCC’s tool is not fixed. For most temporary residence lines it is a past measure, the time it took to process most recent applications; for permanent residence it is a forward estimate for a file received today. Either way, it can move between the day you applied and today, so compare with the time shown now, and keep a note of the one you saw when you filed.</p>
<h2>The steps that help</h2>
<p>Read your ${h.src('account', 'IRCC secure account')} first, then the email address given in the form, spam folder included. A request for documents, biometrics or a medical exam stops the clock until you answer, and an unanswered request is the most common cause of a long silence. Check that your ${h.src('biometrics', 'biometrics')} appear as given if your application needed them.</p>
<p>The ${h.src('check-status', 'application status tools')} show where the file is: received, in review, background check, decision made. A file that shows no change for months is not unusual, because several stages run without visible updates. If the time IRCC shows has passed, use IRCC’s web form to ask about the delay, once, with your application number and a short message; several messages do not move the file faster. If your status in Canada depends on the answer, say so in the message. Keep a copy of what you send and of the reply: if the file is still silent months later, it shows when you first raised the delay, and it saves you from repeating the same details in a second request.</p>
<h2>How often IRCC misses its own standards</h2>
<p>IRCC sets service standards for its main services and reports, in the Government of Canada ${h.src('od-std', 'service inventory')}, how many applications it processed within them. The table shows the services where an application past its time most often leads readers to this page. In ${K.fmtFy(fy, 'en')}, IRCC fell below its target for ${h.n(under)} of these ${h.n(lines.length)} services. The largest number of late files was in the line for ${lc(nm(most.id, 'en'))}, with ${h.n(late(most))} applications outside a standard of ${K.fmtStd(most.s.cur, 'en')}.</p>
${h.table(['Service', 'Standard', `Within standard, ${K.fmtFy(fy, 'en')}`, 'Applications outside the standard'], rows(h, 'en'), `IRCC service standards and results, ${K.fmtFy(fy, 'en')}. Source: Government of Canada service inventory, open data.`, ['l', 'l', 'r', 'r'])}
<p>The pressure on IRCC also shows in its monthly volumes. From ${h.w12()}, it received ${h.n(nt.rin)} temporary residence applications and finalized ${h.n(nt.fin)}${grew ? `, so the stock waiting grew by about ${h.n(nt.net)}` : `, so the stock waiting fell by about ${h.n(nt.net == null ? null : -nt.net)}`}. The ${h.a('history', 'history page')} follows those volumes month by month since 2023.</p>
<h2>If your status depends on the answer</h2>
<p>A student, worker or visitor who applied to extend before the end of their status keeps it while waiting, under the same conditions. The ${h.a('visitor-record', 'visitor record')}, ${h.a('study-permit-extension', 'study permit extension')} and ${h.a('work-permit-extension', 'work permit extension')} pages explain what that covers. Leaving Canada during the wait ends that protection, so plan travel only once you have the decision.</p>
`,
  },
  fr: {
    slug: 'demande-qui-depasse-le-delai',
    nav: 'Délai dépassé', card: 'Vérifications et démarches quand le dossier prend plus de temps',
    title: 'Demande qui dépasse le délai d’IRCC : les démarches en 2026',
    description: 'Votre demande à IRCC dépasse le délai en 2026 ? Vérifiez-le avec votre date, suivez les démarches utiles et voyez à quelle fréquence IRCC manque ses normes.',
    h1: 'Demande qui dépasse le délai : ce qu’il faut vérifier et faire',
    intro: `En ${K.fmtFy(fy, 'fr')}, environ ${F.n(lateAll)} demandes dans ${F.n(lines.length)} services d’IRCC ont été traitées hors de leur norme de service.`,
    resume: `Un dossier qui prend plus de temps que le délai affiché par IRCC est fréquent, et la plupart du temps il n’a rien d’anormal. Commencez par vérifier le calcul : recopiez dans le calculateur ci-dessus le délai qu’affiche l’outil « Vérifier les délais de traitement » d’IRCC, indiquez le mois et le jour où IRCC a reçu la demande complète, et voyez si vous avez réellement dépassé le délai, et de combien de jours. Si c’est le cas, les démarches utiles sont peu nombreuses et gratuites : lire le compte IRCC et l’adresse courriel indiquée, répondre à toute demande, vérifier que la biométrie et les examens médicaux sont enregistrés, puis utiliser le formulaire Web d’IRCC une fois le délai passé. Pour le contexte, l’inventaire des services du gouvernement du Canada, publié en données ouvertes sous la Licence du gouvernement ouvert du Canada, montre qu’en ${K.fmtFy(fy, 'fr')} environ ${F.n(lateAll)} des ${F.n(totAll)} demandes des ${F.n(lines.length)} services ci-dessous, soit ${F.pct(lateShare)}, ont été traitées hors de leur norme. Le retard est un cas courant, pas le signe d’un refus.`,
    faqs: [
      { q: 'Quand peut-on écrire à IRCC au sujet d’une demande en retard ?', a: 'IRCC demande d’attendre que le délai affiché pour la demande soit écoulé avant d’utiliser son formulaire Web au sujet d’un retard. Avant, la réponse est en général que le dossier suit son cours normal. Comptez à partir du jour où IRCC a reçu la demande complète, pas du jour où vous avez commencé le formulaire, et trouvez cette date avec le calculateur.' },
      { q: 'Un dépassement du délai annonce-t-il un refus ?', a: `Non. Le délai est le temps qu’IRCC a mis, ou prévoit de mettre, pour la plupart des demandes : certains dossiers prennent donc toujours plus longtemps. En ${K.fmtFy(fy, 'fr')}, IRCC a manqué sa norme pour environ ${F.n(lateAll)} demandes dans les services présentés sur cette page. Les vérifications de sécurité, une demande de documents ou un examen médical expliquent souvent le temps en plus.` },
      { q: 'Peut-on lire les notes de l’agent sur son dossier ?', a: 'Oui. Vous pouvez demander à IRCC une copie de votre dossier par une demande d’accès à l’information ou de protection des renseignements personnels, faite en ligne, gratuite dans le second cas. La réponse comprend les notes de l’agent enregistrées dans le système d’IRCC. Elle prend des semaines : elle aide surtout à comprendre un refus ou un long silence, pas à accélérer une décision.' },
    ],
    body: (h) => `
<h2>D’abord, vérifier que le délai est vraiment dépassé</h2>
<p>Beaucoup de personnes qui croient leur dossier en retard ont compté à partir du mauvais jour. Le délai part du moment où IRCC reçoit une demande complète, en général le jour de l’envoi en ligne ; pour les demandes qui exigent la biométrie, IRCC compte le temps pris pour la fournir. Recopiez le délai qu’affiche l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC pour votre type de demande, puis indiquez le mois et le jour de la demande.</p>
${h.mini('delai', { p: ['g', 'n', 'u', 'm', 'd'], d: { g: 'visitor', m: ago, d: 1, c: 'FR' }, t: 'Ai-je dépassé le délai de traitement ?' })}
<p>Le délai de l’outil d’IRCC n’est pas figé. Pour la plupart des lignes de résidence temporaire, c’est une mesure passée, le temps qu’il a fallu pour traiter la plupart des demandes récentes ; pour la résidence permanente, c’est une estimation pour un dossier reçu aujourd’hui. Dans les deux cas, il peut bouger entre le jour de la demande et aujourd’hui : comparez avec le délai affiché maintenant, et gardez une note de celui que vous aviez vu au dépôt.</p>
<h2>Les démarches qui servent</h2>
<p>Lisez d’abord votre ${h.src('account', 'compte sécurisé d’IRCC')}, puis l’adresse courriel donnée dans le formulaire, dossier des indésirables compris. Une demande de documents, de biométrie ou d’examen médical arrête le compteur jusqu’à votre réponse, et une demande restée sans réponse est la cause la plus courante d’un long silence. Vérifiez que votre ${h.src('biometrics', 'biométrie')} apparaît comme fournie si la demande l’exigeait.</p>
<p>Les ${h.src('check-status', 'outils de suivi de l’état de la demande')} montrent où en est le dossier : reçu, en examen, vérification des antécédents, décision rendue. Un dossier qui ne change pas pendant des mois n’a rien d’exceptionnel, car plusieurs étapes se déroulent sans mise à jour visible. Si le délai affiché par IRCC est passé, utilisez le formulaire Web d’IRCC pour signaler le retard, une seule fois, avec le numéro de demande et un message court ; plusieurs messages ne font pas avancer le dossier plus vite. Si votre statut au Canada dépend de la réponse, dites-le dans le message.</p>
<h2>À quelle fréquence IRCC manque ses propres normes</h2>
<p>IRCC fixe des normes de service pour ses principaux services et indique, dans l’${h.src('od-std', 'inventaire des services')} du gouvernement du Canada, combien de demandes il a traitées dans ces normes. Le tableau présente les services pour lesquels un dépassement de délai amène le plus souvent les lecteurs sur cette page. En ${K.fmtFy(fy, 'fr')}, IRCC est resté sous sa cible pour ${h.n(under)} de ces ${h.n(lines.length)} services. Le plus grand nombre de dossiers en retard concerne la ligne ${lc(nm(most.id, 'fr'))}, avec ${h.n(late(most))} demandes hors d’une norme de ${K.fmtStd(most.s.cur, 'fr')}.</p>
${h.table(['Service', 'Norme', `Dans la norme, ${K.fmtFy(fy, 'fr')}`, 'Demandes hors de la norme'], rows(h, 'fr'), `Normes de service d’IRCC et résultats, ${K.fmtFy(fy, 'fr')}. Source : inventaire des services du gouvernement du Canada, données ouvertes.`, ['l', 'l', 'r', 'r'])}
<p>La pression sur IRCC se lit aussi dans ses volumes mensuels. De ${h.w12()}, il a reçu ${h.n(nt.rin)} demandes de résidence temporaire et en a finalisé ${h.n(nt.fin)}${grew ? ` : le stock en attente a grossi d’environ ${h.n(nt.net)}` : ` : le stock en attente a diminué d’environ ${h.n(nt.net == null ? null : -nt.net)}`}. La ${h.a('history', 'page historique')} suit ces volumes mois par mois depuis 2023.</p>
<h2>Si votre statut dépend de la réponse</h2>
<p>Un étudiant, un travailleur ou un visiteur qui a demandé une prolongation avant la fin de son statut le garde pendant l’attente, aux mêmes conditions. Les pages ${h.a('visitor-record', 'fiche du visiteur')}, ${h.a('study-permit-extension', 'prolongation du permis d’études')} et ${h.a('work-permit-extension', 'prolongation du permis de travail')} expliquent ce que cela couvre. Quitter le Canada pendant l’attente met fin à cette protection : ne prévoyez un voyage qu’une fois la décision reçue.</p>
`,
  },
});
