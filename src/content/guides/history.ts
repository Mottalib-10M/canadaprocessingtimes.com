import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Archive des fichiers IRCC : nombre de relevés par fichier, plus grands écarts, tout lu dans history.json. */
type F = 'country' | 'noncountry' | 'flpt' | 'tr';
const FILES: F[] = ['country', 'noncountry', 'flpt', 'tr'];
const cnt = (f: F) => K.readingsCount(f), arch = (f: F) => K.archivedCount(f), first = (f: F) => K.firstReading(f)!;
const total = FILES.reduce((a, f) => a + cnt(f), 0);
const totalArch = FILES.reduce((a, f) => a + arch(f), 0);
const cDates = K.HIST.readings.country.map((r) => r.ircc);
const lastOf = (f: F) => K.HIST.readings[f][K.HIST.readings[f].length - 1].ircc;
const ve = K.fullTrend('n:visitor_extension')!, cs = K.fullTrend('n:cit_search')!, se = K.fullTrend('n:study_extension')!, we = K.fullTrend('n:work_extension')!;
const sIN = K.fullTrend('c:study:IN')!, ng = K.fullTrend('c:visitor-outside-canada:NG')!, pgp = K.fullTrend('f:pgp-roc')!, npr = K.fullTrend('n:new_pr')!;
const E = K.en, Fr = K.fr;

const NAME: Record<F, { en: string; fr: string }> = {
  country: { en: 'By country (visas, permits, child sponsorship)', fr: 'Par pays (visas, permis, enfants parrainés)' },
  noncountry: { en: 'Not by country (extensions, eTA, PR card, citizenship records)', fr: 'Sans pays (prolongations, AVE, carte RP, registres de citoyenneté)' },
  flpt: { en: 'Forward-looking (permanent residence, citizenship)', fr: 'Prospectif (résidence permanente, citoyenneté)' },
  tr: { en: 'Forward-looking by week (permit extensions)', fr: 'Prospectif par semaine (prolongations de permis)' },
};
function fileRows(h: Helpers) {
  return FILES.map((f) => [NAME[f][h.lang], cnt(f), arch(f), h.day(first(f)), h.day(lastOf(f))]);
}
const MOVES: Array<[string, string, { en: string; fr: string }]> = [
  ['n:visitor_extension', 'd', { en: 'Visitor record', fr: 'Fiche du visiteur' }],
  ['n:cit_search', 'm', { en: 'Search of citizenship records', fr: 'Recherche dans les registres de citoyenneté' }],
  ['n:study_extension', 'd', { en: 'Study permit extension (past time)', fr: 'Prolongation du permis d’études (délai passé)' }],
  ['n:work_extension', 'd', { en: 'Work permit extension (past time)', fr: 'Prolongation du permis de travail (délai passé)' }],
  ['c:study:IN', 'w', { en: 'Study permit, India', fr: 'Permis d’études, Inde' }],
  ['c:visitor-outside-canada:NG', 'd', { en: 'Visitor visa, Nigeria', fr: 'Visa de visiteur, Nigeria' }],
  ['f:pgp-roc', 'm', { en: 'Parents and grandparents, outside Quebec', fr: 'Parents et grands-parents, hors Québec' }],
];
function moveRows(h: Helpers) {
  return MOVES.map(([s, u, n]) => { const t = K.fullTrend(s)!; return [n[h.lang], `${h.d(t.first!, u)} (${h.day(t.firstDate!)})`, `${h.d(t.min, u)} (${h.day(t.minDate)})`, `${h.d(t.max, u)} (${h.day(t.maxDate)})`, `${h.d(t.last, u)} (${h.day(t.lastDate)})`]; });
}

export default defineGuide({
  id: 'history', group: 'tools', order: 71,
  tool: 'delai', toolArg: { g: 'visitor-record', only: 'visitor-record,cit-search,study-ext,work-ext,study,visitor,pgp-roc' },
  related: ['method', 'visitor-record', 'citizenship', 'study-permit', 'nigeria', 'parents-grandparents'],
  sources: ['wayback', 'ptimes-country', 'ptimes-noncountry', 'ptimes-flpt', 'ptimes-week', 'open-data'],
  en: {
    slug: 'processing-time-history',
    nav: 'History', card: 'Every dated reading, with the copy it comes from',
    title: 'Processing Time History: Dated IRCC Readings, 2023 to 2026',
    description: 'IRCC processing time history in 2026: every dated reading of the four IRCC files, the archived copy behind each point and the largest changes since 2023.',
    h1: 'History of IRCC processing times',
    intro: `${E.n(total)} dated readings of IRCC’s four processing time files, ${E.n(totalArch)} of them taken from Internet Archive copies.`,
    resume: `Our archive holds ${E.n(total)} dated readings of the four files IRCC uses to publish processing times. The file without countries, which covers visitor records, permit extensions and citizenship records, goes back furthest: ${E.n(cnt('noncountry'))} readings since ${E.day(first('noncountry'))}. The country file has ${E.n(cnt('country'))} readings since ${E.day(first('country'))}, the forward-looking file for permanent residence and citizenship ${E.n(cnt('flpt'))} since ${E.day(first('flpt'))}, and the weekly file for permit extensions ${E.n(cnt('tr'))} since ${E.day(first('tr'))}. All but the latest reading of each file come from copies kept by the Internet Archive, each cited with its capture date. The largest change in the archive is the visitor record, which went from ${E.d(ve.first!)} on ${E.day(ve.firstDate!)} to a high of ${E.d(ve.max)} on ${E.day(ve.maxDate)}; it now stands at ${E.d(ve.last)}. Where no copy exists for a date, there is no point: nothing is filled in or smoothed.`,
    faqs: [
      { q: 'Where do the older processing times on this site come from?', a: `From public copies of IRCC’s own files saved by the Internet Archive. ${E.n(totalArch)} of our ${E.n(total)} readings come from such copies; each table row links to the exact capture, so anyone can open it and check the figure. The latest reading of each file is taken directly from canada.ca on the date shown.` },
      { q: 'Why does the country file have a gap between 2025 and July 2026?', a: `The Internet Archive kept very few copies of that file before mid 2026. We found readings dated ${E.day(cDates[0])} and ${E.day(cDates[1])}, then the next one is ${E.day(cDates[2])}. We do not estimate the months in between, so a country chart jumps from one real reading to the next.` },
      { q: 'Why does permanent residence history start only in October 2025?', a: `IRCC switched permanent residence and citizenship to forward-looking times, published in a separate file. Our first copy of that file is dated ${E.day(first('flpt'))}, and it holds ${E.n(cnt('flpt'))} readings since. Older times for these programs were measured differently, so mixing them in would compare two different figures.` },
    ],
    body: (h) => `
<h2>Four files, four histories</h2>
<p>IRCC does not publish a history of its processing times. Each file is overwritten when it is updated, so yesterday’s figure disappears from canada.ca. To rebuild a history, we read the copies of those files that the ${h.src('wayback', 'Internet Archive')} saved over time, keep the update date IRCC wrote inside each copy, and add a fresh reading of the live file. The table below counts what that gives for each file.</p>
${h.table(['File', 'Readings', 'From archived copies', 'First reading', 'Latest reading'], fileRows(h), 'Dates are the update dates IRCC wrote in each file, not the dates the copies were made.', ['l', 'r', 'r', 'r', 'r'])}
<p>The four files do not cover the same span. The ${h.src('ptimes-noncountry', 'file without countries')} was saved almost every week, which gives a dense series from ${h.day(first('noncountry'))}. The ${h.src('ptimes-country', 'country file')} was saved rarely before mid 2026: after ${h.day(cDates[0])} and ${h.day(cDates[1])}, the next copy is dated ${h.day(cDates[2])}. The ${h.src('ptimes-flpt', 'forward-looking file')} for permanent residence and citizenship starts on ${h.day(first('flpt'))}, and the ${h.src('ptimes-week', 'weekly extension file')} on ${h.day(first('tr'))}. A page on this site never shows a trend older than its file allows.</p>
<h2>How a point is kept</h2>
<p>Each reading carries two dates: the update date printed by IRCC in the file, which is the date shown in every table, and the date of the copy it comes from. The table rows link to that copy. When two copies carry the same IRCC date, only one is kept. When a copy is missing for a week or a month, the series simply has no point there; we do not draw a line between two readings and present it as data. The ${h.a('method', 'method page')} gives the full rules.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'visitor-record', m: 'none' }, t: 'Your application against its own history' })}
<h2>The largest changes in the archive</h2>
${h.table(['Series', 'First reading', 'Lowest', 'Highest', 'Latest'], moveRows(h), 'First, lowest, highest and latest values of a few series, with the IRCC date of each.', ['l', 'r', 'r', 'r', 'r'])}
<p>The ${h.a('visitor-record', 'visitor record')} stands out. Visitors asking to stay longer waited ${h.d(ve.first!)} in the reading of ${h.day(ve.firstDate!)}; the figure rose to ${h.d(ve.max)} on ${h.day(ve.maxDate)} and was ${h.d(ve.last)} on ${h.day(ve.lastDate)}. The search of citizenship records, a step for people who need proof of an old file, went the same way after a low of ${h.d(cs.min, 'm')} on ${h.day(cs.minDate)}, reaching ${h.d(cs.max, 'm')} on ${h.day(cs.maxDate)}. See the ${h.a('citizenship', 'citizenship page')} for the grant itself, which has its own line.</p>
${h.hist('n:visitor_extension', { max: 12, unit: 'd' })}
<p>Extensions moved the other way. The past time for a study permit extension peaked at ${h.d(se.max)} on ${h.day(se.maxDate)} and fell to ${h.d(se.last)}; for a work permit extension the high was ${h.d(we.max)} on ${h.day(we.maxDate)}, against ${h.d(we.last)} now. First PR cards, at ${h.d(npr.last)}, sit between the low of ${h.d(npr.min)} and the high of ${h.d(npr.max)} seen since ${h.day(npr.firstDate!)}.</p>
${h.hist('n:cit_search', { max: 12, unit: 'm' })}
<h2>Countries and permanent residence</h2>
<p>With only ${h.n(cnt('country'))} readings, country series are short but telling. A ${h.a('study-permit', 'study permit')} from India took ${h.d(sIN.first!, 'w')} on ${h.day(sIN.firstDate!)}, dropped to ${h.d(sIN.min, 'w')} on ${h.day(sIN.minDate)} and was ${h.d(sIN.last, 'w')} on ${h.day(sIN.lastDate)}. A visitor visa from ${h.a('nigeria', 'Nigeria')} went from ${h.d(ng.first!)} to ${h.d(ng.min)} on ${h.day(ng.minDate)}, then climbed back to ${h.d(ng.last)}.</p>
${h.hist('c:study:IN', { max: 10, unit: 'w' })}
<p>The forward-looking time for ${h.a('parents-grandparents', 'parents and grandparents')} outside Quebec shows how fast a planning figure can move: ${h.d(pgp.first!, 'm')} on ${h.day(pgp.firstDate!)}, ${h.d(pgp.max, 'm')} one reading later on ${h.day(pgp.maxDate)}, then ${h.d(pgp.last, 'm')} on ${h.day(pgp.lastDate)}.</p>
${h.hist('f:pgp-roc', { max: 12, unit: 'm' })}
<p>IRCC also releases monthly operational statistics on the ${h.src('open-data', 'Open Government portal')}. They count applications processed and inventories, not the published processing times, so they are not mixed into these series.</p>
`,
  },
  fr: {
    slug: 'historique-delais',
    nav: 'Historique', card: 'Chaque relevé daté, avec la copie d’où il vient',
    title: 'Historique des délais IRCC : relevés datés depuis 2023, 2026',
    description: 'Historique des délais de traitement d’IRCC en 2026 : chaque relevé daté des quatre fichiers, la copie archivée derrière chaque point et les plus grands écarts.',
    h1: 'Historique des délais de traitement d’IRCC',
    intro: `${Fr.n(total)} relevés datés des quatre fichiers de délais d’IRCC, dont ${Fr.n(totalArch)} tirés de copies de l’Internet Archive.`,
    resume: `Notre archive contient ${Fr.n(total)} relevés datés des quatre fichiers dans lesquels IRCC publie ses délais de traitement. Le fichier sans pays, qui couvre la fiche du visiteur, les prolongations de permis et les registres de citoyenneté, remonte le plus loin : ${Fr.n(cnt('noncountry'))} relevés depuis le ${Fr.day(first('noncountry'))}. Le fichier par pays compte ${Fr.n(cnt('country'))} relevés depuis le ${Fr.day(first('country'))}, le fichier prospectif de la résidence permanente et de la citoyenneté ${Fr.n(cnt('flpt'))} depuis le ${Fr.day(first('flpt'))}, et le fichier hebdomadaire des prolongations ${Fr.n(cnt('tr'))} depuis le ${Fr.day(first('tr'))}. Sauf le dernier relevé de chaque fichier, tous viennent de copies conservées par l’Internet Archive, citées avec leur date de capture. Le plus grand écart de l’archive est celui de la fiche du visiteur, passée de ${Fr.d(ve.first!)} le ${Fr.day(ve.firstDate!)} à un sommet de ${Fr.d(ve.max)} le ${Fr.day(ve.maxDate)} ; elle est aujourd’hui à ${Fr.d(ve.last)}. Là où aucune copie n’existe, il n’y a pas de point : rien n’est complété ni lissé.`,
    faqs: [
      { q: 'D’où viennent les anciens délais affichés sur ce site ?', a: `De copies publiques des fichiers d’IRCC sauvegardées par l’Internet Archive. ${Fr.n(totalArch)} de nos ${Fr.n(total)} relevés viennent de ces copies ; chaque ligne de tableau renvoie à la capture exacte, que chacun peut ouvrir pour vérifier le chiffre. Le dernier relevé de chaque fichier est lu directement sur canada.ca à la date indiquée.` },
      { q: 'Pourquoi le fichier par pays a-t-il un trou entre 2025 et juillet 2026 ?', a: `L’Internet Archive a gardé très peu de copies de ce fichier avant le milieu de 2026. Nous avons des relevés datés du ${Fr.day(cDates[0])} et du ${Fr.day(cDates[1])}, puis le suivant est du ${Fr.day(cDates[2])}. Les mois entre les deux ne sont pas estimés : une courbe par pays saute d’un vrai relevé au suivant.` },
      { q: 'Pourquoi l’historique de la résidence permanente commence-t-il en octobre 2025 ?', a: `IRCC publie les délais de la résidence permanente et de la citoyenneté sous forme prospective, dans un fichier distinct. Notre première copie de ce fichier date du ${Fr.day(first('flpt'))} et nous en avons ${Fr.n(cnt('flpt'))} relevés depuis. Les anciens délais de ces programmes se mesuraient autrement : les mélanger reviendrait à comparer deux chiffres différents.` },
    ],
    body: (h) => `
<h2>Quatre fichiers, quatre historiques</h2>
<p>IRCC ne publie pas d’historique de ses délais. Chaque fichier est remplacé à sa mise à jour, et le chiffre de la veille disparaît de canada.ca. Pour reconstituer un historique, nous lisons les copies de ces fichiers que l’${h.src('wayback', 'Internet Archive')} a sauvegardées au fil du temps, nous gardons la date de mise à jour écrite par IRCC dans chaque copie et nous ajoutons un relevé récent du fichier en ligne. Le tableau compte ce que cela donne pour chaque fichier.</p>
${h.table(['Fichier', 'Relevés', 'Tirés de copies archivées', 'Premier relevé', 'Dernier relevé'], fileRows(h), 'Les dates sont celles de mise à jour écrites par IRCC dans chaque fichier, pas celles des copies.', ['l', 'r', 'r', 'r', 'r'])}
<p>Les quatre fichiers ne couvrent pas la même période. Le ${h.src('ptimes-noncountry', 'fichier sans pays')} a été sauvegardé presque chaque semaine, d’où une série dense depuis le ${h.day(first('noncountry'))}. Le ${h.src('ptimes-country', 'fichier par pays')} l’a été rarement avant le milieu de 2026 : après le ${h.day(cDates[0])} et le ${h.day(cDates[1])}, la copie suivante est datée du ${h.day(cDates[2])}. Le ${h.src('ptimes-flpt', 'fichier prospectif')} de la résidence permanente et de la citoyenneté commence le ${h.day(first('flpt'))}, et le ${h.src('ptimes-week', 'fichier hebdomadaire des prolongations')} le ${h.day(first('tr'))}. Aucune page du site ne montre une tendance plus ancienne que son fichier.</p>
<h2>Comment un point est gardé</h2>
<p>Chaque relevé porte deux dates : la date de mise à jour imprimée par IRCC dans le fichier, celle qui figure dans tous les tableaux, et la date de la copie d’où il vient. Les lignes des tableaux renvoient à cette copie. Quand deux copies portent la même date IRCC, une seule est gardée. Quand il manque une copie pour une semaine ou un mois, la série n’a simplement pas de point ; nous ne traçons pas de ligne entre deux relevés pour la présenter comme une donnée. La ${h.a('method', 'page de méthode')} donne les règles complètes.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'visitor-record', m: 'none' }, t: 'Votre demande face à son propre historique' })}
<h2>Les plus grands écarts de l’archive</h2>
${h.table(['Série', 'Premier relevé', 'Plus bas', 'Plus haut', 'Dernier'], moveRows(h), 'Valeur la plus ancienne, la plus basse, la plus haute et la dernière de quelques séries, avec la date IRCC de chacune.', ['l', 'r', 'r', 'r', 'r'])}
<p>La ${h.a('visitor-record', 'fiche du visiteur')} se détache. Un visiteur qui demandait à rester plus longtemps attendait ${h.d(ve.first!)} au relevé du ${h.day(ve.firstDate!)} ; le chiffre a monté jusqu’à ${h.d(ve.max)} le ${h.day(ve.maxDate)} et il était de ${h.d(ve.last)} le ${h.day(ve.lastDate)}. La recherche dans les registres de citoyenneté, utile à qui doit prouver un ancien dossier, a suivi le même chemin après un creux de ${h.d(cs.min, 'm')} le ${h.day(cs.minDate)}, jusqu’à ${h.d(cs.max, 'm')} le ${h.day(cs.maxDate)}. L’attribution de la citoyenneté elle-même a sa propre ligne, sur la ${h.a('citizenship', 'page de la citoyenneté')}.</p>
${h.hist('n:visitor_extension', { max: 12, unit: 'd' })}
<p>Les prolongations ont évolué en sens inverse. Le délai passé d’une prolongation du permis d’études a culminé à ${h.d(se.max)} le ${h.day(se.maxDate)} avant de tomber à ${h.d(se.last)} ; pour une prolongation du permis de travail, le sommet était de ${h.d(we.max)} le ${h.day(we.maxDate)}, contre ${h.d(we.last)} aujourd’hui. La première carte RP, à ${h.d(npr.last)}, se situe entre le creux de ${h.d(npr.min)} et le sommet de ${h.d(npr.max)} observés depuis le ${h.day(npr.firstDate!)}.</p>
${h.hist('n:cit_search', { max: 12, unit: 'm' })}
<h2>Les pays et la résidence permanente</h2>
<p>Avec ${h.n(cnt('country'))} relevés seulement, les séries par pays sont courtes mais parlantes. Un ${h.a('study-permit', 'permis d’études')} demandé depuis l’Inde prenait ${h.d(sIN.first!, 'w')} le ${h.day(sIN.firstDate!)}, il est descendu à ${h.d(sIN.min, 'w')} le ${h.day(sIN.minDate)} et il était de ${h.d(sIN.last, 'w')} le ${h.day(sIN.lastDate)}. Un visa de visiteur demandé depuis le ${h.a('nigeria', 'Nigeria')} est passé de ${h.d(ng.first!)} à ${h.d(ng.min)} le ${h.day(ng.minDate)}, puis il est remonté à ${h.d(ng.last)}.</p>
${h.hist('c:study:IN', { max: 10, unit: 'w' })}
<p>Le délai prospectif des ${h.a('parents-grandparents', 'parents et grands-parents')} hors Québec montre à quelle vitesse un chiffre de planification peut bouger : ${h.d(pgp.first!, 'm')} le ${h.day(pgp.firstDate!)}, ${h.d(pgp.max, 'm')} un relevé plus tard, le ${h.day(pgp.maxDate)}, puis ${h.d(pgp.last, 'm')} le ${h.day(pgp.lastDate)}.</p>
${h.hist('f:pgp-roc', { max: 12, unit: 'm' })}
<p>IRCC diffuse aussi chaque mois des statistiques opérationnelles sur le ${h.src('open-data', 'portail du gouvernement ouvert')}. Elles comptent les demandes traitées et les inventaires, pas les délais publiés : elles ne sont donc pas mêlées à ces séries.</p>
`,
  },
});
