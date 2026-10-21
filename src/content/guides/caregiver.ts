import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Aides familiaux (résidence permanente) : la plus longue des files de travailleurs, en baisse depuis janvier 2026. */
const P = 'caregiver';
const r = K.readingOf(P);
const q = r.queue ?? [];
const pts = K.points(r.series);
const tr = K.fullTrend(r.series)!;
const M = 365.25 / 12;
const mOf = (days: number) => Math.round(days / M);
const drops = pts.slice(1).filter((p, i) => p.v < pts[i].v).length;
const lastRow = q[q.length - 1], firstRow = q[0];
const lateN = q.filter((x) => x[1] === 'late').length;
const sameAsLast = q.filter((x) => x[1] === lastRow[1]);
/* Plus grand saut de « personnes devant » entre deux mois de dépôt consécutifs. */
const jump = q.slice(1).map((x, i) => ({ from: q[i], to: x, d: (x[2] ?? 0) - (q[i][2] ?? 0) })).sort((a, b) => b.d - a.d)[0];
/* Les files de travailleurs qualifiés, de la plus courte à la plus longue. */
const LINES = ['cec', 'fsw', 'pnp-ee', 'qsw', 'pnp-base', 'aip', 'caregiver'];
const ranked = LINES.map((id) => ({ id, r: K.readingOf(id) })).sort((a, b) => (K.daysOf(a.r.t) ?? 0) - (K.daysOf(b.r.t) ?? 0));
const longest = ranked[ranked.length - 1].id === P;
const wt = K.fullTrend('w:caregiver')!;
/* Avant janvier 2026, le fichier séparait les projets pilotes (gardiens d'enfants, aides à domicile). */
const pilots = K.points('f:childcare-pilot-pr').length > 0 || K.points('f:support-worker-pr').length > 0;
const pilotEnd = [...K.points('f:childcare-pilot-pr'), ...K.points('f:support-worker-pr')].map((p) => p.date).sort().pop() ?? tr.firstDate ?? tr.lastDate;
const D = r.date;
const E = K.en, F = K.fr;
const mo = (n: number, l: Lang) => `${K.num(n, l)} ${K.unitWord(n, 'm', l)}`;
const ym = (k: string, l: Lang) => K.monthYear(`${k}-15`, l);
const lineRows = (h: Helpers, l: Lang) => ranked.map((x) => [K.PAGE_OF[x.id] && K.PAGE_OF[x.id] !== P ? h.a(K.PAGE_OF[x.id], K.progName(x.id, l)) : `<strong>${K.progName(x.id, l)}</strong>`, h.t(x.r.t), K.fmtAhead(x.r.waiting ?? 0, l)]);

export default defineGuide({
  id: 'caregiver', group: 'pr', order: 46,
  tool: 'delai', toolArg: { g: 'caregiver' },
  related: ['express-entry', 'pnp', 'work-permit-extension', 'method', 'history', 'beyond-processing-time'],
  sources: ['ptimes-flpt', 'caregivers', 'check-status'],
  en: {
    slug: 'caregiver-pr-processing-time',
    nav: 'Caregivers', card: 'Longest worker line, falling since January 2026',
    title: 'Caregiver Permanent Residence Processing Time, Queue 2026',
    description: 'Caregiver permanent residence time in 2026: IRCC’s expected months for home care workers, files waiting, the queue by month filed and the fall since January.',
    h1: 'Caregivers: how long permanent residence takes',
    intro: `IRCC’s forward-looking time for caregivers applying for permanent residence was ${K.fmtTime(r.t, 'en')} on ${E.day(D)}, with ${K.fmtAhead(r.waiting ?? 0, 'en')} applications in line.`,
    resume: `A caregiver who applies for permanent residence now can expect ${K.fmtTime(r.t, 'en')}, according to the forward-looking time IRCC published on ${E.day(D)}. That is ${K.num(Math.floor(mOf(tr.last) / 12), 'en')} ${Math.floor(mOf(tr.last) / 12) === 1 ? 'year' : 'years'} and ${mo(mOf(tr.last) % 12, 'en')}, ${longest ? 'the longest of the skilled-worker lines IRCC publishes' : 'one of the longest skilled-worker lines IRCC publishes'}, and ${K.fmtAhead(r.waiting ?? 0, 'en')} applications are waiting. The figure is falling. Our first copy with a caregiver figure, dated ${E.day(tr.firstDate ?? tr.lastDate)}, showed ${E.d(tr.first ?? tr.last, 'm')}, and it went down at ${E.n(drops)} of the ${E.n(pts.length - 1)} monthly readings that followed. For people already waiting, IRCC’s queue by month of filing is the better guide: an application filed in ${ym(firstRow[0], 'en')} still shows ${typeof firstRow[1] === 'number' ? mo(firstRow[1], 'en') : 'no figure'} left, and ${E.n(sameAsLast.length)} filing months share the latest value of ${typeof lastRow[1] === 'number' ? mo(lastRow[1], 'en') : 'no figure'}. The time covers IRCC’s permanent residence decision only, not the job offer or any work permit before it.`,
    faqs: [
      { q: 'Why does caregiver permanent residence take so long?', a: `The line is small in admissions and large in applications: IRCC counted ${K.fmtAhead(r.waiting ?? 0, 'en')} waiting on ${E.day(D)}, and it admits only a limited number of caregivers each year under its levels plan. The forward-looking time reflects how many years it would take to reach a new file at the planned pace.` },
      { q: 'Is the caregiver processing time split by pilot?', a: `Not any more. Up to the copy of ${E.day(pilotEnd)}, IRCC’s file gave separate figures for the home child care provider and home support worker pilots. Since ${E.day(tr.firstDate ?? tr.lastDate)} it shows one caregiver line. Your own position depends on your month of filing, which the queue table and the tool above read for you.` },
      { q: 'Can I keep working in Canada while my caregiver application waits?', a: 'If you hold a work permit, apply to extend it before it expires; you keep working under the same conditions while IRCC decides the extension. The permanent residence application on its own does not give you status, so the extension matters for every year of the wait.' },
    ],
    body: (h) => `
<h2>The longest line for workers</h2>
<p>The table sets caregivers beside the six other permanent residence lines for skilled workers in IRCC’s forward-looking file. Sorted from shortest to longest, caregivers come ${longest ? 'last' : 'near the end'}. The table uses the same ${h.day(D)} file for every line, so the figures compare directly.</p>
${h.table(['Line', 'Expected time', 'Applications waiting'], lineRows(h, 'en'), `Forward-looking times for workers’ permanent residence lines, IRCC file of ${h.day(D)}.`, ['l', 'r', 'r'])}
<p>The gap has a simple cause. Express Entry lines are fed by rounds of invitations that IRCC sizes to its targets, so the queue rarely grows far beyond what it can process. Caregivers apply under pilots with their own intake, and the number of files received has run ahead of the number of admissions planned. When the line is long compared with the yearly pace, the forward-looking time, which IRCC defines as its estimate for a complete application received today (see the ${h.a('method', 'method page')}), becomes long too.</p>
<h2>Falling month after month since January</h2>
<p>The first copy in our archive with a caregiver figure is the one dated ${h.day(tr.firstDate ?? tr.lastDate)}, at ${h.d(tr.first ?? tr.last, 'm')}. ${pilots ? `Earlier copies of IRCC’s forward-looking file, kept since October 2025, had no single caregiver line: up to the copy of ${h.day(pilotEnd)} they gave separate figures for the home child care provider and home support worker pilots, which are not merged here.` : 'Earlier copies of IRCC’s forward-looking file, kept since October 2025, have no number for this line, so we show none.'} Since January the figure fell at ${h.n(drops)} of ${h.n(pts.length - 1)} readings, to ${h.d(tr.last, 'm')} on ${h.day(tr.lastDate)}: ${mo(mOf((tr.first ?? tr.last) - tr.last), 'en')} less in total.</p>
${h.hist(r.series, { max: 12, unit: 'm' })}
<p>Every row is linked to the copy it was read from, most of them Internet Archive captures cited by date, as explained on the ${h.a('history', 'history page')}. The waiting count moved the same way, from ${K.fmtAhead(wt.first ?? wt.last, 'en')} on ${h.day(wt.firstDate ?? wt.lastDate)} to ${K.fmtAhead(wt.last, 'en')} on ${h.day(wt.lastDate)}, which means IRCC finalized more caregiver files than it received over those months. It does not tell you what the next reading will show.</p>
${h.mini('delai', { p: ['m'], d: { g: 'caregiver', m: firstRow[0] }, t: 'Your caregiver application: time left by month filed' })}
<h2>Reading the queue by month of filing</h2>
<p>The same file contains a table with one row per month of filing, going back to ${ym(firstRow[0], 'en')}. It does not look like the neat staircase of other lines. The oldest row, ${ym(firstRow[0], 'en')}, shows ${typeof firstRow[1] === 'number' ? mo(firstRow[1], 'en') : 'no figure'} left with ${K.fmtAhead(firstRow[2], 'en')} people ahead. The biggest change between two consecutive months of filing comes between ${ym(jump.from[0], 'en')} and ${ym(jump.to[0], 'en')}, when the count of people ahead rises from ${K.fmtAhead(jump.from[2], 'en')} to ${K.fmtAhead(jump.to[2], 'en')}. In all, ${h.n(sameAsLast.length)} months show the same ${typeof lastRow[1] === 'number' ? mo(lastRow[1], 'en') : ''} and the same line of ${K.fmtAhead(lastRow[2], 'en')}, and ${h.n(lateN)} scattered months are marked past the expected time.</p>
<p>That pattern suggests files from those months are processed as one pool rather than strictly in order of arrival. For you, it means two things: the tool gives the number IRCC attaches to your month, and a file from a later month may not be behind one from an earlier month inside that pool.</p>
<h2>Status while you wait</h2>
<p>A wait counted in years outlasts most work permits. Apply for a ${h.a('work-permit-extension', 'work permit extension')} before your permit expires, and keep the passport used in the application valid; an expired passport or medical exam can bring a request from IRCC that pauses the file until you answer. The program pages are on ${h.src('caregivers', 'IRCC’s caregivers page')}, and ${h.src('check-status', 'the status tool')} shows each completed step. Other paths may fit some caregivers, such as a ${h.a('pnp', 'provincial nomination')} or ${h.a('express-entry', 'Express Entry')} with Canadian work experience, but each has its own eligibility. If your month is marked past the expected time, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} apply.</p>
`,
  },
  fr: {
    slug: 'delai-aides-familiaux-residence-permanente',
    nav: 'Aides familiaux', card: 'La plus longue file de travailleurs, en baisse depuis janvier 2026',
    title: 'Délai de résidence permanente des aides familiaux, file 2026',
    description: 'Résidence permanente des aides familiaux en 2026 : mois prévus par IRCC, demandes en attente, file par mois de dépôt et baisse du délai depuis janvier.',
    h1: 'Aides familiaux : le délai de la résidence permanente',
    intro: `Le délai prévu par IRCC pour les aides familiaux qui demandent la résidence permanente était de ${K.fmtTime(r.t, 'fr')} le ${F.day(D)}, avec ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes dans la file.`,
    resume: `Un aide familial qui demande la résidence permanente aujourd’hui doit compter ${K.fmtTime(r.t, 'fr')}, selon le délai prévu publié par IRCC le ${F.day(D)}. Cela fait ${K.num(Math.floor(mOf(tr.last) / 12), 'fr')} ans et ${mo(mOf(tr.last) % 12, 'fr')}, ${longest ? 'la plus longue des files de travailleurs qualifiés publiées par IRCC' : 'l’une des plus longues files de travailleurs qualifiés publiées par IRCC'}, et ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes attendent. Le chiffre baisse. Notre première copie qui donne un délai pour les aides familiaux, datée du ${F.day(tr.firstDate ?? tr.lastDate)}, indiquait ${F.d(tr.first ?? tr.last, 'm')}, et il a reculé à ${F.n(drops)} des ${F.n(pts.length - 1)} relevés mensuels suivants. Pour ceux qui attendent déjà, la file d’IRCC par mois de dépôt est plus parlante : une demande déposée en ${ym(firstRow[0], 'fr')} affiche encore ${typeof firstRow[1] === 'number' ? mo(firstRow[1], 'fr') : 'aucun chiffre'}, et ${F.n(sameAsLast.length)} mois de dépôt partagent la dernière valeur, ${typeof lastRow[1] === 'number' ? mo(lastRow[1], 'fr') : 'aucun chiffre'}. Le délai ne couvre que la décision d’IRCC sur la résidence permanente, pas l’offre d’emploi ni le permis de travail qui la précèdent.`,
    faqs: [
      { q: 'Pourquoi la résidence permanente des aides familiaux prend-elle autant de temps ?', a: `La file reçoit beaucoup de demandes pour peu d’admissions : IRCC comptait ${K.fmtAhead(r.waiting ?? 0, 'fr')} dossiers en attente le ${F.day(D)}, et son plan des niveaux n’admet qu’un nombre limité d’aides familiaux chaque année. Le délai prévu traduit le temps qu’il faudrait, au rythme planifié, pour arriver à un nouveau dossier.` },
      { q: 'Le délai des aides familiaux est-il donné par projet pilote ?', a: `Plus maintenant. Jusqu’à la copie du ${F.day(pilotEnd)}, le fichier d’IRCC donnait des chiffres séparés pour les projets pilotes des gardiens d’enfants en milieu familial et des aides familiaux à domicile. Depuis le ${F.day(tr.firstDate ?? tr.lastDate)}, il n’affiche qu’une file. Votre position dépend de votre mois de dépôt, que lisent le tableau et l’outil.` },
      { q: 'Peut-on continuer à travailler au Canada pendant l’attente d’une demande d’aide familial ?', a: 'Si vous avez un permis de travail, demandez sa prolongation avant qu’il expire : vous continuez de travailler aux mêmes conditions pendant qu’IRCC traite la prolongation. La demande de résidence permanente ne donne pas de statut à elle seule, et la prolongation compte pour chaque année d’attente.' },
    ],
    body: (h) => `
<h2>La plus longue file de travailleurs</h2>
<p>Le tableau place les aides familiaux à côté des six autres files de résidence permanente pour travailleurs qualifiés du fichier prospectif d’IRCC. Classés du plus court au plus long, les aides familiaux arrivent ${longest ? 'en dernier' : 'parmi les derniers'}. Le tableau prend le même fichier du ${h.day(D)} pour chaque file : les chiffres se comparent donc directement.</p>
${h.table(['File', 'Délai prévu', 'Demandes en attente'], lineRows(h, 'fr'), `Délais prévus des files de résidence permanente pour travailleurs, fichier d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r'])}
<p>L’écart s’explique simplement. Les files de l’Entrée express sont alimentées par des rondes d’invitations qu’IRCC dimensionne selon ses cibles : la file dépasse rarement de beaucoup ce qu’il peut traiter. Les aides familiaux déposent dans des projets pilotes qui ont leurs propres périodes de réception, et le nombre de dossiers reçus a dépassé le nombre d’admissions prévues. Quand la file est longue par rapport au rythme annuel, le délai prévu, c’est-à-dire l’estimation d’IRCC pour une demande complète reçue aujourd’hui (voir la ${h.a('method', 'page de méthode')}), s’allonge aussi.</p>
<h2>En baisse presque chaque mois depuis janvier</h2>
<p>La première copie de notre archive qui chiffre la file des aides familiaux est celle du ${h.day(tr.firstDate ?? tr.lastDate)}, à ${h.d(tr.first ?? tr.last, 'm')}. ${pilots ? `Les copies plus anciennes du fichier prospectif d’IRCC, gardées depuis octobre 2025, n’avaient pas de file unique : jusqu’à la copie du ${h.day(pilotEnd)}, elles donnaient des chiffres séparés pour les projets pilotes des gardiens d’enfants en milieu familial et des aides familiaux à domicile, que nous ne fusionnons pas ici.` : 'Les copies plus anciennes du fichier prospectif d’IRCC, gardées depuis octobre 2025, n’ont pas de chiffre pour cette file : nous n’en montrons donc aucun.'} Depuis janvier, le délai a reculé à ${h.n(drops)} relevés sur ${h.n(pts.length - 1)}, jusqu’à ${h.d(tr.last, 'm')} le ${h.day(tr.lastDate)}, soit ${mo(mOf((tr.first ?? tr.last) - tr.last), 'fr')} de moins au total.</p>
${h.hist(r.series, { max: 12, unit: 'm' })}
<p>Chaque ligne renvoie à la copie lue, le plus souvent une capture de l’Internet Archive citée par sa date, comme l’explique la ${h.a('history', 'page de l’historique')}. Le nombre de demandes en attente a suivi le même chemin, de ${K.fmtAhead(wt.first ?? wt.last, 'fr')} le ${h.day(wt.firstDate ?? wt.lastDate)} à ${K.fmtAhead(wt.last, 'fr')} le ${h.day(wt.lastDate)} : IRCC a donc finalisé plus de dossiers d’aides familiaux qu’il n’en a reçu pendant ces mois. Elle ne dit pas ce que montrera le prochain relevé.</p>
${h.mini('delai', { p: ['m'], d: { g: 'caregiver', m: firstRow[0] }, t: 'Votre demande d’aide familial : temps restant selon le mois de dépôt' })}
<h2>Lire la file par mois de dépôt</h2>
<p>Le même fichier contient un tableau d’une ligne par mois de dépôt, qui remonte à ${ym(firstRow[0], 'fr')}. Il ne ressemble pas à l’escalier régulier des autres files. La plus vieille ligne, ${ym(firstRow[0], 'fr')}, affiche ${typeof firstRow[1] === 'number' ? mo(firstRow[1], 'fr') : 'aucun chiffre'} avec ${K.fmtAhead(firstRow[2], 'fr')} personnes devant. Le plus grand écart entre deux mois de dépôt qui se suivent se trouve entre ${ym(jump.from[0], 'fr')} et ${ym(jump.to[0], 'fr')}, quand le nombre de personnes devant passe de ${K.fmtAhead(jump.from[2], 'fr')} à ${K.fmtAhead(jump.to[2], 'fr')}. Au total, ${h.n(sameAsLast.length)} mois affichent les mêmes ${typeof lastRow[1] === 'number' ? mo(lastRow[1], 'fr') : ''} et la même file de ${K.fmtAhead(lastRow[2], 'fr')} personnes, et ${h.n(lateN)} mois isolés sont marqués comme ayant dépassé le délai prévu.</p>
<p>Ce profil laisse penser que les dossiers de ces mois sont traités comme un seul bassin plutôt que strictement dans l’ordre d’arrivée. Pour vous, deux conséquences : l’outil donne le chiffre qu’IRCC associe à votre mois, et un dossier d’un mois plus récent n’est peut-être pas derrière un dossier plus ancien à l’intérieur de ce bassin.</p>
<h2>Votre statut pendant l’attente</h2>
<p>Une attente qui se compte en années dure plus longtemps que la plupart des permis de travail. Demandez la ${h.a('work-permit-extension', 'prolongation de votre permis de travail')} avant son expiration, et gardez valide le passeport donné dans la demande : un passeport ou un examen médical échu peut entraîner une demande d’IRCC qui suspend le dossier jusqu’à votre réponse. Les pages des programmes sont sur la ${h.src('caregivers', 'page d’IRCC consacrée aux aides familiaux')}, et l’${h.src('check-status', 'outil de vérification de l’état')} montre chaque étape franchie. D’autres voies conviennent à certains aides familiaux, comme une ${h.a('pnp', 'nomination provinciale')} ou l’${h.a('express-entry', 'Entrée express')} avec de l’expérience canadienne, mais chacune a ses conditions. Si votre mois passe en « délai prévu dépassé », les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} s’appliquent.</p>
`,
  },
});
