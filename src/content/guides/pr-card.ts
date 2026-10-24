import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Carte RP : IRCC ne publie ni norme de service ni série ouverte pour la carte elle-même. La page s'appuie sur le flux
 * qui appelle une première carte : confirmations de résidence permanente (COPR) délivrées et admissions de résidents
 * permanents, données ouvertes d'IRCC (OGL-Canada 2.0). Le délai de la carte se lit dans l'outil d'IRCC. */
const E = K.en, F = K.fr;
if (K.stdOf('pr-card-new') || K.stdOf('pr-card-renew')) throw new Error('pr-card : IRCC publie désormais une norme pour la carte RP, la citer');
const co = K.ops12('copr');
const adm = K.pr12('all');
const ext = K.fullExtremes('copr');
const LASTM = K.MONTHS[K.MONTHS.length - 1];
const CUR = LASTM.slice(0, 4), PREV = String(Number(CUR) - 1), PREV2 = String(Number(CUR) - 2);
const y1 = K.fullYear('copr', 'ALL', PREV2)!, y2 = K.fullYear('copr', 'ALL', PREV)!, ycur = K.fullYear('copr', 'ALL', CUR)!;
const FIRSTM = K.monthsOfYear(CUR)[0];
const cats = ['cec', 'pnp', 'spouse', 'fsw', 'protected'] as const;
const dir = (x: number | null, l: 'en' | 'fr') => (x == null ? '' : l === 'en' ? (x < 0 ? `down ${E.pa(x)}` : `up ${E.pa(x)}`) : (x < 0 ? `en baisse de ${F.pa(x)}` : `en hausse de ${F.pa(x)}`));

function rows(h: Helpers, l: 'en' | 'fr') {
  return [['all', ...cats]].flat().map((k) => { const y = K.pr12(k); return [k === 'all' ? (l === 'en' ? 'All categories' : 'Toutes catégories') : K.prName(k, l), h.n(y.last), h.n(y.prev), h.ch(y.change)]; });
}

export default defineGuide({
  id: 'pr-card', group: 'cit', order: 62,
  tool: 'delai', toolArg: { g: 'pr-card-new', m: 'none', only: 'pr-card-new,pr-card-renew' },
  related: ['citizenship', 'citizenship-calculator', 'express-entry', 'spousal-sponsorship', 'beyond-processing-time'],
  sources: ['pr-card', 'ptimes', 'open-data', 'od-pr', 'check-status', 'ogl'],
  en: {
    slug: 'pr-card-processing-time',
    nav: 'PR card', card: 'First card or renewal: date from IRCC’s time, new permanent residents by month',
    title: 'PR Card Processing Time: First Card and Renewal, 2026',
    description: 'Estimate when your first PR card or renewed card should arrive from the time IRCC shows, and see how many 2026 permanent residents waited for a first card.',
    h1: 'Permanent resident card: from IRCC’s time to a delivery date',
    intro: `IRCC issued ${E.n(co.last)} confirmations of permanent residence from ${E.w12()}, ${dir(co.change, 'en')} on the year before; each new permanent resident then waits for a first card.`,
    resume: `IRCC shows two separate times for the permanent resident card on its “Check processing times” tool: one for the first card of a new permanent resident, one for a renewal or replacement. Read the line that fits, enter it in the calculator above with its unit, then the month and day IRCC received your application or, for a first card, the day you confirmed permanent residence. The result is an estimated date for the card, with the share of the time already elapsed. IRCC publishes no service standard for the card and no open data on card production, so this page relies on the flow that creates first cards: ${E.n(co.last)} confirmations of permanent residence issued from ${E.w12()}, ${dir(co.change, 'en')} on the twelve months before, and ${E.n(adm.last)} permanent residents admitted over the same period. A renewal is a different case: it is requested by someone already settled, usually when the five-year card is close to its expiry, and the residency obligation of 730 days in five years is checked at that moment.`,
    faqs: [
      { q: 'When does IRCC send the first PR card?', a: 'IRCC starts the first card once you have confirmed your permanent residence, either online or at a port of entry, and once it has a photo and a Canadian mailing address. The card is mailed to that address. If the address changes before the card arrives, tell IRCC at once, because Canada Post does not forward it.' },
      { q: 'Can I travel while my PR card is being processed?', a: 'You can leave Canada, but to come back on a commercial flight, boat or bus without a valid card you need a permanent resident travel document, issued from abroad. At a land border in a private vehicle, you can show other proof of status. Your status itself does not depend on the card.' },
      { q: 'Does IRCC publish a service standard for the PR card?', a: 'No. The Government of Canada service inventory lists IRCC standards for visitor visas, study and work permits, several permanent residence streams and citizenship grants, but none for the card. The only time to rely on is the one IRCC shows on its processing times tool, for a first card and for a renewal.' },
      { q: 'What does IRCC check when I renew a PR card?', a: 'IRCC checks that you meet the residency obligation: at least 730 days in Canada in the five years before the application, or since you became a permanent resident if that is more recent. Some days abroad count, such as days with a Canadian citizen spouse. A renewal that shows fewer days can lead to a review of status.' },
    ],
    body: (h) => `
<h2>Two lines, two different times</h2>
<p>IRCC’s ${h.src('ptimes', '“Check processing times” tool')} lists the permanent resident card twice. The first line is the first card, which IRCC prepares for a new permanent resident without a separate application once permanent residence is confirmed. The second line is the renewal or replacement of an existing card, an application the cardholder sends when the card expires within nine months, has expired, or was lost, stolen or damaged. Copy the time that matches your case into the calculator, with its unit. For a first card, use the day you confirmed permanent residence as the start date; for a renewal, use the day IRCC received the application.</p>
${h.mini('delai', { p: ['g', 'n', 'u', 'm'], d: { g: 'pr-card-new', m: 'none' }, t: 'Your PR card: estimated delivery date' })}
<h2>Where first cards come from</h2>
<p>Each first card follows a confirmation of permanent residence, the COPR. IRCC’s ${h.src('open-data', 'open data')} counts COPRs issued every month: ${h.n(co.last)} over the latest twelve months, against ${h.n(co.prev)} over the twelve months before. By calendar year, IRCC issued ${h.n(y1)} in ${PREV2}, ${h.n(y2)} in ${PREV} and ${h.n(ycur)} from ${h.my(FIRSTM)} to ${h.my(LASTM)}. The busiest month in the series was ${h.my(ext.hi![0])} with ${h.n(ext.hi![1])}, the quietest ${h.my(ext.lo![0])} with ${h.n(ext.lo![1])}. A month with many COPRs sends many first card requests into production a few weeks later, which is one reason the time shown for the first card can move without any change on your side.</p>
${h.months(K.MONTHS, [['COPRs issued', K.full('copr')]], { caption: 'Confirmations of permanent residence (COPR) issued by month, newest first. Source: IRCC, Operational Processing, open data; figures rounded to 5.' })}
<h2>New permanent residents by category</h2>
<p>The ${h.src('od-pr', 'permanent residents dataset')} counts admissions, the moment a person becomes a permanent resident, by immigration category. From ${h.w12()}, ${h.n(adm.last)} people were admitted, ${dir(adm.change, 'en')} on the twelve months before. The table shows the largest categories. Admissions and COPRs are close but not identical: a COPR issued abroad becomes an admission only when the person lands in Canada, sometimes months later.</p>
${h.table(['Category', 'Admissions, last 12 months', 'Previous 12 months', 'Change'], rows(h, 'en'), `Permanent residents admitted by category, ${h.w12(K.PRD.months)}, and the twelve months before. Source: IRCC, Permanent Residents, open data; figures rounded to 5.`, ['l', 'r', 'r', 'r'])}
<h2>Renewing: the residency obligation</h2>
<p>A card is valid for five years in most cases. Renewing it is not automatic: IRCC checks that you spent at least 730 days in Canada in the five years before the application, or since you became a permanent resident if that is less than five years ago. The days do not need to be continuous. Some time abroad counts, for example days spent with a spouse or parent who is a Canadian citizen, or working full time for a Canadian business. If you are short, the renewal can trigger a review of your status, so count before you apply. If you are already close to citizenship, the ${h.a('citizenship-calculator', 'citizenship presence calculator')} counts the stricter rule of 1,095 days, and the ${h.a('citizenship', 'citizenship page')} explains what comes next.</p>
<h2>If the card is late</h2>
<p>Check the status in your account or with IRCC’s ${h.src('check-status', 'status tool')}. For a first card, the usual causes of delay are a photo that did not meet the specifications, an address entered with a mistake or a move after landing. For a renewal, a request for proof of your days in Canada can add several weeks. IRCC’s ${h.src('pr-card', 'PR card page')} explains how to update an address or report a card that never arrived. When the date in the calculator is behind you, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} apply to the card as to any other file.</p>
`,
  },
  fr: {
    slug: 'delai-carte-rp',
    nav: 'Carte RP', card: 'Première carte ou renouvellement : date à partir du délai d’IRCC, nouveaux résidents',
    title: 'Délai de la carte RP : première carte et renouvellement 2026',
    description: 'Estimez l’arrivée de votre première carte RP ou de la carte renouvelée à partir du délai affiché par IRCC, et voyez les nouveaux résidents permanents en 2026.',
    h1: 'Carte de résident permanent : du délai d’IRCC à la date de réception',
    intro: `IRCC a délivré ${F.n(co.last)} confirmations de résidence permanente de ${F.w12()}, ${dir(co.change, 'fr')} sur un an ; chaque nouveau résident permanent attend ensuite une première carte.`,
    resume: `IRCC affiche deux délais distincts pour la carte de résident permanent dans son outil « Vérifier les délais de traitement » : l’un pour la première carte d’un nouveau résident permanent, l’autre pour un renouvellement ou un remplacement. Lisez la ligne qui vous concerne, saisissez-la dans le calculateur ci-dessus avec son unité, puis le mois et le jour où IRCC a reçu votre demande ou, pour une première carte, le jour où vous avez confirmé la résidence permanente. Le résultat est une date estimée pour la carte, avec la part du délai déjà écoulée. IRCC ne publie ni norme de service pour la carte ni données ouvertes sur sa production : cette page s’appuie donc sur le flux qui crée les premières cartes, soit ${F.n(co.last)} confirmations de résidence permanente délivrées de ${F.w12()}, ${dir(co.change, 'fr')} par rapport aux douze mois d’avant, et ${F.n(adm.last)} résidents permanents admis sur la même période. Le renouvellement est un autre cas : il est demandé par une personne déjà installée, le plus souvent quand la carte de cinq ans approche de son expiration, et l’obligation de résidence de 730 jours en cinq ans est vérifiée à ce moment.`,
    faqs: [
      { q: 'Quand IRCC envoie-t-il la première carte RP ?', a: 'IRCC lance la première carte une fois la résidence permanente confirmée, en ligne ou à un point d’entrée, et dès qu’il dispose d’une photo et d’une adresse postale au Canada. La carte est envoyée à cette adresse. Si l’adresse change avant l’arrivée de la carte, prévenez IRCC sans attendre : Postes Canada ne la fait pas suivre.' },
      { q: 'Puis-je voyager pendant le traitement de ma carte RP ?', a: 'Vous pouvez quitter le Canada, mais pour revenir en avion, en bateau ou en autocar commercial sans carte valide, il faut un titre de voyage de résident permanent, demandé depuis l’étranger. À une frontière terrestre en véhicule privé, d’autres preuves de statut suffisent. Le statut lui-même ne dépend pas de la carte.' },
      { q: 'IRCC publie-t-il une norme de service pour la carte RP ?', a: 'Non. L’inventaire des services du gouvernement du Canada liste des normes d’IRCC pour les visas de visiteur, les permis d’études et de travail, plusieurs voies de résidence permanente et l’attribution de la citoyenneté, mais aucune pour la carte. Le seul repère est le délai affiché par l’outil d’IRCC, pour une première carte comme pour un renouvellement.' },
      { q: 'Que vérifie IRCC lors du renouvellement de la carte RP ?', a: 'IRCC vérifie l’obligation de résidence : au moins 730 jours au Canada dans les cinq ans avant la demande, ou depuis l’obtention de la résidence permanente si elle est plus récente. Certains jours à l’étranger comptent, par exemple avec un conjoint citoyen canadien. Un renouvellement qui montre moins de jours peut entraîner un examen du statut.' },
    ],
    body: (h) => `
<h2>Deux lignes, deux délais différents</h2>
<p>L’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC liste la carte de résident permanent deux fois. La première ligne est la première carte, qu’IRCC prépare pour un nouveau résident permanent sans demande séparée, une fois la résidence permanente confirmée. La seconde est le renouvellement ou le remplacement d’une carte existante, une demande que le titulaire envoie quand sa carte expire dans les neuf mois, a expiré, ou a été perdue, volée ou abîmée. Recopiez le délai qui correspond à votre cas dans le calculateur, avec son unité. Pour une première carte, prenez comme date de départ le jour de la confirmation de la résidence permanente ; pour un renouvellement, le jour où IRCC a reçu la demande.</p>
${h.mini('delai', { p: ['g', 'n', 'u', 'm'], d: { g: 'pr-card-new', c: 'MA', m: 'none' }, t: 'Votre carte RP : date de réception estimée' })}
<h2>D’où viennent les premières cartes</h2>
<p>Chaque première carte suit une confirmation de résidence permanente, la CRP. Les ${h.src('open-data', 'données ouvertes')} d’IRCC comptent chaque mois les CRP délivrées : ${h.n(co.last)} sur les douze derniers mois, contre ${h.n(co.prev)} sur les douze mois précédents. Par année civile, IRCC en a délivré ${h.n(y1)} en ${PREV2}, ${h.n(y2)} en ${PREV} et ${h.n(ycur)} de ${h.my(FIRSTM)} à ${h.my(LASTM)}. Le mois le plus chargé de la série est ${h.my(ext.hi![0])} avec ${h.n(ext.hi![1])}, le plus calme ${h.my(ext.lo![0])} avec ${h.n(ext.lo![1])}. Un mois riche en CRP envoie beaucoup de premières cartes en production quelques semaines plus tard, ce qui explique en partie que le délai affiché pour la première carte bouge sans que rien ne change de votre côté.</p>
${h.months(K.MONTHS, [['CRP délivrées', K.full('copr')]], { caption: 'Confirmations de résidence permanente (CRP) délivrées par mois, du plus récent au plus ancien. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.' })}
<h2>Les nouveaux résidents permanents par catégorie</h2>
<p>Le ${h.src('od-pr', 'jeu de données sur les résidents permanents')} compte les admissions, le moment où une personne devient résidente permanente, par catégorie d’immigration. De ${h.w12()}, ${h.n(adm.last)} personnes ont été admises, ${dir(adm.change, 'fr')} par rapport aux douze mois d’avant. Le tableau montre les principales catégories. Admissions et CRP sont proches sans être identiques : une CRP délivrée à l’étranger ne devient une admission qu’à l’arrivée de la personne au Canada, parfois des mois plus tard.</p>
${h.table(['Catégorie', 'Admissions, 12 derniers mois', '12 mois d’avant', 'Écart'], rows(h, 'fr'), `Résidents permanents admis par catégorie, ${h.w12(K.PRD.months)}, et les douze mois d’avant. Source : IRCC, Résidents permanents, données ouvertes ; chiffres arrondis à 5.`, ['l', 'r', 'r', 'r'])}
<h2>Renouveler : l’obligation de résidence</h2>
<p>Une carte est valide cinq ans dans la plupart des cas. Son renouvellement n’est pas automatique : IRCC vérifie que vous avez passé au moins 730 jours au Canada dans les cinq ans qui précèdent la demande, ou depuis l’obtention de la résidence permanente si elle date de moins de cinq ans. Les jours n’ont pas à être consécutifs. Une partie du temps à l’étranger compte, par exemple les jours passés avec un conjoint ou un parent citoyen canadien, ou à travailler à temps plein pour une entreprise canadienne. S’il vous manque des jours, le renouvellement peut déclencher un examen du statut : comptez avant de déposer. Si vous approchez de la citoyenneté, le ${h.a('citizenship-calculator', 'calculateur de présence pour la citoyenneté')} applique la règle plus stricte des 1 095 jours, et la ${h.a('citizenship', 'page sur la citoyenneté')} explique la suite.</p>
<h2>Si la carte tarde</h2>
<p>Vérifiez l’état du dossier dans votre compte ou avec l’${h.src('check-status', 'outil de suivi d’IRCC')}. Pour une première carte, les causes habituelles de retard sont une photo hors normes, une adresse saisie avec une erreur ou un déménagement après l’arrivée. Pour un renouvellement, une demande de preuves de vos jours au Canada peut ajouter plusieurs semaines. La ${h.src('pr-card', 'page d’IRCC sur la carte RP')} explique comment changer d’adresse ou signaler une carte jamais reçue. Quand la date du calculateur est passée, les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} s’appliquent à la carte comme à tout autre dossier.</p>
`,
  },
});
