import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : relevé du fichier par pays, historique complet, tous calculés au build. */
const P = 'visitor';
const rng = K.rangeOf(P)!;
const all = K.countriesOf(P).map((c) => [c, K.daysOf(K.readingOf(P, c).t)] as const).filter((x): x is readonly [string, number] => x[1] != null).sort((a, b) => a[1] - b[1]);
const median = all[Math.floor(all.length / 2)][1];
const within30 = all.filter((x) => x[1] <= 30).length;
const over90 = all.filter((x) => x[1] > 90).length;
const t = (c: string) => K.readingOf(P, c).t;
const ser = (c: string) => `c:visitor-outside-canada:${c}`;
const ng = K.fullTrend(ser('NG'))!, inT = K.fullTrend(ser('IN'))!, ir = K.fullTrend(ser('IR'))!;
const inside = K.readingOf('visitor-inside');
const D = K.L.dates.country;
const E = K.en, F = K.fr;

function major(h: Helpers) {
  const codes = K.MAJOR.filter((c) => K.countriesOf(P).includes(c));
  const rows = codes.map((c) => { const tr = K.fullTrend(ser(c)); return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.t(t(c)), tr?.prev != null ? h.d(tr.prev) : '', tr?.firstDate ? `${h.d(tr.first!)} (${h.day(tr.firstDate)})` : '']; });
  return rows;
}

export default defineGuide({
  id: 'visitor-visa', group: 'visit', order: 10,
  tool: 'delai', toolArg: { g: 'visitor', c: 'IN', only: 'visitor,visitor-inside,super-visa,visitor-record,eta' },
  related: ['super-visa', 'visitor-record', 'eta', 'india', 'nigeria', 'beyond-processing-time'],
  sources: ['ptimes-country', 'ptimes-noncountry', 'visit', 'biometrics', 'wayback'],
  en: {
    slug: 'visitor-visa-processing-time',
    nav: 'Visitor visa', card: 'Time by country, decision date, trend since 2024',
    title: 'Visitor Visa Processing Time by Country, Canada 2026',
    description: 'Canada visitor visa processing time in 2026 for every country of filing: the time IRCC publishes, your estimated decision date and the trend since 2024.',
    h1: 'Visitor visa processing time, country by country',
    intro: `IRCC’s latest figure, dated ${E.day(D)}, ranges from ${K.fmtTime(rng.lo[1], 'en')} to ${K.fmtTime(rng.hi[1], 'en')} depending on where you apply.`,
    resume: `A visitor visa requested from outside Canada currently takes ${K.fmtTime(t('IN'), 'en')} from India, ${K.fmtTime(t('PH'), 'en')} from the Philippines, ${K.fmtTime(t('NG'), 'en')} from Nigeria and ${K.fmtTime(t('MX'), 'en')} from Mexico, according to the processing times IRCC published on ${E.day(D)}. Across the ${E.n(all.length)} countries with a figure, the middle value is ${E.n(median)} days; ${E.n(within30)} countries are at 30 days or less and ${E.n(over90)} are above 90 days. The figure is a past time: how long IRCC took to finish 80% of the applications it recently decided from that country, counted from the day it received a complete application and excluding the time needed to give biometrics. It is not a forecast for your file, and one in five applications took longer. Applied from inside Canada, the same visa currently takes ${K.fmtTime(inside.t, 'en')}. The tool above adds the published time to the date IRCC received your application and shows how the figure has moved since our first dated copy.`,
    faqs: [
      { q: 'How long does a Canada visitor visa take from India in 2026?', a: `IRCC’s figure of ${E.day(D)} is ${K.fmtTime(t('IN'), 'en')} for applications made from India. It was ${E.d(inT.first!)} in the copy dated ${E.day(inT.firstDate!)} and peaked at ${E.d(inT.max)} on ${E.day(inT.maxDate)}. Count the time from the day IRCC received your complete application; giving biometrics at a visa application centre comes on top.` },
      { q: 'Why does the processing time differ so much between countries?', a: 'Each figure reflects the files decided recently by the office that handles that country: how many arrived, how many staff work on them and how often extra checks are needed. A country with few applications can swing from one week to the next, because a handful of slow files is enough to move the 80th percentile.' },
      { q: 'My visitor visa is past the processing time. What should I do?', a: 'First check that the date you use is the date IRCC received the complete application, and that biometrics were given. If you are clearly past the published time, IRCC’s web form lets you ask about an application outside the normal time. Sending a second application does not move you up the line.' },
      { q: 'Does a visitor visa cost less time if I apply from inside Canada?', a: `Applied from inside Canada, for example to get a new visa before travelling abroad and coming back, the published time is currently ${K.fmtTime(inside.t, 'en')}. That line is a single figure for all nationalities, read on ${E.day(inside.date)}, and it moves far less than the country figures.` },
    ],
    body: (h) => `
<h2>All main countries of filing</h2>
<p>The table lists the countries that file the most applications to Canada, with the figure IRCC published on ${h.day(D)}, the one before it and the oldest copy in our archive. Older figures come from public copies of IRCC’s file kept by the Internet Archive; each one is listed with its date on the ${h.a('history', 'history page')}, and no point is filled in where no copy exists.</p>
${h.table(['Country', 'Published time', 'Previous reading', 'Oldest copy kept'], major(h), `Visitor visa from outside Canada, IRCC figure of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>The spread is wide. Nigeria went from ${h.d(ng.first!)} in the copy of ${h.day(ng.firstDate!)} down to ${h.d(ng.min)} on ${h.day(ng.minDate)}, then back up to ${h.d(ng.last)} now. Iran sits at ${h.t(t('IR'))}, after a high of ${h.d(ir.max)} on ${h.day(ir.maxDate)}. A figure that moves by a week from one reading to the next is common; the trend over several readings says more than any single number.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'visitor', c: 'NG', m: 'none' }, t: 'Your visitor visa: estimated decision date' })}
<h2>What the published time measures</h2>
<p>IRCC calls this a past processing time. Each week it looks at the applications it finished recently and reports the time within which 80% of them were decided. The clock starts when IRCC receives a complete application, which for an online application is the submission date, and stops at the decision. The time to book and give biometrics is not included, so if you gave fingerprints and a photo three weeks after applying, the decision may come later than the date on your submission plus the published time.</p>
<p>Because it looks back, the figure reacts late. When applications pile up after a holiday season, the published time rises only once those files are decided. The trend in the tool helps here: a time that has risen at each of the last readings is more likely to keep rising for a while than one that has been flat for months.</p>
<h2>Which country counts</h2>
<p>The country in IRCC’s list is the one you apply from, which is normally your country of residence, not your passport. A Nigerian citizen living legally in the United Arab Emirates who applies from there falls under the figure for the United Arab Emirates. If you pick the wrong country in the tool, the date it gives you will be off by as much as the gap between the two lines.</p>
<h2>Reading your own estimate</h2>
<p>Enter the month and day IRCC received your application. The result adds the published time to that date. If the date is already behind you, the tool says by how many days you are past the time. That does not mean something is wrong: by definition one application in five takes longer. It is the point from which a follow-up through IRCC’s web form becomes reasonable, and from which the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} apply.</p>
<p>Two situations change the reading. If IRCC asked for more documents or a medical exam, the file waits for your answer, and the published time does not cover that pause. If you applied on paper, the clock starts when the mailroom logs the envelope, not when you posted it.</p>
<h2>Other visit documents</h2>
<p>Parents and grandparents who want to stay up to five years at a time use the ${h.a('super-visa', 'super visa')}, which has its own, usually longer, time by country. Visitors already in Canada who want to stay longer apply for a ${h.a('visitor-record', 'visitor record')}, a line that has grown sharply since 2024. Travellers from visa-exempt countries need only an ${h.a('eta', 'eTA')}, usually approved within minutes.</p>
`,
  },
  fr: {
    slug: 'delai-visa-visiteur',
    nav: 'Visa de visiteur', card: 'Délai par pays, date de décision, tendance depuis 2024',
    title: 'Délai du visa visiteur Canada par pays, relevé 2026',
    description: 'Délai de traitement du visa de visiteur canadien en 2026 pour chaque pays de dépôt : chiffre publié par IRCC, date de décision estimée et tendance depuis 2024.',
    h1: 'Délai du visa de visiteur, pays par pays',
    intro: `Le dernier chiffre d’IRCC, daté du ${F.day(D)}, va de ${K.fmtTime(rng.lo[1], 'fr')} à ${K.fmtTime(rng.hi[1], 'fr')} selon le pays de dépôt.`,
    resume: `Un visa de visiteur demandé hors du Canada prend aujourd’hui ${K.fmtTime(t('MA'), 'fr')} depuis le Maroc, ${K.fmtTime(t('DZ'), 'fr')} depuis l’Algérie, ${K.fmtTime(t('CM'), 'fr')} depuis le Cameroun et ${K.fmtTime(t('FR'), 'fr')} pour une demande déposée en France, d’après les délais publiés par IRCC le ${F.day(D)}. Sur les ${F.n(all.length)} pays qui ont un chiffre, la valeur du milieu est de ${F.n(median)} jours ; ${F.n(within30)} pays sont à 30 jours ou moins et ${F.n(over90)} dépassent 90 jours. Ce chiffre est un délai passé : le temps qu’il a fallu à IRCC pour terminer 80 % des demandes récemment tranchées pour ce pays, compté à partir de la réception d’une demande complète et sans le temps de la biométrie. Ce n’est pas une prévision pour votre dossier, et une demande sur cinq a pris plus longtemps. Faite depuis le Canada, la même demande prend en ce moment ${K.fmtTime(inside.t, 'fr')}. L’outil ci-dessus ajoute le délai publié à la date de réception et montre comment le chiffre a évolué depuis notre première copie datée.`,
    faqs: [
      { q: 'Combien de temps prend un visa de visiteur depuis le Maroc en 2026 ?', a: `Le chiffre d’IRCC du ${F.day(D)} est de ${K.fmtTime(t('MA'), 'fr')} pour une demande faite depuis le Maroc. La plus ancienne copie de notre archive, datée du ${F.day(K.fullTrend(ser('MA'))!.firstDate!)}, indiquait ${F.d(K.fullTrend(ser('MA'))!.first!)}. Le délai court à partir de la réception de la demande complète ; le rendez-vous de biométrie au centre de réception des demandes de visa s’ajoute.` },
      { q: 'Pourquoi le délai change-t-il autant d’un pays à l’autre ?', a: 'Chaque chiffre reflète les dossiers tranchés récemment par le bureau qui traite ce pays : nombre de demandes reçues, personnel affecté, vérifications supplémentaires. Un pays qui dépose peu de demandes peut varier fortement d’une semaine à l’autre, car quelques dossiers lents suffisent à déplacer le seuil des 80 %.' },
      { q: 'Mon visa de visiteur dépasse le délai publié : que faire ?', a: 'Vérifiez d’abord la date utilisée : c’est la date de réception de la demande complète, biométrie fournie. Si vous dépassez nettement le délai publié, le formulaire Web d’IRCC permet de poser une question sur une demande hors des délais normaux. Envoyer une seconde demande ne fait pas avancer la première.' },
    ],
    body: (h) => `
<h2>Les principaux pays de dépôt</h2>
<p>Le tableau reprend les pays qui déposent le plus de demandes au Canada, avec le chiffre publié par IRCC le ${h.day(D)}, le relevé précédent et la plus ancienne copie de notre archive. Les chiffres anciens viennent des copies publiques du fichier d’IRCC conservées par l’Internet Archive ; chacune est listée avec sa date sur la ${h.a('history', 'page de l’historique')}, et aucun point n’est inventé là où il n’existe pas de copie.</p>
${h.table(['Pays', 'Délai publié', 'Relevé précédent', 'Plus ancienne copie'], major(h), `Visa de visiteur demandé hors du Canada, chiffre d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>L’écart est grand. Le Cameroun est passé de ${h.d(K.fullTrend(ser('CM'))!.first!)} dans la copie du ${h.day(K.fullTrend(ser('CM'))!.firstDate!)} à ${h.d(K.fullTrend(ser('CM'))!.last)} aujourd’hui. Le Maroc a suivi le même chemin, de ${h.d(K.fullTrend(ser('MA'))!.first!)} à ${h.d(K.fullTrend(ser('MA'))!.last)}. Un chiffre qui bouge d’une semaine d’un relevé à l’autre est courant : la tendance sur plusieurs relevés en dit plus qu’un chiffre isolé.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'visitor', c: 'CM', m: 'none' }, t: 'Votre visa de visiteur : date de décision estimée' })}
<h2>Ce que mesure le délai publié</h2>
<p>IRCC parle de délai de traitement passé. Chaque semaine, il regarde les demandes terminées récemment et publie le temps dans lequel 80 % d’entre elles ont reçu une décision. Le compteur démarre à la réception d’une demande complète, soit la date d’envoi pour une demande en ligne, et s’arrête à la décision. Le temps de prendre rendez-vous et de donner ses empreintes n’est pas compris : si la biométrie a été faite trois semaines après la demande, la décision peut arriver plus tard que la date d’envoi plus le délai publié.</p>
<p>Comme il regarde en arrière, ce chiffre réagit avec retard. Quand les demandes s’accumulent après une période de vacances, le délai publié ne monte qu’une fois ces dossiers tranchés. La tendance de l’outil aide à lire ce retard : un délai qui a monté à chacun des derniers relevés a plus de chances de continuer un moment qu’un délai stable depuis des mois.</p>
<h2>Quel pays compte</h2>
<p>Le pays de la liste d’IRCC est celui depuis lequel vous déposez, en général votre pays de résidence, et non celui de votre passeport. Un citoyen camerounais qui réside légalement en France et dépose depuis la France relève du chiffre de la France. Si vous choisissez le mauvais pays dans l’outil, la date obtenue sera fausse d’autant que l’écart entre les deux lignes.</p>
<h2>Lire votre propre estimation</h2>
<p>Indiquez le mois et le jour où IRCC a reçu votre demande. Le résultat ajoute le délai publié à cette date. Si la date est déjà passée, l’outil dit de combien de jours vous dépassez le délai. Cela ne veut pas dire qu’il y a un problème : par définition, une demande sur cinq prend plus longtemps. C’est le moment où une relance par le formulaire Web d’IRCC devient raisonnable, et où s’appliquent les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')}.</p>
<p>Deux situations changent la lecture. Si IRCC a demandé des documents ou un examen médical, le dossier attend votre réponse et le délai publié ne couvre pas cette pause. Pour une demande papier, le compteur part du jour où le courrier est enregistré, pas du jour de l’envoi.</p>
<h2>Les autres documents de visite</h2>
<p>Les parents et grands-parents qui veulent rester jusqu’à cinq ans d’affilée demandent le ${h.a('super-visa', 'super visa')}, qui a son propre délai par pays, souvent plus long. Les visiteurs déjà au Canada qui veulent rester plus longtemps demandent une ${h.a('visitor-record', 'fiche du visiteur')}, dont le délai a beaucoup augmenté depuis 2024. Les voyageurs dispensés de visa n’ont besoin que d’une ${h.a('eta', 'AVE')}, accordée le plus souvent en quelques minutes.</p>
`,
  },
});
