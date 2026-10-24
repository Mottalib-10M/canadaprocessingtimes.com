import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : admissions de résidents permanents de la catégorie des aides familiaux (Permanent Residents,
 * Monthly IRCC Updates), données ouvertes sous la Licence du gouvernement ouvert du Canada. Aucune norme de service
 * publiée pour ces programmes ; le délai de l'outil d'IRCC est saisi par le lecteur. */
const E = K.en, F = K.fr;
const M = K.PRD.months;
const ser = K.prSeries('caregiver');
const c12 = K.pr12('caregiver'), aip = K.pr12('aip'), all = K.pr12('all');
const yr = (y: string) => K.yearSum(ser, M, y) ?? 0;
const y23 = yr('2023'), y24 = yr('2024'), y25 = yr('2025');
const per1000 = all.last ? Math.round(((c12.last ?? 0) / all.last) * 10000) / 10 : null;
const ytd = K.yearSum(ser, M, M[M.length - 1].slice(0, 4)) ?? 0;
const ytdMonths = Number(M[M.length - 1].slice(5, 7));
let hi = 0;
ser.forEach((v, i) => { if ((v ?? 0) > (ser[hi] ?? 0)) hi = i; });
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');

export default defineGuide({
  id: 'caregiver', group: 'pr', order: 46,
  tool: 'delai', toolArg: { g: 'caregiver' },
  related: ['express-entry', 'pnp', 'work-permit-extension', 'method', 'history', 'beyond-processing-time'],
  sources: ['ptimes', 'caregivers', 'od-pr', 'od-std', 'check-status', 'ogl'],
  en: {
    slug: 'caregiver-pr-processing-time',
    nav: 'Caregivers', card: 'Decision date for a caregiver PR file, caregivers admitted each month',
    title: 'Caregiver Permanent Residence Processing Time 2026',
    description: 'Turn the caregiver permanent residence time IRCC shows into a decision date, and see how many caregivers and their families became residents in 2026 data.',
    h1: 'Caregivers: from IRCC’s time to a permanent residence date',
    intro: `${E.n(c12.last)} caregivers and family members became permanent residents from ${E.w12(M)}, ${E.ch(c12.change)} on the year before.`,
    resume: `Home child care providers and home support workers reach permanent residence through IRCC’s caregiver pilots, which have changed several times in recent years. Whatever the pilot, the time that applies to your file is the one IRCC shows for caregivers on its “Check processing times” tool. Enter it in the calculator above with the date IRCC received your complete application, and you get an estimated decision date, with the days elapsed and the days left. All other figures on this page come from Government of Canada open data, published under the Open Government Licence of Canada. IRCC publishes no service standard for caregivers. From ${E.w12(M)}, ${E.n(c12.last)} people were admitted in the caregiver category, principal applicants with their spouses and children, ${E.ch(c12.change)} on the previous twelve months. That is about ${per1000 ?? 0} in every thousand new permanent residents. By calendar year, IRCC admitted ${E.n(y23)} caregivers and family members in 2023, ${E.n(y24)} in 2024 and ${E.n(y25)} in 2025.`,
    faqs: [
      { q: 'Which caregiver pilot does the processing time on IRCC’s tool cover?', a: 'IRCC shows one caregiver line for the pilots in force, and the figure is what it expects for a file received now. Files sent under an older pilot keep the rules of that pilot, but there is no separate time for them. Copy the caregiver line, then enter the date IRCC received your full application.' },
      { q: 'Can a caregiver keep working while the permanent residence file is processed?', a: 'In most cases, yes. A caregiver already in Canada who applies for permanent residence can often ask for a work permit, or extend an existing one, while IRCC decides. The work permit has its own time on IRCC’s tool and must be applied for separately from the permanent residence application.' },
      { q: 'Are more caregivers being admitted as permanent residents?', a: `IRCC’s open data counts ${E.n(c12.last)} caregivers and family members over the latest twelve months, ${E.ch(c12.change)} on the twelve months before. In ${M[M.length - 1].slice(0, 4)}, ${E.n(ytd)} were admitted in the first ${ytdMonths} months. The yearly count depends on places set in the levels plan and on how many pilot files reach a decision.` },
    ],
    body: (h) => `
<h2>One line for several pilots</h2>
<p>Canada has run a series of caregiver programs: the live in caregiver program, then two five year pilots for home child care providers and home support workers, and newer home care worker pilots that IRCC describes on its ${h.src('caregivers', 'caregivers page')}. Each one has its own conditions on work experience, language and the job offer. For processing, IRCC shows a single caregiver line on its ${h.src('ptimes', '“Check processing times” tool')}, and that is the figure to copy into the calculator.</p>
<p>Enter it with its unit, usually months, and the date of receipt written on IRCC’s acknowledgement. The calculator adds the months as calendar months and returns the estimated decision date, the days gone since IRCC received the file and the share of the time used. If you applied before the pilot changed, the date is a rough guide only: the figure reflects new files, not those already waiting.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'caregiver', m: 'none' }, t: 'Your caregiver file: estimated decision date' })}
<h2>No standard to compare with</h2>
<p>The Government of Canada service inventory, published as ${h.src('od-std', 'open data')}, lists IRCC’s service standards and how often each was met. It contains none for caregivers, whether for the work permit tied to a pilot or for permanent residence. The forward looking time on IRCC’s tool is therefore the only reference, worked out from the files waiting and the places the levels plan gives these pilots.</p>
<h2>Caregivers admitted, month by month</h2>
<p>IRCC’s ${h.src('od-pr', 'open data on permanent residents')} has a caregiver category, which covers the caregiver and the spouse and children included in the application. The latest twelve months total ${h.n(c12.last)}, ${dirEn(c12.change)} ${h.pa(c12.change)} on the twelve before. For scale, the Atlantic Immigration Program admitted ${h.n(aip.last)} over the same months.</p>
${h.months(M, [['Caregivers and family members', ser]], { caption: 'Admissions of permanent residents in the caregiver category, by month. Source: IRCC, Permanent Residents, Monthly IRCC Updates, open data; figures rounded.' })}
<p>The yearly totals were ${h.n(y23)} in 2023, ${h.n(y24)} in 2024 and ${h.n(y25)} in 2025. Since January 2023 the busiest month was ${h.my(M[hi])}, with ${h.n(ser[hi])} admissions. Admissions in this category arrive unevenly, because a pilot often closes its intake once its cap is reached and IRCC then works through the files in batches.</p>
<h2>Two steps for caregivers abroad</h2>
<p>Under the five year pilots, a caregiver outside Canada first received an occupation restricted open work permit, came to work, and became eligible for permanent residence after enough qualifying experience. The permanent residence time on IRCC’s tool covers only that last step. A caregiver already working in Canada who meets the experience rule applies directly, and the time then runs from the receipt of that application.</p>
<p>Keep proof of every month worked: pay slips, a letter from each employer and the hours. Missing experience records are a frequent reason for a request from IRCC, and the file stops until you answer. A spouse and children can be included in the application and are then counted in the same category, even if they stay abroad until the decision.</p>
<h2>When the time runs out</h2>
<p>If your work permit expires before the decision, see the page on ${h.a('work-permit-extension', 'extending a work permit')}. Check IRCC’s ${h.src('check-status', 'application status tool')} for any request, and if the date has passed with nothing pending, read the ${h.a('beyond-processing-time', 'guide to files past the processing time')}. Caregivers with enough skilled work experience can also look at ${h.a('express-entry', 'Express Entry')} or a ${h.a('pnp', 'provincial nominee program')}.</p>
`,
  },
  fr: {
    slug: 'delai-aides-familiaux-residence-permanente',
    nav: 'Aides familiaux', card: 'Date de décision d’un aide familial, admissions par mois',
    title: 'Délai de résidence permanente des aides familiaux en 2026',
    description: 'Transformez le délai de résidence permanente des aides familiaux affiché par IRCC en date de décision, et voyez combien d’aides familiaux sont admis en 2026.',
    h1: 'Aides familiaux : du délai d’IRCC à la date de résidence permanente',
    intro: `${F.n(c12.last)} aides familiaux et membres de leur famille sont devenus résidents permanents de ${F.w12(M)}, soit ${F.ch(c12.change)} sur un an.`,
    resume: `Les gardiens d’enfants en milieu familial et les aides familiaux à domicile accèdent à la résidence permanente par les projets pilotes d’IRCC pour les aides familiaux, qui ont changé plusieurs fois ces dernières années. Quel que soit le projet, le délai qui vaut pour votre dossier est celui qu’IRCC affiche pour les aides familiaux dans son outil « Vérifier les délais de traitement ». Saisissez-le dans le calculateur ci-dessus avec la date de réception de votre demande complète par IRCC, et vous obtenez une date de décision estimée, avec les jours écoulés et ceux qui restent. Tous les autres chiffres de la page viennent des données ouvertes du gouvernement du Canada, publiées sous la Licence du gouvernement ouvert du Canada. IRCC ne publie aucune norme de service pour les aides familiaux. De ${F.w12(M)}, ${F.n(c12.last)} personnes ont été admises dans la catégorie des aides familiaux, demandeurs principaux avec leur époux et leurs enfants, soit ${F.ch(c12.change)} sur un an. Cela représente environ ${per1000 ?? 0} nouveaux résidents permanents sur mille. Par année civile, IRCC en a admis ${F.n(y23)} en 2023, ${F.n(y24)} en 2024 et ${F.n(y25)} en 2025.`,
    faqs: [
      { q: 'Quel projet pilote couvre le délai des aides familiaux dans l’outil d’IRCC ?', a: 'IRCC affiche une seule ligne pour les aides familiaux, celle des projets en vigueur, et ce chiffre correspond à un dossier reçu maintenant. Les dossiers envoyés sous un ancien projet gardent ses règles, mais n’ont pas de délai distinct. Recopiez la ligne des aides familiaux, puis la date de réception de votre demande complète.' },
      { q: 'Un aide familial peut-il continuer à travailler pendant le traitement ?', a: 'Dans la plupart des cas, oui. Un aide familial déjà au Canada qui demande la résidence permanente peut souvent obtenir un permis de travail, ou prolonger celui qu’il a, pendant la décision d’IRCC. Ce permis a son propre délai dans l’outil d’IRCC et se demande à part de la résidence permanente.' },
      { q: 'Le Canada admet-il davantage d’aides familiaux comme résidents permanents ?', a: `Les données ouvertes d’IRCC comptent ${F.n(c12.last)} aides familiaux et membres de leur famille sur les douze derniers mois, soit ${F.ch(c12.change)} sur un an. En ${M[M.length - 1].slice(0, 4)}, ${F.n(ytd)} ont été admis au cours des ${ytdMonths} premiers mois. Le total annuel dépend des places du plan des niveaux et du nombre de dossiers tranchés.` },
    ],
    body: (h) => `
<h2>Une seule ligne pour plusieurs projets pilotes</h2>
<p>Le Canada a mené une série de programmes pour les aides familiaux : le programme des aides familiaux résidants, puis deux projets pilotes de cinq ans pour les gardiens d’enfants en milieu familial et les aides familiaux à domicile, et de nouveaux projets pour les travailleurs des soins à domicile qu’IRCC présente sur sa ${h.src('caregivers', 'page des aides familiaux')}. Chacun a ses conditions d’expérience, de langue et d’offre d’emploi. Pour le traitement, IRCC affiche une seule ligne pour les aides familiaux dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}, et c’est ce chiffre qu’il faut recopier dans le calculateur.</p>
<p>Saisissez-le avec son unité, le plus souvent des mois, et la date de réception inscrite sur l’accusé de réception d’IRCC. Le calculateur ajoute les mois en mois de calendrier et donne la date de décision estimée, les jours écoulés depuis la réception et la part du délai consommée. Si vous avez déposé avant un changement de projet, la date n’est qu’un repère : le chiffre vaut pour les nouveaux dossiers, pas pour ceux déjà en attente.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'caregiver', m: 'none' }, t: 'Votre dossier d’aide familial : date de décision estimée' })}
<h2>Aucune norme de comparaison</h2>
<p>L’inventaire des services du gouvernement du Canada, publié en ${h.src('od-std', 'données ouvertes')}, recense les normes de service d’IRCC et la fréquence à laquelle chacune est tenue. Il n’en contient aucune pour les aides familiaux, ni pour le permis de travail lié à un projet pilote, ni pour la résidence permanente. Le délai prospectif de l’outil d’IRCC reste donc la seule référence, calculé à partir des dossiers en attente et des places que le plan des niveaux accorde à ces projets.</p>
<h2>Les aides familiaux admis, mois par mois</h2>
<p>Les ${h.src('od-pr', 'données ouvertes d’IRCC sur les résidents permanents')} ont une catégorie des aides familiaux, qui couvre l’aide familial ainsi que l’époux et les enfants inclus dans la demande. Les douze derniers mois en totalisent ${h.n(c12.last)}, ${dirFr(c12.change)} de ${h.pa(c12.change)} sur les douze précédents. À titre de comparaison, le Programme d’immigration au Canada atlantique en a admis ${h.n(aip.last)} sur les mêmes mois.</p>
${h.months(M, [['Aides familiaux et membres de la famille', ser]], { caption: 'Admissions de résidents permanents dans la catégorie des aides familiaux, par mois. Source : IRCC, Résidents permanents, mises à jour mensuelles, données ouvertes ; chiffres arrondis.' })}
<p>Les totaux annuels ont été de ${h.n(y23)} en 2023, ${h.n(y24)} en 2024 et ${h.n(y25)} en 2025. Depuis janvier 2023, le mois le plus chargé a été ${h.my(M[hi])}, avec ${h.n(ser[hi])} admissions. Les admissions de cette catégorie arrivent de façon irrégulière, car un projet pilote ferme souvent sa réception une fois son plafond atteint, et IRCC traite ensuite les dossiers par lots.</p>
<h2>Deux étapes pour l’aide familial à l’étranger</h2>
<p>Dans les projets pilotes de cinq ans, l’aide familial à l’étranger recevait d’abord un permis de travail ouvert limité à sa profession, venait travailler, puis devenait admissible à la résidence permanente après assez d’expérience admissible. Le délai de résidence permanente de l’outil d’IRCC ne couvre que cette dernière étape. Un aide familial qui travaille déjà au Canada et remplit la condition d’expérience présente directement sa demande, et le délai part alors de la réception de celle-ci.</p>
<p>Gardez la preuve de chaque mois travaillé : bulletins de paie, lettre de chaque employeur et heures effectuées. Une expérience mal documentée est une cause fréquente de demande de pièces par IRCC, et le dossier s’arrête jusqu’à votre réponse. L’époux et les enfants peuvent être inclus dans la demande ; ils sont alors comptés dans la même catégorie.</p>
<h2>Quand le délai est écoulé</h2>
<p>Si votre permis de travail expire avant la décision, consultez la page sur la ${h.a('work-permit-extension', 'prolongation du permis de travail')}. Vérifiez dans l’${h.src('check-status', 'outil de suivi de l’état des demandes')} d’IRCC qu’aucune demande n’attend, et si la date est passée sans rien en suspens, lisez le ${h.a('beyond-processing-time', 'guide des dossiers qui dépassent le délai')}. Les aides familiaux qui ont assez d’expérience qualifiée peuvent aussi regarder l’${h.a('express-entry', 'Entrée express')} ou un ${h.a('pnp', 'programme des candidats des provinces')}.</p>
`,
  },
});
