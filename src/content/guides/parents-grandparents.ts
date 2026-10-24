import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : admissions de résidents permanents dans la catégorie des parents et grands-parents
 * (Permanent Residents, Monthly IRCC Updates) et norme de service du super visa (Inventaire des services du GC),
 * données ouvertes sous la Licence du gouvernement ouvert du Canada. Le délai de l'outil d'IRCC est saisi par le lecteur. */
const E = K.en, F = K.fr;
const M = K.PRD.months;
const ser = K.prSeries('pgp');
const p12 = K.pr12('pgp'), sp = K.pr12('spouse'), ch = K.pr12('child'), all = K.pr12('all');
const yr = (y: string) => K.yearSum(ser, M, y) ?? 0;
const y23 = yr('2023'), y24 = yr('2024'), y25 = yr('2025');
const fall = y23 ? Math.round(((y25 - y23) / y23) * 1000) / 10 : null;
const shareFam = K.pctOf(p12.last, (p12.last ?? 0) + (sp.last ?? 0) + (ch.last ?? 0));
const sv = K.stdOf('super-visa')!;
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');

export default defineGuide({
  id: 'parents-grandparents', group: 'family', order: 51,
  tool: 'delai', toolArg: { g: 'pgp-roc', only: 'pgp-roc,pgp-qc' },
  related: ['super-visa', 'spousal-sponsorship', 'dependent-child', 'visitor-visa', 'beyond-processing-time'],
  sources: ['ptimes', 'pgp', 'od-pr', 'od-std', 'super-visa', 'ogl'],
  en: {
    slug: 'parents-grandparents-sponsorship-processing-time',
    nav: 'Parents and grandparents', card: 'Decision date after an invitation, parents admitted, super visa',
    title: 'Parents and Grandparents Program Processing Time 2026',
    description: 'Get a decision date for a parents and grandparents sponsorship from the time IRCC shows, with the 2026 count of parents admitted and the super visa standard.',
    h1: 'Parents and grandparents: decision date and admissions',
    intro: `${E.n(p12.last)} parents and grandparents became permanent residents from ${E.w12(M)}, ${E.ch(p12.change)} on the twelve months before.`,
    resume: `The Parents and Grandparents Program works by invitation: IRCC picks sponsors from those who sent an interest to sponsor form, and only invited sponsors can file. Once your complete application is received, read the time IRCC shows on its “Check processing times” tool, on the line for Quebec or for the rest of Canada, and enter it in the calculator above with the date of receipt: you get an estimated decision date, the days elapsed and the days left. The rest of this page comes from Government of Canada open data, published under the Open Government Licence of Canada. IRCC publishes no service standard for this program. Admissions are falling: ${E.n(y23)} parents and grandparents in 2023, ${E.n(y24)} in 2024 and ${E.n(y25)} in 2025, then ${E.n(p12.last)} over ${E.w12(M)}, ${E.ch(p12.change)} on the previous twelve months. They still make up ${E.pct(shareFam)} of all sponsored family admissions. For a stay without permanent residence, the super visa has a standard of ${K.fmtStd(sv.cur, 'en')}, met for ${E.pct(sv.cur.perf)} of files in ${K.fmtFy(sv.fy, 'en')}.`,
    faqs: [
      { q: 'When does the clock start for a parents and grandparents sponsorship?', a: 'On the day IRCC receives the complete application, sent after the invitation. The time spent waiting for an invitation, sometimes years, is not part of the processing time IRCC shows. Enter that receipt date in the calculator, not the date you sent the interest to sponsor form.' },
      { q: 'Why do Quebec sponsors see a different time for parents?', a: 'A sponsor living in Quebec must also sign an undertaking with the Quebec government, which sets its own income rules and its own intake. IRCC therefore shows a separate line for Quebec on its tool. Copy the line that matches where you live, then add the date IRCC received the application.' },
      { q: 'How fast is a super visa compared with parent sponsorship?', a: `Much faster on paper. IRCC’s service standard for a super visa is ${K.fmtStd(sv.cur, 'en')} for 80% of applications, and it was met for ${E.pct(sv.cur.perf)} of them in ${K.fmtFy(sv.fy, 'en')}. Parent sponsorship has no published standard and leads to permanent residence, which a super visa does not give.` },
      { q: 'Are fewer parents being admitted to Canada now?', a: `Yes, according to IRCC’s open data. Admissions of parents and grandparents went from ${E.n(y23)} in 2023 to ${E.n(y25)} in 2025, ${E.ch(fall)} over two years. The latest twelve months total ${E.n(p12.last)}. The yearly levels plan sets the number of places, so lower admissions also reflect fewer places.` },
    ],
    body: (h) => `
<h2>Invitation first, then the processing time</h2>
<p>Unlike the spouse and child streams, sponsoring a parent or grandparent starts with an intake set by IRCC. Sponsors send an interest to sponsor form during an opening, IRCC selects some of them, and invited sponsors then file the full sponsorship and permanent residence application. The processing time on IRCC’s ${h.src('ptimes', '“Check processing times” tool')} only covers what happens after that full application is received. The rules for each intake are on IRCC’s ${h.src('pgp', 'Parents and Grandparents Program page')}.</p>
<p>So the date to enter in the calculator is the date of receipt of the complete application, which appears in the acknowledgement IRCC sends. Choose the Quebec line if you live in Quebec, the other one if not, and copy the figure with its unit. The calculator adds months as calendar months, so twenty four months from 15 March lands on 15 March two years later.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'pgp-roc', m: 'none' }, t: 'Your parents sponsorship: estimated decision date' })}
<h2>No standard, so the tool is the only reference</h2>
<p>The Government of Canada service inventory, published as ${h.src('od-std', 'open data')}, lists IRCC’s service standards with their yearly results. It holds none for the Parents and Grandparents Program. The only figure for a parent’s file is therefore the forward looking time IRCC shows on its tool: the time it expects for an application received now, given the files already waiting and the places planned for the year. For an application filed long ago, the figure on the tool may be shorter or longer than what your file will actually take.</p>
<h2>Parents and grandparents admitted, by month</h2>
<p>IRCC’s ${h.src('od-pr', 'open data on permanent residents')} counts admissions in the parents and grandparents category, which includes the spouse of the parent and children who come along. The latest twelve months total ${h.n(p12.last)}, ${dirEn(p12.change)} ${h.pa(p12.change)} on the twelve before, or ${h.pct(K.pctOf(p12.last, all.last))} of all new permanent residents of Canada.</p>
${h.months(M, [['Parents and grandparents', ser]], { caption: 'Admissions of permanent residents in the parents and grandparents category, by month. Source: IRCC, Permanent Residents, Monthly IRCC Updates, open data; figures rounded.' })}
<p>By calendar year, IRCC admitted ${h.n(y23)} parents and grandparents in 2023, ${h.n(y24)} in 2024 and ${h.n(y25)} in 2025, a change of ${h.ch(fall)} over two years. Admissions are the end of the process, so they show the files finished each month and the space set aside in the levels plan. They do not tell you how many new invitations were sent.</p>
<h2>The super visa as a bridge</h2>
<p>Many families apply for a ${h.a('super-visa', 'super visa')} while waiting, or instead of sponsorship. It is a temporary resident visa that lets a parent or grandparent stay in Canada for up to five years per entry, with private medical insurance and a minimum income from the child or grandchild. IRCC’s ${h.src('super-visa', 'super visa page')} lists the conditions. Its service standard is ${K.fmtStd(sv.cur, 'en')} for 80% of applications; in ${K.fmtFy(sv.fy, 'en')}, ${h.n(sv.cur.met)} of ${h.n(sv.cur.total)} were processed within it, ${h.pct(sv.cur.perf)}.</p>
<p>A super visa does not lead to permanent residence and gives no access to provincial health care. A parent can hold one while a sponsorship is in process, and a pending sponsorship is not a reason to refuse it. For a short trip, the ordinary ${h.a('visitor-visa', 'visitor visa')} is enough.</p>
<h2>If the file runs long</h2>
<p>Parents are often older, and medical exams expire after twelve months. If IRCC asks for a new exam, the file waits until it is done. When the calculator shows the date has passed and your account shows no request, the ${h.a('beyond-processing-time', 'guide to files past the processing time')} sets out what to do. Spouses and children have their own pages: ${h.a('spousal-sponsorship', 'spousal sponsorship')} and ${h.a('dependent-child', 'dependent child')}.</p>
`,
  },
  fr: {
    slug: 'delai-parrainage-parents-grands-parents',
    nav: 'Parents et grands-parents', card: 'Date de décision après invitation, parents admis, super visa',
    title: 'Délai du parrainage des parents et grands-parents 2026',
    description: 'Obtenez une date de décision pour le parrainage d’un parent ou grand-parent à partir du délai d’IRCC, avec les parents admis en 2026 et la norme du super visa.',
    h1: 'Parents et grands-parents : date de décision et admissions',
    intro: `${F.n(p12.last)} parents et grands-parents sont devenus résidents permanents de ${F.w12(M)}, soit ${F.ch(p12.change)} sur un an.`,
    resume: `Le Programme des parents et des grands-parents fonctionne sur invitation : IRCC tire des répondants parmi ceux qui ont envoyé un formulaire d’intérêt, et seuls les répondants invités peuvent déposer une demande. Une fois votre demande complète reçue, lisez le délai affiché par l’outil « Vérifier les délais de traitement » d’IRCC, sur la ligne du Québec ou du reste du Canada, et saisissez-le dans le calculateur ci-dessus avec la date de réception : vous obtenez une date de décision estimée, les jours écoulés et ceux qui restent. Le reste de la page vient des données ouvertes du gouvernement du Canada, publiées sous la Licence du gouvernement ouvert du Canada. IRCC ne publie aucune norme de service pour ce programme. Les admissions reculent : ${F.n(y23)} parents et grands-parents en 2023, ${F.n(y24)} en 2024 et ${F.n(y25)} en 2025, puis ${F.n(p12.last)} de ${F.w12(M)}, soit ${F.ch(p12.change)} sur un an. Ils représentent encore ${F.pct(shareFam)} des admissions de la famille parrainée. Pour un séjour sans résidence permanente, le super visa a une norme de ${K.fmtStd(sv.cur, 'fr')}, tenue pour ${F.pct(sv.cur.perf)} des dossiers en ${K.fmtFy(sv.fy, 'fr')}.`,
    faqs: [
      { q: 'Quand le délai du parrainage des parents commence-t-il ?', a: 'Le jour où IRCC reçoit la demande complète, envoyée après l’invitation. L’attente de l’invitation, parfois plusieurs années, ne fait pas partie du délai affiché par IRCC. Saisissez donc dans le calculateur cette date de réception, et non la date d’envoi du formulaire d’intérêt à parrainer.' },
      { q: 'Pourquoi le délai des parents diffère-t-il pour les répondants du Québec ?', a: 'Un répondant qui vit au Québec doit aussi signer un engagement auprès du gouvernement du Québec, qui fixe ses propres règles de revenu et son propre nombre de demandes. IRCC affiche donc une ligne distincte pour le Québec. Recopiez la ligne qui correspond à votre lieu de vie, puis la date de réception de la demande.' },
      { q: 'Le super visa est-il plus rapide que le parrainage d’un parent ?', a: `Nettement, sur le papier. La norme de service d’IRCC pour le super visa est de ${K.fmtStd(sv.cur, 'fr')} pour 80 % des demandes, et elle a été tenue pour ${F.pct(sv.cur.perf)} d’entre elles en ${K.fmtFy(sv.fy, 'fr')}. Le parrainage d’un parent n’a pas de norme publiée, mais il mène à la résidence permanente, ce que le super visa ne donne pas.` },
      { q: 'Le Canada admet-il moins de parents qu’avant ?', a: `Oui, selon les données ouvertes d’IRCC. Les admissions de parents et grands-parents sont passées de ${F.n(y23)} en 2023 à ${F.n(y25)} en 2025, soit ${F.ch(fall)} en deux ans. Les douze derniers mois en totalisent ${F.n(p12.last)}. Le plan des niveaux fixe le nombre de places : la baisse des admissions reflète aussi moins de places.` },
    ],
    body: (h) => `
<h2>D’abord l’invitation, ensuite le délai</h2>
<p>Contrairement aux volets de l’époux et de l’enfant, le parrainage d’un parent ou d’un grand-parent commence par une période de réception fixée par IRCC. Les répondants envoient un formulaire d’intérêt pendant une ouverture, IRCC en sélectionne une partie, puis les répondants invités déposent la demande complète de parrainage et de résidence permanente. Le délai de l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} ne couvre que ce qui suit la réception de cette demande complète. Les règles de chaque période figurent sur la ${h.src('pgp', 'page d’IRCC du Programme des parents et des grands-parents')}.</p>
<p>La date à saisir dans le calculateur est donc celle de la réception de la demande complète, indiquée dans l’accusé de réception d’IRCC. Choisissez la ligne du Québec si vous y vivez, l’autre sinon, et recopiez le chiffre avec son unité. Le calculateur ajoute les mois en mois de calendrier : vingt-quatre mois à partir du 15 mars mènent au 15 mars deux ans plus tard.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'pgp-qc', m: 'none' }, t: 'Votre parrainage de parents : date de décision estimée' })}
<h2>Pas de norme : l’outil reste la seule référence</h2>
<p>L’inventaire des services du gouvernement du Canada, publié en ${h.src('od-std', 'données ouvertes')}, recense les normes de service d’IRCC avec leurs résultats annuels. Il n’en contient aucune pour le Programme des parents et des grands-parents. Le seul chiffre pour le dossier d’un parent est donc le délai prospectif affiché par l’outil d’IRCC : le temps prévu pour une demande reçue maintenant, selon les dossiers déjà en attente et les places prévues pour l’année. Pour une demande ancienne, ce chiffre peut être plus court ou plus long que le temps réel de votre dossier.</p>
<h2>Les parents et grands-parents admis, par mois</h2>
<p>Les ${h.src('od-pr', 'données ouvertes d’IRCC sur les résidents permanents')} comptent les admissions dans la catégorie des parents et grands-parents, qui inclut l’époux du parent et les enfants qui l’accompagnent. Les douze derniers mois en totalisent ${h.n(p12.last)}, ${dirFr(p12.change)} de ${h.pa(p12.change)} sur les douze précédents, soit ${h.pct(K.pctOf(p12.last, all.last))} de tous les nouveaux résidents permanents du Canada.</p>
${h.months(M, [['Parents et grands-parents', ser]], { caption: 'Admissions de résidents permanents dans la catégorie des parents et grands-parents, par mois. Source : IRCC, Résidents permanents, mises à jour mensuelles, données ouvertes ; chiffres arrondis.' })}
<p>Par année civile, IRCC a admis ${h.n(y23)} parents et grands-parents en 2023, ${h.n(y24)} en 2024 et ${h.n(y25)} en 2025, une évolution de ${h.ch(fall)} en deux ans. Les admissions sont la fin du parcours : elles montrent les dossiers terminés chaque mois et la place réservée dans le plan des niveaux. Elles ne disent pas combien de nouvelles invitations ont été envoyées.</p>
<h2>Le super visa comme passerelle</h2>
<p>Beaucoup de familles demandent un ${h.a('super-visa', 'super visa')} pendant l’attente, ou à la place du parrainage. C’est un visa de résident temporaire qui permet à un parent ou grand-parent de rester au Canada jusqu’à cinq ans par entrée, avec une assurance médicale privée et un revenu minimum de l’enfant ou du petit-enfant. La ${h.src('super-visa', 'page d’IRCC sur le super visa')} en donne les conditions. Sa norme de service est de ${K.fmtStd(sv.cur, 'fr')} pour 80 % des demandes ; en ${K.fmtFy(sv.fy, 'fr')}, ${h.n(sv.cur.met)} demandes sur ${h.n(sv.cur.total)} ont été traitées dans ce délai, soit ${h.pct(sv.cur.perf)}.</p>
<p>Le super visa ne mène pas à la résidence permanente et n’ouvre pas l’accès à l’assurance maladie provinciale. Un parent peut le détenir pendant le traitement d’un parrainage, et un parrainage en cours n’est pas un motif de refus. Pour un court voyage, le ${h.a('visitor-visa', 'visa de visiteur')} ordinaire suffit.</p>
<h2>Si le dossier s’allonge</h2>
<p>Les parents sont souvent plus âgés, et l’examen médical expire au bout de douze mois. Si IRCC demande un nouvel examen, le dossier attend qu’il soit fait. Quand le calculateur indique que la date est dépassée et que votre compte ne montre aucune demande, le ${h.a('beyond-processing-time', 'guide des dossiers qui dépassent le délai')} explique quoi faire. Époux et enfants ont leurs propres pages : ${h.a('spousal-sponsorship', 'parrainage de l’époux')} et ${h.a('dependent-child', 'enfant à charge')}.</p>
`,
  },
});
