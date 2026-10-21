import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Expérience internationale Canada : ligne « iec » du fichier sans pays, relevée chaque semaine depuis fin 2023. */
const S = 'n:iec';
const r = K.readingOf('iec');
const tr = K.fullTrend(S)!;
const pts = K.points(S);
const N = pts.length;
/** Plus haut de décembre-janvier et plus bas de février-mars qui suit, pour chaque saison couverte. */
function season(y: number) {
  const win = pts.filter((p) => p.date >= `${y - 1}-12-01` && p.date <= `${y}-01-31`);
  const after = pts.filter((p) => p.date >= `${y}-02-01` && p.date <= `${y}-03-31`);
  if (!win.length || !after.length) return null;
  const hi = win.reduce((a, b) => (b.v > a.v ? b : a));
  const lo = after.reduce((a, b) => (b.v < a.v ? b : a));
  return { y, hi, lo };
}
const seasons = [2024, 2025, 2026].map(season).filter((x): x is NonNullable<ReturnType<typeof season>> => !!x);
const s25 = seasons.find((x) => x.y === 2025)!, s26 = seasons.find((x) => x.y === 2026)!;
const ago = K.valueNear(S, `${Number(r.date.slice(0, 4)) - 1}${r.date.slice(4)}`);
const avgW = Math.round(pts.reduce((a, p) => a + p.v, 0) / N / 7);
const E = K.en, F = K.fr;

export default defineGuide({
  id: 'iec', group: 'work', order: 33,
  tool: 'delai', toolArg: { g: 'iec', only: 'iec,work,work-inside,work-ext' },
  related: ['work-permit', 'work-permit-extension', 'pgwp', 'france'],
  sources: ['iec', 'ptimes-noncountry', 'biometrics', 'wayback'],
  en: {
    slug: 'iec-working-holiday-processing-time',
    nav: 'IEC (working holiday)', card: 'Weeks after invitation, yearly cycle since 2023',
    title: 'IEC Working Holiday Visa Processing Time, Canada 2026',
    description: 'International Experience Canada processing time in 2026: weeks IRCC publishes after an invitation, the yearly winter peak and every weekly reading since 2023.',
    h1: 'IEC processing time: working holiday, young professionals, co-op',
    intro: `IRCC’s figure for International Experience Canada work permits, dated ${E.day(r.date)}, is ${K.fmtTime(r.t, 'en')}.`,
    resume: `An International Experience Canada (IEC) work permit application currently takes ${K.fmtTime(r.t, 'en')}, according to the figure IRCC published on ${E.day(r.date)}. The time is one line for all three IEC categories, Working Holiday, Young Professionals and International Co-op, and for all partner countries. It covers only the last stage: the work permit application you send after receiving an invitation from a pool, counted from the day IRCC receives it complete, without the biometrics appointment. The wait in the pool before an invitation is not included and can be much longer. Our archive holds ${E.n(N)} weekly readings since ${E.day(tr.firstDate!)}. Over that period the figure ranged from ${E.d(tr.min, 'w')} on ${E.day(tr.minDate)} to ${E.d(tr.max, 'w')} on ${E.day(tr.maxDate)}, and averaged about ${E.n(avgW)} weeks. ${ago ? `A year ago, on ${E.day(ago.date)}, it was ${E.d(ago.v, 'w')}.` : ''} The line follows a clear yearly cycle: it rises at the turn of the year, then drops sharply in February. The tool adds the current figure to the date you submitted.`,
    faqs: [
      { q: 'Does the IEC processing time include the wait for an invitation?', a: 'No. IRCC’s figure starts when it receives your work permit application, which you can only send after being invited from the pool. The time spent in the pool depends on the number of places for your country and category and on how many candidates are waiting, and IRCC does not publish a processing time for it.' },
      { q: 'Why does the IEC time drop every February?', a: `In our readings the figure peaks in winter and falls in February: ${E.d(s25.hi.v, 'w')} on ${E.day(s25.hi.date)} then ${E.d(s25.lo.v, 'w')} on ${E.day(s25.lo.date)}, and ${E.d(s26.hi.v, 'w')} on ${E.day(s26.hi.date)} then ${E.d(s26.lo.v, 'w')} on ${E.day(s26.lo.date)}. The drop lines up with the opening of a new IEC season, when the files being decided change.` },
      { q: 'How long do I have to send my IEC work permit application after an invitation?', a: 'IRCC gives 10 days to accept or decline an invitation to apply, then 20 days after accepting to submit the work permit application with its documents and fee. Biometrics are requested after submission. The published processing time starts only once that complete application has been received.' },
    ],
    body: (h) => `
<h2>One figure for every IEC category</h2>
<p>IRCC does not split this line by country or by category. Whether you come as a working holiday participant with an open work permit, as a young professional with a job offer, or as an international co-op student with an internship, the published time is the same ${h.t(r.t)}. Differences between countries show up earlier, in the pool: a country with many candidates and few places means a longer wait for an invitation, not a slower decision once the application is in.</p>
<p>The steps are fixed. You create a profile, enter the pool for one or more categories, wait for an invitation, accept it, and submit the work permit application online. IRCC then asks for biometrics if yours are not on file, and may ask for a medical exam or police certificates. A positive decision is a port of entry letter of introduction; the work permit itself is issued by a border officer when you arrive in Canada.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'iec', m: 'none' }, t: 'Your IEC application: estimated decision date' })}
<h2>The yearly cycle</h2>
<p>Few lines in IRCC’s files follow the calendar as closely as this one. Each winter the time climbs, then drops in a few weeks. The table compares, for each season we cover, the highest reading in December and January with the lowest in February and March.</p>
${h.table(['Season', 'Winter high', 'February to March low'], seasons.map((x) => [String(x.y), `${h.d(x.hi.v, 'w')} (${h.day(x.hi.date)})`, `${h.d(x.lo.v, 'w')} (${h.day(x.lo.date)})`]), 'International Experience Canada, IRCC past processing time, readings from our archive.', ['l', 'r', 'r'])}
<p>The likely reason is the change of season: invitations for a new year start going out, and a large batch of fresh, simple files gets decided quickly, which pulls the 80th percentile down. Through spring and summer the figure creeps back up. If you can choose when to submit, the readings suggest that the weeks right after the season opens have had the shortest published times, though nothing guarantees the pattern repeats.</p>
<h2>Building your own timeline</h2>
<p>Put the steps end to end. After an invitation you have up to 10 days to accept and 20 more to submit, so many candidates send the application within a month of being invited. Add the published time of ${h.t(r.t)}, then the biometrics appointment if one is needed, and the date of the letter of introduction comes into view. The letter is valid for a set period, and you must enter Canada before it expires to have the permit issued. For a working holiday that starts in a specific month, count backwards from the date you want to land, and keep a margin: one in five files takes longer than the published figure, and a request for police certificates from several countries can add weeks on its own.</p>
<h2>Every reading since the end of 2023</h2>
<p>This line comes from IRCC’s file of times not split by country, which we read weekly. The table keeps the eleven latest readings and the oldest one; the full list of ${h.n(N)} readings is on the ${h.a('history', 'history page')}.</p>
${h.hist(S, { max: 12, unit: 'w' })}
<h2>After the IEC permit</h2>
<p>An IEC permit is usually open or tied to one employer for a fixed period, and most participants cannot extend it beyond the term set by their country’s agreement. Those who want to stay longer move to another permit, such as an employer-specific permit, whose times are on the ${h.a('work-permit', 'work permit page')} and the ${h.a('work-permit-extension', 'work permit extension page')}. France is one of the partner countries of the program; the other Canadian processing times for French residents are gathered on the ${h.a('france', 'France page')}.</p>
`,
  },
  fr: {
    slug: 'delai-eic-pvt',
    nav: 'EIC (PVT)', card: 'Semaines après l’invitation, cycle annuel depuis 2023',
    title: 'Délai EIC et PVT Canada, relevés hebdomadaires 2026',
    description: 'Délai d’Expérience internationale Canada (PVT, jeunes pros, stage) en 2026 : semaines publiées par IRCC, pic d’hiver et relevés hebdomadaires depuis 2023.',
    h1: 'Délai EIC : PVT, jeunes professionnels et stage coop',
    intro: `Le chiffre d’IRCC pour les permis d’Expérience internationale Canada, daté du ${F.day(r.date)}, est de ${K.fmtTime(r.t, 'fr')}.`,
    resume: `Une demande de permis de travail Expérience internationale Canada (EIC) prend en ce moment ${K.fmtTime(r.t, 'fr')}, d’après le chiffre publié par IRCC le ${F.day(r.date)}. Ce délai est commun aux trois catégories, Permis vacances-travail (PVT), Jeunes professionnels et Stage coop international, et à tous les pays partenaires. Il ne couvre que la dernière étape : la demande de permis envoyée après l’invitation tirée d’un bassin, comptée dès sa réception complète par IRCC, sans le rendez-vous de biométrie. L’attente dans le bassin avant l’invitation n’est pas comprise et peut être bien plus longue. Notre archive compte ${F.n(N)} relevés hebdomadaires depuis le ${F.day(tr.firstDate!)}. Sur cette période, le chiffre est allé de ${F.d(tr.min, 'w')} le ${F.day(tr.minDate)} à ${F.d(tr.max, 'w')} le ${F.day(tr.maxDate)}, pour une moyenne d’environ ${F.n(avgW)} semaines. ${ago ? `Il y a un an, le ${F.day(ago.date)}, il était de ${F.d(ago.v, 'w')}.` : ''} La ligne suit un cycle annuel net : hausse au tournant de l’année, puis forte baisse en février. L’outil ajoute le délai actuel à votre date d’envoi.`,
    faqs: [
      { q: 'Le délai du PVT compte-t-il l’attente de l’invitation ?', a: 'Non. Le chiffre d’IRCC démarre à la réception de la demande de permis de travail, que l’on ne peut envoyer qu’après une invitation tirée du bassin. Le temps passé dans le bassin dépend du nombre de places pour votre pays et votre catégorie et du nombre de candidats, et IRCC ne publie aucun délai pour cette étape.' },
      { q: 'Pourquoi le délai EIC chute-t-il chaque mois de février ?', a: `Dans nos relevés, le chiffre culmine en hiver puis baisse en février : ${F.d(s25.hi.v, 'w')} le ${F.day(s25.hi.date)} puis ${F.d(s25.lo.v, 'w')} le ${F.day(s25.lo.date)}, et ${F.d(s26.hi.v, 'w')} le ${F.day(s26.hi.date)} puis ${F.d(s26.lo.v, 'w')} le ${F.day(s26.lo.date)}. La baisse coïncide avec l’ouverture d’une nouvelle saison EIC, quand les dossiers tranchés changent.` },
      { q: 'Combien de temps pour envoyer ma demande de permis EIC après l’invitation ?', a: 'IRCC laisse 10 jours pour accepter ou refuser l’invitation à présenter une demande, puis 20 jours après l’acceptation pour envoyer la demande de permis avec ses documents et les frais. La biométrie est demandée après l’envoi. Le délai publié ne démarre qu’à la réception de cette demande complète.' },
    ],
    body: (h) => `
<h2>Un seul chiffre pour toutes les catégories</h2>
<p>IRCC ne découpe cette ligne ni par pays ni par catégorie. Que vous partiez en PVT avec un permis ouvert, comme jeune professionnel avec une offre d’emploi ou en stage coop international, le délai publié est le même : ${h.t(r.t)}. Les écarts entre pays se jouent plus tôt, dans le bassin : un pays qui a beaucoup de candidats et peu de places attend plus longtemps son invitation, mais la décision n’est pas plus lente une fois la demande envoyée.</p>
<p>Le parcours est toujours le même : créer un profil, entrer dans le bassin d’une ou plusieurs catégories, attendre l’invitation, l’accepter, puis déposer la demande de permis en ligne. IRCC demande ensuite la biométrie si elle n’est pas déjà au dossier, et parfois un examen médical ou des certificats de police. Une réponse positive prend la forme d’une lettre d’introduction ; le permis lui-même est délivré par l’agent des services frontaliers à l’arrivée au Canada.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'iec', m: 'none' }, t: 'Votre demande EIC : date de décision estimée' })}
<h2>Le cycle de chaque année</h2>
<p>Peu de lignes des fichiers d’IRCC suivent autant le calendrier. Chaque hiver, le délai monte, puis retombe en quelques semaines. Le tableau compare, pour chaque saison couverte, le relevé le plus haut de décembre et janvier au plus bas de février et mars.</p>
${h.table(['Saison', 'Sommet d’hiver', 'Creux de février à mars'], seasons.map((x) => [String(x.y), `${h.d(x.hi.v, 'w')} (${h.day(x.hi.date)})`, `${h.d(x.lo.v, 'w')} (${h.day(x.lo.date)})`]), 'Expérience internationale Canada, délai passé d’IRCC, relevés de notre archive.', ['l', 'r', 'r'])}
<p>L’explication la plus probable est le changement de saison : les invitations de la nouvelle année partent, et un grand lot de dossiers récents et simples est tranché vite, ce qui fait baisser le seuil des 80 %. Le chiffre remonte ensuite peu à peu au printemps et en été. Si vous pouvez choisir votre moment, les relevés montrent que les semaines qui suivent l’ouverture de la saison ont eu les délais publiés les plus courts, sans garantie que le schéma se répète.</p>
<h2>Construire son propre calendrier</h2>
<p>Mettez les étapes bout à bout. Après l’invitation, vous avez jusqu’à 10 jours pour accepter et 20 de plus pour déposer : beaucoup de candidats envoient donc leur demande dans le mois qui suit l’invitation. Ajoutez le délai publié de ${h.t(r.t)}, puis le rendez-vous de biométrie s’il est demandé, et la date de la lettre d’introduction se dessine. Cette lettre est valable pour une durée limitée, et il faut entrer au Canada avant son expiration pour obtenir le permis. Pour un PVT qui doit commencer à un mois précis, partez de la date d’arrivée voulue et remontez le calendrier, avec une marge : une demande sur cinq dépasse le délai publié, et des certificats de police de plusieurs pays peuvent à eux seuls ajouter des semaines.</p>
<h2>Tous les relevés depuis fin 2023</h2>
<p>Cette ligne vient du fichier d’IRCC des délais sans pays, que nous lisons chaque semaine. Le tableau garde les onze derniers relevés et le plus ancien ; la liste complète des ${h.n(N)} relevés est sur la ${h.a('history', 'page de l’historique')}.</p>
${h.hist(S, { max: 12, unit: 'w' })}
<h2>Après le permis EIC</h2>
<p>Un permis EIC est ouvert ou lié à un employeur pour une durée fixée par l’accord avec votre pays, et la plupart des participants ne peuvent pas le prolonger au-delà. Pour rester plus longtemps, il faut passer à un autre permis, par exemple un permis lié à un employeur, dont les délais sont sur la ${h.a('work-permit', 'page du permis de travail')} et la ${h.a('work-permit-extension', 'page de la prolongation du permis de travail')}. La France fait partie des pays partenaires du programme ; les autres délais canadiens des résidents français sont réunis sur la ${h.a('france', 'page de la France')}.</p>
`,
  },
});
