import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* AVE / eTA : ligne « eta » du fichier sans pays (délai publié en minutes), relevée chaque semaine. */
const S = 'n:eta';
const r = K.readingOf('eta');
const tr = K.fullTrend(S)!;
const pts = K.points(S);
const allSame = pts.every((p) => p.v === pts[0].v);
const vis = K.rangeOf('visitor')!;
const inside = K.readingOf('visitor-inside');
const D = r.date;
const E = K.en, F = K.fr;
const vt = (c: string) => K.readingOf('visitor', c).t;
const visDays = K.countriesOf('visitor').map((c) => K.daysOf(vt(c))).filter((x): x is number => x != null).sort((a, b) => a - b);
const visMedian = visDays[Math.floor(visDays.length / 2)];

function docRows(h: Helpers, l: 'en' | 'fr') {
  const T = (fr: string, en: string) => (l === 'fr' ? fr : en);
  return [
    [T('Dispensé de visa, arrive en avion', 'Visa-exempt, arriving by air'), T('AVE', 'eTA'), h.t(r.t)],
    [T('Dispensé de visa, arrive par la route, le train ou la mer', 'Visa-exempt, arriving by land or sea'), T('Aucune AVE exigée', 'No eTA needed'), T('sans objet', 'not applicable')],
    [T('Soumis au visa, demande hors du Canada', 'Visa required, applying from outside Canada'), T('Visa de visiteur', 'Visitor visa'), `${h.t(vis.lo[1])} ${T('à', 'to')} ${h.t(vis.hi[1])}`],
    [T('Soumis au visa, demande depuis le Canada', 'Visa required, applying from inside Canada'), T('Visa de visiteur', 'Visitor visa'), h.t(inside.t)],
  ];
}

export default defineGuide({
  id: 'eta', group: 'visit', order: 13,
  tool: 'delai', toolArg: { g: 'eta', only: 'eta,visitor,visitor-inside' },
  related: ['visitor-visa', 'visitor-record', 'super-visa', 'study-permit', 'beyond-processing-time'],
  sources: ['eta', 'ptimes-noncountry', 'visit', 'ptimes'],
  en: {
    slug: 'eta-processing-time',
    nav: 'eTA', card: 'Electronic Travel Authorization: minutes, and when it takes longer',
    title: 'eTA Processing Time for Air Travel to Canada, 2026',
    description: 'eTA processing time in 2026: what IRCC publishes for the Electronic Travel Authorization, why some requests take days, and how it compares with a visitor visa.',
    h1: 'eTA processing time: the Electronic Travel Authorization',
    intro: `IRCC's figure of ${E.day(D)} for an eTA is ${K.fmtTime(r.t, 'en')}, the shortest time in its whole file.`,
    resume: `An Electronic Travel Authorization (eTA) is usually decided within minutes: the figure IRCC published on ${E.day(D)} is ${K.fmtTime(r.t, 'en')}. That line has barely moved in our archive. Across the ${E.n(tr.n)} weekly readings we hold since ${E.day(tr.firstDate!)}, ${allSame ? 'every one gave a time counted in minutes, with no reading in days or weeks' : `the value ranged from ${E.d(tr.min, 'min')} to ${E.d(tr.max, 'min')}`}. The eTA is for travellers from visa-exempt countries who fly to Canada or transit through a Canadian airport; travellers from countries that need a visa apply for a visitor visa instead, where IRCC's figures currently run from ${K.fmtTime(vis.lo[1], 'en')} to ${K.fmtTime(vis.hi[1], 'en')} depending on the country, with a middle value of ${E.n(visMedian)} days. The published minutes describe the usual case. IRCC states that some requests take several days, when it sends an email asking for more documents, and the published figure does not cover that wait. Apply before you book a flight, and check the passport number carefully: an eTA is linked to one passport.`,
    faqs: [
      { q: 'How long does an eTA take to be approved in 2026?', a: `IRCC's figure of ${E.day(D)} is ${K.fmtTime(r.t, 'en')}. Most requests are approved by email shortly after payment. Some are held for review, and IRCC then writes within 72 hours to ask for more information; those files can take several days, sometimes longer, and the published time does not reflect them.` },
      { q: 'My eTA has not arrived after a few days. Is that normal?', a: 'It happens. Check your email, including the spam folder, for a message from IRCC asking for documents or a medical exam. If nothing arrived, IRCC’s eTA page lets you check the status with your application number and passport details. Applying a second time with the same passport does not speed up the first request.' },
      { q: 'Does the eTA processing time change from one country to another?', a: 'No. IRCC publishes a single eTA figure for all nationalities, in its file of processing times without a country breakdown. The visitor visa is different: it is published country by country, because each visa office handles its own region and the times differ widely.' },
      { q: 'How long is an approved eTA valid?', a: 'An eTA is valid for up to five years, or until the passport it is linked to expires, whichever comes first. It allows several trips, each for a stay usually up to six months as decided by the border officer. A new passport needs a new eTA before the next flight.' },
    ],
    body: (h) => `
<h2>A line measured in minutes</h2>
<p>Most of IRCC's processing times are counted in days, weeks or months. The eTA is the exception: the figure is published in minutes, and the ${h.src('eta', 'eTA page of IRCC')} describes it as an online request that is usually approved within minutes. Our archive holds ${h.n(tr.n)} weekly readings of the eTA line since ${h.day(tr.firstDate!)}, and ${allSame ? 'none of them was expressed in days or weeks' : `they ranged from ${h.d(tr.min, 'min')} to ${h.d(tr.max, 'min')}`}. In the same period, the visitor record line went from about three months to more than a year. The eTA is one of the few lines where the published figure and the experience of most travellers match.</p>
${h.hist(S, { max: 6, unit: 'min' })}
<p>The table shows only the latest readings and the oldest one; all the others are on the ${h.a('history', 'history page')}. A row would read in days if IRCC ever published a slower figure, and nothing is added where no copy exists.</p>
<h2>eTA, visa or nothing: which line applies</h2>
<p>The time that matters depends on the document you need, which depends on your passport and on how you travel. A visa-exempt traveller flying in needs an eTA; the same traveller crossing the land border by car does not. A traveller from a country that needs a visa applies for a visitor visa, published country by country.</p>
${h.table(['Traveller', 'Document', 'Published time'], docRows(h, 'en'), `IRCC figures of ${h.day(D)}.`, ['l', 'l', 'r'])}
<p>Since 2023, IRCC also lets citizens of a list of countries that normally need a visa fly to Canada with an eTA, if they meet conditions such as holding a Canadian visa in the last ten years or a valid United States non-immigrant visa. The list and the conditions are on the eTA page of IRCC; check them before choosing between the two routes, because the difference in time is large.</p>
${h.mini('delai', { p: ['g', 'c'], d: { g: 'visitor', c: 'BR' }, t: 'Need a visa instead? Compare the visitor visa time' })}
<h2>When an eTA takes longer than minutes</h2>
<p>A request that is not approved at once is not refused. IRCC may send an email within 72 hours asking for more documents, for example a scan of the passport or an explanation of past refusals, or asking the traveller to have a medical exam. From that point, the request waits for your answer and then for an officer's review. These cases fall outside the published figure, which is why some travellers see days instead of minutes.</p>
<p>Three things cause most avoidable delays. The first is a typo in the passport number: the eTA is attached to the exact number entered, and an approval on the wrong number will not let you board. The second is a request made through an unofficial website that charges a service fee on top of the government fee and adds a step between you and IRCC; the official form is on canada.ca. The third is applying at the airport: approval is quick in most cases, but not in all, so the request should be sent before the flight is booked.</p>
<h2>What the eTA does not cover</h2>
<p>An eTA lets you board a flight to Canada. It does not give a right to enter: the border officer decides on arrival and sets the length of stay. To stay longer than allowed, a visitor in Canada applies for a ${h.a('visitor-record', 'visitor record')}, a line that currently takes ${h.t(K.readingOf('visitor-record').t)}. To study or work, the matching permit is needed; an eTA is issued automatically with a first ${h.a('study-permit', 'study permit')} or work permit for visa-exempt nationals.</p>
<p>Parents and grandparents from visa-required countries who want long stays use the ${h.a('super-visa', 'super visa')}. Travellers from visa-required countries who are not eligible for the eTA route find their country's figure on the ${h.a('visitor-visa', 'visitor visa page')}.</p>
`,
  },
  fr: {
    slug: 'delai-ave',
    nav: 'AVE', card: 'Autorisation de voyage électronique : minutes, et quand c’est plus long',
    title: 'Délai de l’AVE pour un vol vers le Canada, relevé 2026',
    description: 'Délai de l’AVE en 2026 : ce qu’IRCC publie pour l’autorisation de voyage électronique, pourquoi certaines demandes prennent des jours, et l’écart avec un visa.',
    h1: 'Délai de l’AVE : l’autorisation de voyage électronique',
    intro: `Le chiffre d’IRCC du ${F.day(D)} pour une AVE est de ${K.fmtTime(r.t, 'fr')}, le délai le plus court de tout son fichier.`,
    resume: `Une autorisation de voyage électronique (AVE) est en général accordée en quelques minutes : le chiffre publié par IRCC le ${F.day(D)} est de ${K.fmtTime(r.t, 'fr')}. Cette ligne n’a pratiquement pas bougé dans notre archive. Sur les ${F.n(tr.n)} relevés hebdomadaires que nous avons depuis le ${F.day(tr.firstDate!)}, ${allSame ? 'tous donnaient un délai en minutes, aucun en jours ni en semaines' : `la valeur est allée de ${F.d(tr.min, 'min')} à ${F.d(tr.max, 'min')}`}. L’AVE concerne les voyageurs des pays dispensés de visa qui arrivent au Canada en avion ou y transitent par un aéroport ; les ressortissants de pays soumis au visa demandent un visa de visiteur, dont le délai va aujourd’hui de ${K.fmtTime(vis.lo[1], 'fr')} à ${K.fmtTime(vis.hi[1], 'fr')} selon le pays, avec une valeur médiane de ${F.n(visMedian)} jours. Les minutes publiées décrivent le cas courant. IRCC indique que certaines demandes prennent plusieurs jours, lorsqu’un courriel demande des documents, et le chiffre publié ne couvre pas cette attente. Faites la demande avant d’acheter le billet et vérifiez le numéro de passeport : l’AVE est liée à un seul passeport.`,
    faqs: [
      { q: 'Combien de temps faut-il pour obtenir une AVE en 2026 ?', a: `Le chiffre d’IRCC du ${F.day(D)} est de ${K.fmtTime(r.t, 'fr')}. La plupart des demandes sont approuvées par courriel peu après le paiement. Certaines sont mises en examen : IRCC écrit alors dans les 72 heures pour demander des renseignements, et ces dossiers peuvent prendre plusieurs jours, que le délai publié ne reflète pas.` },
      { q: 'Mon AVE n’est pas arrivée après quelques jours : est-ce normal ?', a: 'Cela arrive. Vérifiez vos courriels, y compris les indésirables, à la recherche d’un message d’IRCC qui demande des documents ou un examen médical. Si rien n’est arrivé, la page de l’AVE d’IRCC permet de vérifier l’état de la demande avec son numéro et les données du passeport. Une seconde demande avec le même passeport n’accélère pas la première.' },
      { q: 'Le délai de l’AVE dépend-il du pays de citoyenneté ?', a: 'Non. IRCC publie un délai unique pour l’AVE, toutes nationalités confondues, dans son fichier sans détail par pays. Le visa de visiteur est différent : il est publié pays par pays, parce que chaque bureau des visas traite sa propre région et que les délais varient beaucoup.' },
      { q: 'Combien de temps une AVE approuvée reste-t-elle valide ?', a: 'Une AVE vaut jusqu’à cinq ans, ou jusqu’à l’expiration du passeport auquel elle est liée si celle-ci arrive avant. Elle permet plusieurs voyages, chacun pour un séjour fixé par l’agent à la frontière, souvent jusqu’à six mois. Un nouveau passeport exige une nouvelle AVE avant le prochain vol.' },
    ],
    body: (h) => `
<h2>Un délai compté en minutes</h2>
<p>La plupart des délais d’IRCC se comptent en jours, en semaines ou en mois. L’AVE fait exception : le chiffre est publié en minutes, et la ${h.src('eta', 'page de l’AVE d’IRCC')} la décrit comme une demande en ligne approuvée le plus souvent en quelques minutes. Notre archive compte ${h.n(tr.n)} relevés hebdomadaires de cette ligne depuis le ${h.day(tr.firstDate!)}, et ${allSame ? 'aucun n’était exprimé en jours ou en semaines' : `ils allaient de ${h.d(tr.min, 'min')} à ${h.d(tr.max, 'min')}`}. Pendant la même période, la ligne de la fiche du visiteur est passée d’environ trois mois à plus d’un an. L’AVE est l’une des rares lignes où le chiffre publié correspond à ce que vit la majorité des voyageurs.</p>
${h.hist(S, { max: 6, unit: 'min' })}
<p>Le tableau ne montre que les derniers relevés et le plus ancien ; tous les autres sont sur la ${h.a('history', 'page de l’historique')}. Une ligne s’afficherait en jours si IRCC publiait un jour un chiffre plus lent, et rien n’est ajouté là où aucune copie n’existe.</p>
<h2>AVE, visa ou rien : quelle ligne s’applique</h2>
<p>Le délai qui compte dépend du document exigé, donc du passeport et du moyen de transport. Un voyageur dispensé de visa qui arrive en avion a besoin d’une AVE ; le même voyageur qui passe la frontière terrestre en voiture n’en a pas besoin. Un voyageur d’un pays soumis au visa demande un visa de visiteur, dont le délai est publié pays par pays.</p>
${h.table(['Voyageur', 'Document', 'Délai publié'], docRows(h, 'fr'), `Chiffres d’IRCC du ${h.day(D)}.`, ['l', 'l', 'r'])}
<p>Depuis 2023, IRCC permet aussi aux citoyens d’une liste de pays normalement soumis au visa de prendre l’avion pour le Canada avec une AVE, à certaines conditions, par exemple avoir eu un visa canadien dans les dix dernières années ou détenir un visa de non-immigrant américain valide. La liste et les conditions figurent sur la page de l’AVE d’IRCC ; vérifiez-les avant de choisir entre les deux voies, car l’écart de délai est grand.</p>
${h.mini('delai', { p: ['g', 'c'], d: { g: 'visitor', c: 'MA' }, t: 'Besoin d’un visa ? Comparez le délai du visa de visiteur' })}
<h2>Quand une AVE prend plus que quelques minutes</h2>
<p>Une demande qui n’est pas approuvée tout de suite n’est pas refusée pour autant. IRCC peut envoyer dans les 72 heures un courriel qui demande d’autres documents, par exemple une copie du passeport ou des explications sur un refus passé, ou qui demande un examen médical. À partir de là, la demande attend votre réponse, puis l’examen d’un agent. Ces cas sortent du chiffre publié, d’où les quelques jours que constatent certains voyageurs.</p>
<p>Trois erreurs expliquent la plupart des retards évitables. La première est une faute dans le numéro de passeport : l’AVE est rattachée au numéro saisi, et une approbation sur un mauvais numéro ne permet pas d’embarquer. La deuxième est une demande passée par un site non officiel, qui ajoute des frais de service aux frais du gouvernement et un intermédiaire entre vous et IRCC ; le formulaire officiel se trouve sur canada.ca. La troisième est d’attendre l’aéroport : l’approbation est rapide dans la plupart des cas, pas dans tous, et la demande devrait partir avant l’achat du billet.</p>
<h2>Ce que l’AVE ne couvre pas</h2>
<p>L’AVE permet d’embarquer sur un vol vers le Canada. Elle ne donne pas le droit d’entrer : l’agent des services frontaliers décide à l’arrivée et fixe la durée du séjour. Pour rester plus longtemps que prévu, le visiteur déjà au Canada demande une ${h.a('visitor-record', 'fiche du visiteur')}, une ligne qui prend en ce moment ${h.t(K.readingOf('visitor-record').t)}. Pour étudier ou travailler, il faut le permis correspondant ; une AVE est délivrée automatiquement avec un premier ${h.a('study-permit', 'permis d’études')} ou permis de travail aux ressortissants dispensés de visa.</p>
<p>Les parents et grands-parents de pays soumis au visa qui veulent de longs séjours passent par le ${h.a('super-visa', 'super visa')}. Les voyageurs de pays soumis au visa qui ne remplissent pas les conditions de l’AVE trouvent le chiffre de leur pays sur la ${h.a('visitor-visa', 'page du visa de visiteur')}.</p>
`,
  },
});
