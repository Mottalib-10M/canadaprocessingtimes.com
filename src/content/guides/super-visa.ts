import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Super visa : fichier par pays d'IRCC, clé « supervisa ». Tous les chiffres sont lus au build. */
const P = 'super-visa';
const rng = K.rangeOf(P)!;
const listed = K.countriesOf(P);
const timed = listed.map((c) => [c, K.daysOf(K.readingOf(P, c).t)] as const).filter((x): x is readonly [string, number] => x[1] != null).sort((a, b) => a[1] - b[1]);
const noFigure = listed.length - timed.length;
const median = timed[Math.floor(timed.length / 2)][1];
const under60 = timed.filter((x) => x[1] <= 60).length;
const over120 = timed.filter((x) => x[1] > 120).length;
const t = (c: string) => K.readingOf(P, c).t;
const sv = (c: string) => `c:supervisa:${c}`;
const vv = (c: string) => `c:visitor-outside-canada:${c}`;
const D = K.L.dates.country;
const E = K.en, F = K.fr;
const inT = K.fullTrend(sv('IN'))!, phT = K.fullTrend(sv('PH'))!, pkT = K.fullTrend(sv('PK'))!, cnT = K.fullTrend(sv('CN'))!;
const maT = K.fullTrend(sv('MA'))!, cmT = K.fullTrend(sv('CM'))!, dzT = K.fullTrend(sv('DZ'))!;
const pts = K.points(sv('IN'));
const gapFrom = pts[1]?.date ?? pts[0].date, gapTo = pts[2]?.date ?? pts[pts.length - 1].date;
const rankOf = (c: string) => timed.findIndex((x) => x[0] === c) + 1;

/* Super visa et visa de visiteur depuis le même pays : écart en jours, grands pays où les deux sont publiés. */
const pair = K.MAJOR.map((c) => [c, K.daysOf(t(c)), K.daysOf(K.readingOf('visitor', c).t)] as const)
  .filter((x): x is readonly [string, number, number] => x[1] != null && x[2] != null);
const slower = pair.filter((x) => x[1] > x[2]).length;

function majorRows(h: Helpers) {
  return K.MAJOR.filter((c) => timed.some((x) => x[0] === c)).map((c) => {
    const tr = K.fullTrend(sv(c));
    return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.t(t(c)), tr?.prev != null ? h.d(tr.prev) : '', tr ? `${h.d(tr.max)} (${h.day(tr.maxDate)})` : '', `${h.n(rankOf(c))} / ${h.n(timed.length)}`];
  });
}
function pairRows(h: Helpers) {
  return pair.map(([c, s, v]) => [h.cn(c), h.d(s), h.d(v), s >= v ? `+${h.d(s - v)}` : `-${h.d(v - s)}`]);
}

export default defineGuide({
  id: 'super-visa', group: 'visit', order: 11,
  tool: 'delai', toolArg: { g: 'super-visa', c: 'IN', only: 'super-visa,visitor,visitor-inside,visitor-record' },
  related: ['visitor-visa', 'visitor-record', 'parents-grandparents', 'india', 'china', 'beyond-processing-time'],
  sources: ['super-visa', 'ptimes-country', 'biometrics', 'ptimes', 'wayback'],
  en: {
    slug: 'super-visa-processing-time',
    nav: 'Super visa', card: 'Parents and grandparents: time by country and trend',
    title: 'Super Visa Processing Time by Country, Canada 2026',
    description: 'Super visa processing time in 2026 for each country where IRCC publishes one: the current figure, its rank, the peak since 2024 and a decision date estimate.',
    h1: 'Super visa processing time for parents and grandparents',
    intro: `On ${E.day(D)}, IRCC published a super visa time for ${E.n(timed.length)} countries, from ${K.fmtTime(rng.lo[1], 'en')} to ${K.fmtTime(rng.hi[1], 'en')}.`,
    resume: `A parent or grandparent super visa currently takes ${K.fmtTime(t('IN'), 'en')} when the application is made from India, ${K.fmtTime(t('CN'), 'en')} from China, ${K.fmtTime(t('PH'), 'en')} from the Philippines and ${K.fmtTime(t('PK'), 'en')} from Pakistan, according to the figures IRCC published on ${E.day(D)}. Only ${E.n(timed.length)} of the ${E.n(listed.length)} countries in IRCC's list carry a super visa time; the other ${E.n(noFigure)} show no figure because too few applications were decided there recently. Among the countries with a figure, the middle value is ${E.n(median)} days, ${E.n(under60)} are at 60 days or less and ${E.n(over120)} are above 120 days. From India the time stood at ${E.d(inT.first!)} in the oldest copy we hold (${E.day(inT.firstDate!)}) and reached ${E.d(inT.max)} on ${E.day(inT.maxDate)}. The super visa is usually slower than a regular visitor visa from the same country: it was slower in ${E.n(slower)} of the ${E.n(pair.length)} large countries where both are published. The figure is how long IRCC took for 80% of recent decisions, not a date promised for your file.`,
    faqs: [
      { q: 'How long does a super visa take from India right now?', a: `The figure IRCC published on ${E.day(D)} is ${K.fmtTime(t('IN'), 'en')} for a super visa requested from India, which ranks ${E.n(rankOf('IN'))} of ${E.n(timed.length)} countries from fastest to slowest. The previous reading was ${E.d(inT.prev!)}. The clock starts when IRCC receives the complete application and does not include the biometrics appointment.` },
      { q: 'Why is the super visa slower than a visitor visa from the same country?', a: 'A super visa file contains more to check: an immigration medical exam, proof of private health insurance and proof that the child or grandchild in Canada meets the income requirement. Each of these can lead to a request for more documents, and the 80% threshold that IRCC reports includes those slower files.' },
      { q: 'Why does my country show no super visa time at all?', a: `IRCC prints no figure when too few applications from a country were finished in the period it measures. On ${E.day(D)}, ${E.n(noFigure)} countries were in that situation. It does not mean the office refuses applications from there; it means the sample was too small to publish a reliable number.` },
      { q: 'Can a super visa holder stay longer than the first period granted?', a: 'Yes. A super visa holder can ask to extend the stay from inside Canada before the authorized period ends. That request goes through the visitor record line, a separate figure that does not depend on the country of origin and that has been much longer than the super visa itself in recent readings.' },
    ],
    body: (h) => `
<h2>Super visa times in the main countries of filing</h2>
<p>The table shows the figure IRCC published on ${h.day(D)} for the countries that file the most applications to Canada, the reading before it, the highest value in our archive and the country's place among the ${h.n(timed.length)} countries that have a figure (1 is the fastest). Countries in the large-filing group with no super visa figure are left out rather than shown as zero.</p>
${h.table(['Country', 'Published time', 'Previous reading', 'Highest kept', 'Rank'], majorRows(h), `Parent and grandparent super visa, IRCC figure of ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The range is wide even among large countries. Pakistan reached ${h.d(pkT.max)} on ${h.day(pkT.maxDate)} and now stands at ${h.d(pkT.last)}. The Philippines went from ${h.d(phT.first!)} in the copy of ${h.day(phT.firstDate!)} to a low of ${h.d(phT.min)} on ${h.day(phT.minDate)}, and is back at ${h.d(phT.last)}. China has risen at most readings since ${h.day(cnT.minDate)}, from ${h.d(cnT.min)} to ${h.d(cnT.last)}.</p>
<h2>Super visa against visitor visa, country by country</h2>
<p>Parents often ask whether a regular visitor visa would come faster. The figures answer the timing part of the question only: the two documents do not give the same length of stay, so speed alone should not decide. The last column is the super visa time minus the visitor visa time from the same country, on the same IRCC reading.</p>
${h.table(['Country', 'Super visa', 'Visitor visa', 'Difference'], pairRows(h), `Both lines from IRCC's country file of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>In ${h.n(slower)} of these ${h.n(pair.length)} countries the super visa is the slower of the two. The gap comes from the extra pieces in the file: the medical exam must be done by a panel physician approved by IRCC, the insurance must meet the conditions listed on the ${h.src('super-visa', 'super visa page of IRCC')}, and the host in Canada must document an income above the threshold for the family size. A missing letter or an expired insurance quote is the most common reason a file waits.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'super-visa', c: 'PH', m: 'none' }, t: 'Your super visa: estimated decision date' })}
<h2>The India series, reading by reading</h2>
<p>India is one of the large filing countries in the table above, which makes its line a useful reference. Every reading below comes from a dated copy of IRCC's file. Our archive has a long gap between ${h.day(gapFrom)} and ${h.day(gapTo)}, when no public copy of the country file was kept; nothing is filled in for that period.</p>
${h.hist(sv('IN'), { max: 10 })}
<p>Since the readings became regular again, the India figure has climbed from ${h.d(inT.min)} on ${h.day(inT.minDate)} to ${h.d(inT.last)} now. A rise at several readings in a row usually means the office is finishing older files, and the published time follows those files upward for a while.</p>
<h2>Countries with very short or very long times</h2>
<p>The shortest super visa time on ${h.day(D)} was ${h.t(rng.lo[1])} for ${h.cn(rng.lo[0])}; the longest was ${h.t(rng.hi[1])} for ${h.cn(rng.hi[0])}. Morocco is at ${h.t(t('MA'))}, Algeria at ${h.t(t('DZ'))} and Cameroon at ${h.t(t('CM'))}. Treat extreme values with care: a country that sends few super visa applications can show a high figure because two or three files needed security or medical checks. For those countries the trend over several readings, shown in the tool, says more than the latest figure.</p>
<h2>What you count from</h2>
<p>The time runs from the day IRCC received the complete application. Biometrics are given at a visa application centre after the request letter arrives, and that step is not inside the published time; see the ${h.src('biometrics', 'biometrics page')} for who has to give them. If you applied before getting the medical exam done, the clock still runs, but the decision cannot come until the exam results reach IRCC. How we collect and date the figures is explained on the ${h.a('method', 'method page')}.</p>
<p>Once the parent is in Canada, the stay can be extended from inside the country. That request is processed on the ${h.a('visitor-record', 'visitor record line')}, which has no country breakdown. Families who want permanent residence for a parent instead follow the ${h.a('parents-grandparents', 'parents and grandparents sponsorship')}, a different program with its own queue.</p>
`,
  },
  fr: {
    slug: 'delai-super-visa',
    nav: 'Super visa', card: 'Parents et grands-parents : délai par pays et tendance',
    title: 'Délai du super visa par pays de dépôt, relevé IRCC 2026',
    description: 'Délai du super visa en 2026 pour chaque pays où IRCC en publie un : chiffre actuel, rang parmi les pays, sommet depuis 2024 et date de décision estimée.',
    h1: 'Délai du super visa pour parents et grands-parents',
    intro: `Le ${F.day(D)}, IRCC publiait un délai de super visa pour ${F.n(timed.length)} pays, de ${K.fmtTime(rng.lo[1], 'fr')} à ${K.fmtTime(rng.hi[1], 'fr')}.`,
    resume: `Un super visa pour parent ou grand-parent prend en ce moment ${K.fmtTime(t('MA'), 'fr')} pour une demande faite depuis le Maroc, ${K.fmtTime(t('DZ'), 'fr')} depuis l’Algérie, ${K.fmtTime(t('CM'), 'fr')} depuis le Cameroun et ${K.fmtTime(t('TN'), 'fr')} depuis la Tunisie, selon les chiffres publiés par IRCC le ${F.day(D)}. Seuls ${F.n(timed.length)} des ${F.n(listed.length)} pays de la liste d’IRCC ont un délai de super visa ; les ${F.n(noFigure)} autres n’affichent rien, faute d’un nombre suffisant de demandes tranchées récemment. Parmi les pays chiffrés, la valeur du milieu est de ${F.n(median)} jours, ${F.n(under60)} pays sont à 60 jours ou moins et ${F.n(over120)} dépassent 120 jours. La France n’a pas de chiffre publié pour ce visa. Le Maroc est passé de ${F.d(maT.first!)} dans la plus ancienne copie de notre archive (${F.day(maT.firstDate!)}) à ${F.d(maT.last)} aujourd’hui. Le super visa est en général plus lent qu’un visa de visiteur ordinaire depuis le même pays : c’est le cas dans ${F.n(slower)} des ${F.n(pair.length)} grands pays où les deux sont publiés. Le chiffre décrit 80 % des décisions récentes, pas une date promise pour votre dossier.`,
    faqs: [
      { q: 'Quel est le délai du super visa depuis le Maroc ?', a: `Le chiffre publié par IRCC le ${F.day(D)} est de ${K.fmtTime(t('MA'), 'fr')} pour un super visa demandé depuis le Maroc, soit le rang ${F.n(rankOf('MA'))} sur ${F.n(timed.length)} pays, du plus rapide au plus lent. Le compteur part de la réception de la demande complète ; le rendez-vous de biométrie et l’examen médical se font à côté.` },
      { q: 'Pourquoi le super visa est-il plus long qu’un visa de visiteur ?', a: 'Le dossier contient plus de pièces à vérifier : examen médical aux fins de l’immigration, preuve d’assurance maladie privée et preuve que l’enfant ou le petit-enfant au Canada atteint le revenu minimal exigé. Chacune peut entraîner une demande de documents, et les dossiers plus lents entrent dans le seuil de 80 % publié par IRCC.' },
      { q: 'Pourquoi aucun délai de super visa n’est affiché pour la France ?', a: `IRCC n’affiche pas de chiffre quand trop peu de demandes d’un pays ont été terminées pendant la période mesurée. Le ${F.day(D)}, ${F.n(noFigure)} pays étaient dans ce cas, dont la France. Cela ne veut pas dire que les demandes y sont refusées : l’échantillon est simplement trop petit pour publier un chiffre fiable.` },
      { q: 'Un parent titulaire du super visa peut-il prolonger son séjour au Canada ?', a: 'Oui. Il peut demander une prolongation depuis le Canada avant la fin de la période autorisée. Cette demande passe par la ligne de la fiche du visiteur, un délai unique pour toutes les nationalités, qui a été beaucoup plus long que le super visa lui-même lors des derniers relevés.' },
    ],
    body: (h) => `
<h2>Le super visa dans les grands pays de dépôt</h2>
<p>Le tableau reprend le chiffre publié par IRCC le ${h.day(D)} pour les pays qui déposent le plus de demandes au Canada, le relevé précédent, la valeur la plus haute de notre archive et le rang du pays parmi les ${h.n(timed.length)} pays chiffrés (1 = le plus rapide). Les grands pays sans délai de super visa, comme la France, n’apparaissent pas : on ne les affiche pas à zéro.</p>
${h.table(['Pays', 'Délai publié', 'Relevé précédent', 'Plus haut gardé', 'Rang'], majorRows(h), `Super visa pour parents et grands-parents, chiffre d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Les écarts restent grands. Le Cameroun a atteint ${h.d(cmT.max)} le ${h.day(cmT.maxDate)} et se trouve aujourd’hui à ${h.d(cmT.last)}. L’Algérie est passée de ${h.d(dzT.first!)} dans la copie du ${h.day(dzT.firstDate!)} à ${h.d(dzT.last)}. Le Maroc, au plus bas à ${h.d(maT.min)} le ${h.day(maT.minDate)}, fait partie des pays les plus rapides de la liste.</p>
<h2>Super visa ou visa de visiteur : la comparaison par pays</h2>
<p>Beaucoup de familles se demandent si un visa de visiteur ordinaire arriverait plus vite. Les chiffres ne répondent qu’à la question du délai : les deux documents ne donnent pas la même durée de séjour, et la vitesse ne devrait pas trancher seule. La dernière colonne donne le délai du super visa moins celui du visa de visiteur, sur le même relevé d’IRCC.</p>
${h.table(['Pays', 'Super visa', 'Visa de visiteur', 'Écart'], pairRows(h), `Les deux lignes viennent du fichier par pays d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>Dans ${h.n(slower)} de ces ${h.n(pair.length)} pays, le super visa est le plus lent des deux. L’écart vient des pièces propres à ce visa : l’examen médical doit être passé chez un médecin désigné par IRCC, l’assurance doit remplir les conditions décrites sur la ${h.src('super-visa', 'page du super visa d’IRCC')} et l’hôte au Canada doit prouver un revenu supérieur au seuil fixé pour la taille de sa famille. Une lettre qui manque ou une attestation d’assurance périmée suffit à mettre le dossier en attente.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'super-visa', c: 'MA', m: 'none' }, t: 'Votre super visa : date de décision estimée' })}
<h2>La série du Maroc, relevé par relevé</h2>
<p>Chaque ligne du tableau vient d’une copie datée du fichier d’IRCC. Notre archive a un long trou entre le ${h.day(gapFrom)} et le ${h.day(gapTo)} : aucune copie publique du fichier par pays n’a été conservée pendant cette période, et rien n’est inventé pour la combler.</p>
${h.hist(sv('MA'), { max: 10 })}
<p>Sur une série aussi courte, chaque relevé pèse lourd. Un pays qui dépose peu de super visas peut gagner ou perdre deux semaines d’un relevé à l’autre parce que deux ou trois dossiers ont demandé un contrôle de plus. Lisez la tendance sur plusieurs semaines plutôt que le dernier chiffre seul.</p>
<h2>Les extrêmes de la liste</h2>
<p>Le délai le plus court au ${h.day(D)} était de ${h.t(rng.lo[1])} pour ${h.cn(rng.lo[0])} ; le plus long, ${h.t(rng.hi[1])} pour ${h.cn(rng.hi[0])}. L’Inde est à ${h.t(t('IN'))}, la Chine à ${h.t(t('CN'))} et les Philippines à ${h.t(t('PH'))}. La moitié des pays chiffrés sont à ${h.n(median)} jours ou moins.</p>
<h2>À partir de quand compter</h2>
<p>Le délai court à partir du jour où IRCC reçoit la demande complète. La biométrie se donne dans un centre de réception des demandes de visa après la lettre de convocation, et cette étape n’entre pas dans le délai publié ; la ${h.src('biometrics', 'page sur la biométrie')} précise qui doit la fournir. Si la demande est partie avant l’examen médical, le compteur tourne quand même, mais la décision attend les résultats de l’examen. La façon dont nous relevons et datons les chiffres est décrite sur la ${h.a('method', 'page de méthode')}.</p>
<p>Une fois le parent au Canada, la prolongation du séjour se demande sur place et suit la ligne de la ${h.a('visitor-record', 'fiche du visiteur')}, sans détail par pays. Pour une résidence permanente, la voie est le ${h.a('parents-grandparents', 'parrainage des parents et grands-parents')}, un autre programme avec sa propre file.</p>
`,
  },
});
