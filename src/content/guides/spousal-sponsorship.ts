import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Parrainage de l'époux ou du conjoint : quatre lignes du fichier prospectif d'IRCC (au Canada ou à l'étranger,
   Québec ou reste du Canada), leur file par mois de dépôt et l'historique daté depuis octobre 2025. */
const LINES = ['spousal-in-roc', 'spousal-in-qc', 'spousal-out-roc', 'spousal-out-qc'] as const;
type Line = (typeof LINES)[number];
const R = Object.fromEntries(LINES.map((p) => [p, K.readingOf(p)])) as Record<Line, ReturnType<typeof K.readingOf>>;
const TR = (p: Line) => K.fullTrend(R[p].series)!;
const D = K.L.dates.flpt;
const F0 = K.firstReading('flpt')!;
const tm = (p: Line, l: Lang) => K.fmtTime(R[p].t, l);
const w = (p: Line, l: Lang) => K.num(R[p].waiting ?? 0, l);
const mo = (days: number, l: Lang) => K.fmtDays(days, 'm', l);
const Q = R['spousal-out-roc'].queue!;
const keyAt = (back: number) => Q[Q.length - 1 - back][0];
const rowOf = (p: Line, key: string) => R[p].queue!.find((x) => x[0] === key);
const left = (p: Line, key: string, l: Lang) => {
  const r = rowOf(p, key); if (!r) return '';
  if (r[1] === 'late') return l === 'fr' ? 'délai prévu dépassé' : 'past the expected time';
  return typeof r[1] === 'number' ? `${K.num(r[1], l)} ${l === 'fr' ? 'mois' : r[1] === 1 ? 'month' : 'months'}` : '';
};
const lateCount = (p: Line) => R[p].queue!.filter((x) => x[1] === 'late').length;
const y1 = keyAt(12);
const y1row = rowOf('spousal-out-roc', y1)!;
const y1in = rowOf('spousal-in-roc', y1)!;
const my = (key: string, l: Lang) => K.monthYear(`${key}-15`, l);
const inR = TR('spousal-in-roc'), outR = TR('spousal-out-roc'), inQ = TR('spousal-in-qc'), outQ = TR('spousal-out-qc');

function lines(h: Helpers) {
  return LINES.map((p) => { const t = TR(p); return [K.progName(p, h.lang), h.t(R[p].t), h.n(R[p].waiting ?? 0), t.firstDate ? `${h.d(t.first!, 'm')} (${h.day(t.firstDate)})` : '', `${h.d(t.max, 'm')} (${h.day(t.maxDate)})`]; });
}
function queue(h: Helpers) {
  return [0, 6, 12, 18, 24].map((b) => keyAt(b)).map((k) => [my(k, h.lang), ...LINES.map((p) => left(p, k, h.lang))]);
}

export default defineGuide({
  id: 'spousal-sponsorship', group: 'family', order: 50,
  tool: 'delai', toolArg: { g: 'spousal-in-roc', only: 'spousal-in-roc,spousal-in-qc,spousal-out-roc,spousal-out-qc' },
  related: ['dependent-child', 'parents-grandparents', 'work-permit', 'beyond-processing-time', 'method'],
  sources: ['ptimes-flpt', 'spouse', 'ptimes', 'check-status', 'wayback'],
  en: {
    slug: 'spousal-sponsorship-processing-time',
    nav: 'Spousal sponsorship', card: 'Inland, outland, Quebec: four times and the queue by month',
    title: 'Spousal Sponsorship Processing Time, Inland and Outland 2026',
    description: 'Spousal sponsorship processing time in 2026: inland and outland, Quebec and the rest of Canada, the queue by month of filing and the trend since October 2025.',
    h1: 'Spousal and partner sponsorship: the four published times',
    intro: `IRCC’s file dated ${K.en.day(D)} gives ${tm('spousal-out-roc', 'en')} for a spouse abroad and ${tm('spousal-in-roc', 'en')} for a spouse already in Canada, outside Quebec.`,
    resume: `Sponsoring a spouse, common-law or conjugal partner currently takes ${tm('spousal-out-roc', 'en')} when the partner lives outside Canada and ${tm('spousal-in-roc', 'en')} when the couple lives together in Canada, for sponsors outside Quebec, according to the times IRCC published on ${K.en.day(D)}. For a sponsor in Quebec the figures are ${tm('spousal-out-qc', 'en')} for a partner abroad and ${tm('spousal-in-qc', 'en')} inside Canada. These are forward-looking times: IRCC’s estimate for an application it would receive today, based on the files already waiting. About ${w('spousal-in-roc', 'en')} inland and ${w('spousal-out-roc', 'en')} outland applications were in line outside Quebec on that date. If you already applied, the queue IRCC publishes by month of filing is more precise than the headline figure: for a file sent in ${my(y1, 'en')} to a partner abroad, IRCC expects ${y1row[1] === 'late' ? 'it to be past the expected time' : `${K.num(y1row[1] as number, 'en')} more months`}. The tool above reads that queue for your month and shows how each line has moved since October 2025.`,
    faqs: [
      { q: 'Is outland spousal sponsorship faster than inland in 2026?', a: `Outside Quebec, yes at the moment. IRCC expects ${tm('spousal-out-roc', 'en')} for a partner living abroad against ${tm('spousal-in-roc', 'en')} for a couple in Canada (${K.en.day(D)}). The gap has narrowed: the outland line was ${mo(outR.first!, 'en')} in ${K.en.my(outR.firstDate!)} and has risen since, while the inland line went from ${mo(inR.first!, 'en')} to ${mo(inR.last, 'en')}.` },
      { q: 'Why is spousal sponsorship slower for a sponsor living in Quebec?', a: `A Quebec sponsor goes through two governments: IRCC checks the sponsor and the relationship, and the sponsor also signs an undertaking with the Quebec government before IRCC finishes the permanent residence file. The extra step shows in the figures: ${tm('spousal-in-qc', 'en')} inland and ${tm('spousal-out-qc', 'en')} outland in Quebec, against ${tm('spousal-in-roc', 'en')} and ${tm('spousal-out-roc', 'en')} elsewhere.` },
      { q: 'What does “people ahead” mean in the spousal sponsorship queue?', a: `For each month of filing, IRCC publishes how many applications are ahead of one received in that month and how long it expects the file to take from now. For an outland file sent in ${my(y1, 'en')}, the figure was ${K.fmtAhead(y1row[2], 'en')} people ahead on ${K.en.day(D)}. A larger number means more files that IRCC plans to finish before yours.` },
      { q: 'Can my spouse work while an inland sponsorship is being processed?', a: 'Many spouses in Canada can apply for an open work permit while the sponsorship is in process, under conditions IRCC sets and changes from time to time. That permit has its own processing time, separate from the permanent residence file. Check the current eligibility on IRCC’s spouse sponsorship pages before applying, as the rules for open work permits have been revised several times.' },
    ],
    body: (h) => `
<h2>Four lines, four different times</h2>
<p>IRCC splits spousal and partner sponsorship into four lines, depending on where the couple lives and whether the sponsor lives in Quebec. The table gives the time published on ${h.day(D)}, the number of applications waiting, the first figure in our archive and the highest figure recorded since then.</p>
${h.table(['Line', 'Time now', 'Applications waiting', 'First reading', 'Highest'], lines(h), `Spousal and partner sponsorship, IRCC forward-looking times of ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The four lines do not move together. Outside Quebec, the inland line rose from ${h.d(inR.first!, 'm')} in ${h.my(inR.firstDate!)} to a high of ${h.d(inR.max, 'm')} on ${h.day(inR.maxDate)}, and stands at ${h.d(inR.last, 'm')} now. The outland line climbed from ${h.d(outR.first!, 'm')} to ${h.d(outR.last, 'm')}, while the number of outland files waiting grew to ${h.n(R['spousal-out-roc'].waiting ?? 0)}. In Quebec both lines went the other way: ${h.d(inQ.first!, 'm')} to ${h.d(inQ.last, 'm')} inland and ${h.d(outQ.first!, 'm')} to ${h.d(outQ.last, 'm')} outland over the same period.</p>
<h2>Inland or outland: what really changes</h2>
<p>The two classes lead to the same result, permanent residence for the sponsored partner. The inland class is for couples who live together in Canada, where the partner usually holds or held a temporary status. The outland class covers partners who live abroad, and partners in Canada who choose it, for example because they may need to travel during processing. An outland applicant can visit or leave Canada while the file moves; an inland applicant who leaves risks the application if they cannot come back.</p>
<p>Speed has favoured one class or the other at different times, so the choice is rarely made on time alone. Today the outland line outside Quebec is shorter by ${h.d((K.daysOf(R['spousal-in-roc'].t) ?? 0) - (K.daysOf(R['spousal-out-roc'].t) ?? 0), 'm')}, but it is also the line where the backlog has grown fastest. A figure that keeps rising each month is a sign that the gap may close.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'spousal-out-roc', m: y1 }, t: 'Your sponsorship: where your month of filing stands' })}
<h2>The queue by month of filing</h2>
<p>Besides the headline figure, IRCC publishes a queue: for each month in which applications were received, the time it expects is left and the number of people ahead. This is the most useful reading for anyone who has already applied. The table shows a few months for each line, as of ${h.day(D)}.</p>
${h.table(['Month filed', 'Inland, outside Quebec', 'Inland, Quebec', 'Outland, outside Quebec', 'Outland, Quebec'], queue(h), `Time left by month of filing, IRCC queue published ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Two details stand out. First, the oldest months are marked as past the expected time: ${h.n(lateCount('spousal-out-roc'))} of the ${h.n(Q.length)} months listed for the outland line outside Quebec, and ${h.n(lateCount('spousal-in-roc'))} for the inland line. Files from those months that are still open have gone beyond what IRCC planned, often because of a missing document, a security check or a medical exam. Second, a file sent in ${h.my(y1)} to a partner in Canada had ${y1in[1] === 'late' ? 'already passed the expected time' : `${h.n(y1in[1] as number)} months left`}, with ${K.fmtAhead(y1in[2], 'en')} people ahead.</p>
<h2>How the outland line has moved</h2>
<p>IRCC has published forward-looking times for permanent residence since well before our archive starts, but the copies we could recover and date begin on ${h.day(F0)}. The table lists every reading for the outland line outside Quebec, each with the copy it was taken from. There is no earlier point, and none is estimated.</p>
${h.hist(R['spousal-out-roc'].series, { max: 12, unit: 'm' })}
<h2>What the published time leaves out</h2>
<p>The forward-looking time counts from the day IRCC receives a complete application. It does not include the time to collect police certificates, to book a medical exam or to answer a request for documents. If IRCC asks for an interview or for proof of the relationship, the file waits for you. For a Quebec sponsor, the undertaking step with the Quebec government is part of the published figure, but delays on that side still lengthen the total. When your own date is clearly beyond the queue figure, the ${h.a('beyond-processing-time', 'steps for a file past the processing time')} explain what you can ask. How we read and date each figure is set out on the ${h.a('method', 'method page')}.</p>
<p>Children who are sponsored at the same time as the partner are included in the same application. A child sponsored alone, without the partner, follows the ${h.a('dependent-child', 'dependent child line')}, which IRCC publishes by country. Parents and grandparents have a separate program with its own invitation round, described on the ${h.a('parents-grandparents', 'parents and grandparents page')}. IRCC’s ${h.src('spouse', 'spouse and partner sponsorship pages')} set out who can sponsor and what proof of the relationship is needed.</p>
`,
  },
  fr: {
    slug: 'delai-parrainage-epoux',
    nav: 'Parrainage de l’époux', card: 'Au Canada, à l’étranger, Québec : quatre délais et la file par mois',
    title: 'Délai du parrainage de l’époux, Canada ou étranger 2026',
    description: 'Délai du parrainage d’un époux ou conjoint en 2026 : au Canada ou à l’étranger, Québec ou reste du Canada, file par mois de dépôt, tendance depuis octobre 2025.',
    h1: 'Parrainer son époux ou conjoint : les quatre délais publiés',
    intro: `Le fichier d’IRCC daté du ${K.fr.day(D)} prévoit ${tm('spousal-out-qc', 'fr')} pour un conjoint à l’étranger parrainé depuis le Québec, et ${tm('spousal-out-roc', 'fr')} ailleurs au Canada.`,
    resume: `Parrainer un époux, un conjoint de fait ou un partenaire conjugal prend aujourd’hui ${tm('spousal-in-qc', 'fr')} quand le couple vit au Québec et ${tm('spousal-out-qc', 'fr')} quand le répondant vit au Québec et le conjoint à l’étranger, selon les délais publiés par IRCC le ${K.fr.day(D)}. Hors Québec, les chiffres sont de ${tm('spousal-in-roc', 'fr')} pour un couple au Canada et de ${tm('spousal-out-roc', 'fr')} pour un conjoint à l’étranger. Ce sont des délais prospectifs : l’estimation d’IRCC pour une demande reçue aujourd’hui, établie à partir des dossiers déjà en attente. Environ ${w('spousal-in-qc', 'fr')} demandes au Canada et ${w('spousal-out-qc', 'fr')} demandes de l’étranger attendaient côté Québec à cette date. Si votre demande est déjà partie, la file qu’IRCC publie par mois de dépôt est plus précise que le chiffre global : pour un dossier envoyé en ${my(y1, 'fr')}, IRCC prévoit encore ${left('spousal-out-qc', y1, 'fr')} pour un conjoint à l’étranger parrainé du Québec. L’outil ci-dessus lit cette file pour votre mois et montre l’évolution de chaque ligne depuis octobre 2025.`,
    faqs: [
      { q: 'Le parrainage de l’époux est-il plus long quand le répondant vit au Québec ?', a: `Oui. Au ${K.fr.day(D)}, IRCC prévoit ${tm('spousal-in-qc', 'fr')} pour un couple au Québec contre ${tm('spousal-in-roc', 'fr')} ailleurs au Canada, et ${tm('spousal-out-qc', 'fr')} contre ${tm('spousal-out-roc', 'fr')} pour un conjoint à l’étranger. Le répondant québécois signe un engagement auprès du gouvernement du Québec, une étape qui s’ajoute à l’examen fédéral.` },
      { q: 'Faut-il choisir le parrainage au Canada ou à l’étranger pour aller plus vite ?', a: `Hors Québec, la ligne de l’étranger est en ce moment la plus courte (${tm('spousal-out-roc', 'fr')} contre ${tm('spousal-in-roc', 'fr')}), mais c’est aussi celle dont l’arriéré grossit le plus vite. Le choix tient surtout à la situation du couple : le conjoint parrainé de l’étranger peut voyager pendant le traitement, ce qui est risqué dans la catégorie du Canada.` },
      { q: 'Que veut dire « personnes devant » dans la file du parrainage de l’époux ?', a: `Pour chaque mois de dépôt, IRCC publie le nombre de demandes placées devant une demande reçue ce mois-là et le temps qu’il prévoit encore. Pour un dossier du Québec envoyé en ${my(y1, 'fr')} pour un conjoint à l’étranger, ce chiffre était de ${K.fmtAhead(rowOf('spousal-out-qc', y1)![2], 'fr')} personnes au ${K.fr.day(D)}.` },
      { q: 'Le délai du parrainage de l’époux comprend-il l’examen médical ?', a: 'Le délai prospectif part de la réception d’une demande complète. Si l’examen médical, les certificats de police ou la biométrie arrivent plus tard, ou si IRCC demande des preuves de la relation, le dossier attend votre réponse et le temps total s’allonge d’autant. Préparez ces pièces tôt pour ne pas ajouter de pause au délai publié.' },
    ],
    body: (h) => `
<h2>Quatre lignes, quatre délais</h2>
<p>IRCC sépare le parrainage d’un époux ou d’un conjoint en quatre lignes, selon le lieu de vie du couple et selon que le répondant habite au Québec ou non. Le tableau donne le délai publié le ${h.day(D)}, le nombre de demandes en attente, le premier chiffre de notre archive et le plus haut relevé depuis.</p>
${h.table(['Ligne', 'Délai actuel', 'Demandes en attente', 'Premier relevé', 'Plus haut'], lines(h), `Parrainage d’un époux ou conjoint, délais prospectifs d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Les lignes québécoises ont reculé depuis l’automne 2025 : de ${h.d(inQ.first!, 'm')} à ${h.d(inQ.last, 'm')} pour un couple au Québec, et de ${h.d(outQ.first!, 'm')} à ${h.d(outQ.last, 'm')} pour un conjoint à l’étranger. Hors Québec, c’est l’inverse. La ligne du Canada a atteint ${h.d(inR.max, 'm')} le ${h.day(inR.maxDate)} avant de revenir à ${h.d(inR.last, 'm')}, et celle de l’étranger est passée de ${h.d(outR.first!, 'm')} à ${h.d(outR.last, 'm')}, avec ${h.n(R['spousal-out-roc'].waiting ?? 0)} demandes en file.</p>
<h2>Pourquoi le Québec reste plus long</h2>
<p>Au Québec, le parrainage passe par deux administrations. IRCC vérifie d’abord que le répondant est admissible. Le répondant signe ensuite un engagement auprès du gouvernement du Québec, qui doit l’accepter avant qu’IRCC termine la demande de résidence permanente du conjoint. Le délai publié couvre l’ensemble du parcours, et l’étape québécoise explique une bonne part de l’écart avec le reste du Canada.</p>
<p>L’écart s’est pourtant réduit. En octobre 2025, la ligne du Québec pour un couple au Canada dépassait celle du reste du pays de ${h.d(inQ.first! - inR.first!, 'm')} ; aujourd’hui l’écart est de ${h.d(inQ.last - inR.last, 'm')}. Moins de demandes attendent au Québec, ${h.n(R['spousal-in-qc'].waiting ?? 0)} pour les couples au Canada, ce qui laisse moins de dossiers à écouler avant le vôtre.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'spousal-in-qc', m: y1 }, t: 'Votre parrainage : où en est votre mois de dépôt' })}
<h2>La file selon le mois de dépôt</h2>
<p>En plus du chiffre global, IRCC publie une file : pour chaque mois de réception des demandes, le temps qu’il prévoit encore et le nombre de personnes devant. C’est la lecture la plus utile quand la demande est déjà envoyée. Le tableau reprend quelques mois pour chaque ligne, au ${h.day(D)}.</p>
${h.table(['Mois de dépôt', 'Au Canada, hors Québec', 'Au Canada, Québec', 'Étranger, hors Québec', 'Étranger, Québec'], queue(h), `Temps restant selon le mois de dépôt, file publiée par IRCC le ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Les mois les plus anciens sont marqués « délai prévu dépassé » : ${h.n(lateCount('spousal-out-roc'))} des ${h.n(Q.length)} mois listés pour la ligne de l’étranger hors Québec, contre ${h.n(lateCount('spousal-in-qc'))} pour un couple au Québec. Un dossier encore ouvert dans ces mois-là a dépassé ce qu’IRCC prévoyait, souvent à cause d’une pièce manquante, d’une vérification de sécurité ou d’un examen médical en retard.</p>
<h2>L’évolution de la ligne québécoise</h2>
<p>Les copies datées que nous avons pu retrouver du fichier prospectif commencent le ${h.day(F0)} ; il n’existe aucun point plus ancien dans notre archive et aucun n’est estimé. Le tableau donne chaque relevé de la ligne du Québec pour un couple au Canada, avec la copie d’où il vient.</p>
${h.hist(R['spousal-in-qc'].series, { max: 12, unit: 'm' })}
<h2>Ce que le délai ne compte pas</h2>
<p>Le délai court à partir de la réception d’une demande complète. Le temps de réunir les certificats de police, de passer l’examen médical ou de répondre à une demande de documents vient en plus. Si IRCC convoque le couple à une entrevue, le dossier attend la date fixée. Quand votre date dépasse nettement celle de la file, les ${h.a('beyond-processing-time', 'démarches pour une demande hors délai')} indiquent quoi demander, et la ${h.a('method', 'page de méthode')} explique comment chaque chiffre est relevé et daté.</p>
<p>Les enfants parrainés avec le conjoint font partie de la même demande. Un enfant parrainé seul suit la ${h.a('dependent-child', 'ligne de l’enfant à charge')}, publiée par pays. Les parents et grands-parents relèvent d’un autre programme, décrit sur la ${h.a('parents-grandparents', 'page des parents et grands-parents')}. Les ${h.src('spouse', 'pages d’IRCC sur le parrainage d’un époux ou conjoint')} précisent qui peut parrainer et quelles preuves de la relation fournir.</p>
`,
  },
});
