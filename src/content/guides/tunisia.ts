import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tm, tr, rankText, rankOf, median, lines, ser } from './_pays';

/* Tunisie : l'un des super visas les plus rapides, des permis d'études et de travail courts. */
const C = 'TN';
const D = K.L.dates.country;
const E = K.en, F = K.fr;
const vi = tr('visitor', C)!, sv = tr('super-visa', C)!, st = tr('study', C)!, wk = tr('work', C)!;
const ft = (g: 'visitor' | 'super-visa' | 'study' | 'work' | 'child', l: 'en' | 'fr') => K.fmtTime(tm(g, C), l);
const svPts = K.points(ser('super-visa', C));
const R = K.HIST.readings.country;
const svMissing = R.filter((r) => !svPts.some((p) => p.date === r.ircc)).map((r) => r.ircc);
const svRank = rankOf('super-visa', C)!;
const NB = ['TN', 'MA', 'DZ', 'EG', 'LY'].filter((c) => K.countriesOf('study').includes(c));
const nbRows = (l: 'en' | 'fr') => NB.map((c) => [K.countryName(c, l), ...(['super-visa', 'study', 'work', 'visitor'] as const).map((g) => K.fmtTime(tm(g, c), l))]);
const fastest = (g: 'super-visa' | 'study' | 'work' | 'visitor') => [...NB].sort((a, b) => (K.daysOf(tm(g, a)) ?? 1e9) - (K.daysOf(tm(g, b)) ?? 1e9))[0];

export default defineGuide({
  id: 'tunisia', group: 'countries', order: 113, country: C,
  tool: 'delai', toolArg: { g: 'super-visa', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['super-visa', 'work-permit', 'study-permit', 'visitor-visa', 'morocco', 'algeria'],
  sources: ['ptimes-country', 'super-visa', 'study-permit', 'work-permit', 'wayback'],
  en: {
    slug: 'processing-times-tunisia',
    nav: 'Tunisia', card: 'One of the fastest super visas, short study and work permits',
    title: 'Super Visa and Study Permit Times from Tunisia, 2026',
    description: 'Canadian super visa, study permit, work permit and visitor visa processing times for applicants in Tunisia in 2026, ranked against other countries, history.',
    h1: 'Processing times for applications filed from Tunisia',
    intro: `In IRCC’s file of ${E.day(D)}, the super visa from Tunisia takes ${ft('super-visa', 'en')}, ${rankText('super-visa', C, 'en')} countries with a figure.`,
    resume: `Tunisia is one of the quicker countries to file from. IRCC’s country file of ${E.day(D)} gives ${ft('super-visa', 'en')} for a parent and grandparent super visa, ${ft('study', 'en')} for a study permit, ${ft('work', 'en')} for a work permit and ${ft('visitor', 'en')} for a visitor visa. The super visa ranks ${rankText('super-visa', C, 'en')} countries with a published figure, where the middle value is ${E.d(median('super-visa'))}; the study permit ranks ${rankText('study', C, 'en')} and the work permit ${rankText('work', C, 'en')}. The visitor visa is the line that sits mid-table, after reading ${E.d(vi.first!)} in our oldest copy, dated ${E.day(vi.firstDate!)}. Dependent children have no published time for Tunisia. Each figure is a past time: the delay within which IRCC finished 80% of recent files from Tunisia, counted from receipt of a complete application, without the time needed to give biometrics at a visa application centre.`,
    faqs: [
      { q: 'How long does a super visa take from Tunisia?', a: `${ft('super-visa', 'en')} in IRCC’s file of ${E.day(D)}, which makes Tunisia ${rankText('super-visa', C, 'en')} countries. Our oldest copy, dated ${E.day(sv.firstDate!)}, showed ${E.d(sv.first!)}. The application still needs the host’s proof of income, a letter of invitation and private medical insurance from a Canadian or approved insurer, so prepare those first.` },
      { q: 'Is a study permit from Tunisia faster than from Morocco or Algeria?', a: `At IRCC’s update of ${E.day(D)}, yes: ${ft('study', 'en')} from Tunisia against ${K.fmtTime(K.readingOf('study', 'MA').t, 'en')} from Morocco and ${K.fmtTime(K.readingOf('study', 'DZ').t, 'en')} from Algeria. These lines move every week, so compare them again in the tool on the day you actually apply.` },
      { q: 'Why is there no super visa figure for some weeks?', a: `IRCC sometimes publishes no number for a line, for instance when too few files were decided. For Tunisia’s super visa, ${svMissing.length ? `the copy dated ${E.day(svMissing[0])} has none` : 'every copy has a figure'}; the archive leaves such a week empty instead of filling it with a guess.` },
    ],
    body: (h) => `
<h2>Every line from Tunisia</h2>
${lines(h, C, ['super-visa', 'study', 'work', 'visitor', 'child'])}
<h2>The super visa</h2>
<p>The super visa lets a parent or grandparent of a Canadian citizen or permanent resident stay up to five years at a time, on a visa valid for up to ten years. From Tunisia it takes ${h.t(tm('super-visa', C))}, which places it ${svRank.pos === 1 ? 'first' : `${h.n(svRank.pos)}th`} among ${h.n(svRank.of)} countries. In most countries this line is much slower than an ordinary visitor visa; from Tunisia it is currently the faster of the two.</p>
${h.hist(ser('super-visa', C), { max: 10 })}
${h.mini('delai', { p: ['m'], d: { g: 'super-visa', c: C, m: 'none' }, t: 'Super visa from Tunisia: your date' })}
<p>The application needs a letter in which the child or grandchild in Canada promises financial support and shows income at or above the low-income cut-off for the household, plus at least one year of private health insurance. None of that is counted in IRCC’s figure, which starts when the complete application arrives.</p>
<h2>Studies and work</h2>
<p>A study permit from Tunisia takes ${h.t(tm('study', C))}, against ${h.d(st.first!, 'w')} in the copy of ${h.day(st.firstDate!)}. Students admitted in Quebec need the CAQ first; elsewhere, most need a provincial attestation letter. Work permits take ${h.t(tm('work', C))}, down from ${h.d(wk.first!, 'w')} in the same oldest copy. Employer-specific permits usually follow the employer’s Labour Market Impact Assessment, which is a separate wait.</p>
<h2>The visitor visa</h2>
<p>At ${h.t(tm('visitor', C))}, the visitor visa ranks ${rankText('visitor', C, 'en')} countries. It read ${h.d(vi.first!)} on ${h.day(vi.firstDate!)}, and readings since July 2026 have stayed within a few days of each other. For a short family visit, apply early enough to cover the biometrics appointment, which IRCC does not count.</p>
<h2>Children and spouses</h2>
<p>IRCC publishes no dependent child time for Tunisia: the line is marked as not having enough recent decisions. Spouses and partners are not in the country file at all; their permanent residence applications follow the national forward-looking times shown on the ${h.a('spousal-sponsorship', 'spousal sponsorship page')}, which depend on where the couple lives, not on the country of citizenship.</p>
<h2>Tunisia and its neighbours</h2>
<p>Comparing North African lines on the same date shows how much the office and the country matter. On ${h.day(D)}, the quickest of these countries for a study permit was ${h.cn(fastest('study'))}, for a work permit ${h.cn(fastest('work'))}, for a super visa ${h.cn(fastest('super-visa'))} and for a visitor visa ${h.cn(fastest('visitor'))}. No line is fastest everywhere, which is why a single regional figure would mislead.</p>
${h.table(['Country', 'Super visa', 'Study permit', 'Work permit', 'Visitor visa'], nbRows('en'), `IRCC country file of ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>A country with fewer applications can also jump from one week to the next, so read the change since the previous reading before drawing conclusions from a single figure.</p>
<h2>Reading the estimate</h2>
<p>Biometrics come on top: fingerprints and a photo, given at a visa application centre after IRCC’s instruction letter, and not counted in the published time.</p>
<p>Choose your line and the month IRCC received your file: the tool adds the published time and shows the table of the main countries on the same date. A Tunisian living legally in France or Germany who applies from there falls under that country’s figure, not Tunisia’s.</p>
`,
  },
  fr: {
    slug: 'delais-tunisie',
    nav: 'Tunisie', card: 'Un des super visas les plus rapides, permis d’études et de travail courts',
    title: 'Délai super visa et permis d’études depuis la Tunisie, 2026',
    description: 'Délais canadiens du super visa, du permis d’études, du permis de travail et du visa de visiteur depuis la Tunisie en 2026, rang parmi les pays, historique.',
    h1: 'Délais des demandes déposées depuis la Tunisie',
    intro: `Dans le fichier d’IRCC du ${F.day(D)}, le super visa depuis la Tunisie prend ${ft('super-visa', 'fr')}, au ${rankText('super-visa', C, 'fr')} pays chiffrés.`,
    resume: `La Tunisie fait partie des pays d’où l’on dépose le plus vite. Le fichier par pays d’IRCC du ${F.day(D)} donne ${ft('super-visa', 'fr')} pour le super visa des parents et grands-parents, ${ft('study', 'fr')} pour un permis d’études, ${ft('work', 'fr')} pour un permis de travail et ${ft('visitor', 'fr')} pour un visa de visiteur. Le super visa est au ${rankText('super-visa', C, 'fr')} pays qui ont un chiffre, pour une valeur médiane de ${F.d(median('super-visa'))} ; le permis d’études est au ${rankText('study', C, 'fr')} et le permis de travail au ${rankText('work', C, 'fr')}. Le visa de visiteur est la ligne qui se situe au milieu du classement, après ${F.d(vi.first!)} dans notre plus ancienne copie, datée du ${F.day(vi.firstDate!)}. Les enfants à charge n’ont pas de délai publié pour la Tunisie. Chaque chiffre est un délai passé : le temps dans lequel IRCC a terminé 80 % des dossiers récents venus de Tunisie, à partir de la réception d’une demande complète, sans le temps de la biométrie dans un centre de réception des demandes de visa.`,
    faqs: [
      { q: 'Combien de temps prend un super visa depuis la Tunisie ?', a: `${ft('super-visa', 'fr')} dans le fichier d’IRCC du ${F.day(D)}, soit le ${rankText('super-visa', C, 'fr')} pays. Notre plus ancienne copie, datée du ${F.day(sv.firstDate!)}, indiquait ${F.d(sv.first!)}. La demande exige toujours la preuve de revenu de l’hôte, une lettre d’invitation et une assurance médicale privée d’un assureur canadien ou agréé : préparez-les d’abord.` },
      { q: 'Le permis d’études est-il plus rapide depuis la Tunisie que depuis le Maroc ou l’Algérie ?', a: `À la mise à jour d’IRCC du ${F.day(D)}, oui : ${ft('study', 'fr')} depuis la Tunisie, contre ${K.fmtTime(K.readingOf('study', 'MA').t, 'fr')} depuis le Maroc et ${K.fmtTime(K.readingOf('study', 'DZ').t, 'fr')} depuis l’Algérie. Ces lignes bougent chaque semaine : comparez-les à nouveau dans l’outil le jour où vous déposez.` },
      { q: 'Pourquoi certaines semaines n’ont-elles pas de chiffre pour le super visa ?', a: `IRCC ne publie parfois aucun nombre pour une ligne, par exemple quand trop peu de dossiers ont été tranchés. Pour le super visa depuis la Tunisie, ${svMissing.length ? `la copie du ${F.day(svMissing[0])} n’en a pas` : 'chaque copie a un chiffre'} ; l’archive laisse alors la semaine vide au lieu de la combler par une supposition.` },
    ],
    body: (h) => `
<h2>Toutes les lignes depuis la Tunisie</h2>
${lines(h, C, ['super-visa', 'study', 'work', 'visitor', 'child'])}
<h2>Le super visa</h2>
<p>Le super visa permet au parent ou au grand-parent d’un citoyen canadien ou d’un résident permanent de rester jusqu’à cinq ans d’affilée, avec un visa valable jusqu’à dix ans. Depuis la Tunisie, il prend ${h.t(tm('super-visa', C))}, ce qui le place au ${svRank.pos === 1 ? '1er' : `${h.n(svRank.pos)}e`} rang sur ${h.n(svRank.of)} pays. Dans la plupart des pays, cette ligne est bien plus lente qu’un visa de visiteur ordinaire ; depuis la Tunisie, c’est en ce moment la plus rapide des deux.</p>
${h.hist(ser('super-visa', C), { max: 10 })}
${h.mini('delai', { p: ['m'], d: { g: 'super-visa', c: C, m: 'none' }, t: 'Super visa depuis la Tunisie : votre date' })}
<p>La demande exige une lettre dans laquelle l’enfant ou le petit-enfant au Canada s’engage à subvenir aux besoins du parent et prouve un revenu au moins égal au seuil de faible revenu du ménage, ainsi qu’au moins un an d’assurance maladie privée. Rien de cela n’entre dans le chiffre d’IRCC, qui part de l’arrivée de la demande complète.</p>
<h2>Études et travail</h2>
<p>Un permis d’études depuis la Tunisie prend ${h.t(tm('study', C))}, contre ${h.d(st.first!, 'w')} dans la copie du ${h.day(st.firstDate!)}. Les étudiants admis au Québec ont besoin du CAQ d’abord ; ailleurs, la plupart ont besoin d’une lettre d’attestation de la province. Un permis de travail prend ${h.t(tm('work', C))}, contre ${h.d(wk.first!, 'w')} dans la même copie. Un permis lié à un employeur suit en général l’étude d’impact sur le marché du travail obtenue par l’employeur, qui est une attente à part.</p>
<h2>Le visa de visiteur</h2>
<p>À ${h.t(tm('visitor', C))}, le visa de visiteur se classe au ${rankText('visitor', C, 'fr')} pays. Il indiquait ${h.d(vi.first!)} le ${h.day(vi.firstDate!)}, et les relevés depuis juillet 2026 sont restés à quelques jours les uns des autres. Pour une courte visite familiale, déposez assez tôt pour couvrir le rendez-vous de biométrie, qu’IRCC ne compte pas.</p>
<h2>Enfants et conjoints</h2>
<p>IRCC ne publie aucun délai d’enfant à charge pour la Tunisie : la ligne est marquée comme manquant de décisions récentes. Les époux et conjoints ne figurent pas dans le fichier par pays ; leur demande de résidence permanente suit les délais prospectifs nationaux de la ${h.a('spousal-sponsorship', 'page du parrainage de l’époux')}, qui dépendent du lieu de vie du couple et non de la nationalité.</p>
<h2>La Tunisie et ses voisins</h2>
<p>Comparer les lignes d’Afrique du Nord à la même date montre combien le bureau et le pays comptent. Au ${h.day(D)}, le plus rapide de ces pays était ${h.cn(fastest('study'))} pour un permis d’études, ${h.cn(fastest('work'))} pour un permis de travail, ${h.cn(fastest('super-visa'))} pour un super visa et ${h.cn(fastest('visitor'))} pour un visa de visiteur. Aucune ligne n’est la plus rapide partout : un chiffre régional unique induirait en erreur.</p>
${h.table(['Pays', 'Super visa', 'Permis d’études', 'Permis de travail', 'Visa de visiteur'], nbRows('fr'), `Fichier par pays d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Un pays qui dépose moins de demandes peut aussi bondir d’une semaine à l’autre : regardez l’écart avec le relevé précédent avant de tirer une conclusion d’un seul chiffre.</p>
<h2>La biométrie et les pièces à réunir</h2>
<p>Toute demande de visa ou de permis faite depuis la Tunisie exige empreintes et photo, données dans un centre de réception des demandes de visa après la lettre d’instruction d’IRCC. Ce rendez-vous n’est pas compté dans le délai publié, pas plus que le temps de réunir relevés bancaires, lettre d’invitation ou attestation d’études. Si vous avez donné votre biométrie deux semaines après la demande, ajoutez ces deux semaines à la date donnée par l’outil.</p>
<h2>Lire l’estimation</h2>
<p>Choisissez votre ligne et le mois où IRCC a reçu votre dossier : l’outil ajoute le délai publié et affiche le tableau des principaux pays à la même date. Un Tunisien qui réside légalement en France ou en Allemagne et dépose depuis ce pays relève du chiffre de ce pays, et non de celui de la Tunisie.</p>
`,
  },
});
