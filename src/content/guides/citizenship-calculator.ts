import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Règle de présence effective (params-2026.json > citizenship) et exemples calculés par le moteur. */
const R = K.P.citizenship as { required: number; window: number; tempRatio: number; tempCap: number };
const RULE = K.CIT_RULE;
const G = K.readingOf('citizenship');
const T = K.isTime(G.t) ? G.t : null;
const yrs = Math.round(R.window / 365);
const pct = Math.round(R.tempRatio * 100);
/* Jours d'avant nécessaires pour atteindre le plafond du crédit. */
const tempForCap = Math.ceil(R.tempCap / R.tempRatio);
const CASES = [
  { pr: 900, tmp: 400 },
  { pr: 700, tmp: 1000 },
  { pr: 1000, tmp: 0 },
  { pr: 600, tmp: 300 },
].map((x) => ({ ...x, c: K.citizenship({ prDays: x.pr, tempDays: x.tmp }, RULE) }));
const [A, B, C, D] = CASES;
const earliest = (missing: number) => K.addDays(K.READ, missing);
const oath = (missing: number, l: 'en' | 'fr') => (T ? K.whenAt(K.addTime(earliest(missing), T), T, l) : '');
const E = K.en, F = K.fr;

function caseRows(h: Helpers) {
  const l = h.lang as 'en' | 'fr';
  return CASES.map((x, i) => [String.fromCharCode(65 + i), h.n(x.pr), h.n(x.tmp), h.n(x.c.tempCredit), h.n(x.c.total),
    x.c.eligible ? (l === 'fr' ? 'seuil atteint' : 'threshold met') : (l === 'fr' ? `${h.n(x.c.missing)} jours manquants` : `${h.n(x.c.missing)} days short`)]);
}

export default defineGuide({
  id: 'citizenship-calculator', group: 'cit', order: 61,
  tool: 'citoyennete', toolArg: { pr: 900, tmp: 400 },
  related: ['citizenship', 'pr-card', 'express-entry', 'cec', 'pgwp'],
  sources: ['citizenship-eligibility', 'citizenship-act', 'ptimes-flpt'],
  en: {
    slug: 'citizenship-physical-presence-calculator',
    nav: 'Citizenship days calculator', card: `Count your ${E.n(R.required)} days and the earliest date to apply`,
    title: 'Physical Presence for Citizenship: Day Count Tool 2026',
    description: `Count your days of physical presence for Canadian citizenship in 2026: the ${E.n(R.required)}-day rule, the half-day credit before PR, the earliest date you can apply.`,
    h1: 'Physical presence for citizenship, counted day by day',
    intro: `You need ${E.n(R.required)} days in Canada within the ${E.n(yrs)} years before you sign the application; days before permanent residence count at ${E.n(pct)}%, up to ${E.n(R.tempCap)}.`,
    resume: `To apply for Canadian citizenship as an adult, you must have been physically present in Canada for at least ${E.n(R.required)} days during the ${E.n(yrs)} years right before the date you sign the application. Days spent in Canada as a permanent resident count in full. Days spent in Canada before that, as a visitor, student, worker or protected person, count as half a day each, and this credit is capped at ${E.n(R.tempCap)} days, which you reach with ${E.n(tempForCap)} days of earlier stay. Someone with ${E.n(A.pr)} days as a permanent resident and ${E.n(A.tmp)} days before has ${E.n(A.c.total)} days and can apply. Someone with ${E.n(C.pr)} days as a permanent resident and nothing before is ${E.n(C.c.missing)} days short. Enter your two totals above: the tool gives the count, the days missing, the first date you could sign with no new trip abroad, and an oath date using IRCC’s current forward-looking time of ${K.fmtTime(G.t, 'en')}.`,
    faqs: [
      { q: 'How many days do I need for Canadian citizenship physical presence in 2026?', a: `The rule is ${E.n(R.required)} days of physical presence in the ${E.n(yrs)} years before the date you sign. It comes from section 5 of the Citizenship Act and applies throughout 2026. Days as a permanent resident count fully; earlier days in Canada with temporary status count for half, ${E.n(R.tempCap)} days at most.` },
      { q: 'Do days as an international student count toward the citizenship day count?', a: `Yes, if they fall inside the ${E.n(yrs)}-year window. Each day you were in Canada as a student, worker, visitor or protected person before becoming a permanent resident counts as half a day. Two years of study inside the window, about ${E.n(730)} days, give ${E.n(Math.min(R.tempCap, Math.floor(730 * R.tempRatio)))} days of credit.` },
      { q: 'Can my citizenship day count go down while I wait to apply?', a: 'It normally does not go down while you stay in Canada, because each new day in the country replaces one leaving the window. It can fall if the day that slides out of the window was a full permanent resident day and you are now abroad, or if the day leaving was part of the earlier half-day credit while you spend the new day outside Canada.' },
      { q: 'Is this citizenship day count tool enough to submit an application?', a: 'No. It works on two totals you type in. IRCC asks you to list every trip outside Canada and checks the count itself, and its own physical presence calculator, linked from the eligibility page, is the reference before you sign. Use the result here to plan a date, then confirm it with exact travel dates.' },
    ],
    body: (h) => `
<h2>The rule in four numbers</h2>
<p>Section 5 of the ${h.src('citizenship-act', 'Citizenship Act')} sets the physical presence test. It uses four values, all read from our parameter file and shown here as the calculator applies them.</p>
${h.table(['Element', 'Value', 'What it means'], [
  ['Days required', h.n(R.required), 'Total physical presence you need on the day you sign'],
  ['Window', `${h.n(R.window)} days`, `The ${h.n(yrs)} years counted back from the signing date`],
  ['Credit for earlier days', `${h.n(pct)}%`, 'Each day in Canada with temporary status before PR'],
  ['Cap on that credit', h.n(R.tempCap), `Reached with ${h.n(tempForCap)} days of earlier stay`],
], 'Physical presence rule for an adult citizenship grant.', ['l', 'r', 'l'])}
<p>The test is about presence, not status alone. A permanent resident who lives abroad for most of the window does not meet it, even with a valid ${h.a('pr-card', 'PR card')}. A day spent outside Canada counts for nothing, whatever your status at the time.</p>
<h2>Four worked cases</h2>
<p>Each line below was computed by the same engine as the calculator, on ${h.day(K.READ)}. The first two columns are what you would type; the next two are what the rule keeps.</p>
${h.table(['Case', 'Days as PR', 'Days before PR', 'Credit kept', 'Total', 'Result'], caseRows(h), `Physical presence, ${h.n(R.required)} days required.`, ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>Case A is a typical former worker or graduate: ${h.n(A.pr)} days as a permanent resident plus ${h.n(A.tmp)} days before, which give ${h.n(A.c.tempCredit)} days of credit and a total of ${h.n(A.c.total)}. Case B shows the cap at work. Its ${h.n(B.tmp)} earlier days would be worth ${h.n(Math.floor(B.tmp * R.tempRatio))} at half value, but only ${h.n(B.c.tempCredit)} are kept, so the total stops at ${h.n(B.c.total)} and the person is ${h.n(B.c.missing)} days short. With no new trip, the first date to sign would be ${h.day(earliest(B.c.missing))}.</p>
<p>Case C has no earlier stay at all and needs ${h.n(C.c.missing)} more days, which puts the first possible signing date at ${h.day(earliest(C.c.missing))}. Case D is further away: ${h.n(D.c.total)} days counted, ${h.n(D.c.missing)} missing. ${T ? `If case C signed on that first date and IRCC’s forward-looking time stayed at ${h.t(G.t)}, the oath would come around ${oath(C.c.missing, 'en')}.` : ''}</p>
${h.mini('citoyennete', { p: ['pr', 'tmp'], d: { pr: B.pr, tmp: B.tmp }, t: 'Your physical presence count' })}
<h2>Counting the two totals</h2>
<p>Start from the date you plan to sign and go back ${h.n(yrs)} years. Within that window, list every trip outside Canada. Days in Canada after the date on your confirmation of permanent residence go in the first box. Days in Canada before that date, with a study permit, a work permit, visitor status or as a protected person, go in the second. Time in Canada without any status does not count, and some periods, such as time serving a sentence, are excluded; ${h.src('citizenship-eligibility', 'IRCC’s eligibility page')} lists them.</p>
<p>The window slides. Each day you wait pushes the oldest day out. If that old day was an early, half-value day, you lose half a day of credit and gain a full day by being in Canada, so the total still rises. If you travel during the wait, the total can stand still or fall. That is why the date given by the calculator assumes no new absence.</p>
<h2>After the threshold</h2>
<p>Meeting the day count is one condition among several. Adults must also have filed income tax returns for at least three years within the window, if they were required to, and those aged 18 to 54 must prove language ability and pass the citizenship test. Once the application is in, the ${h.a('citizenship', 'citizenship processing time')} applies: IRCC currently projects ${h.t(G.t)} for a grant, with its queue published by month of filing.</p>
<p>A common mistake is to apply the moment the count reaches ${h.n(R.required)} exactly. IRCC counts from your travel history, and a single day misread pushes the file below the threshold, which can lead to a refusal. A margin of a few weeks above the minimum protects against that.</p>
`,
  },
  fr: {
    slug: 'calcul-presence-effective-citoyennete',
    nav: 'Jours pour la citoyenneté', card: `Comptez vos ${F.n(R.required)} jours et la date de dépôt possible`,
    title: 'Présence effective pour la citoyenneté : jours, 2026',
    description: `Comptez vos jours de présence pour la citoyenneté canadienne en 2026 : règle des ${F.n(R.required)} jours, demi-journées avant la RP, première date de dépôt possible.`,
    h1: 'La présence effective pour la citoyenneté, jour par jour',
    intro: `Il faut ${F.n(R.required)} jours au Canada dans les ${F.n(yrs)} ans qui précèdent la signature de la demande ; les jours d’avant la résidence permanente comptent à ${F.n(pct)} %, ${F.n(R.tempCap)} au plus.`,
    resume: `Pour demander la citoyenneté canadienne à l’âge adulte, il faut avoir été effectivement présent au Canada au moins ${F.n(R.required)} jours pendant les ${F.n(yrs)} ans qui précèdent la date de signature de la demande. Les jours passés au Canada comme résident permanent comptent en entier. Les jours passés au Canada avant, comme visiteur, étudiant, travailleur ou personne protégée, valent une demi-journée chacun, et ce crédit est plafonné à ${F.n(R.tempCap)} jours, atteint avec ${F.n(tempForCap)} jours de séjour antérieur. Une personne qui a ${F.n(A.pr)} jours comme résident permanent et ${F.n(A.tmp)} jours avant arrive à ${F.n(A.c.total)} jours et peut déposer. Une personne qui a ${F.n(C.pr)} jours comme résident permanent et rien avant a ${F.n(C.c.missing)} jours de retard. Entrez vos deux totaux ci-dessus : l’outil donne le compte, les jours manquants, la première date de signature possible sans nouveau voyage et une date de serment fondée sur le délai prospectif actuel d’IRCC, ${K.fmtTime(G.t, 'fr')}.`,
    faqs: [
      { q: 'Combien de jours de présence effective faut-il pour la citoyenneté canadienne en 2026 ?', a: `La règle est de ${F.n(R.required)} jours de présence effective dans les ${F.n(yrs)} ans qui précèdent la signature. Elle vient de l’article 5 de la Loi sur la citoyenneté et s’applique pendant toute l’année 2026. Les jours comme résident permanent comptent en entier ; les jours antérieurs avec un statut temporaire comptent pour moitié, ${F.n(R.tempCap)} jours au plus.` },
      { q: 'Les jours passés comme étudiant étranger comptent-ils pour la présence effective ?', a: `Oui, s’ils tombent dans la fenêtre de ${F.n(yrs)} ans. Chaque jour au Canada comme étudiant, travailleur, visiteur ou personne protégée avant la résidence permanente vaut une demi-journée. Deux ans d’études dans la fenêtre, soit environ ${F.n(730)} jours, donnent ${F.n(Math.min(R.tempCap, Math.floor(730 * R.tempRatio)))} jours de crédit.` },
      { q: 'Mon compte de présence effective peut-il baisser si j’attends avant de déposer ?', a: 'Pas tant que vous restez au Canada : chaque nouveau jour au pays remplace celui qui sort de la fenêtre. Le compte peut baisser si vous êtes à l’étranger pendant que sort un ancien jour de résident permanent, ou si un jour du crédit à moitié sort alors que vous passez le nouveau jour hors du Canada.' },
      { q: 'Ce calcul de présence effective suffit-il pour déposer la demande de citoyenneté ?', a: 'Non. Il part de deux totaux que vous saisissez. IRCC demande la liste de tous vos voyages hors du Canada et refait le compte lui-même ; son propre calculateur de présence effective, accessible depuis la page d’admissibilité, fait foi avant de signer. Servez-vous du résultat ici pour viser une date, puis confirmez avec vos dates exactes.' },
    ],
    body: (h) => `
<h2>La règle en quatre chiffres</h2>
<p>L’article 5 de la ${h.src('citizenship-act', 'Loi sur la citoyenneté')} fixe le critère de présence effective. Il repose sur quatre valeurs, toutes lues dans notre fichier de paramètres et appliquées telles quelles par le calculateur.</p>
${h.table(['Élément', 'Valeur', 'Ce que cela veut dire'], [
  ['Jours exigés', h.n(R.required), 'Présence totale nécessaire le jour de la signature'],
  ['Fenêtre', `${h.n(R.window)} jours`, `Les ${h.n(yrs)} ans comptés à rebours depuis la signature`],
  ['Crédit des jours antérieurs', `${h.n(pct)} %`, 'Chaque jour au Canada avec un statut temporaire avant la RP'],
  ['Plafond de ce crédit', h.n(R.tempCap), `Atteint avec ${h.n(tempForCap)} jours de séjour antérieur`],
], 'Règle de présence effective pour l’attribution de la citoyenneté à un adulte.', ['l', 'r', 'l'])}
<p>Le critère porte sur la présence, pas seulement sur le statut. Un résident permanent qui vit à l’étranger la plus grande partie de la fenêtre ne le remplit pas, même avec une ${h.a('pr-card', 'carte RP')} valide. Un jour passé hors du Canada ne compte pour rien, quel que soit le statut de l’époque.</p>
<h2>Quatre cas calculés</h2>
<p>Chaque ligne ci-dessous a été calculée par le même moteur que l’outil, au ${h.day(K.READ)}. Les deux premières colonnes sont ce que vous saisiriez ; les deux suivantes, ce que la règle retient.</p>
${h.table(['Cas', 'Jours comme RP', 'Jours avant la RP', 'Crédit retenu', 'Total', 'Résultat'], caseRows(h), `Présence effective, ${h.n(R.required)} jours exigés.`, ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>Le cas A est celui d’un ancien travailleur ou diplômé : ${h.n(A.pr)} jours comme résident permanent et ${h.n(A.tmp)} jours avant, qui donnent ${h.n(A.c.tempCredit)} jours de crédit et un total de ${h.n(A.c.total)}. Le cas B montre le plafond. Ses ${h.n(B.tmp)} jours antérieurs vaudraient ${h.n(Math.floor(B.tmp * R.tempRatio))} jours à moitié, mais seuls ${h.n(B.c.tempCredit)} sont retenus : le total s’arrête à ${h.n(B.c.total)} et il manque ${h.n(B.c.missing)} jours. Sans nouveau voyage, la première date de signature serait le ${h.day(earliest(B.c.missing))}.</p>
<p>Le cas C n’a aucun séjour antérieur et doit attendre ${h.n(C.c.missing)} jours, soit une première signature possible le ${h.day(earliest(C.c.missing))}. Le cas D est plus loin : ${h.n(D.c.total)} jours comptés, ${h.n(D.c.missing)} manquants. ${T ? `Si le cas C signait à cette date et que le délai prospectif d’IRCC restait à ${h.t(G.t)}, le serment tomberait vers ${oath(C.c.missing, 'fr')}.` : ''}</p>
${h.mini('citoyennete', { p: ['pr', 'tmp'], d: { pr: B.pr, tmp: B.tmp }, t: 'Votre compte de présence effective' })}
<h2>Établir les deux totaux</h2>
<p>Partez de la date où vous comptez signer et remontez de ${h.n(yrs)} ans. Dans cette fenêtre, notez chaque séjour hors du Canada. Les jours au Canada après la date inscrite sur votre confirmation de résidence permanente vont dans la première case. Les jours au Canada avant cette date, avec un permis d’études, un permis de travail, le statut de visiteur ou comme personne protégée, vont dans la seconde. Le temps passé au Canada sans statut ne compte pas, et certaines périodes, comme l’exécution d’une peine, sont exclues ; la ${h.src('citizenship-eligibility', 'page d’admissibilité d’IRCC')} les énumère.</p>
<p>La fenêtre glisse. Chaque jour d’attente en fait sortir le plus ancien. Si ce vieux jour était un jour antérieur compté à moitié, vous perdez une demi-journée de crédit et gagnez un jour entier en restant au Canada : le total monte quand même. Si vous voyagez pendant l’attente, il peut stagner ou baisser. C’est pourquoi la date donnée par le calculateur suppose qu’il n’y a aucune nouvelle absence.</p>
<h2>Une fois le seuil atteint</h2>
<p>Le compte de jours n’est qu’une condition parmi d’autres. Un adulte doit aussi avoir produit ses déclarations de revenus pendant au moins trois ans dans la fenêtre, s’il y était tenu, et les 18 à 54 ans doivent prouver leurs compétences linguistiques et réussir l’examen de citoyenneté. Une fois la demande envoyée, c’est le ${h.a('citizenship', 'délai de traitement de la citoyenneté')} qui s’applique : IRCC projette en ce moment ${h.t(G.t)} pour une attribution, avec une file publiée par mois de dépôt.</p>
<p>Une erreur fréquente consiste à déposer le jour même où le compte atteint ${h.n(R.required)} tout juste. IRCC refait le calcul à partir de vos voyages, et un seul jour mal compté fait passer le dossier sous le seuil, ce qui peut mener à un refus. Une marge de quelques semaines au-dessus du minimum protège contre ce risque.</p>
`,
  },
});
