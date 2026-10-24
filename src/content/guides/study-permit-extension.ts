import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : données ouvertes d'IRCC (Operational Processing, titulaires de permis d'études) et normes de
 * service (Inventaire des services du GC), OGL-Canada 2.0, calculés au build. Aucun jeu ouvert ne sépare les
 * prolongations : elles sont comptées dans la résidence temporaire reçue, finalisée et approuvée. Le délai publié par
 * IRCC sur canada.ca n'est pas repris : le simulateur prend celui que le lecteur lit dans l'outil d'IRCC. */
const E = K.en, F = K.fr;
const rin = K.ops12('trIn'), fin = K.ops12('trFin'), ok = K.ops12('trOk');
const ap = K.approval12(), net = K.net12();
const ins = K.stdOf('study-inside')!;
const eff = K.study12();
const ext = K.fullExtremes('trIn');
const y24 = K.fullYear('trIn', 'ALL', '2024')!, y25 = K.fullYear('trIn', 'ALL', '2025')!;
const dirEn = (x: number | null) => (x == null ? 'about level' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stables' : x > 0 ? 'en hausse' : 'en baisse');
if (net.net == null || net.net >= 0) throw new Error('study-permit-extension : le texte suppose plus de dossiers finalisés que reçus');

export default defineGuide({
  id: 'study-permit-extension', group: 'study', order: 21,
  tool: 'delai', toolArg: { g: 'study-ext', only: 'study-ext,study-inside,work-ext' },
  related: ['study-permit', 'pgwp', 'work-permit-extension', 'beyond-processing-time'],
  sources: ['ptimes', 'od-std', 'open-data', 'od-study', 'extend-study', 'check-status', 'ogl'],
  en: {
    slug: 'study-permit-extension-processing-time',
    nav: 'Study permit extension', card: 'Decision date from IRCC’s estimate, status while you wait, in-Canada volumes',
    title: 'Study Permit Extension Processing Time and Date, 2026',
    description: 'Turn the study permit extension time IRCC shows you into a decision date, check your status while you wait, and see IRCC’s in-Canada volumes for 2026.',
    h1: 'Study permit extension: your decision date from IRCC’s estimate',
    intro: `IRCC finalized ${E.n(fin.last)} temporary residence applications from ${E.w12()}, extensions included, ${E.ch(fin.change)} on the year before.`,
    resume: `For a study permit extension, IRCC’s “Check processing times” tool shows a single figure in days, an estimate of how long a new application filed today should take. Copy it into the calculator above with the day you submitted your application online, and you get an estimated decision date. The rest of this page comes from Government of Canada open data under the Open Government Licence of Canada. No open dataset counts extensions on their own: they sit inside the temporary residence applications IRCC received, finalized and approved. From ${E.w12()}, IRCC received ${E.n(rin.last)} of those applications and finalized ${E.n(fin.last)}, so it closed ${E.n(-net.net!)} more files than came in; ${E.pct(ap.rate)} of the finalized files were approved. IRCC’s service inventory has no separate standard for extensions; the standard for a study permit requested inside Canada is ${K.fmtStd(ins.cur, 'en')} for 80% of applications, met for ${E.pct(ins.cur.perf)} of them in ${K.fmtFy(ins.fy, 'en')}.`,
    faqs: [
      { q: 'Can I keep studying while my extension is processed?', a: 'Yes, if you applied before your study permit expired and you stay in Canada. You then keep your status under the same conditions until IRCC decides, which is called maintained status. If your permit expires before you apply, you lose that protection and must ask to restore your status within 90 days.' },
      { q: 'Does IRCC publish a service standard for study permit extensions?', a: `Not as a separate line. The Government of Canada service inventory, published as open data, lists a standard of ${K.fmtStd(ins.cur, 'en')} for study permits requested inside Canada, met for ${E.pct(ins.cur.perf)} of ${E.n(ins.cur.total)} applications in ${K.fmtFy(ins.fy, 'en')}. For an extension, the figure to use is the estimate on IRCC’s own tool.` },
      { q: 'How busy is IRCC with in-Canada applications?', a: `Extensions are not counted separately, but across all temporary residence applications IRCC received ${E.n(rin.last)} and finalized ${E.n(fin.last)} over the latest twelve months. Receipts were ${dirEn(rin.change)} ${E.pa(rin.change)} on the year before and decisions ${E.ch(fin.change)}, which means the queue of pending files shrank.` },
    ],
    body: (h) => `
<h2>From IRCC’s estimate to a date</h2>
<p>For an extension, IRCC’s ${h.src('ptimes', '“Check processing times” tool')} does not show a past time, as it does for a permit requested from abroad. It shows an estimate, in days, of how long a new application should take given the files already waiting. This site does not copy that figure. Read it on IRCC’s tool, enter it in the calculator, and add the day you submitted the application online. The calculator adds the days and says how many are left, or by how many you are past the estimate.</p>
<p>The estimate moves from week to week. If you filed some time ago, the figure IRCC shows today was not the one in force when you applied: run the calculator with both if you noted the earlier one. An extension asked for a new school or a new program is still an extension, and so is one asked only to cover the months left before graduation. A change of conditions, such as moving from a language school to a college, goes through the same online form.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'study-ext' }, t: 'Your extension: estimated decision date' })}
<h2>Your status while you wait</h2>
<p>An extension filed ${h.src('extend-study', 'before your study permit expires')} keeps you in status: you can stay in Canada and keep studying under the same conditions until IRCC decides. That protection ends if you leave Canada. The ${h.src('check-status', 'application status tracker')} shows whether IRCC has started the file and whether it asked for anything, such as biometrics or a document. The decision date matters less than the date your current permit expires, so file at least 30 days before it.</p>
<h2>The volume behind the line</h2>
<p>IRCC’s ${h.src('open-data', 'operational processing data')} does not count extensions on their own. They are part of the temporary residence applications it received, finalized and approved, alongside visitor visas, work permits and study permits requested from abroad. Over the latest twelve months, IRCC received ${h.n(rin.last)} temporary residence applications, ${dirEn(rin.change)} ${h.pa(rin.change)} on a year, and finalized ${h.n(fin.last)}, ${h.ch(fin.change)}. With ${h.n(-net.net!)} more files closed than opened, the stock waiting for a decision shrank over the period, which tends to shorten the estimate IRCC shows for new applications. Of the finalized files, ${h.n(ok.last)} were approved, ${h.pct(ap.rate)}, against ${h.pct(ap.prevRate)} the year before.</p>
<p>By calendar year, IRCC received ${h.n(y24)} temporary residence applications in 2024 and ${h.n(y25)} in 2025. The busiest month in the series was ${h.my(ext.hi![0])}, with ${h.n(ext.hi![1])} applications.</p>
${h.months(K.MONTHS, [['Received', K.full('trIn')], ['Finalized', K.full('trFin')], ['Approved', K.full('trOk')]], { max: 12, caption: 'Temporary residence applications, all countries, extensions included, by month, newest first. Source: IRCC open data, Operational Processing; figures rounded to 5.' })}
<h2>A standard for in-Canada study permits</h2>
<p>The Government of Canada service inventory, published as ${h.src('od-std', 'open data')}, has no line for extensions. Its nearest line is the study permit requested inside Canada: ${K.fmtStd(ins.cur, 'en')} for 80% of applications. In ${K.fmtFy(ins.fy, 'en')}, IRCC met it for ${h.n(ins.cur.met)} of ${h.n(ins.cur.total)} applications, ${h.pct(ins.cur.perf)}, against ${h.pct(ins.prev?.perf)} the year before. Over the latest twelve months, ${h.n(eff.last)} study permits took effect, from the ${h.src('od-study', 'study permit holders dataset')}, inside and outside Canada together.</p>
<h2>If the date passes</h2>
<p>A file past the estimate is not lost: the estimate covers most files, not all. Check the tracker for a request you may have missed, then follow the ${h.a('beyond-processing-time', 'steps for an application past the processing time')}. If you are about to graduate, the next permit is usually the ${h.a('pgwp', 'post-graduation work permit')}, which you can request while your extension is still pending.</p>
`,
  },
  fr: {
    slug: 'delai-prolongation-permis-etudes',
    nav: 'Prolongation du permis d’études', card: 'Date de décision à partir de l’estimation d’IRCC, statut pendant l’attente, volumes',
    title: 'Délai de prolongation du permis d’études : date en 2026',
    description: 'Transformez le délai de prolongation du permis d’études affiché par IRCC en date de décision, gardez votre statut pendant l’attente et voyez les volumes 2026.',
    h1: 'Prolongation du permis d’études : votre date de décision',
    intro: `IRCC a finalisé ${F.n(fin.last)} demandes de résidence temporaire de ${F.w12()}, prolongations comprises, soit ${F.ch(fin.change)} sur un an.`,
    resume: `Pour une prolongation du permis d’études, l’outil « Vérifier les délais de traitement » d’IRCC affiche un seul chiffre en jours : l’estimation du temps que devrait prendre une demande déposée aujourd’hui. Recopiez-le dans le calculateur ci-dessus avec le jour où vous avez envoyé votre demande en ligne : vous obtenez une date de décision estimée. Le reste de la page vient des données ouvertes du gouvernement du Canada, sous la Licence du gouvernement ouvert du Canada. Aucun jeu ouvert ne compte les prolongations à part : elles font partie des demandes de résidence temporaire reçues, finalisées et approuvées par IRCC. De ${F.w12()}, IRCC a reçu ${F.n(rin.last)} de ces demandes et en a finalisé ${F.n(fin.last)}, soit ${F.n(-net.net!)} dossiers fermés de plus que de dossiers entrés ; ${F.pct(ap.rate)} des dossiers finalisés ont été approuvés. L’inventaire des services d’IRCC ne fixe pas de norme propre aux prolongations ; celle du permis d’études demandé au Canada est de ${K.fmtStd(ins.cur, 'fr')} pour 80 % des demandes, tenue pour ${F.pct(ins.cur.perf)} d’entre elles en ${K.fmtFy(ins.fy, 'fr')}.`,
    faqs: [
      { q: 'Puis-je continuer à étudier pendant le traitement de ma prolongation ?', a: 'Oui, si vous avez fait la demande avant l’expiration de votre permis d’études et que vous restez au Canada. Vous gardez alors votre statut aux mêmes conditions jusqu’à la décision d’IRCC : c’est le statut maintenu. Si le permis expire avant la demande, cette protection tombe et il faut demander le rétablissement du statut dans les 90 jours.' },
      { q: 'IRCC publie-t-il une norme de service pour la prolongation du permis d’études ?', a: `Pas en ligne distincte. L’inventaire des services du gouvernement du Canada, publié en données ouvertes, fixe une norme de ${K.fmtStd(ins.cur, 'fr')} pour le permis d’études demandé au Canada, tenue pour ${F.pct(ins.cur.perf)} des ${F.n(ins.cur.total)} demandes en ${K.fmtFy(ins.fy, 'fr')}. Pour une prolongation, le chiffre à retenir est l’estimation de l’outil d’IRCC.` },
      { q: 'IRCC est-il débordé par les demandes faites au Canada ?', a: `Les prolongations ne sont pas comptées à part, mais pour l’ensemble de la résidence temporaire IRCC a reçu ${F.n(rin.last)} demandes et en a finalisé ${F.n(fin.last)} sur les douze derniers mois. Les arrivées sont ${dirFr(rin.change)} de ${F.pa(rin.change)} sur un an et les décisions ont varié de ${F.ch(fin.change)} : la file des dossiers en attente a raccourci.` },
    ],
    body: (h) => `
<h2>De l’estimation d’IRCC à une date</h2>
<p>Pour une prolongation, l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC n’affiche pas un délai passé, comme pour un permis demandé à l’étranger. Il affiche une estimation, en jours, du temps que devrait prendre une nouvelle demande compte tenu des dossiers déjà en attente. Ce site ne recopie pas ce chiffre. Lisez-le dans l’outil d’IRCC, saisissez-le dans le calculateur et indiquez le jour où vous avez envoyé la demande en ligne. Le calculateur ajoute les jours et dit combien il en reste, ou de combien vous dépassez l’estimation.</p>
<p>L’estimation bouge d’une semaine à l’autre. Si vous avez déposé il y a un moment, le chiffre affiché aujourd’hui n’est pas celui en vigueur le jour de la demande : faites le calcul avec les deux si vous aviez noté l’ancien.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'study-ext' }, t: 'Votre prolongation : date de décision estimée' })}
<h2>Votre statut pendant l’attente</h2>
<p>Une prolongation déposée ${h.src('extend-study', 'avant l’expiration du permis d’études')} vous garde en statut : vous pouvez rester au Canada et continuer vos études aux mêmes conditions jusqu’à la décision d’IRCC. Cette protection tombe si vous quittez le Canada. L’${h.src('check-status', 'outil de suivi des demandes')} indique si IRCC a ouvert le dossier et s’il a demandé quelque chose, comme la biométrie ou un document. La date de décision compte moins que la date d’expiration de votre permis actuel : déposez au moins 30 jours avant.</p>
<h2>Le volume derrière la file</h2>
<p>Les ${h.src('open-data', 'données de traitement opérationnel')} d’IRCC ne comptent pas les prolongations à part. Elles font partie des demandes de résidence temporaire reçues, finalisées et approuvées, avec les visas de visiteur, les permis de travail et les permis d’études demandés à l’étranger. Sur les douze derniers mois, IRCC a reçu ${h.n(rin.last)} demandes de résidence temporaire, ${dirFr(rin.change)} de ${h.pa(rin.change)} sur un an, et en a finalisé ${h.n(fin.last)}, soit ${h.ch(fin.change)}. Avec ${h.n(-net.net!)} dossiers fermés de plus que de dossiers ouverts, le stock en attente de décision a diminué sur la période, ce qui tend à raccourcir l’estimation affichée pour les nouvelles demandes. Sur les dossiers finalisés, ${h.n(ok.last)} ont été approuvés, soit ${h.pct(ap.rate)}, contre ${h.pct(ap.prevRate)} l’année d’avant.</p>
<p>Par année civile, IRCC a reçu ${h.n(y24)} demandes de résidence temporaire en 2024 et ${h.n(y25)} en 2025. Le mois le plus chargé de la série a été ${h.my(ext.hi![0])}, avec ${h.n(ext.hi![1])} demandes.</p>
${h.months(K.MONTHS, [['Reçues', K.full('trIn')], ['Finalisées', K.full('trFin')], ['Approuvées', K.full('trOk')]], { max: 12, caption: 'Demandes de résidence temporaire, tous pays, prolongations comprises, par mois, du plus récent au plus ancien. Source : IRCC, données ouvertes, Traitement opérationnel ; chiffres arrondis à 5.' })}
<h2>Une norme pour le permis d’études demandé au Canada</h2>
<p>L’inventaire des services du gouvernement du Canada, publié en ${h.src('od-std', 'données ouvertes')}, n’a pas de ligne pour les prolongations. La plus proche est celle du permis d’études demandé au Canada : ${K.fmtStd(ins.cur, 'fr')} pour 80 % des demandes. En ${K.fmtFy(ins.fy, 'fr')}, IRCC l’a tenue pour ${h.n(ins.cur.met)} demandes sur ${h.n(ins.cur.total)}, soit ${h.pct(ins.cur.perf)}, contre ${h.pct(ins.prev?.perf)} l’exercice d’avant. Sur les douze derniers mois, ${h.n(eff.last)} permis d’études sont entrés en vigueur d’après le ${h.src('od-study', 'jeu des titulaires de permis d’études')}, au Canada et à l’étranger confondus.</p>
<h2>Si la date est dépassée</h2>
<p>Un dossier au-delà de l’estimation n’est pas perdu : l’estimation couvre la plupart des dossiers, pas tous. Vérifiez dans l’outil de suivi qu’aucune demande ne vous a échappé, puis suivez les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')}. Si vous terminez bientôt vos études, le permis suivant est souvent le ${h.a('pgwp', 'permis de travail postdiplôme')}, que vous pouvez demander même si la prolongation est encore en cours.</p>
`,
  },
});
