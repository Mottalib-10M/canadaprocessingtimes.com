import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Carte RP : deux lignes du fichier hebdomadaire sans pays, suivies depuis fin 2023. */
const NEW = K.readingOf('pr-card-new'), REN = K.readingOf('pr-card-renew');
const nT = K.fullTrend('n:new_pr')!, rT = K.fullTrend('n:existing_pr')!;
const nP = K.points('n:new_pr'), rP = K.points('n:existing_pr');
const yearBack = `${Number(NEW.date.slice(0, 4)) - 1}${NEW.date.slice(4)}`;
const nY = K.valueNear('n:new_pr', yearBack), rY = K.valueNear('n:existing_pr', yearBack);
const years = [...new Set(nP.map((p) => p.date.slice(0, 4)))];
const stat = (pts: typeof nP, y: string) => { const v = pts.filter((p) => p.date.startsWith(y)).map((p) => p.v); return v.length ? { lo: Math.min(...v), hi: Math.max(...v), avg: v.reduce((a, b) => a + b, 0) / v.length, n: v.length } : null; };
/* Relevés où le renouvellement était plus rapide que la première carte. */
const both = nP.map((p) => [p, rP.find((q) => q.date === p.date)] as const).filter((x) => x[1]);
const renewFaster = both.filter(([a, b]) => b!.v < a.v).length;
const E = K.en, F = K.fr;

function yearRows(h: Helpers) {
  return years.filter((y) => stat(nP, y)!.n >= 4).map((y) => {
    const a = stat(nP, y)!, b = stat(rP, y);
    return [y, h.n(a.n), `${h.d(a.lo)} · ${h.d(a.hi)}`, h.d(Math.round(a.avg)), b ? `${h.d(b.lo)} · ${h.d(b.hi)}` : '', b ? h.d(Math.round(b.avg)) : ''];
  });
}

export default defineGuide({
  id: 'pr-card', group: 'cit', order: 62,
  tool: 'delai', toolArg: { g: 'pr-card-new', m: 'none', only: 'pr-card-new,pr-card-renew' },
  related: ['citizenship', 'citizenship-calculator', 'express-entry', 'spousal-sponsorship', 'beyond-processing-time'],
  sources: ['ptimes-noncountry', 'pr-card', 'check-status', 'account'],
  en: {
    slug: 'pr-card-processing-time',
    nav: 'PR card', card: 'First card and renewal, weekly figures since 2023',
    title: 'PR Card Processing Time: New and Renewal Cards 2026',
    description: 'Permanent resident card processing time in 2026: the first card after landing and the renewal, IRCC’s weekly figure, a year ago and the range since late 2023.',
    h1: 'PR card processing time, first card and renewal',
    intro: `IRCC’s figure of ${E.day(NEW.date)}: ${K.fmtTime(NEW.t, 'en')} for a first permanent resident card, ${K.fmtTime(REN.t, 'en')} for a renewal or replacement.`,
    resume: `A first permanent resident card currently takes ${K.fmtTime(NEW.t, 'en')} and a renewal or replacement takes ${K.fmtTime(REN.t, 'en')}, according to the processing times IRCC published on ${E.day(NEW.date)}. Both are past times: the period within which IRCC finished 80% of recent applications, not a promise for yours. ${nY ? `A year earlier, in the reading of ${E.day(nY.date)}, the first card took ${E.d(nY.v)}` : 'The first card'}${rY ? ` and the renewal ${E.d(rY.v)}` : ''}. We hold ${E.n(nP.length)} weekly readings of these two lines since ${E.day(nT.firstDate!)}. Over that span the first card ranged from ${E.d(nT.min)} on ${E.day(nT.minDate)} to ${E.d(nT.max)} on ${E.day(nT.maxDate)}, and the renewal from ${E.d(rT.min)} on ${E.day(rT.minDate)} to ${E.d(rT.max)} on ${E.day(rT.maxDate)}. Moves of several weeks within a single month have happened on both lines. The tool above adds the published time to the day IRCC received your application.`,
    faqs: [
      { q: 'How long does a first PR card take to arrive after landing in 2026?', a: `IRCC’s figure of ${E.day(NEW.date)} for a first permanent resident card is ${K.fmtTime(NEW.t, 'en')}. In practice the card cannot be produced until IRCC has an acceptable photo and a Canadian mailing address, so a missing item adds to the wait. Mail delivery comes on top of the processing time.` },
      { q: 'When should I apply to renew my PR card?', a: `IRCC asks permanent residents to apply when the card expires within nine months, or once it has expired. With the renewal line at ${K.fmtTime(REN.t, 'en')} on ${E.day(REN.date)}, and a high of ${E.d(rT.max)} in our series, applying early leaves room for a slow week. An expired card does not end permanent resident status.` },
      { q: 'Can I travel while my PR card renewal is being processed?', a: 'You can leave Canada, but to board a flight back you need a valid PR card or a permanent resident travel document. If your card expires while you are abroad, you apply for the travel document from outside Canada, which is a separate application with its own time. Crossing the land border by private vehicle follows different rules.' },
      { q: 'Is the PR card renewal usually faster than the first card?', a: `Not always. In ${E.n(renewFaster)} of the ${E.n(both.length)} weekly readings where both lines were published, the renewal was the faster of the two. Today the first card is at ${K.fmtTime(NEW.t, 'en')} and the renewal at ${K.fmtTime(REN.t, 'en')}. The two lines move separately, so check the one that matches your application.` },
    ],
    body: (h) => `
<h2>Two lines, one card</h2>
<p>The first PR card is produced after you become a permanent resident, using the address and photo you gave. The renewal or replacement line covers everyone else: an expiring card, a lost or stolen card, or a change of name or sex designation. IRCC publishes both in its weekly file of times that are not split by country, so each figure applies wherever you live in Canada.</p>
${h.table(['Application', `Time on ${h.day(NEW.date)}`, 'A year earlier', 'First reading kept'], [
  [K.progName('pr-card-new', 'en'), h.t(NEW.t), nY ? `${h.d(nY.v)} (${h.day(nY.date)})` : '', `${h.d(nT.first!)} (${h.day(nT.firstDate!)})`],
  [K.progName('pr-card-renew', 'en'), h.t(REN.t), rY ? `${h.d(rY.v)} (${h.day(rY.date)})` : '', `${h.d(rT.first!)} (${h.day(rT.firstDate!)})`],
], 'Permanent resident card lines, IRCC weekly file.', ['l', 'r', 'r', 'r'])}
<h2>Year by year</h2>
<p>Because these two lines are published every week, our archive is dense: ${h.n(nP.length)} readings for the first card. The table groups them by calendar year, with the low, the high and the plain average of the readings in each year. The average is our own arithmetic on IRCC’s figures, not a number IRCC publishes.</p>
${h.table(['Year', 'Readings', 'First card, low · high', 'First card, average', 'Renewal, low · high', 'Renewal, average'], yearRows(h), 'Weekly readings grouped by year of the IRCC update date.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Two patterns stand out. The first card climbed to ${h.d(nT.max)} in the reading of ${h.day(nT.maxDate)}, then fell to ${h.d(nT.min)} by ${h.day(nT.minDate)}: a gap of ${h.d(nT.max - nT.min)} between the two readings. The renewal line had its own cycle, from its high of ${h.d(rT.max)} on ${h.day(rT.maxDate)} to a low of ${h.d(rT.min)} on ${h.day(rT.minDate)}. Neither line has a clear long trend; both move in waves.</p>
${h.mini('delai', { p: ['g', 'm', 'd'], d: { g: 'pr-card-renew', m: K.READ.slice(0, 7), d: 1 }, t: 'Your PR card: estimated date' })}
<h2>What the first card needs before it is made</h2>
<p>For a new permanent resident, the first card is not a separate application filed months later: it follows the confirmation of permanent residence. IRCC cannot produce the card without a usable photo and a Canadian mailing address, so a missing item adds to the published time, one likely reason why two people who landed the same day can get their cards weeks apart. Someone who confirmed permanent residence while abroad and gave no Canadian address yet should expect the card only after that address reaches IRCC. A card produced on schedule still travels by post, and that delay is not part of the figure.</p>
<h2>The latest weeks</h2>
${h.hist('n:new_pr', { max: 10, caption: 'First PR card: latest IRCC weekly figures, with the oldest reading kept at the bottom.' })}
<p>Weekly changes of a few days are frequent, and the figure can turn around within a month. Reading the last six or eight weeks gives a better sense of direction than the single latest number. The ${h.a('history', 'history page')} has every reading with the copy it came from.</p>
<h2>What the card is for, and what it is not</h2>
<p>The card is proof of status when you board a plane, train, bus or boat to Canada. Status itself depends on the residency obligation, two years of physical presence in every five-year period, not on the card. Letting a card expire while you live in Canada has no effect on your status; it matters when you travel. IRCC’s ${h.src('pr-card', 'PR card page')} sets out who must apply and which documents to send.</p>
<p>The card is also separate from citizenship. A permanent resident who meets the ${h.a('citizenship-calculator', 'physical presence count')} can apply for ${h.a('citizenship', 'citizenship')} even with an expired card, and once a citizen no longer needs one.</p>
<h2>When the card is late</h2>
<p>Compare the date IRCC received your application with the time in force. If you applied online, the ${h.src('account', 'IRCC account')} shows messages such as a request for a new photo, and the card cannot be produced until you answer. If the card was mailed but never arrived, the address IRCC holds is the first thing to check. Past the published time, the ${h.a('beyond-processing-time', 'steps for late applications')} describe how to ask IRCC about the file.</p>
`,
  },
  fr: {
    slug: 'delai-carte-rp',
    nav: 'Carte RP', card: 'Première carte et renouvellement, chiffres hebdomadaires depuis 2023',
    title: 'Délai de la carte RP : première carte et renouvellement 2026',
    description: 'Délai de la carte de résident permanent en 2026 : première carte et renouvellement, chiffre hebdomadaire d’IRCC, valeur d’il y a un an et écart depuis fin 2023.',
    h1: 'Délai de la carte RP, première carte et renouvellement',
    intro: `Chiffre d’IRCC du ${F.day(NEW.date)} : ${K.fmtTime(NEW.t, 'fr')} pour une première carte de résident permanent, ${K.fmtTime(REN.t, 'fr')} pour un renouvellement ou un remplacement.`,
    resume: `Une première carte de résident permanent prend en ce moment ${K.fmtTime(NEW.t, 'fr')}, et un renouvellement ou un remplacement ${K.fmtTime(REN.t, 'fr')}, selon les délais publiés par IRCC le ${F.day(NEW.date)}. Ce sont des délais passés : le temps dans lequel IRCC a terminé 80 % des demandes récentes, pas une promesse pour la vôtre. ${nY ? `Un an plus tôt, au relevé du ${F.day(nY.date)}, la première carte prenait ${F.d(nY.v)}` : 'La première carte'}${rY ? ` et le renouvellement ${F.d(rY.v)}` : ''}. Nous conservons ${F.n(nP.length)} relevés hebdomadaires de ces deux lignes depuis le ${F.day(nT.firstDate!)}. Sur cette période, la première carte est allée de ${F.d(nT.min)} le ${F.day(nT.minDate)} à ${F.d(nT.max)} le ${F.day(nT.maxDate)}, et le renouvellement de ${F.d(rT.min)} le ${F.day(rT.minDate)} à ${F.d(rT.max)} le ${F.day(rT.maxDate)}. Des mouvements de plusieurs semaines en un seul mois se sont produits sur les deux lignes. L’outil ci-dessus ajoute le délai publié au jour où IRCC a reçu votre demande.`,
    faqs: [
      { q: 'Combien de temps faut-il pour recevoir sa première carte RP en 2026 ?', a: `Le chiffre d’IRCC du ${F.day(NEW.date)} pour une première carte de résident permanent est de ${K.fmtTime(NEW.t, 'fr')}. Le délai part du moment où IRCC a tout ce qu’il faut pour produire la carte, y compris une photo acceptable et une adresse postale au Canada. L’acheminement par la poste s’ajoute au délai de traitement.` },
      { q: 'Quand faut-il demander le renouvellement de sa carte RP ?', a: `IRCC demande aux résidents permanents de présenter la demande quand la carte expire dans moins de neuf mois, ou une fois expirée. Avec un renouvellement à ${K.fmtTime(REN.t, 'fr')} le ${F.day(REN.date)} et un plus haut de ${F.d(rT.max)} dans notre série, s’y prendre tôt laisse de la marge. Une carte expirée ne fait pas perdre le statut de résident permanent.` },
      { q: 'Peut-on voyager pendant le renouvellement de la carte RP ?', a: 'Vous pouvez quitter le Canada, mais pour reprendre un vol de retour il faut une carte RP valide ou un titre de voyage pour résident permanent. Si la carte expire pendant que vous êtes à l’étranger, ce titre se demande depuis l’extérieur du Canada : c’est une demande distincte, avec son propre délai. Le passage de la frontière terrestre en voiture suit d’autres règles.' },
      { q: 'Le renouvellement de la carte RP est-il plus rapide que la première carte ?', a: `Pas toujours. Sur les ${F.n(both.length)} relevés hebdomadaires où les deux lignes étaient publiées, le renouvellement a été le plus rapide ${F.n(renewFaster)} fois. Aujourd’hui, la première carte est à ${K.fmtTime(NEW.t, 'fr')} et le renouvellement à ${K.fmtTime(REN.t, 'fr')}. Les deux lignes bougent séparément : regardez celle qui correspond à votre demande.` },
    ],
    body: (h) => `
<h2>Deux lignes pour une même carte</h2>
<p>La première carte RP est fabriquée une fois que vous êtes devenu résident permanent, à partir de l’adresse et de la photo fournies. La ligne du renouvellement ou du remplacement couvre tous les autres cas : carte qui expire, carte perdue ou volée, changement de nom ou de mention du sexe. IRCC publie les deux dans son fichier hebdomadaire des délais qui ne sont pas ventilés par pays : chaque chiffre vaut partout au Canada.</p>
${h.table(['Demande', `Délai au ${h.day(NEW.date)}`, 'Un an plus tôt', 'Premier relevé conservé'], [
  [K.progName('pr-card-new', 'fr'), h.t(NEW.t), nY ? `${h.d(nY.v)} (${h.day(nY.date)})` : '', `${h.d(nT.first!)} (${h.day(nT.firstDate!)})`],
  [K.progName('pr-card-renew', 'fr'), h.t(REN.t), rY ? `${h.d(rY.v)} (${h.day(rY.date)})` : '', `${h.d(rT.first!)} (${h.day(rT.firstDate!)})`],
], 'Lignes de la carte de résident permanent, fichier hebdomadaire d’IRCC.', ['l', 'r', 'r', 'r'])}
<h2>Année par année</h2>
<p>Comme ces deux lignes sont publiées chaque semaine, notre archive est dense : ${h.n(nP.length)} relevés pour la première carte. Le tableau les regroupe par année civile, avec le plus bas, le plus haut et la moyenne simple des relevés de l’année. Cette moyenne est notre propre calcul sur les chiffres d’IRCC, pas un chiffre publié par IRCC.</p>
${h.table(['Année', 'Relevés', 'Première carte, bas · haut', 'Première carte, moyenne', 'Renouvellement, bas · haut', 'Renouvellement, moyenne'], yearRows(h), 'Relevés hebdomadaires regroupés selon l’année de la date de mise à jour d’IRCC.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Deux mouvements ressortent. La première carte est montée à ${h.d(nT.max)} au relevé du ${h.day(nT.maxDate)}, puis tombée à ${h.d(nT.min)} dès le ${h.day(nT.minDate)} : un écart de ${h.d(nT.max - nT.min)} entre ces deux relevés. Le renouvellement a eu son propre cycle, de son plus haut de ${h.d(rT.max)} le ${h.day(rT.maxDate)} à un plus bas de ${h.d(rT.min)} le ${h.day(rT.minDate)}. Aucune des deux lignes n’a de tendance longue nette : elles avancent par vagues.</p>
${h.mini('delai', { p: ['g', 'm', 'd'], d: { g: 'pr-card-renew', m: K.READ.slice(0, 7), d: 1 }, t: 'Votre carte RP : date estimée' })}
<h2>Ce qu’il faut avant que la première carte soit produite</h2>
<p>Pour un nouveau résident permanent, la première carte n’est pas une demande distincte déposée des mois plus tard : elle suit la confirmation de la résidence permanente. IRCC ne peut pas produire la carte sans photo utilisable ni adresse postale au Canada : une pièce manquante s’ajoute au délai publié, ce qui explique sans doute que deux personnes arrivées le même jour reçoivent leur carte à quelques semaines d’écart. Une personne qui a confirmé sa résidence permanente depuis l’étranger sans encore donner d’adresse canadienne ne doit attendre sa carte qu’après la transmission de cette adresse à IRCC. Une carte produite dans les temps voyage ensuite par la poste, et ce délai-là n’est pas compris dans le chiffre.</p>
<h2>Les dernières semaines</h2>
${h.hist('n:new_pr', { max: 10, caption: 'Première carte RP : derniers chiffres hebdomadaires d’IRCC, avec le plus ancien relevé conservé en bas.' })}
<p>Des variations de quelques jours d’une semaine à l’autre sont fréquentes, et le chiffre peut changer de sens en un mois. Lire les six ou huit dernières semaines renseigne mieux sur la direction que le seul dernier chiffre. La ${h.a('history', 'page de l’historique')} reprend chaque relevé avec la copie d’où il vient.</p>
<h2>À quoi sert la carte, et à quoi elle ne sert pas</h2>
<p>La carte prouve votre statut quand vous embarquez dans un avion, un train, un autocar ou un bateau à destination du Canada. Le statut, lui, dépend de l’obligation de résidence, soit deux ans de présence effective par période de cinq ans, et non de la carte. Laisser expirer sa carte en vivant au Canada ne change rien au statut ; cela compte au moment de voyager. La ${h.src('pr-card', 'page d’IRCC sur la carte RP')} précise qui doit présenter une demande et quels documents envoyer.</p>
<p>La carte est aussi distincte de la citoyenneté. Un résident permanent qui remplit le ${h.a('citizenship-calculator', 'compte de présence effective')} peut demander la ${h.a('citizenship', 'citoyenneté')} même avec une carte expirée, et n’en a plus besoin une fois citoyen.</p>
<h2>Quand la carte tarde</h2>
<p>Comparez la date de réception de votre demande avec le délai en vigueur. Pour une demande en ligne, le ${h.src('account', 'compte IRCC')} affiche les messages comme une demande de nouvelle photo, et la carte ne peut pas être produite avant votre réponse. Si la carte a été postée mais n’est jamais arrivée, vérifiez d’abord l’adresse qu’IRCC a au dossier. Au-delà du délai publié, les ${h.a('beyond-processing-time', 'démarches pour une demande en retard')} expliquent comment interroger IRCC sur le dossier.</p>
`,
  },
});
