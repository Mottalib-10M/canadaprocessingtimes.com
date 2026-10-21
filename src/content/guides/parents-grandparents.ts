import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Parents et grands-parents : deux lignes prospectives (Québec, reste du Canada), leur file par mois de dépôt,
   et le super visa comme solution de visite, délai par pays. */
const ROC = K.readingOf('pgp-roc'), QC = K.readingOf('pgp-qc');
const tr = K.fullTrend(ROC.series)!, tq = K.fullTrend(QC.series)!;
const D = K.L.dates.flpt;
const F0 = K.firstReading('flpt')!;
const QR = ROC.queue!, QQ = QC.queue!;
const keyAt = (q: typeof QR, back: number) => q[q.length - 1 - back][0];
const my = (key: string, l: Lang) => K.monthYear(`${key}-15`, l);
const leftTxt = (v: unknown, l: Lang) => (v === 'late' ? (l === 'fr' ? 'délai prévu dépassé' : 'past the expected time') : typeof v === 'number' ? `${K.num(v, l)} ${l === 'fr' ? 'mois' : v === 1 ? 'month' : 'months'}` : '');
const lastLeft = QR[QR.length - 1][1];
const plateau = QR.filter((x) => x[1] === lastLeft).length;
const firstPlateau = QR.find((x) => x[1] === lastLeft)![0];
const SV = 'super-visa';
const svRange = K.rangeOf(SV)!;
const svT = (c: string) => K.readingOf(SV, c).t;
const svCodes = K.MAJOR.filter((c) => K.countriesOf(SV).includes(c) && K.isTime(svT(c))).sort((a, b) => (K.daysOf(svT(a)) ?? 0) - (K.daysOf(svT(b)) ?? 0));
const svSer = (c: string) => `c:supervisa:${c}`;

function queueRows(h: Helpers) {
  return [0, 6, 12, 18, 24, 30].map((b) => keyAt(QR, b)).map((k) => {
    const a = QR.find((x) => x[0] === k)!, b = QQ.find((x) => x[0] === k);
    return [my(k, h.lang), leftTxt(a[1], h.lang), K.fmtAhead(a[2], h.lang), b ? leftTxt(b[1], h.lang) : '', b ? K.fmtAhead(b[2], h.lang) : ''];
  });
}
function svRows(h: Helpers) {
  return svCodes.map((c) => { const t = K.fullTrend(svSer(c)); return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.t(svT(c)), t?.firstDate ? `${h.d(t.first!)} (${h.day(t.firstDate)})` : '']; });
}

export default defineGuide({
  id: 'parents-grandparents', group: 'family', order: 51,
  tool: 'delai', toolArg: { g: 'pgp-roc', only: 'pgp-roc,pgp-qc' },
  related: ['super-visa', 'spousal-sponsorship', 'dependent-child', 'visitor-visa', 'beyond-processing-time'],
  sources: ['ptimes-flpt', 'pgp', 'super-visa', 'ptimes-country', 'wayback'],
  en: {
    slug: 'parents-grandparents-sponsorship-processing-time',
    nav: 'Parents and grandparents', card: 'Two times, Quebec and elsewhere, and the super visa',
    title: 'Parents and Grandparents Sponsorship Processing Time 2026',
    description: 'Parents and grandparents sponsorship processing time in 2026, in Quebec and the rest of Canada, the queue by month of filing, and the super visa for visits.',
    h1: 'Sponsoring parents and grandparents: how long it takes',
    intro: `IRCC expects ${K.fmtTime(ROC.t, 'en')} outside Quebec and ${K.fmtTime(QC.t, 'en')} in Quebec, in its file dated ${K.en.day(D)}.`,
    resume: `Sponsoring a parent or grandparent for permanent residence currently takes ${K.fmtTime(ROC.t, 'en')} for a sponsor living outside Quebec and ${K.fmtTime(QC.t, 'en')} for a sponsor in Quebec, according to the forward-looking times IRCC published on ${K.en.day(D)}. About ${K.num(ROC.waiting ?? 0, 'en')} applications were waiting outside Quebec and ${K.num(QC.waiting ?? 0, 'en')} in Quebec. These figures are IRCC’s estimate for an application received today; they are not a promise. The outside-Quebec line has come down from a high of ${K.fmtDays(tr.max, 'm', 'en')} on ${K.en.day(tr.maxDate)}, while the Quebec line has stayed close to its peak of ${K.fmtDays(tq.max, 'm', 'en')}, reached on ${K.en.day(tq.maxDate)}. The program only accepts applications from sponsors IRCC has invited, so the line moves in steps after each intake. For a family that mostly wants to spend long periods together, the super visa is the quicker route: it is a visit document, decided in ${K.fmtTime(svT('IN'), 'en')} for India and ${K.fmtTime(svT('PH'), 'en')} for the Philippines at the latest reading, and it allows stays of up to five years at a time.`,
    faqs: [
      { q: 'How long does parent sponsorship take outside Quebec in 2026?', a: `IRCC’s forward-looking time of ${K.en.day(D)} is ${K.fmtTime(ROC.t, 'en')}. In our first dated copy (${K.en.day(tr.firstDate!)}) it was ${K.fmtDays(tr.first!, 'm', 'en')}, and it rose to ${K.fmtDays(tr.max, 'm', 'en')} on ${K.en.day(tr.maxDate)} before easing. The time runs from the day IRCC receives the complete application sent after an invitation.` },
      { q: 'Why does the parents and grandparents program take so much longer in Quebec?', a: `The Quebec government selects the sponsored parents and sets its own annual cap, and the sponsor signs an undertaking with Quebec in addition to the federal steps. The published Quebec time is ${K.fmtTime(QC.t, 'en')}, with ${K.num(QC.waiting ?? 0, 'en')} applications waiting, against ${K.fmtTime(ROC.t, 'en')} outside Quebec on ${K.en.day(D)}.` },
      { q: 'Is a super visa a real alternative to sponsoring my parents?', a: `It answers a different need. A super visa lets a parent or grandparent visit for up to five years per entry, but gives no permanent status, no provincial health coverage and requires private medical insurance. It is decided far faster: currently between ${K.fmtTime(svRange.lo[1], 'en')} and ${K.fmtTime(svRange.hi[1], 'en')} depending on the country of filing. Many families use it while waiting for an invitation.` },
      { q: 'Can I apply to sponsor my parents without an invitation?', a: 'No. IRCC first collects interest to sponsor forms, then invites a number of potential sponsors to apply. Only invited sponsors can submit a complete application, and the processing time on this page starts from that application. Check IRCC’s parents and grandparents page for the current intake and its dates before planning around it.' },
    ],
    body: (h) => `
<h2>Two lines and their direction</h2>
<p>IRCC publishes two times for this program: one for sponsors who live in Quebec, one for everyone else. Outside Quebec, the figure stood at ${h.d(tr.first!, 'm')} in the copy of ${h.day(tr.firstDate!)}, jumped to ${h.d(tr.max, 'm')} by ${h.day(tr.maxDate)} and has fallen at almost every reading since, to ${h.d(tr.last, 'm')} now. A jump of that size usually reflects a batch of invited applications entering the line: when thousands of files arrive in the same few months, the forward-looking time is recalculated for all of them at once.</p>
<p>The Quebec line followed its own path. It went from ${h.d(tq.first!, 'm')} to a peak of ${h.d(tq.max, 'm')} on ${h.day(tq.maxDate)}, and is ${h.d(tq.last, 'm')} today. Quebec decides how many parents it selects each year, so a long Quebec queue reflects that cap as much as IRCC’s own pace.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'pgp-roc', m: keyAt(QR, 18) }, t: 'Your parent sponsorship: time left for your month' })}
<h2>The queue by month of filing</h2>
<p>For each month in which applications arrived, IRCC states how many months it expects are left and how many applications are ahead. The table shows one month in six, as of ${h.day(D)}.</p>
${h.table(['Month filed', 'Outside Quebec: time left', 'People ahead', 'Quebec: time left', 'People ahead'], queueRows(h), `Parents and grandparents, queue published by IRCC on ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The outside-Quebec queue has a long flat stretch: ${h.n(plateau)} months of filing, from ${h.my(`${firstPlateau}-15`)} onward, all show the same ${leftTxt(lastLeft, 'en')} left. The number of people ahead barely moves across those months. This is what an invitation-based program looks like in the data: files arrived in a block after an intake, IRCC treats them as one group, and a later month of filing does not mean a later decision within that group. Older months marked as past the expected time are files that IRCC planned to finish already, often waiting on medical results or documents.</p>
<h2>Every reading since October 2025</h2>
<p>Our archive of the forward-looking file starts on ${h.day(F0)}, the oldest copy we could date. The table below lists each reading for sponsors outside Quebec with the copy it comes from. No earlier point exists in our data and none has been estimated.</p>
${h.hist(ROC.series, { max: 12, unit: 'm' })}
<h2>The super visa: a visit, not a status</h2>
<p>Parents and grandparents of Canadian citizens and permanent residents can ask for a ${h.a('super-visa', 'super visa')} instead, or while they wait. It allows stays of up to five years per entry and is valid for up to ten years, but it does not lead to permanent residence. The host must meet an income threshold and the visitor needs private medical insurance from an approved insurer. Unlike the sponsorship, the super visa is processed country by country, with a past time published every week.</p>
${h.table(['Country of filing', 'Super visa time', 'Oldest copy kept'], svRows(h), `Super visa, IRCC figure of ${h.day(K.L.dates.country)}, main countries of filing.`, ['l', 'r', 'r'])}
<p>Across all countries with a figure, the super visa currently takes from ${h.t(svRange.lo[1])} to ${h.t(svRange.hi[1])}. Even at the slow end, that is a fraction of the sponsorship line. A parent who already holds a ${h.a('visitor-visa', 'visitor visa')} can also come for shorter stays, usually up to six months at a time.</p>
<h2>Before and after you apply</h2>
<p>The forward-looking time starts when IRCC receives the complete application. The time between the invitation and sending the file, and any wait for police certificates or a medical exam, is not counted. If your month of filing shows a decision date that has already passed, the ${h.a('beyond-processing-time', 'steps for a file past the processing time')} apply. IRCC’s ${h.src('pgp', 'parents and grandparents page')} gives the income requirement for sponsors and the dates of the current intake.</p>
`,
  },
  fr: {
    slug: 'delai-parrainage-parents-grands-parents',
    nav: 'Parents et grands-parents', card: 'Deux délais, Québec et ailleurs, et le super visa',
    title: 'Délai du parrainage des parents et grands-parents 2026',
    description: 'Délai du parrainage des parents et grands-parents en 2026, au Québec et ailleurs au Canada : file par mois de dépôt, tendance et super visa pour venir vite.',
    h1: 'Parrainer ses parents ou grands-parents : les délais',
    intro: `IRCC prévoit ${K.fmtTime(QC.t, 'fr')} au Québec et ${K.fmtTime(ROC.t, 'fr')} ailleurs au Canada, dans son fichier daté du ${K.fr.day(D)}.`,
    resume: `Parrainer un parent ou un grand-parent pour la résidence permanente prend aujourd’hui ${K.fmtTime(QC.t, 'fr')} pour un répondant qui vit au Québec et ${K.fmtTime(ROC.t, 'fr')} pour un répondant ailleurs au Canada, selon les délais prospectifs publiés par IRCC le ${K.fr.day(D)}. Environ ${K.num(QC.waiting ?? 0, 'fr')} demandes attendaient côté Québec et ${K.num(ROC.waiting ?? 0, 'fr')} dans le reste du pays. Ces chiffres sont l’estimation d’IRCC pour une demande reçue aujourd’hui, pas un engagement. La ligne du Québec a culminé à ${K.fmtDays(tq.max, 'm', 'fr')} le ${K.fr.day(tq.maxDate)} et n’en est redescendue que de peu, alors que celle du reste du Canada a reculé depuis son sommet de ${K.fmtDays(tr.max, 'm', 'fr')}. Seuls les répondants invités par IRCC peuvent déposer, et le Québec fixe en plus son propre plafond de sélection. Pour passer de longues périodes en famille sans attendre, le super visa est beaucoup plus rapide : c’est un document de visite, accordé en ${K.fmtTime(svT('MA'), 'fr')} depuis le Maroc et en ${K.fmtTime(svT('DZ'), 'fr')} depuis l’Algérie au dernier relevé, pour des séjours allant jusqu’à cinq ans d’affilée.`,
    faqs: [
      { q: 'Combien de temps prend le parrainage des parents au Québec en 2026 ?', a: `Le délai prospectif publié par IRCC le ${K.fr.day(D)} est de ${K.fmtTime(QC.t, 'fr')}, avec ${K.num(QC.waiting ?? 0, 'fr')} demandes en attente. Il était de ${K.fmtDays(tq.first!, 'm', 'fr')} dans notre première copie datée, du ${K.fr.day(tq.firstDate!)}. Le délai court à partir de la réception de la demande complète envoyée après l’invitation.` },
      { q: 'Pourquoi le parrainage des parents est-il plus long au Québec qu’ailleurs ?', a: `Le Québec sélectionne lui-même les parents parrainés et fixe un nombre maximal de demandes par année. Le répondant signe un engagement auprès du gouvernement du Québec, en plus des étapes fédérales. Au ${K.fr.day(D)}, cela donne ${K.fmtTime(QC.t, 'fr')} au Québec contre ${K.fmtTime(ROC.t, 'fr')} dans le reste du Canada.` },
      { q: 'Le super visa peut-il remplacer le parrainage de mes parents ?', a: `Il répond à un autre besoin. Le super visa permet des séjours de cinq ans au plus par entrée, sans statut permanent ni couverture de l’assurance maladie provinciale, et exige une assurance médicale privée. Il est tranché bien plus vite : entre ${K.fmtTime(svRange.lo[1], 'fr')} et ${K.fmtTime(svRange.hi[1], 'fr')} selon le pays de dépôt au dernier relevé.` },
      { q: 'Peut-on parrainer ses parents sans avoir reçu d’invitation ?', a: 'Non. IRCC recueille d’abord des formulaires d’intérêt, puis invite un certain nombre de répondants potentiels à présenter une demande. Seuls les répondants invités peuvent envoyer une demande complète, et le délai de cette page part de cette demande. La page d’IRCC sur les parents et grands-parents donne les dates de la période d’invitation en cours.' },
    ],
    body: (h) => `
<h2>Deux lignes, deux trajectoires</h2>
<p>IRCC publie un délai pour les répondants du Québec et un autre pour le reste du Canada. Au Québec, le chiffre était de ${h.d(tq.first!, 'm')} dans la copie du ${h.day(tq.firstDate!)}. Il a grimpé jusqu’à ${h.d(tq.max, 'm')} le ${h.day(tq.maxDate)} puis n’a reculé que lentement, à ${h.d(tq.last, 'm')} aujourd’hui. Comme le Québec plafonne le nombre de parents sélectionnés chaque année, une longue file québécoise traduit ce plafond autant que le rythme d’IRCC.</p>
<p>Hors Québec, la courbe est plus nerveuse. Elle est passée de ${h.d(tr.first!, 'm')} à ${h.d(tr.max, 'm')} en un mois, le ${h.day(tr.maxDate)}, un saut qui traduit en général l’arrivée d’un lot de demandes invitées, puis elle a baissé presque à chaque relevé jusqu’à ${h.d(tr.last, 'm')}.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'pgp-qc', m: keyAt(QQ, 18) }, t: 'Votre parrainage de parent : temps restant pour votre mois' })}
<h2>La file selon le mois de dépôt</h2>
<p>Pour chaque mois de réception, IRCC indique le nombre de mois qu’il prévoit encore et le nombre de demandes placées devant. Le tableau reprend un mois sur six, au ${h.day(D)}.</p>
${h.table(['Mois de dépôt', 'Hors Québec : temps restant', 'Personnes devant', 'Québec : temps restant', 'Personnes devant'], queueRows(h), `Parents et grands-parents, file publiée par IRCC le ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>La file du Québec affiche des temps restants très longs même pour des dossiers déposés il y a plus de deux ans : pour ${h.my(`${keyAt(QQ, 24)}-15`)}, IRCC prévoit encore ${leftTxt(QQ[QQ.length - 25][1], 'fr')}. Hors Québec, ${h.n(plateau)} mois de dépôt consécutifs, depuis ${h.my(`${firstPlateau}-15`)}, partagent le même temps restant : les demandes arrivées après une même période d’invitation sont traitées comme un bloc, et un mois de dépôt plus tardif ne signifie pas une décision plus tardive au sein de ce bloc.</p>
<h2>Tous les relevés depuis octobre 2025</h2>
<p>Notre archive du fichier prospectif commence le ${h.day(F0)}, date de la plus ancienne copie que nous avons pu dater. Voici chaque relevé de la ligne du Québec, avec la copie d’où il vient. Aucun point plus ancien n’existe dans nos données et aucun n’est estimé.</p>
${h.hist(QC.series, { max: 12, unit: 'm' })}
<h2>Le super visa : une visite, pas un statut</h2>
<p>Les parents et grands-parents de citoyens canadiens et de résidents permanents peuvent demander un ${h.a('super-visa', 'super visa')}, à la place du parrainage ou en l’attendant. Il autorise des séjours jusqu’à cinq ans par entrée et reste valide jusqu’à dix ans, sans mener à la résidence permanente. L’hôte doit atteindre un seuil de revenu et le visiteur doit souscrire une assurance médicale privée. Le délai du super visa est publié chaque semaine, pays par pays.</p>
${h.table(['Pays de dépôt', 'Délai du super visa', 'Plus ancienne copie'], svRows(h), `Super visa, chiffre d’IRCC du ${h.day(K.L.dates.country)}, principaux pays de dépôt.`, ['l', 'r', 'r'])}
<p>Selon le pays, il faut aujourd’hui de ${h.t(svRange.lo[1])} à ${h.t(svRange.hi[1])}. Même au plus long, c’est une petite partie du délai du parrainage, et la demande peut être faite dès que l’hôte remplit les conditions, sans attendre aucune invitation. Beaucoup de familles combinent les deux : le parent vient avec un super visa pendant que le dossier de résidence permanente avance dans la file. Un parent qui a déjà un ${h.a('visitor-visa', 'visa de visiteur')} peut aussi venir pour des séjours plus courts, en général six mois au plus.</p>
<h2>Avant et après le dépôt</h2>
<p>Le délai prospectif part de la réception de la demande complète. Le temps entre l’invitation et l’envoi du dossier, et l’attente des certificats de police ou de l’examen médical, ne sont pas comptés. Si la date prévue pour votre mois de dépôt est déjà passée, voyez les ${h.a('beyond-processing-time', 'démarches pour une demande hors délai')}. La ${h.src('pgp', 'page d’IRCC sur le parrainage des parents et grands-parents')} donne le revenu exigé du répondant et le calendrier de la période d’invitation.</p>
`,
  },
});
