import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : admissions de résidents permanents par catégorie (Permanent Residents, Monthly IRCC Updates)
 * et norme de service du regroupement familial à l'étranger (Inventaire des services du GC), données ouvertes sous la
 * Licence du gouvernement ouvert du Canada. Le délai de l'outil d'IRCC est saisi par le lecteur. */
const E = K.en, F = K.fr;
const M = K.PRD.months;
const ser = K.prSeries('child');
const c12 = K.pr12('child'), sp = K.pr12('spouse'), pg = K.pr12('pgp'), all = K.pr12('all');
const yr = (y: string) => K.yearSum(ser, M, y) ?? 0;
const y23 = yr('2023'), y24 = yr('2024'), y25 = yr('2025');
const perMonth = Math.round((c12.last ?? 0) / 12);
const ratio = c12.last ? Math.round((sp.last ?? 0) / c12.last) : null;
const shareFam = K.pctOf(c12.last, (c12.last ?? 0) + (sp.last ?? 0) + (pg.last ?? 0));
const st = K.stdOf('child')!;
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');

export default defineGuide({
  id: 'dependent-child', group: 'family', order: 52,
  tool: 'delai', toolArg: { g: 'child', c: 'IN' },
  related: ['spousal-sponsorship', 'parents-grandparents', 'nigeria', 'india', 'haiti', 'beyond-processing-time'],
  sources: ['ptimes', 'od-pr', 'od-std', 'check-status', 'biometrics', 'ogl'],
  en: {
    slug: 'dependent-child-sponsorship-processing-time',
    nav: 'Dependent child', card: 'Decision date for a sponsored child, children admitted each year',
    title: 'Dependent Child Sponsorship Processing Time, 2026 Data',
    description: 'Estimate the decision date of a dependent child sponsorship from the time IRCC shows, and see how many sponsored children Canada admitted in 2026 data.',
    h1: 'Sponsoring a dependent child: your date and the yearly numbers',
    intro: `Canada admitted ${E.n(c12.last)} sponsored children as permanent residents from ${E.w12(M)}, about ${E.n(perMonth)} a month.`,
    resume: `A dependent child sponsored on its own, outside a spouse’s application, has its own line on IRCC’s “Check processing times” tool. Read that figure, enter it in the calculator above with the date IRCC received the complete application, and the result gives an estimated decision date with the days elapsed and those still ahead. Everything else on this page is drawn from Government of Canada open data released under the Open Government Licence of Canada. A child living abroad falls under IRCC’s service standard for the Family Class overseas: ${K.fmtStd(st.cur, 'en')} for 80% of applications, a target met for ${E.pct(st.cur.perf)} of the ${E.n(st.cur.total)} files processed in ${K.fmtFy(st.fy, 'en')}. Over ${E.w12(M)}, ${E.n(c12.last)} sponsored children became permanent residents, ${E.ch(c12.change)} on the twelve months before. That is a small stream: roughly one child for every ${ratio ?? 0} sponsored spouses, and ${E.pct(shareFam)} of all sponsored family admissions.`,
    faqs: [
      { q: 'Who counts as a dependent child for a Canadian sponsorship?', a: 'Under IRCC’s rules, a child under 22 who is not married or in a common law relationship, or an older child who has depended on the parent since before 22 because of a physical or mental condition. The age is assessed on the day IRCC receives the complete application, so a birthday during processing does not remove the child.' },
      { q: 'Does a child sponsored alone follow the same standard as a spouse?', a: `Yes, when the child lives outside Canada. IRCC groups spouses, partners and dependent children abroad under one Family Class overseas standard of ${K.fmtStd(st.cur, 'en')} for 80% of applications. The time shown on IRCC’s tool can still differ from the spouse lines, so copy the child line itself.` },
      { q: 'How many sponsored children are admitted to Canada each year?', a: `IRCC’s open data records ${E.n(y23)} sponsored children admitted in 2023, ${E.n(y24)} in 2024 and ${E.n(y25)} in 2025. The latest twelve months bring ${E.n(c12.last)}. Children included in a parent’s own permanent residence application are counted in that parent’s category, not here.` },
    ],
    body: (h) => `
<h2>A separate line for a child sponsored alone</h2>
<p>Most children come to Canada inside a parent’s application: they are listed as family members when a spouse is sponsored, or when a worker or a refugee applies. A child is sponsored on its own when the parent is already a permanent resident or a citizen and the child was left out, or was born or adopted later. That case has its own line on IRCC’s ${h.src('ptimes', '“Check processing times” tool')}, under family sponsorship. Copy that figure and its unit into the calculator, then add the day IRCC received the full package.</p>
<p>The calculator gives three answers: the estimated decision date, the days already gone since filing, and the share of the time used. A share above 100% means the file has run past the time you entered. That is a signal to check the file, not proof of a problem, because IRCC’s figure is an estimate for new files, worked out from the files waiting today.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'child', m: 'none' }, t: 'Your child sponsorship: estimated decision date' })}
<h2>The standard for children living abroad</h2>
<p>IRCC’s service standards are published in the Government of Canada service inventory, released as ${h.src('od-std', 'open data')}. A dependent child living outside Canada belongs to the Family Class overseas, the same group as spouses and partners abroad. The target is ${K.fmtStd(st.cur, 'en')} for 80% of applications. In ${K.fmtFy(st.fy, 'en')}, ${h.n(st.cur.met)} of ${h.n(st.cur.total)} applications were processed within it, ${h.pct(st.cur.perf)}, compared with ${h.pct(st.prev?.perf)} in ${K.fmtFy(st.pfy!, 'en')}. The inventory does not split children from spouses, so this rate describes the whole group.</p>
<h2>Sponsored children admitted, by month</h2>
<p>The open data on ${h.src('od-pr', 'permanent residents')} counts admissions under the category “sponsored children”. The latest twelve months total ${h.n(c12.last)}, ${dirEn(c12.change)} ${h.pa(c12.change)} on the twelve before. Across Canada, that is ${h.pct(K.pctOf(c12.last, all.last))} of all new permanent residents.</p>
${h.months(M, [['Sponsored children', ser]], { caption: 'Admissions of permanent residents in the sponsored children category, by month. Source: IRCC, Permanent Residents, Monthly IRCC Updates, open data; figures rounded.' })}
<p>Over full calendar years, IRCC admitted ${h.n(y23)} sponsored children in 2023, ${h.n(y24)} in 2024 and ${h.n(y25)} in 2025. Monthly figures move a lot in a stream this size, so a single low month says little; the twelve month total is the steadier measure. The category also covers adopted children and orphaned relatives sponsored under the same rules.</p>
<h2>Papers that often slow a child’s file</h2>
<p>A child’s application needs proof of the link to the sponsor, usually a full birth certificate naming the parents. When the other parent stays abroad, IRCC asks for that parent’s consent or a custody order. Missing consent is a frequent cause of letters asking for more documents, and each letter pauses the file. A child 14 or older also gives ${h.src('biometrics', 'biometrics')}, and every child takes a medical exam with a doctor approved by IRCC.</p>
<p>When a DNA test is the only way to prove the link, IRCC sends a letter that explains how to arrange it with an accredited laboratory. That step can add weeks, and the clock you entered keeps running. Keep a copy of every letter with its date, so you can tell how long the file waited on you.</p>
<h2>After the date has passed</h2>
<p>Use IRCC’s ${h.src('check-status', 'application status tool')} to see whether a request is waiting. If the file is past the time and nothing is pending, follow the ${h.a('beyond-processing-time', 'steps for a file past the processing time')}. For a child filed in India, Nigeria or Haiti, the pages on ${h.a('india', 'India')}, ${h.a('nigeria', 'Nigeria')} and ${h.a('haiti', 'Haiti')} give IRCC’s open data figures for citizens of those countries. A spouse is covered on the ${h.a('spousal-sponsorship', 'spousal sponsorship page')}.</p>
`,
  },
  fr: {
    slug: 'delai-parrainage-enfant-a-charge',
    nav: 'Enfant à charge', card: 'Date de décision pour un enfant parrainé, enfants admis par année',
    title: 'Délai du parrainage d’un enfant à charge, données 2026',
    description: 'Estimez la date de décision d’un parrainage d’enfant à charge à partir du délai d’IRCC, et voyez combien d’enfants parrainés le Canada accueille en 2026.',
    h1: 'Parrainer un enfant à charge : votre date et les chiffres de l’année',
    intro: `Le Canada a admis ${F.n(c12.last)} enfants parrainés comme résidents permanents de ${F.w12(M)}, environ ${F.n(perMonth)} par mois.`,
    resume: `Un enfant à charge parrainé seul, en dehors de la demande d’un époux, a sa propre ligne dans l’outil « Vérifier les délais de traitement » d’IRCC. Lisez ce chiffre, saisissez-le dans le calculateur ci-dessus avec la date à laquelle IRCC a reçu la demande complète, et vous obtenez une date de décision estimée, avec les jours écoulés et ceux qui restent. Tout le reste de la page provient des données ouvertes du gouvernement du Canada, publiées sous la Licence du gouvernement ouvert du Canada. Un enfant qui vit à l’étranger relève de la norme de service d’IRCC pour le regroupement familial à l’étranger : ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes, objectif tenu pour ${F.pct(st.cur.perf)} des ${F.n(st.cur.total)} dossiers traités en ${K.fmtFy(st.fy, 'fr')}. De ${F.w12(M)}, ${F.n(c12.last)} enfants parrainés sont devenus résidents permanents, soit ${F.ch(c12.change)} sur un an. C’est un petit volet : environ un enfant pour ${ratio ?? 0} époux parrainés, et ${F.pct(shareFam)} des admissions de la famille parrainée.`,
    faqs: [
      { q: 'Qui est un enfant à charge pour un parrainage au Canada ?', a: 'Selon les règles d’IRCC, un enfant de moins de 22 ans qui n’est ni marié ni en union de fait, ou un enfant plus âgé qui dépend du parent depuis avant ses 22 ans en raison d’un état physique ou mental. L’âge est fixé au jour où IRCC reçoit la demande complète : un anniversaire pendant le traitement ne fait pas sortir l’enfant.' },
      { q: 'L’enfant parrainé seul suit-il la même norme que l’époux ?', a: `Oui, s’il vit hors du Canada. IRCC regroupe époux, conjoints et enfants à charge à l’étranger sous une seule norme du regroupement familial à l’étranger, de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes. Le délai affiché par l’outil d’IRCC peut tout de même différer des lignes de l’époux : recopiez la ligne de l’enfant.` },
      { q: 'Combien d’enfants parrainés le Canada admet-il chaque année ?', a: `Les données ouvertes d’IRCC comptent ${F.n(y23)} enfants parrainés admis en 2023, ${F.n(y24)} en 2024 et ${F.n(y25)} en 2025. Les douze derniers mois en apportent ${F.n(c12.last)}. Les enfants inclus dans la demande de résidence permanente d’un parent sont comptés dans la catégorie de ce parent, pas ici.` },
    ],
    body: (h) => `
<h2>Une ligne à part pour l’enfant parrainé seul</h2>
<p>La plupart des enfants arrivent au Canada dans la demande d’un parent : ils figurent comme membres de la famille quand un époux est parrainé, ou quand un travailleur ou un réfugié dépose sa demande. Un enfant est parrainé seul quand le parent est déjà résident permanent ou citoyen et que l’enfant n’avait pas été inclus, ou qu’il est né ou a été adopté ensuite. Ce cas a sa propre ligne dans l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC, sous le parrainage familial. Recopiez ce chiffre et son unité dans le calculateur, puis la date de réception du dossier complet.</p>
<p>Le calculateur donne trois réponses : la date de décision estimée, les jours écoulés depuis le dépôt et la part du délai déjà consommée. Une part supérieure à 100 % signifie que le dossier a dépassé le délai saisi. C’est un signal pour vérifier le dossier, pas la preuve d’un problème, car le chiffre d’IRCC est une estimation pour les nouvelles demandes, calculée à partir des dossiers en attente aujourd’hui.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'child', m: 'none' }, t: 'Votre parrainage d’enfant : date de décision estimée' })}
<h2>La norme pour l’enfant qui vit à l’étranger</h2>
<p>Les normes de service d’IRCC figurent dans l’inventaire des services du gouvernement du Canada, publié en ${h.src('od-std', 'données ouvertes')}. Un enfant à charge qui vit hors du Canada appartient au regroupement familial à l’étranger, le même groupe que les époux et conjoints à l’étranger. L’objectif est de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes. En ${K.fmtFy(st.fy, 'fr')}, ${h.n(st.cur.met)} demandes sur ${h.n(st.cur.total)} ont été traitées dans ce délai, soit ${h.pct(st.cur.perf)}, contre ${h.pct(st.prev?.perf)} en ${K.fmtFy(st.pfy!, 'fr')}. L’inventaire ne sépare pas les enfants des époux : ce taux décrit l’ensemble du groupe.</p>
<h2>Les enfants parrainés admis, par mois</h2>
<p>Les données ouvertes sur les ${h.src('od-pr', 'résidents permanents')} comptent les admissions dans la catégorie « enfants parrainés ». Les douze derniers mois en totalisent ${h.n(c12.last)}, ${dirFr(c12.change)} de ${h.pa(c12.change)} sur les douze précédents. À l’échelle du Canada, cela représente ${h.pct(K.pctOf(c12.last, all.last))} de tous les nouveaux résidents permanents.</p>
${h.months(M, [['Enfants parrainés', ser]], { caption: 'Admissions de résidents permanents dans la catégorie des enfants parrainés, par mois. Source : IRCC, Résidents permanents, mises à jour mensuelles, données ouvertes ; chiffres arrondis.' })}
<p>Sur des années civiles complètes, IRCC a admis ${h.n(y23)} enfants parrainés en 2023, ${h.n(y24)} en 2024 et ${h.n(y25)} en 2025. Pour un volet de cette taille, les chiffres mensuels varient beaucoup : un mois faible dit peu de chose, et le total sur douze mois reste la mesure la plus stable. La catégorie couvre aussi les enfants adoptés et les parents orphelins parrainés selon les mêmes règles.</p>
<h2>Les pièces qui ralentissent souvent le dossier d’un enfant</h2>
<p>La demande d’un enfant exige la preuve du lien avec le répondant, en général un acte de naissance complet qui nomme les parents. Quand l’autre parent reste à l’étranger, IRCC demande son consentement ou une décision de garde. Un consentement manquant est une cause fréquente de lettres demandant des pièces, et chaque lettre suspend le dossier. Un enfant de 14 ans ou plus donne aussi ses ${h.src('biometrics', 'données biométriques')}, et chaque enfant passe un examen médical chez un médecin agréé par IRCC.</p>
<p>Quand un test d’ADN est le seul moyen de prouver le lien, IRCC envoie une lettre qui explique comment l’organiser avec un laboratoire accrédité. Cette étape peut ajouter des semaines, et le compteur saisi continue de tourner. Gardez une copie datée de chaque lettre : vous saurez combien de temps le dossier a attendu de votre côté.</p>
<h2>Une fois la date passée</h2>
<p>Servez-vous de l’${h.src('check-status', 'outil de suivi de l’état des demandes')} d’IRCC pour voir si une demande attend votre réponse. Si le dossier dépasse le délai sans rien en suspens, suivez les ${h.a('beyond-processing-time', 'démarches pour un dossier qui dépasse le délai')}. Pour un enfant dont la demande vient d’Inde, du Nigeria ou d’Haïti, les pages ${h.a('india', 'Inde')}, ${h.a('nigeria', 'Nigeria')} et ${h.a('haiti', 'Haïti')} donnent les chiffres ouverts d’IRCC pour les ressortissants de ces pays. L’époux est traité sur la ${h.a('spousal-sponsorship', 'page du parrainage de l’époux')}.</p>
`,
  },
});
