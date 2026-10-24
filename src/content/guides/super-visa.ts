import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { extremes } from '../../lib/engine/times';

/* Super visa : norme de service d'IRCC (Inventaire des services du GC), visas de visiteur et admissions de parents
 * et grands-parents (données ouvertes d'IRCC, OGL-Canada 2.0). Aucun délai de canada.ca n'est repris. */
const E = K.en, F = K.fr;
const sv = K.stdOf('super-visa')!, vv = K.stdOf('visitor')!;
const v1 = K.ops12('v1');
const pgp = K.pr12('pgp');
const pgpY = (y: string) => K.yearSum(K.prSeries('pgp'), K.PRD.months, y);
const p23 = pgpY('2023')!, p24 = pgpY('2024')!, p25 = pgpY('2025')!;
const pgpExt = extremes(K.prSeries('pgp'), K.PRD.months);
const missed = sv.cur.total != null && sv.cur.met != null ? sv.cur.total - sv.cur.met : null;
const gap = sv.cur.perf != null && vv.cur.perf != null ? Math.round((sv.cur.perf - vv.cur.perf) * 10) / 10 : null;
if (gap == null || gap <= 0) throw new Error('super-visa : le texte suppose une norme du super visa mieux tenue que celle du visa de visiteur');
const above = sv.cur.perf != null && sv.cur.target != null && sv.cur.perf >= sv.cur.target * 100;
const better = (a: number | null | undefined, b: number | null | undefined) => a != null && b != null && a > b;
const IN = K.ops12('v1', 'IN'), CN = K.ops12('v1', 'CN'), PH = K.ops12('v1', 'PH');
const MA = K.ops12('v1', 'MA'), DZ = K.ops12('v1', 'DZ'), HT = K.ops12('v1', 'HT');

function stdRows(h: Helpers) {
  const fr = h.lang === 'fr';
  return [sv, vv].map((x, i) => [
    i === 0 ? (fr ? 'Super visa (parents et grands-parents)' : 'Super visa (parents and grandparents)') : (fr ? 'Nouveau visa de visiteur, demande hors du Canada' : 'New visitor visa, applied from outside Canada'),
    K.fmtStd(x.cur, h.lang), h.pct(x.prev?.perf), h.pct(x.cur.perf), h.n(x.cur.total),
  ]);
}

export default defineGuide({
  id: 'super-visa', group: 'visit', order: 11,
  tool: 'delai', toolArg: { g: 'super-visa', c: 'IN', only: 'super-visa,visitor,visitor-inside,visitor-record' },
  related: ['visitor-visa', 'visitor-record', 'parents-grandparents', 'india', 'china', 'beyond-processing-time'],
  sources: ['ptimes', 'super-visa', 'od-std', 'open-data', 'od-pr', 'ogl'],
  en: {
    slug: 'super-visa-processing-time',
    nav: 'Super visa', card: 'Parents and grandparents: IRCC’s 112-day target and how often it holds',
    title: 'Super Visa Processing Time for Parents and Grandparents 2026',
    description: 'Super visa processing in 2026: IRCC’s service standard, the share of applications that met it, and your own decision date from the time IRCC shows you.',
    h1: 'Super visa: IRCC’s target, its record, and your own date',
    intro: `IRCC aims to decide a super visa within ${K.fmtStd(sv.cur, 'en')}; in ${K.fmtFy(sv.fy, 'en')} it did so for ${E.pct(sv.cur.perf)} of applications.`,
    resume: `The super visa lets a parent or grandparent of a Canadian citizen or permanent resident visit for up to five years at a time, and IRCC sets it a service standard of ${K.fmtStd(sv.cur, 'en')} for 80% of new applications. In the Government of Canada service inventory, published as open data, IRCC reports that ${E.n(sv.cur.met)} of ${E.n(sv.cur.total)} super visa applications met that standard in ${K.fmtFy(sv.fy, 'en')}, or ${E.pct(sv.cur.perf)}, against ${E.pct(sv.prev?.perf)} in ${K.fmtFy(sv.pfy!, 'en')}. That record is far better than for an ordinary visitor visa, whose much shorter standard of ${K.fmtStd(vv.cur, 'en')} held for only ${E.pct(vv.cur.perf)} of files. The time for your own country is the one IRCC shows on its “Check processing times” tool: copy it into the calculator above with the day IRCC received your application to get an estimated decision date. The calculator opens with the ${K.fmtStd(sv.cur, 'en')} standard filled in, as a starting point you replace.`,
    faqs: [
      { q: 'What is IRCC’s service standard for a super visa?', a: `IRCC aims to process new parent and grandparent super visa applications within ${K.fmtStd(sv.cur, 'en')}, for 80% of files. Its own reporting, published as open data, shows that ${E.pct(sv.cur.perf)} of ${E.n(sv.cur.total)} applications met that target in ${K.fmtFy(sv.fy, 'en')}. The standard is a target for the whole program, not the time for your country, which IRCC shows on its tool.` },
      { q: 'Is a super visa slower than a regular visitor visa?', a: `Its standard is longer: ${K.fmtStd(sv.cur, 'en')} against ${K.fmtStd(vv.cur, 'en')} for a visitor visa. The super visa file is heavier, with proof of private medical insurance and a letter of support from the child or grandchild in Canada, so the comparison that matters is the time IRCC shows for your country on its tool, not the two standards.` },
      { q: 'Does the super visa count as a step toward sponsoring my parents?', a: `No. The super visa is a temporary visit, while sponsorship gives permanent residence and goes through a separate program with its own intake. In IRCC’s open data, ${E.n(pgp.last)} sponsored parents and grandparents became permanent residents over the latest twelve months. Holding a super visa does not move a parent up that line.` },
    ],
    body: (h) => `
<h2>The standard IRCC sets itself</h2>
<p>IRCC publishes, for its main services, a service standard and a yearly count of how many files met it. Those figures sit in the Government of Canada service inventory, which the Treasury Board Secretariat releases as ${h.src('od-std', 'open data')}. For the super visa, the standard is ${K.fmtStd(sv.cur, 'en')} for 80% of new applications. The table compares it with the standard for an ordinary visitor visa, for the two latest fiscal years IRCC reported.</p>
${h.table(['Application', 'Standard', `Met, ${K.fmtFy(sv.pfy!, 'en')}`, `Met, ${K.fmtFy(sv.fy, 'en')}`, `Applications, ${K.fmtFy(sv.fy, 'en')}`], stdRows(h), 'Share of applications processed within IRCC’s service standard. Source: GC Service Inventory, service standards and performance results, open data.', ['l', 'r', 'r', 'r', 'r'])}
<p>The super visa ${above ? 'stayed above' : 'fell short of'} its own 80% target in ${K.fmtFy(sv.fy, 'en')}: ${h.pct(sv.cur.perf)} of files within the standard, ${better(sv.cur.perf, sv.prev?.perf) ? 'up from' : 'compared with'} ${h.pct(sv.prev?.perf)} the year before. About ${h.n(missed)} applications still took longer than ${K.fmtStd(sv.cur, 'en')}. The gap with the ordinary visitor visa, ${h.n(gap, 1)} percentage points in the share of files on time, comes from two very different standards rather than from a faster office: a two-week target is hard to hold for a line that receives millions of applications.</p>
<h2>From the time on IRCC’s tool to a date</h2>
<p>IRCC shows a super visa time for each country of filing on its ${h.src('ptimes', '“Check processing times” tool')}. That figure is a past time: how long IRCC took to finish 80% of the super visa applications it decided recently for that country. Copy it into the calculator with its unit, then enter the month and day IRCC received the complete application. The result is the filing date plus that time. If the date is behind you, the calculator says by how many days the file is past the time you entered.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'super-visa', m: 'none' }, t: 'Your super visa: estimated decision date' })}
<p>Three parts of a super visa file add weeks that no published time covers. Parents give biometrics at a visa application centre, often in a city far from home. Many need an immigration medical exam by a panel physician. And the insurance policy must meet the program’s rules on coverage and duration, which IRCC checks before it decides. Count those steps before you plan a flight.</p>
<h2>Where super visa applicants come from</h2>
<p>IRCC does not publish super visa counts by country in its open data, but it does publish the visitor visas it approves, a family that includes the super visa. From ${h.w12()}, IRCC approved ${h.n(v1.last)} visitor visas, ${h.ch(v1.change)} on the twelve months before. Citizens of India received ${h.n(IN.last)} of them, China ${h.n(CN.last)} and the Philippines ${h.n(PH.last)}. A visitor visa count is a ceiling, not a super visa count: it mixes short tourist trips with five-year family stays.</p>
<h2>Super visa or sponsorship</h2>
<p>A super visa is a visit. The ${h.a('parents-grandparents', 'parents and grandparents sponsorship')} program grants permanent residence instead, through a limited intake. IRCC’s open data counts the parents and grandparents admitted as permanent residents: ${h.n(p23)} in 2023, ${h.n(p24)} in 2024 and ${h.n(p25)} in 2025, with ${h.n(pgp.last)} over the latest twelve months. The monthly count peaked at ${h.n(pgpExt.hi?.[1])} in ${h.my(pgpExt.hi?.[0] ?? K.PRD.months[0])}. Many families use the super visa while they wait for an invitation to sponsor, since the two can run side by side.</p>
<h2>When the date passes</h2>
<p>If the decision is late, check that the date you entered is the day IRCC received the complete application, after the insurance proof and the letter of support were in. Then follow the ${h.a('beyond-processing-time', 'steps for an application past the processing time')}. Parents who are already in Canada and want to stay longer than their visa allows apply for a ${h.a('visitor-record', 'visitor record')} instead of a new super visa.</p>
`,
  },
  fr: {
    slug: 'delai-super-visa',
    nav: 'Super visa', card: 'Parents et grands-parents : la cible de 112 jours d’IRCC et son bilan',
    title: 'Délai du super visa pour parents et grands-parents 2026',
    description: 'Super visa en 2026 : la norme de service d’IRCC, la part des demandes qui l’ont respectée et votre date de décision à partir du délai affiché par IRCC.',
    h1: 'Super visa : la cible d’IRCC, son bilan et votre propre date',
    intro: `IRCC vise une décision sur le super visa en ${K.fmtStd(sv.cur, 'fr')} ; en ${K.fmtFy(sv.fy, 'fr')}, il y est parvenu pour ${F.pct(sv.cur.perf)} des demandes.`,
    resume: `Le super visa permet au parent ou au grand-parent d’un citoyen canadien ou d’un résident permanent de séjourner jusqu’à cinq ans d’affilée, et IRCC lui fixe une norme de service de ${K.fmtStd(sv.cur, 'fr')} pour 80 % des nouvelles demandes. Dans l’inventaire des services du gouvernement du Canada, publié en données ouvertes, IRCC indique que ${F.n(sv.cur.met)} des ${F.n(sv.cur.total)} demandes de super visa ont respecté cette norme en ${K.fmtFy(sv.fy, 'fr')}, soit ${F.pct(sv.cur.perf)}, contre ${F.pct(sv.prev?.perf)} en ${K.fmtFy(sv.pfy!, 'fr')}. C’est bien mieux que pour un visa de visiteur ordinaire, dont la norme beaucoup plus courte de ${K.fmtStd(vv.cur, 'fr')} n’a été tenue que pour ${F.pct(vv.cur.perf)} des dossiers. Le délai de votre pays est celui qu’IRCC affiche dans son outil « Vérifier les délais de traitement » : recopiez-le dans le calculateur ci-dessus avec le jour de réception de la demande pour obtenir une date de décision estimée. Le calculateur s’ouvre avec la norme de ${K.fmtStd(sv.cur, 'fr')}, un point de départ à remplacer.`,
    faqs: [
      { q: 'Quelle est la norme de service d’IRCC pour un super visa ?', a: `IRCC vise à traiter les nouvelles demandes de super visa pour parents et grands-parents en ${K.fmtStd(sv.cur, 'fr')}, pour 80 % des dossiers. Ses propres résultats, publiés en données ouvertes, montrent que ${F.pct(sv.cur.perf)} des ${F.n(sv.cur.total)} demandes ont respecté cette cible en ${K.fmtFy(sv.fy, 'fr')}. La norme vaut pour tout le programme : le délai de votre pays est celui de l’outil d’IRCC.` },
      { q: 'Le super visa est-il plus long qu’un visa de visiteur ordinaire ?', a: `Sa norme est plus longue : ${K.fmtStd(sv.cur, 'fr')} contre ${K.fmtStd(vv.cur, 'fr')} pour un visa de visiteur. Le dossier est plus lourd, avec une preuve d’assurance médicale privée et une lettre d’appui de l’enfant ou du petit-enfant au Canada. La comparaison utile reste le délai qu’IRCC affiche pour votre pays dans son outil, pas les deux normes.` },
      { q: 'Le super visa rapproche-t-il du parrainage des parents ?', a: `Non. Le super visa est une visite temporaire, alors que le parrainage donne la résidence permanente par un programme distinct, avec ses propres invitations. Dans les données ouvertes d’IRCC, ${F.n(pgp.last)} parents et grands-parents parrainés sont devenus résidents permanents sur les douze derniers mois. Détenir un super visa ne fait pas avancer un parent dans cette file.` },
    ],
    body: (h) => `
<h2>La norme qu’IRCC se fixe</h2>
<p>Pour ses principaux services, IRCC publie une norme de service et, chaque année, le nombre de dossiers qui l’ont respectée. Ces chiffres figurent dans l’inventaire des services du gouvernement du Canada, que le Secrétariat du Conseil du Trésor diffuse en ${h.src('od-std', 'données ouvertes')}. Pour le super visa, la norme est de ${K.fmtStd(sv.cur, 'fr')} pour 80 % des nouvelles demandes. Le tableau la compare à celle d’un visa de visiteur ordinaire, pour les deux derniers exercices déclarés par IRCC.</p>
${h.table(['Demande', 'Norme', `Tenue, ${K.fmtFy(sv.pfy!, 'fr')}`, `Tenue, ${K.fmtFy(sv.fy, 'fr')}`, `Demandes, ${K.fmtFy(sv.fy, 'fr')}`], stdRows(h), 'Part des demandes traitées dans la norme de service d’IRCC. Source : Inventaire des services du GC, normes de service et résultats, données ouvertes.', ['l', 'r', 'r', 'r', 'r'])}
<p>Le super visa ${above ? 'est resté au-dessus de' : 'est resté sous'} sa propre cible de 80 % en ${K.fmtFy(sv.fy, 'fr')} : ${h.pct(sv.cur.perf)} des dossiers dans la norme, ${better(sv.cur.perf, sv.prev?.perf) ? 'contre' : 'à comparer à'} ${h.pct(sv.prev?.perf)} l’année précédente. Environ ${h.n(missed)} demandes ont tout de même dépassé ${K.fmtStd(sv.cur, 'fr')}. L’écart avec le visa de visiteur ordinaire, ${h.n(gap, 1)} points de pourcentage de dossiers dans les temps, tient à deux normes très différentes plutôt qu’à un bureau plus rapide : une cible de deux semaines est difficile à tenir pour une ligne qui reçoit des millions de demandes.</p>
<h2>Du délai de l’outil d’IRCC à une date</h2>
<p>IRCC affiche un délai de super visa pour chaque pays de dépôt dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. Ce chiffre est un délai passé : le temps qu’il lui a fallu pour terminer 80 % des demandes de super visa tranchées récemment pour ce pays. Recopiez-le dans le calculateur avec son unité, puis indiquez le mois et le jour où IRCC a reçu la demande complète. Le résultat est la date de dépôt plus ce délai. Si la date est passée, le calculateur dit de combien de jours le dossier dépasse le délai saisi.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'super-visa', c: 'MA', m: 'none' }, t: 'Votre super visa : date de décision estimée' })}
<p>Trois étapes d’un dossier de super visa ajoutent des semaines qu’aucun délai publié ne couvre. Les parents donnent leurs données biométriques dans un centre de réception des demandes de visa, souvent dans une ville éloignée. Beaucoup doivent passer un examen médical auprès d’un médecin désigné. Et la police d’assurance doit respecter les règles du programme sur la couverture et la durée, ce qu’IRCC vérifie avant de décider. Comptez ces étapes avant de réserver un vol.</p>
<h2>D’où viennent les demandeurs</h2>
<p>IRCC ne publie pas de nombre de super visas par pays dans ses données ouvertes, mais il publie les visas de visiteur approuvés, une famille qui comprend le super visa. De ${h.w12()}, IRCC a approuvé ${h.n(v1.last)} visas de visiteur, soit ${h.ch(v1.change)} par rapport aux douze mois d’avant. Les citoyens marocains en ont reçu ${h.n(MA.last)}, les Algériens ${h.n(DZ.last)} et les Haïtiens ${h.n(HT.last)}. Ce décompte est un plafond, pas un nombre de super visas : il mêle de courts séjours touristiques et des visites familiales de cinq ans.</p>
<h2>Super visa ou parrainage</h2>
<p>Un super visa est une visite. Le ${h.a('parents-grandparents', 'parrainage des parents et grands-parents')} donne au contraire la résidence permanente, par des invitations en nombre limité. Les données ouvertes d’IRCC comptent les parents et grands-parents admis comme résidents permanents : ${h.n(p23)} en 2023, ${h.n(p24)} en 2024 et ${h.n(p25)} en 2025, et ${h.n(pgp.last)} sur les douze derniers mois. Le nombre mensuel a culminé à ${h.n(pgpExt.hi?.[1])} en ${h.my(pgpExt.hi?.[0] ?? K.PRD.months[0])}. Beaucoup de familles utilisent le super visa en attendant une invitation à parrainer, les deux démarches pouvant avancer en parallèle.</p>
<h2>Quand la date est passée</h2>
<p>Si la décision tarde, vérifiez que la date saisie est bien celle où IRCC a reçu la demande complète, preuve d’assurance et lettre d’appui comprises. Suivez ensuite les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')}. Les parents déjà au Canada qui veulent rester au-delà de ce que leur visa permet demandent une ${h.a('visitor-record', 'fiche du visiteur')} plutôt qu’un nouveau super visa.</p>
`,
  },
});
