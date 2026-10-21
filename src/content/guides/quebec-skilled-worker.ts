import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Travailleurs qualifiés sélectionnés par le Québec : étape fédérale seulement, chiffres du fichier prospectif. */
const P = 'qsw';
const r = K.readingOf(P);
const q = r.queue ?? [];
const tr = K.fullTrend(r.series)!;
const steady = tr.min === tr.max;
const late = q.filter((x) => x[1] === 'late');
const open = q.filter((x) => typeof x[1] === 'number');
const firstOpen = open[0];
const lastRow = q[q.length - 1];
const qb = K.L.flpt['quebec-business'];
const fsw = K.readingOf('fsw');
const D = r.date;
const E = K.en, F = K.fr;
const mo = (n: number, l: Lang) => `${K.num(n, l)} ${K.unitWord(n, 'm', l)}`;
const ym = (k: string, l: Lang) => K.monthYear(`${k}-15`, l);
const lateSpan = (l: Lang) => (late.length ? `${ym(late[0][0], l)} ${l === 'fr' ? 'à' : 'to'} ${ym(late[late.length - 1][0], l)}` : '');

function queueRows(h: Helpers, l: Lang) {
  const pick = open.filter((_, i) => i % 2 === 0 || i === open.length - 1);
  return pick.map((x) => [h.my(`${x[0]}-15`), typeof x[1] === 'number' ? mo(x[1], l) : '', K.fmtAhead(x[2], l)]);
}

export default defineGuide({
  id: 'quebec-skilled-worker', group: 'pr', order: 44,
  tool: 'delai', toolArg: { g: 'qsw' },
  related: ['express-entry', 'pnp', 'spousal-sponsorship', 'method', 'history', 'citizenship'],
  sources: ['ptimes-flpt', 'qsw', 'check-status'],
  en: {
    slug: 'quebec-skilled-worker-processing-time',
    nav: 'Quebec skilled worker', card: 'Federal stage after the CSQ, queue by month filed',
    title: 'Quebec Skilled Worker PR Processing Time, Federal Stage 2026',
    description: 'Quebec skilled worker permanent residence in 2026: IRCC’s expected time for the federal stage after the CSQ, the queue by month filed, readings since 2025.',
    h1: 'Quebec skilled worker: the federal permanent residence stage',
    intro: `IRCC’s forward-looking time for Quebec-selected skilled workers, dated ${E.day(D)}, is ${K.fmtTime(r.t, 'en')}, with ${K.fmtAhead(r.waiting ?? 0, 'en')} applications waiting.`,
    resume: `Once Quebec has issued its selection certificate (the CSQ), the permanent residence application sent to IRCC currently takes ${K.fmtTime(r.t, 'en')}, according to the forward-looking time IRCC published on ${E.day(D)}. That figure covers only the federal stage: medical exam, criminal and security checks and the final decision. The time spent getting selected by Quebec comes before it and is not counted. IRCC reports ${K.fmtAhead(r.waiting ?? 0, 'en')} applications waiting in this line. Its queue table gives a separate answer for each month of filing: a file received in ${ym(lastRow[0], 'en')} has ${typeof lastRow[1] === 'number' ? mo(lastRow[1], 'en') : 'an unknown time'} left, while every month from ${lateSpan('en')} is marked as past the expected time. ${steady ? `The headline figure has not changed in any of the ${E.n(tr.n)} monthly readings we hold since ${E.day(tr.firstDate ?? tr.lastDate)}.` : `It ranged from ${E.d(tr.min, 'm')} to ${E.d(tr.max, 'm')} across the ${E.n(tr.n)} readings we hold since ${E.day(tr.firstDate ?? tr.lastDate)}.`} The tool above reads your month of filing against that queue.`,
    faqs: [
      { q: 'Does the Quebec skilled worker processing time include getting the CSQ?', a: `No. The ${K.fmtTime(r.t, 'en')} published by IRCC on ${E.day(D)} starts when IRCC receives the permanent residence application, which you can only send once Quebec has selected you. Quebec’s own selection step has its own timing, set by the Quebec immigration ministry, and IRCC does not publish it.` },
      { q: 'Why is the Quebec skilled worker line slower than Express Entry?', a: `Quebec runs its own selection and is not part of Express Entry, so its files sit in a separate federal queue with its own staff and annual targets. On ${E.day(D)}, IRCC expected ${K.fmtTime(r.t, 'en')} for this line against ${K.fmtTime(fsw.t, 'en')} for the Federal Skilled Worker program inside Express Entry.` },
      { q: 'My Quebec skilled worker file is marked past the expected time. What now?', a: `IRCC labels the oldest filing months in its queue as past the expected time; ${E.n(late.length)} months carry that label in the ${E.day(D)} table. It means IRCC expected to have finished them. Check your online account for requests first, then use IRCC’s web form to ask about the file.` },
    ],
    body: (h) => `
<h2>Two governments, two stages</h2>
<p>Quebec chooses its own economic immigrants. A skilled worker first applies to Quebec, which assesses the file under its own rules and, if it accepts the person, issues a Certificat de sélection du Québec, the CSQ. Only then does the person send a permanent residence application to IRCC. Ottawa does not reassess the selection; it checks admissibility: health, criminality, security, and whether the documents match what Quebec approved. This page covers that second stage, because it is the only one IRCC publishes a time for. The official steps are on ${h.src('qsw', 'IRCC’s page for Quebec-selected skilled workers')}.</p>
<p>The figure IRCC gives for this stage is a forward-looking time: its own estimate for a complete application received today, explained on our ${h.a('method', 'method page')}. It was ${h.t(r.t)} on ${h.day(D)}.</p>
<h2>Where your month of filing stands</h2>
<p>The headline figure answers only one question: how long a new application would take. If you already applied, the queue table published in the same file is more useful. For each month of filing, IRCC states how much time it expects is left and roughly how many people are ahead. In the ${h.day(D)} file, the months from ${lateSpan(h.lang)} are all marked as past the expected time. From ${h.my(`${firstOpen[0]}-15`)} onward, each month has a number, starting at ${typeof firstOpen[1] === 'number' ? mo(firstOpen[1], 'en') : ''} and rising with each later month.</p>
${h.table(['Month filed', 'Time left', 'People ahead'], queueRows(h, 'en'), `Quebec-selected skilled workers, queue published by IRCC on ${h.day(D)} (every second month shown, latest included).`, ['l', 'r', 'r'])}
<p>The count of people ahead grows with the filing month, from ${K.fmtAhead(firstOpen[2], 'en')} for ${h.my(`${firstOpen[0]}-15`)} to ${K.fmtAhead(lastRow[2], 'en')} for ${h.my(`${lastRow[0]}-15`)}. That number includes everyone filed before you who is still waiting, which is why a recent file sees nearly the whole line in front of it.</p>
${h.mini('delai', { p: ['m'], d: { g: 'qsw', m: firstOpen[0] }, t: 'Your Quebec skilled worker file: time left' })}
<h2>A figure that has barely moved</h2>
<p>${steady ? `Every monthly copy we hold, from ${h.day(tr.firstDate ?? tr.lastDate)} to ${h.day(tr.lastDate)}, shows the same ${h.d(tr.last, 'm')}.` : `Our copies since ${h.day(tr.firstDate ?? tr.lastDate)} range from ${h.d(tr.min, 'm')} to ${h.d(tr.max, 'm')}.`} IRCC started publishing forward-looking times for permanent residence in this format in October 2025, so the series begins there; nothing older is shown, and no month is filled in where no copy exists. The ${h.a('history', 'history page')} lists every copy with its capture date.</p>
${h.hist(r.series, { max: 12, unit: 'm' })}
<p>A stable headline does not mean a stable queue. The waiting count stood at ${K.fmtAhead(r.waiting ?? 0, 'en')} on ${h.day(D)}. When more CSQ holders apply in a year than IRCC plans to admit from Quebec, the later months stretch even while the headline stays put.</p>
<h2>How it compares with other Quebec lines</h2>
<p>Quebec’s business immigrants (investors, entrepreneurs and self-employed people selected by Quebec) are in a separate line. IRCC’s figure for them was ${h.t(qb?.cur)} on the same date, with ${K.fmtAhead(qb?.waiting ?? 0, 'en')} applications waiting, so skilled workers move much faster. Outside Quebec, the closest equivalents are the ${h.a('express-entry', 'Express Entry programs')} and the ${h.a('pnp', 'provincial nominee streams')}; a CSQ holder cannot use either for the same plan, because Quebec does not take part in them.</p>
<p>Spouses and partners living in Quebec go through ${h.a('spousal-sponsorship', 'family sponsorship')}, which also has a Quebec-specific line. After landing, the clock toward ${h.a('citizenship', 'citizenship')} starts like anywhere else in Canada.</p>
<h2>Before you count the months</h2>
<p>Use the date IRCC received the complete permanent residence application, not the date of your CSQ. If IRCC asks for an updated medical exam, police certificate or a new CSQ because the old one expired, the file waits for you and the estimate moves by that much. Your ${h.src('check-status', 'application status')} shows each step that has been completed. Once you are past the time IRCC gives for your month, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} apply.</p>
`,
  },
  fr: {
    slug: 'delai-travailleur-qualifie-quebec',
    nav: 'Travailleur qualifié du Québec', card: 'Étape fédérale après le CSQ, file par mois de dépôt',
    title: 'Délai RP du travailleur qualifié du Québec, après CSQ 2026',
    description: 'Résidence permanente des travailleurs qualifiés du Québec en 2026 : délai prévu par IRCC après le CSQ, file d’attente par mois de dépôt et relevés depuis 2025.',
    h1: 'Travailleur qualifié du Québec : l’étape fédérale de la résidence permanente',
    intro: `Le délai prévu par IRCC pour les travailleurs qualifiés sélectionnés par le Québec, daté du ${F.day(D)}, est de ${K.fmtTime(r.t, 'fr')}, avec ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes en attente.`,
    resume: `Une fois le Certificat de sélection du Québec (CSQ) obtenu, la demande de résidence permanente envoyée à IRCC prend en ce moment ${K.fmtTime(r.t, 'fr')}, selon le délai prévu publié par IRCC le ${F.day(D)}. Ce chiffre ne vise que l’étape fédérale : examen médical, vérifications de sécurité et de criminalité, puis décision. Le temps de la sélection par le Québec vient avant et n’y est pas compté. IRCC fait état de ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes en attente dans cette file. Son tableau par mois de dépôt donne une réponse propre à chaque mois : un dossier reçu en ${ym(lastRow[0], 'fr')} a encore ${typeof lastRow[1] === 'number' ? mo(lastRow[1], 'fr') : 'un temps inconnu'} devant lui, alors que tous les mois de ${lateSpan('fr')} sont marqués comme ayant dépassé le délai prévu. ${steady ? `Le chiffre principal n’a bougé dans aucun des ${F.n(tr.n)} relevés mensuels que nous gardons depuis le ${F.day(tr.firstDate ?? tr.lastDate)}.` : `Il a varié de ${F.d(tr.min, 'm')} à ${F.d(tr.max, 'm')} sur les ${F.n(tr.n)} relevés gardés depuis le ${F.day(tr.firstDate ?? tr.lastDate)}.`} L’outil ci-dessus situe votre mois de dépôt dans cette file.`,
    faqs: [
      { q: 'Le délai du travailleur qualifié du Québec comprend-il l’obtention du CSQ ?', a: `Non. Les ${K.fmtTime(r.t, 'fr')} publiés par IRCC le ${F.day(D)} partent de la réception de la demande de résidence permanente, qu’on ne peut envoyer qu’après avoir été sélectionné par le Québec. La sélection québécoise suit son propre calendrier, fixé par le ministère de l’Immigration du Québec, et IRCC ne le publie pas.` },
      { q: 'Pourquoi la file des travailleurs qualifiés du Québec est-elle plus lente que l’Entrée express ?', a: `Le Québec fait sa propre sélection et ne participe pas à l’Entrée express : ses dossiers forment une file fédérale distincte, avec son personnel et ses cibles annuelles. Le ${F.day(D)}, IRCC prévoyait ${K.fmtTime(r.t, 'fr')} pour cette file, contre ${K.fmtTime(fsw.t, 'fr')} pour les travailleurs qualifiés du fédéral dans l’Entrée express.` },
      { q: 'Mon dossier de travailleur qualifié du Québec a dépassé le délai prévu : que faire ?', a: `IRCC marque les plus vieux mois de dépôt de sa file comme ayant dépassé le délai prévu ; ${F.n(late.length)} mois portent cette mention dans le tableau du ${F.day(D)}. IRCC comptait donc les avoir terminés. Vérifiez d’abord les demandes de documents dans votre compte en ligne, puis écrivez par le formulaire Web d’IRCC.` },
    ],
    body: (h) => `
<h2>Deux gouvernements, deux étapes</h2>
<p>Le Québec choisit lui-même ses immigrants économiques. Le travailleur qualifié dépose d’abord sa demande auprès du ministère de l’Immigration, de la Francisation et de l’Intégration (MIFI), qui l’évalue selon les règles québécoises et, s’il l’accepte, lui délivre un Certificat de sélection du Québec, le CSQ. C’est seulement ensuite qu’on envoie la demande de résidence permanente à IRCC. Ottawa ne refait pas la sélection : il vérifie l’admissibilité, soit la santé, les antécédents judiciaires, la sécurité et la concordance des documents avec ce que le Québec a approuvé. Cette page porte sur cette deuxième étape, la seule pour laquelle IRCC publie un délai. Les démarches officielles sont sur la ${h.src('qsw', 'page d’IRCC sur les travailleurs qualifiés sélectionnés par le Québec')}.</p>
<p>Le chiffre d’IRCC pour cette étape est un délai prévu : son estimation pour une demande complète reçue aujourd’hui, comme l’explique notre ${h.a('method', 'page de méthode')}. Il était de ${h.t(r.t)} le ${h.day(D)}.</p>
<h2>Où en est votre mois de dépôt</h2>
<p>Le chiffre principal répond à une seule question : combien de temps prendrait une nouvelle demande. Si votre dossier est déjà parti, le tableau de file publié dans le même fichier vous sera plus utile. Pour chaque mois de dépôt, IRCC indique le temps qu’il prévoit encore et le nombre approximatif de personnes devant. Dans le fichier du ${h.day(D)}, tous les mois de ${lateSpan('fr')} portent la mention « délai prévu dépassé ». À partir de ${h.my(`${firstOpen[0]}-15`)}, chaque mois reçoit un chiffre, qui commence à ${typeof firstOpen[1] === 'number' ? mo(firstOpen[1], 'fr') : ''} et grimpe d’un mois de dépôt à l’autre.</p>
${h.table(['Mois de dépôt', 'Temps restant', 'Personnes devant'], queueRows(h, 'fr'), `Travailleurs qualifiés sélectionnés par le Québec, file publiée par IRCC le ${h.day(D)} (un mois sur deux, le plus récent compris).`, ['l', 'r', 'r'])}
<p>Le nombre de personnes devant augmente avec le mois de dépôt : ${K.fmtAhead(firstOpen[2], 'fr')} pour ${h.my(`${firstOpen[0]}-15`)}, ${K.fmtAhead(lastRow[2], 'fr')} pour ${h.my(`${lastRow[0]}-15`)}. Ce compte inclut tous ceux qui ont déposé avant vous et qui attendent encore, ce qui explique qu’un dossier récent voie presque toute la file devant lui.</p>
${h.mini('delai', { p: ['m'], d: { g: 'qsw', m: firstOpen[0] }, t: 'Votre dossier de travailleur qualifié du Québec : temps restant' })}
<h2>Un chiffre qui bouge à peine</h2>
<p>${steady ? `Toutes les copies mensuelles que nous gardons, du ${h.day(tr.firstDate ?? tr.lastDate)} au ${h.day(tr.lastDate)}, affichent les mêmes ${h.d(tr.last, 'm')}.` : `Nos copies depuis le ${h.day(tr.firstDate ?? tr.lastDate)} vont de ${h.d(tr.min, 'm')} à ${h.d(tr.max, 'm')}.`} IRCC publie les délais prévus de résidence permanente sous cette forme depuis octobre 2025 : la série commence donc là, rien de plus ancien n’est montré et aucun mois n’est inventé là où il n’y a pas de copie. La ${h.a('history', 'page de l’historique')} liste chaque copie avec sa date de capture.</p>
${h.hist(r.series, { max: 12, unit: 'm' })}
<p>Un chiffre principal stable ne veut pas dire une file stable. On comptait ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes en attente le ${h.day(D)}. Quand plus de titulaires d’un CSQ déposent dans l’année que ce qu’IRCC prévoit d’admettre en provenance du Québec, les mois récents s’allongent même si le chiffre principal ne change pas.</p>
<h2>Comparé aux autres files québécoises</h2>
<p>Les gens d’affaires sélectionnés par le Québec (investisseurs, entrepreneurs, travailleurs autonomes) forment une file à part. IRCC leur donnait ${h.t(qb?.cur)} à la même date, avec ${K.fmtAhead(qb?.waiting ?? 0, 'fr')} demandes en attente : les travailleurs qualifiés avancent donc beaucoup plus vite. Hors Québec, les équivalents les plus proches sont les ${h.a('express-entry', 'programmes de l’Entrée express')} et les ${h.a('pnp', 'volets des candidats des provinces')} ; un titulaire de CSQ ne peut pas s’en servir pour le même projet, puisque le Québec n’y participe pas.</p>
<p>L’époux ou le conjoint qui vit au Québec passe par le ${h.a('spousal-sponsorship', 'parrainage familial')}, qui a lui aussi une file propre au Québec. Après l’arrivée, le compte des jours vers la ${h.a('citizenship', 'citoyenneté')} part comme partout ailleurs au Canada.</p>
<h2>Avant de compter les mois</h2>
<p>Prenez la date à laquelle IRCC a reçu la demande de résidence permanente complète, pas la date de votre CSQ. Si IRCC demande un nouvel examen médical, un certificat de police à jour ou un nouveau CSQ parce que l’ancien est échu, le dossier vous attend et l’estimation recule d’autant. L’${h.src('check-status', 'état de votre demande')} montre chaque étape franchie. Une fois passé le temps prévu pour votre mois, les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} s’appliquent.</p>
`,
  },
});
