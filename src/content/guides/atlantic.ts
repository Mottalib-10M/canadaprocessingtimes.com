import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : admissions de résidents permanents du Programme d'immigration au Canada atlantique et des
 * programmes des candidats des provinces (Permanent Residents, Monthly IRCC Updates), données ouvertes sous la Licence
 * du gouvernement ouvert du Canada. Aucune norme de service publiée ; le délai de l'outil d'IRCC est saisi par le lecteur. */
const E = K.en, F = K.fr;
const M = K.PRD.months;
const ser = K.prSeries('aip');
const a12 = K.pr12('aip'), pnp = K.pr12('pnp'), all = K.pr12('all');
const yr = (y: string) => K.yearSum(ser, M, y) ?? 0;
const y23 = yr('2023'), y24 = yr('2024'), y25 = yr('2025');
const perMonth = Math.round((a12.last ?? 0) / 12);
const vsPnp = a12.last && pnp.last ? Math.round(pnp.last / a12.last) : null;
let hi = 0, lo = 0;
ser.forEach((v, i) => { if ((v ?? 0) > (ser[hi] ?? 0)) hi = i; if ((v ?? 0) < (ser[lo] ?? 0)) lo = i; });
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');

export default defineGuide({
  id: 'atlantic', group: 'pr', order: 45,
  tool: 'delai', toolArg: { g: 'aip' },
  related: ['pnp', 'express-entry', 'work-permit', 'method', 'history', 'beyond-processing-time'],
  sources: ['ptimes', 'aip', 'od-pr', 'od-std', 'check-status', 'ogl'],
  en: {
    slug: 'atlantic-immigration-program-processing-time',
    nav: 'Atlantic Immigration Program', card: 'Decision date after endorsement, Atlantic admissions by month',
    title: 'Atlantic Immigration Program Processing Time in 2026',
    description: 'Work out a decision date for an Atlantic Immigration Program application from the time IRCC shows, and see how many people it admitted in 2026 open data.',
    h1: 'Atlantic Immigration Program: decision date and admissions',
    intro: `${E.n(a12.last)} people became permanent residents through the Atlantic Immigration Program from ${E.w12(M)}, ${E.ch(a12.change)} on the year before.`,
    resume: `The Atlantic Immigration Program brings workers to New Brunswick, Nova Scotia, Prince Edward Island and Newfoundland and Labrador through an employer designated by the province. Once the province has endorsed the job offer and IRCC has received your complete permanent residence application, read the program’s time on IRCC’s “Check processing times” tool and enter it in the calculator above with the date of receipt: you get an estimated decision date, with the days already elapsed and those left. The rest of this page is drawn from Government of Canada open data, published under the Open Government Licence of Canada. IRCC publishes no service standard for this program. Over ${E.w12(M)}, ${E.n(a12.last)} people were admitted through it, about ${E.n(perMonth)} a month and ${E.ch(a12.change)} on the previous twelve months. By calendar year the count went from ${E.n(y23)} in 2023 to ${E.n(y24)} in 2024 and ${E.n(y25)} in 2025. The provincial nominee programs, the other route run with the provinces, admitted about ${vsPnp ?? 0} times as many people over the same period.`,
    faqs: [
      { q: 'Does the Atlantic processing time include the provincial endorsement?', a: 'No. The time IRCC shows covers the permanent residence application, from the day IRCC receives it complete. Finding a designated employer, building the settlement plan and getting the endorsement from the province all come before, and each province sets its own pace for that step. Enter the date IRCC received the file, not the endorsement date.' },
      { q: 'Can I start working in an Atlantic province before permanent residence?', a: 'Yes, in many cases. With the endorsement letter, a worker can ask for an employer specific work permit, so the job can start while the permanent residence file is processed. That permit has its own time on IRCC’s tool and its own application, separate from the Atlantic Immigration Program file.' },
      { q: 'How many people does the Atlantic Immigration Program admit each year?', a: `IRCC’s open data counts ${E.n(y23)} admissions in 2023, ${E.n(y24)} in 2024 and ${E.n(y25)} in 2025, principal applicants and family members together. The latest twelve months total ${E.n(a12.last)}. That is ${E.pct(K.pctOf(a12.last, all.last))} of all new permanent residents in Canada over the period.` },
    ],
    body: (h) => `
<h2>Where the processing time starts</h2>
<p>The Atlantic Immigration Program is driven by employers. A business in one of the four Atlantic provinces gets designated by the province, offers a job, and the worker obtains a settlement plan and then the province’s endorsement. Only after that does the worker send the permanent residence application to IRCC. The conditions are on IRCC’s ${h.src('aip', 'Atlantic Immigration Program page')}. The time on IRCC’s ${h.src('ptimes', '“Check processing times” tool')} starts on the day IRCC receives that application complete, so the months spent on the job search and the endorsement are outside it.</p>
<p>Copy the figure and its unit from IRCC’s tool into the calculator, then enter the date of receipt shown in your acknowledgement. The calculator adds months as calendar months and returns the estimated decision date, the days already gone and the share of the time used. If the share passes 100%, the file has run past the time you entered.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'aip', m: 'none' }, t: 'Your Atlantic application: estimated decision date' })}
<h2>A time without a standard</h2>
<p>IRCC’s service standards, with their yearly results, are listed in the Government of Canada service inventory published as ${h.src('od-std', 'open data')}. The Atlantic Immigration Program has none. The time on IRCC’s tool is forward looking: IRCC estimates how long a file received today will take, based on the files waiting and the places set for the program in the levels plan. It is the only figure to put in the calculator. A file filed long ago may move faster or slower than that figure suggests.</p>
<h2>Atlantic admissions month by month</h2>
<p>IRCC’s ${h.src('od-pr', 'open data on permanent residents')} counts admissions in the Atlantic Immigration Program category, which includes the spouse and children who come with the worker. The latest twelve months total ${h.n(a12.last)}, ${dirEn(a12.change)} ${h.pa(a12.change)} on the twelve months before.</p>
${h.months(M, [['Atlantic Immigration Program', ser], ['Provincial nominee programs', K.prSeries('pnp')]], { caption: 'Admissions of permanent residents in the Atlantic Immigration Program and provincial nominee programs, by month. Source: IRCC, Permanent Residents, Monthly IRCC Updates, open data; figures rounded.' })}
<p>Admissions have moved a lot since the pilot became a permanent program: ${h.n(y23)} admissions in 2023, ${h.n(y24)} in 2024 and ${h.n(y25)} in 2025. Since January 2023, the busiest month was ${h.my(M[hi])}, with ${h.n(ser[hi])} admissions, and the quietest ${h.my(M[lo])}, with ${h.n(ser[lo])}. Admissions depend on the places the levels plan gives the program each year, so a lower count can reflect fewer places as much as slower files.</p>
<h2>Atlantic or provincial nominee?</h2>
<p>Workers in the Atlantic provinces often compare this program with the ${h.a('pnp', 'provincial nominee programs')}. Both need the province, but the nominee route has a stream linked to ${h.a('express-entry', 'Express Entry')}, with its own processing line, and paper streams outside it. Over the latest twelve months, provincial nominee programs admitted ${h.n(pnp.last)} people across Canada, against ${h.n(a12.last)} for the Atlantic program. Each province decides which route it favours for a given job, so ask the province before choosing. A worker who already qualifies for Express Entry may also find that route quicker than an employer based one.</p>
<h2>While the file is in process</h2>
<p>A worker endorsed by a province can apply for a ${h.a('work-permit', 'work permit')} so the job can start before permanent residence. Keep the endorsement valid: if the job offer falls through, tell the province, as the endorsement may be withdrawn. Check IRCC’s ${h.src('check-status', 'application status tool')} for requests, and if the calculator shows the date has passed with nothing pending, read the ${h.a('beyond-processing-time', 'guide to files past the processing time')}.</p>
`,
  },
  fr: {
    slug: 'delai-programme-immigration-atlantique',
    nav: 'Programme d’immigration au Canada atlantique', card: 'Date de décision après la recommandation, admissions par mois',
    title: 'Délai du Programme d’immigration au Canada atlantique 2026',
    description: 'Calculez la date de décision d’une demande au Programme d’immigration au Canada atlantique à partir du délai d’IRCC, avec les admissions publiées en 2026.',
    h1: 'Programme d’immigration au Canada atlantique : date et admissions',
    intro: `${F.n(a12.last)} personnes sont devenues résidents permanents par le Programme d’immigration au Canada atlantique de ${F.w12(M)}, soit ${F.ch(a12.change)} sur un an.`,
    resume: `Le Programme d’immigration au Canada atlantique fait venir des travailleurs au Nouveau-Brunswick, en Nouvelle-Écosse, à l’Île-du-Prince-Édouard et à Terre-Neuve-et-Labrador par l’intermédiaire d’un employeur désigné par la province. Une fois l’offre d’emploi recommandée par la province et votre demande de résidence permanente reçue complète par IRCC, lisez le délai du programme dans l’outil « Vérifier les délais de traitement » d’IRCC et saisissez-le dans le calculateur ci-dessus avec la date de réception : vous obtenez une date de décision estimée, avec les jours écoulés et ceux qui restent. Le reste de la page vient des données ouvertes du gouvernement du Canada, publiées sous la Licence du gouvernement ouvert du Canada. IRCC ne publie aucune norme de service pour ce programme. De ${F.w12(M)}, ${F.n(a12.last)} personnes ont été admises par ce programme, environ ${F.n(perMonth)} par mois, soit ${F.ch(a12.change)} sur un an. Par année civile, on est passé de ${F.n(y23)} en 2023 à ${F.n(y24)} en 2024 et ${F.n(y25)} en 2025. Les programmes des candidats des provinces, l’autre voie menée avec les provinces, ont admis environ ${vsPnp ?? 0} fois plus de personnes sur la même période.`,
    faqs: [
      { q: 'Le délai du programme atlantique inclut-il la recommandation de la province ?', a: 'Non. Le délai affiché par IRCC couvre la demande de résidence permanente, à partir du jour où IRCC la reçoit complète. La recherche d’un employeur désigné, le plan d’établissement et la recommandation de la province viennent avant, et chaque province fixe son propre rythme pour cette étape. Saisissez la date de réception par IRCC, pas celle de la recommandation.' },
      { q: 'Peut-on commencer à travailler en Atlantique avant la résidence permanente ?', a: 'Oui, dans bien des cas. Avec la lettre de recommandation, le travailleur peut demander un permis de travail lié à l’employeur, pour commencer l’emploi pendant le traitement de la résidence permanente. Ce permis a son propre délai dans l’outil d’IRCC et sa propre demande, distincte du dossier du programme atlantique.' },
      { q: 'Combien de personnes le programme atlantique admet-il chaque année ?', a: `Les données ouvertes d’IRCC comptent ${F.n(y23)} admissions en 2023, ${F.n(y24)} en 2024 et ${F.n(y25)} en 2025, demandeurs principaux et membres de la famille ensemble. Les douze derniers mois en totalisent ${F.n(a12.last)}, soit ${F.pct(K.pctOf(a12.last, all.last))} de tous les nouveaux résidents permanents du Canada sur la période.` },
    ],
    body: (h) => `
<h2>Où commence le délai</h2>
<p>Le Programme d’immigration au Canada atlantique repose sur les employeurs. Une entreprise de l’une des quatre provinces de l’Atlantique est désignée par la province, propose un emploi, et le travailleur obtient un plan d’établissement puis la recommandation de la province. C’est seulement ensuite qu’il envoie sa demande de résidence permanente à IRCC. Les conditions figurent sur la ${h.src('aip', 'page d’IRCC du programme')}. Le délai de l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} part du jour où IRCC reçoit cette demande complète : les mois passés à chercher l’emploi et à obtenir la recommandation n’en font pas partie.</p>
<p>Recopiez le chiffre et son unité depuis l’outil d’IRCC dans le calculateur, puis la date de réception indiquée dans votre accusé de réception. Le calculateur ajoute les mois en mois de calendrier et donne la date de décision estimée, les jours écoulés et la part du délai consommée. Au-delà de 100 %, le dossier a dépassé le délai saisi.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'aip', m: 'none' }, t: 'Votre demande atlantique : date de décision estimée' })}
<h2>Un délai sans norme</h2>
<p>Les normes de service d’IRCC, avec leurs résultats annuels, figurent dans l’inventaire des services du gouvernement du Canada publié en ${h.src('od-std', 'données ouvertes')}. Le programme atlantique n’en a aucune. Le délai de l’outil d’IRCC est prospectif : IRCC estime le temps que prendra un dossier reçu aujourd’hui, selon les dossiers en attente et les places prévues pour le programme dans le plan des niveaux. C’est le seul chiffre à saisir dans le calculateur. Un dossier déposé il y a longtemps peut avancer plus vite ou plus lentement que ce chiffre ne le laisse penser.</p>
<h2>Les admissions atlantiques mois par mois</h2>
<p>Les ${h.src('od-pr', 'données ouvertes d’IRCC sur les résidents permanents')} comptent les admissions du Programme d’immigration au Canada atlantique, y compris l’époux et les enfants qui accompagnent le travailleur. Les douze derniers mois en totalisent ${h.n(a12.last)}, ${dirFr(a12.change)} de ${h.pa(a12.change)} sur les douze mois précédents.</p>
${h.months(M, [['Programme d’immigration au Canada atlantique', ser], ['Programmes des candidats des provinces', K.prSeries('pnp')]], { caption: 'Admissions de résidents permanents du Programme d’immigration au Canada atlantique et des programmes des candidats des provinces, par mois. Source : IRCC, Résidents permanents, mises à jour mensuelles, données ouvertes ; chiffres arrondis.' })}
<p>Les admissions ont beaucoup varié depuis que le projet pilote est devenu un programme permanent : ${h.n(y23)} admissions en 2023, ${h.n(y24)} en 2024 et ${h.n(y25)} en 2025. Depuis janvier 2023, le mois le plus chargé a été ${h.my(M[hi])}, avec ${h.n(ser[hi])} admissions, et le plus calme ${h.my(M[lo])}, avec ${h.n(ser[lo])}. Les admissions dépendent des places que le plan des niveaux accorde chaque année au programme : un chiffre plus bas peut traduire moins de places autant que des dossiers plus lents.</p>
<h2>Atlantique ou candidat d’une province ?</h2>
<p>Les travailleurs des provinces de l’Atlantique comparent souvent ce programme aux ${h.a('pnp', 'programmes des candidats des provinces')}. Les deux passent par la province, mais la voie des candidats a un volet lié à l’${h.a('express-entry', 'Entrée express')}, avec sa propre ligne de délai, et des volets sur papier hors de ce système. Sur les douze derniers mois, les programmes des candidats des provinces ont admis ${h.n(pnp.last)} personnes dans tout le Canada, contre ${h.n(a12.last)} pour le programme atlantique. Chaque province choisit la voie qu’elle privilégie pour un emploi donné : renseignez-vous auprès d’elle avant de choisir.</p>
<h2>Pendant le traitement</h2>
<p>Un travailleur recommandé par une province peut demander un ${h.a('work-permit', 'permis de travail')} pour commencer l’emploi avant la résidence permanente. Gardez la recommandation valide : si l’offre d’emploi tombe, prévenez la province, qui peut retirer sa recommandation. Consultez l’${h.src('check-status', 'outil de suivi de l’état des demandes')} d’IRCC pour repérer une demande de pièce, et si le calculateur indique que la date est passée sans rien en suspens, lisez le ${h.a('beyond-processing-time', 'guide des dossiers qui dépassent le délai')}.</p>
`,
  },
});
