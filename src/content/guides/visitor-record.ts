import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Fiche du visiteur : ligne « visitor_extension » du fichier sans pays, relevée chaque semaine depuis 2024. */
const S = 'n:visitor_extension';
const r = K.readingOf('visitor-record');
const tr = K.fullTrend(S)!;
const pts = K.points(S);
const D = r.date;
const E = K.en, F = K.fr;
const yearAgo = K.valueNear(S, `${Number(D.slice(0, 4)) - 1}${D.slice(4)}`);
const crossed = (lim: number) => pts.find((p) => p.v >= lim);
const c200 = crossed(200), c300 = crossed(300), c400 = crossed(400);
/* Plus bas d'avant le sommet, depuis le début de l'année du sommet. */
const peakYear = tr.maxDate.slice(0, 4);
const beforePeak = pts.filter((p) => p.date >= `${peakYear}-01-01` && p.date <= tr.maxDate);
const lowBefore = beforePeak.reduce((a, b) => (b.v < a.v ? b : a), beforePeak[0]);
const afterPeak = pts.filter((p) => p.date >= tr.maxDate);
const inside = K.readingOf('visitor-inside');
const est = K.estimate('visitor-record', 'IN', null);
const sx = K.readingOf('study-ext'), wx = K.readingOf('work-ext'), sxa = K.altOf('study-ext')!, wxa = K.altOf('work-ext')!;
/* Moyenne de chaque année civile, à partir des seuls relevés de l'année. */
const years = [...new Set(pts.map((p) => p.date.slice(0, 4)))];
const yearRow = (y: string) => { const v = pts.filter((p) => p.date.startsWith(y)); const vals = v.map((p) => p.v); return { y, n: v.length, lo: Math.min(...vals), hi: Math.max(...vals), from: v[0].date, to: v[v.length - 1].date }; };
const yr = years.map(yearRow);

export default defineGuide({
  id: 'visitor-record', group: 'visit', order: 12,
  tool: 'delai', toolArg: { g: 'visitor-record', only: 'visitor-record,visitor-inside,study-ext,work-ext' },
  related: ['visitor-visa', 'super-visa', 'study-permit-extension', 'work-permit-extension', 'beyond-processing-time', 'history'],
  sources: ['extend-stay', 'ptimes-noncountry', 'ptimes', 'account', 'wayback'],
  en: {
    slug: 'visitor-record-processing-time',
    nav: 'Visitor record', card: 'Extending a visit: time, peak and weekly history',
    title: 'Visitor Record Processing Time and Weekly History 2026',
    description: 'Visitor record (extend your stay) processing time in 2026: the figure IRCC publishes each week, its peak, the weekly history since 2024 and your decision date.',
    h1: 'Visitor record processing time: extending a stay in Canada',
    intro: `IRCC's figure of ${E.day(D)} for a visitor record is ${K.fmtTime(r.t, 'en')}, against ${E.d(tr.first!)} in our first weekly copy.`,
    resume: `A request to extend a stay as a visitor in Canada, which ends with a visitor record, currently takes ${K.fmtTime(r.t, 'en')} according to the figure IRCC published on ${E.day(D)}. The previous weekly reading was ${E.d(tr.prev!)} on ${E.day(tr.prevDate!)}. This is one of the lines that has moved most since 2024: it was ${E.d(tr.first!)} in our first copy dated ${E.day(tr.firstDate!)}, passed 200 days on ${E.day(c200!.date)}, 300 days on ${E.day(c300!.date)} and peaked at ${E.d(tr.max)} on ${E.day(tr.maxDate)}.${yearAgo ? ` A year before the latest figure, on ${E.day(yearAgo.date)}, it stood at ${E.d(yearAgo.v)}.` : ''} The figure is the same for every nationality, because IRCC publishes it without a country breakdown. It counts the time within which 80% of recent requests were decided, from the day IRCC received a complete request. An application sent online today would, if the time held, get a decision around ${est.date ? E.day(est.date) : 'a date we cannot compute'}. While the request is pending, a visitor who applied before the end of the authorized stay can generally remain in Canada under the same conditions until IRCC decides.`,
    faqs: [
      { q: 'How long does a visitor record take to process in 2026?', a: `IRCC's figure of ${E.day(D)} is ${K.fmtTime(r.t, 'en')}. It is a single number for all applicants, with no breakdown by country, and it changes almost every week. Our archive holds ${E.n(tr.n)} weekly readings, from ${E.d(tr.min)} at the lowest to ${E.d(tr.max)} at the highest.` },
      { q: 'Can I stay in Canada while my visitor record request is pending?', a: 'If the request reached IRCC before the end of your authorized stay, you can generally stay in Canada under the same conditions until a decision is made. This is what IRCC calls maintained status. If the request is refused, you have to leave or restore your status within the period IRCC sets.' },
      { q: `Why did the visitor record time jump in ${E.my(tr.maxDate)}?`, a: `IRCC does not explain weekly moves. The readings show the figure went from ${E.d(lowBefore.v)} on ${E.day(lowBefore.date)} to ${E.d(tr.max)} on ${E.day(tr.maxDate)}. Because the published time looks back at recent decisions, a jump of this size usually reflects a batch of old requests being decided in a short period.` },
      { q: 'Is a visitor record the same as a new visa?', a: 'No. A visitor record is a document that sets a new end date for your stay. It is not a travel document: if you leave Canada, you need a valid visa or eTA to come back. Someone who wants to travel and return during the stay may need a new visitor visa as well.' },
    ],
    body: (h) => `
<h2>From ${h.d(tr.first!)} to ${h.d(tr.max)}: what the weekly readings show</h2>
<p>IRCC publishes the visitor record time in its file of processing times without a country breakdown, and updates it most weeks. We hold ${h.n(tr.n)} dated readings of that line, the first on ${h.day(tr.firstDate!)}. The table summarises each calendar year from those readings only; a year with fewer readings is not completed with estimates.</p>
${h.table(['Year', 'Readings kept', 'Lowest', 'Highest', 'First and last reading'], yr.map((x) => [x.y, h.n(x.n), h.d(x.lo), h.d(x.hi), `${h.day(x.from)} to ${h.day(x.to)}`]), 'Visitor record (extension of a visit), IRCC non-country file.', ['l', 'r', 'r', 'r', 'l'])}
<p>The line rose in steps rather than steadily. It stayed between ${h.d(yr[0].lo)} and ${h.d(yr[0].hi)} in ${yr[0].y}, crossed 200 days on ${h.day(c200!.date)}, then 300 days on ${h.day(c300!.date)}${c400 ? `, and passed 400 days on ${h.day(c400.date)}` : ''}. Since the peak of ${h.day(tr.maxDate)} it has fallen at ${h.n(afterPeak.filter((p, i) => i > 0 && p.v < afterPeak[i - 1].v).length)} of the ${h.n(afterPeak.length - 1)} readings that followed, to ${h.d(tr.last)} now. A decline after a peak is normal for a past processing time: once the oldest requests are decided, they stop pulling the 80th percentile up.</p>
<h2>The latest readings</h2>
${h.hist(S, { max: 12 })}
<p>Each line cites the copy it comes from. Older readings come from captures of IRCC's file kept by the Internet Archive; the most recent one was read directly on canada.ca. The full list is on the ${h.a('history', 'history page')}.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'visitor-record', m: 'none' }, t: 'Your visitor record request: estimated decision date' })}
<h2>Who applies for a visitor record</h2>
<p>Anyone in Canada as a visitor who wants to stay beyond the date stamped in the passport or set at the port of entry asks for a visitor record. That includes parents on a super visa who want to stay longer, travellers whose plans changed, and people whose study or work permit is ending and who want time to leave or to wait for another application. IRCC's ${h.src('extend-stay', 'page on extending a stay')} asks visitors to apply at least 30 days before their status ends.</p>
<p>The request is made online from an IRCC account. Since the line has no country breakdown, a Mexican visitor and an Indian visitor face the same published time. What changes from one file to another is the content: proof of funds for the extra months, the reason for staying, and the travel history.</p>
<h2>Three extension lines side by side</h2>
<p>Visitors, students and workers who extend their stay all apply from inside Canada, yet IRCC reports very different times for them. On ${h.day(D)}, the past time for a study permit extension was ${h.t(sxa.t)} and for a work permit extension ${h.t(wxa.t)}, against ${h.t(r.t)} for a visitor record. For the two permits, IRCC also publishes a forward-looking estimate by week of filing (${h.t(sx.t)} and ${h.t(wx.t)} on ${h.day(sx.date)}); nothing of the kind exists for visitors. The visitor line is the one to watch most closely if you plan your stay around it, because it has moved by months, not weeks, within a single year.</p>
<h2>Living with a long wait</h2>
<p>With a published time of ${h.t(r.t)}, many requests are still open when the period asked for has already passed. Staying under maintained status is lawful as long as the request reached IRCC on time, but it has practical limits. Leaving Canada ends maintained status, and coming back requires a valid visa or eTA and a new decision by the border officer. A visitor in this situation cannot start working or studying without the right permit.</p>
<p>The figure is not a deadline for IRCC. If your request was received more than ${h.t(r.t)} ago, the steps on the ${h.a('beyond-processing-time', 'page on applications past the processing time')} apply. A visitor visa requested from inside Canada is a different, much shorter line: ${h.t(inside.t)} on ${h.day(inside.date)}. Students and workers who want to stay longer use the ${h.a('study-permit-extension', 'study permit extension')} or the ${h.a('work-permit-extension', 'work permit extension')} lines instead.</p>
`,
  },
  fr: {
    slug: 'delai-fiche-du-visiteur',
    nav: 'Fiche du visiteur', card: 'Prolonger un séjour : délai, sommet et historique',
    title: 'Délai de la fiche du visiteur et son historique, 2026',
    description: 'Délai de la fiche du visiteur (prolonger un séjour) en 2026 : chiffre publié chaque semaine par IRCC, sommet, historique depuis 2024 et date de décision.',
    h1: 'Délai de la fiche du visiteur : prolonger un séjour au Canada',
    intro: `Le chiffre d’IRCC du ${F.day(D)} pour une fiche du visiteur est de ${K.fmtTime(r.t, 'fr')}, contre ${F.d(tr.first!)} dans notre première copie hebdomadaire.`,
    resume: `Une demande de prolongation de séjour comme visiteur au Canada, qui aboutit à une fiche du visiteur, prend en ce moment ${K.fmtTime(r.t, 'fr')} selon le chiffre publié par IRCC le ${F.day(D)}. Le relevé précédent, le ${F.day(tr.prevDate!)}, indiquait ${F.d(tr.prev!)}. C’est l’une des lignes qui ont le plus bougé depuis 2024 : ${F.d(tr.first!)} dans notre première copie datée du ${F.day(tr.firstDate!)}, plus de 200 jours à partir du ${F.day(c200!.date)}, plus de 300 jours à partir du ${F.day(c300!.date)}, puis un sommet de ${F.d(tr.max)} le ${F.day(tr.maxDate)}.${yearAgo ? ` Un an avant le dernier chiffre, le ${F.day(yearAgo.date)}, il était de ${F.d(yearAgo.v)}.` : ''} Ce délai est le même pour toutes les nationalités, car IRCC le publie sans détail par pays. Il donne le temps dans lequel 80 % des demandes récentes ont été tranchées, à partir de la réception d’une demande complète. Une demande envoyée en ligne aujourd’hui aurait sa décision vers le ${est.date ? F.day(est.date) : 'jour que nous ne pouvons pas calculer'} si le délai se maintenait. Pendant l’attente, le visiteur qui a déposé avant la fin de son séjour autorisé peut en général rester au Canada aux mêmes conditions jusqu’à la décision.`,
    faqs: [
      { q: 'Combien de temps prend une fiche du visiteur en 2026 ?', a: `Le chiffre d’IRCC du ${F.day(D)} est de ${K.fmtTime(r.t, 'fr')}. C’est un délai unique pour tous les demandeurs, sans détail par pays, qui change presque chaque semaine. Notre archive compte ${F.n(tr.n)} relevés hebdomadaires de cette ligne, de ${F.d(tr.min)} au plus bas à ${F.d(tr.max)} au plus haut.` },
      { q: 'Puis-je rester au Canada pendant l’examen de ma demande de fiche du visiteur ?', a: 'Si la demande est arrivée chez IRCC avant la fin de votre séjour autorisé, vous pouvez en général rester au Canada aux mêmes conditions jusqu’à la décision. IRCC parle de statut maintenu. En cas de refus, il faut quitter le pays ou demander le rétablissement du statut dans le délai fixé par IRCC.' },
      { q: `Pourquoi le délai de la fiche du visiteur a-t-il bondi en ${F.my(tr.maxDate)} ?`, a: `IRCC n’explique pas les variations d’une semaine à l’autre. Les relevés montrent un passage de ${F.d(lowBefore.v)} le ${F.day(lowBefore.date)} à ${F.d(tr.max)} le ${F.day(tr.maxDate)}. Comme le délai publié regarde les décisions récentes, un saut de cette taille traduit en général le traitement rapproché d’un lot de vieilles demandes.` },
      { q: 'La fiche du visiteur remplace-t-elle un visa pour revenir au Canada ?', a: 'Non. La fiche du visiteur fixe une nouvelle date de fin de séjour, mais ce n’est pas un titre de voyage. Pour revenir après une sortie du Canada, il faut un visa ou une AVE valide. Une personne qui veut voyager pendant son séjour prolongé peut donc avoir besoin d’un nouveau visa de visiteur.' },
    ],
    body: (h) => `
<h2>De ${h.d(tr.first!)} à ${h.d(tr.max)} : ce que disent les relevés</h2>
<p>IRCC publie le délai de la fiche du visiteur dans son fichier de délais sans pays et le met à jour presque chaque semaine. Nous avons ${h.n(tr.n)} relevés datés de cette ligne, le premier du ${h.day(tr.firstDate!)}. Le tableau résume chaque année civile à partir de ces seuls relevés ; une année incomplète n’est pas complétée par des estimations.</p>
${h.table(['Année', 'Relevés gardés', 'Plus bas', 'Plus haut', 'Premier et dernier relevé'], yr.map((x) => [x.y, h.n(x.n), h.d(x.lo), h.d(x.hi), `du ${h.day(x.from)} au ${h.day(x.to)}`]), 'Fiche du visiteur (prolongation de séjour), fichier sans pays d’IRCC.', ['l', 'r', 'r', 'r', 'l'])}
<p>La hausse s’est faite par paliers. La ligne est restée entre ${h.d(yr[0].lo)} et ${h.d(yr[0].hi)} en ${yr[0].y}, a franchi 200 jours le ${h.day(c200!.date)}, puis 300 jours le ${h.day(c300!.date)}${c400 ? `, et 400 jours le ${h.day(c400.date)}` : ''}. Depuis le sommet du ${h.day(tr.maxDate)}, elle a baissé à ${h.n(afterPeak.filter((p, i) => i > 0 && p.v < afterPeak[i - 1].v).length)} des ${h.n(afterPeak.length - 1)} relevés suivants, jusqu’à ${h.d(tr.last)} aujourd’hui. Pour un délai passé, une descente après un sommet est attendue : une fois les plus vieilles demandes tranchées, elles cessent de tirer le seuil des 80 % vers le haut.</p>
<h2>Les derniers relevés</h2>
${h.hist(S, { max: 12 })}
<p>Chaque ligne cite sa copie. Les relevés anciens viennent de captures du fichier d’IRCC conservées par l’Internet Archive ; le plus récent a été lu directement sur canada.ca. La liste complète est sur la ${h.a('history', 'page de l’historique')}.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'visitor-record', m: 'none' }, t: 'Votre fiche du visiteur : date de décision estimée' })}
<h2>Qui demande une fiche du visiteur</h2>
<p>Toute personne au Canada comme visiteur qui veut rester après la date inscrite dans son passeport ou fixée à l’entrée demande une fiche du visiteur. Cela comprend les parents venus avec un super visa qui souhaitent rester plus longtemps, les voyageurs dont les plans ont changé et les personnes dont le permis d’études ou de travail arrive à échéance et qui veulent du temps pour partir ou attendre une autre demande. La ${h.src('extend-stay', 'page d’IRCC sur la prolongation du séjour')} demande de déposer au moins 30 jours avant la fin du statut.</p>
<p>La demande se fait en ligne depuis un compte IRCC. Comme la ligne n’a pas de détail par pays, un visiteur marocain et un visiteur français font face au même délai publié. Ce qui change d’un dossier à l’autre, c’est le contenu : preuve de fonds pour les mois supplémentaires, motif du séjour, voyages antérieurs.</p>
<h2>Trois lignes de prolongation côte à côte</h2>
<p>Visiteurs, étudiants et travailleurs qui prolongent leur séjour déposent tous depuis le Canada, mais IRCC publie pour eux des délais très différents. Le ${h.day(D)}, le délai passé d’une prolongation de permis d’études était de ${h.t(sxa.t)} et celui d’une prolongation de permis de travail de ${h.t(wxa.t)}, contre ${h.t(r.t)} pour une fiche du visiteur. Pour les deux permis, IRCC publie aussi une estimation prospective par semaine de dépôt (${h.t(sx.t)} et ${h.t(wx.t)} au ${h.day(sx.date)}) ; rien de tel n’existe pour les visiteurs. C’est donc la ligne des visiteurs qu’il faut suivre de plus près pour organiser un séjour : elle a varié de plusieurs mois, et non de quelques semaines, en une seule année.</p>
<h2>Vivre avec une longue attente</h2>
<p>Avec un délai publié de ${h.t(r.t)}, beaucoup de demandes sont encore ouvertes alors que la période demandée est déjà écoulée. Rester sous statut maintenu est légal si la demande est arrivée à temps, mais cela a des limites concrètes. Quitter le Canada met fin au statut maintenu, et le retour exige un visa ou une AVE valide et une nouvelle décision de l’agent à la frontière. Un visiteur dans cette situation ne peut pas commencer à travailler ou à étudier sans le permis qui convient.</p>
<p>Le chiffre n’est pas une échéance pour IRCC. Si votre demande a été reçue il y a plus de ${h.t(r.t)}, les démarches de la ${h.a('beyond-processing-time', 'page sur les demandes qui dépassent le délai')} s’appliquent. Le visa de visiteur demandé depuis le Canada est une autre ligne, beaucoup plus courte : ${h.t(inside.t)} au ${h.day(inside.date)}. Les étudiants et travailleurs qui veulent rester plus longtemps passent par la ${h.a('study-permit-extension', 'prolongation du permis d’études')} ou la ${h.a('work-permit-extension', 'prolongation du permis de travail')}.</p>
`,
  },
});
