import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : admissions de résidents permanents des catégories de réfugiés et de personnes protégées
 * (Permanent Residents, Monthly IRCC Updates), données ouvertes sous la Licence du gouvernement ouvert du Canada.
 * Aucune norme de service publiée pour ces programmes ; le délai de l'outil d'IRCC est saisi par le lecteur. */
const E = K.en, F = K.fr;
const M = K.PRD.months;
const gar = K.pr12('gar'), psr = K.pr12('psr'), bv = K.pr12('bvor'), pp = K.pr12('protected'), dep = K.pr12('protectedDep'), all = K.pr12('all');
const resettled = (gar.last ?? 0) + (psr.last ?? 0) + (bv.last ?? 0);
const resettledPrev = (gar.prev ?? 0) + (psr.prev ?? 0) + (bv.prev ?? 0);
const resCh = resettledPrev ? Math.round(((resettled - resettledPrev) / resettledPrev) * 1000) / 10 : null;
const inland = (pp.last ?? 0) + (dep.last ?? 0);
const total = resettled + inland;
const shareAll = K.pctOf(total, all.last);
const yr = (k: string, y: string) => K.yearSum(K.prSeries(k), M, y) ?? 0;
const res = (y: string) => yr('gar', y) + yr('psr', y) + yr('bvor', y);
const r23 = res('2023'), r24 = res('2024'), r25 = res('2025');
const ps = K.prSeries('protected');
let hiP = 0;
ps.forEach((v, i) => { if ((v ?? 0) > (ps[hiP] ?? 0)) hiP = i; });
const lastP = ps[ps.length - 1] ?? 0;
const bigger = (psr.last ?? 0) >= (gar.last ?? 0) ? 'psr' : 'gar';
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');

export default defineGuide({
  id: 'refugees', group: 'family', order: 53,
  tool: 'delai', toolArg: { g: 'refugees-gov', only: 'refugees-gov,refugees-priv,protected' },
  related: ['spousal-sponsorship', 'dependent-child', 'pr-card', 'history', 'method'],
  sources: ['ptimes', 'od-pr', 'od-std', 'check-status', 'ogl'],
  en: {
    slug: 'refugee-processing-time',
    nav: 'Refugees', card: 'Resettled refugees and protected persons: decision date, admissions',
    title: 'Refugee and Protected Person Processing Time in 2026',
    description: 'Estimate the decision date of a refugee resettlement or protected person file from the time IRCC shows, with the refugees Canada admitted in 2026 data.',
    h1: 'Refugees and protected persons: from IRCC’s time to a date',
    intro: `Canada admitted ${E.n(total)} refugees, protected persons and their dependants as permanent residents from ${E.w12(M)}.`,
    resume: `IRCC shows three refugee lines on its “Check processing times” tool: government assisted refugees, privately sponsored refugees, and protected persons in Canada applying for permanent residence, all outside Quebec. Pick the line, enter its figure in the calculator above with the date IRCC received the complete application, and you get an estimated decision date with the days elapsed and those left. The other figures here come from Government of Canada open data, published under the Open Government Licence of Canada, and IRCC publishes no service standard for these programs. From ${E.w12(M)}, ${E.n(resettled)} resettled refugees became permanent residents, ${E.ch(resCh)} on the year before: ${E.n(gar.last)} government assisted, ${E.n(psr.last)} privately sponsored and ${E.n(bv.last)} under blended sponsorship. Over the same months, ${E.n(pp.last)} protected persons in Canada and ${E.n(dep.last)} of their dependants were admitted. Together they make ${E.pct(shareAll)} of all new permanent residents. These counts are admissions, not times, but they show how much the levels plan leaves for each stream.`,
    faqs: [
      { q: 'Does the refugee time on IRCC’s tool include the asylum hearing?', a: 'No. For a protected person, the time IRCC shows starts once the Immigration and Refugee Board has granted protection and the permanent residence application has been received. The asylum claim and the hearing come before, under the Board, and are not counted in that figure or in the calculator.' },
      { q: 'Is there a service standard for refugee resettlement?', a: 'Not in the Government of Canada service inventory. IRCC publishes no standard for government assisted refugees, privately sponsored refugees or protected persons. The only time available is the forward looking figure on IRCC’s tool, which you can copy into the calculator with the date of receipt.' },
      { q: 'How many resettled refugees does Canada admit each year?', a: `IRCC’s open data counts ${E.n(r23)} resettled refugees admitted in 2023, ${E.n(r24)} in 2024 and ${E.n(r25)} in 2025, adding government assisted, privately sponsored and blended sponsorship refugees. The latest twelve months total ${E.n(resettled)}, ${E.ch(resCh)} on the twelve months before, as published by IRCC.` },
    ],
    body: (h) => `
<h2>Three lines, three different routes</h2>
<p>Refugees reach permanent residence in Canada by two very different routes. Resettled refugees are selected abroad, usually after a referral by the United Nations refugee agency or by a private sponsor, and they land in Canada already as permanent residents. Protected persons made their claim inside Canada, received protection, and then apply for permanent residence from Canada. IRCC’s ${h.src('ptimes', '“Check processing times” tool')} gives one time for government assisted refugees, one for privately sponsored refugees and one for protected persons, each for files outside Quebec.</p>
<p>Copy the line that matches the file, with its unit, into the calculator, and add the date IRCC received the complete application. For a private sponsorship, that is the date the sponsorship group’s application reached IRCC, not the date the group was formed. The calculator gives an estimated decision date and the share of the time already gone.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'refugees-priv', m: 'none' }, t: 'Your refugee file: estimated decision date' })}
<h2>No published standard</h2>
<p>The Government of Canada service inventory, released as ${h.src('od-std', 'open data')}, lists the service standards of IRCC and their results each year. None covers refugee resettlement or protected persons. The time on IRCC’s tool is therefore the only reference. It is forward looking: the time IRCC expects for a file received today, given the files waiting and the places in the levels plan. Resettlement also depends on travel, exit permits and the situation in the country of first refuge, which no time can predict. For a private sponsorship, the group’s own readiness to receive the family can also shape the arrival date.</p>
<h2>Resettled refugees admitted, by month</h2>
<p>The ${h.src('od-pr', 'open data on permanent residents')} counts each refugee category separately. Over the latest twelve months, ${h.pct(K.pctOf(K.pr12(bigger).last, resettled))} of resettled refugees came through the ${bigger === 'psr' ? 'private sponsorship' : 'government assisted'} stream, the largest of the three. Government assisted refugees were ${dirEn(gar.change)} ${h.pa(gar.change)} and privately sponsored refugees ${dirEn(psr.change)} ${h.pa(psr.change)} on the twelve months before.</p>
${h.months(M, [[K.prName('gar', 'en'), K.prSeries('gar')], [K.prName('psr', 'en'), K.prSeries('psr')], [K.prName('protected', 'en'), ps], [K.prName('protectedDep', 'en'), K.prSeries('protectedDep')]], { caption: 'Admissions of permanent residents in the refugee and protected person categories, by month. Source: IRCC, Permanent Residents, Monthly IRCC Updates, open data; figures rounded.' })}
<p>Across calendar years, resettled refugees numbered ${h.n(r23)} in 2023, ${h.n(r24)} in 2024 and ${h.n(r25)} in 2025. Resettlement arrives in waves that follow flights and group departures, so a single month can be twice the next one. Blended sponsorship, where the government and a private group share the cost, is small: ${h.n(bv.last)} admissions over the twelve months.</p>
<h2>Protected persons in Canada</h2>
<p>Admissions of protected persons follow another rhythm. The latest twelve months bring ${h.n(pp.last)}, ${dirEn(pp.change)} ${h.pa(pp.change)} on the twelve before, ${hiP === M.length - 1 ? `and the latest month published, ${h.my(M[hiP])}, is also the busiest since January 2023, with ${h.n(lastP)} admissions.` : `and the busiest month since January 2023 was ${h.my(M[hiP])}, with ${h.n(ps[hiP])}. The latest month published, ${h.my(M[M.length - 1])}, counts ${h.n(lastP)}.`} Their family members, admitted in a separate category, total ${h.n(dep.last)} over the year. A protected person can include them in the permanent residence application, and they then follow the same file.</p>
<p>Until permanent residence is granted, a protected person holds no ${h.a('pr-card', 'permanent resident card')} and cannot sponsor a spouse or a child. Once it is granted, family members left out of the application can be sponsored through the ${h.a('spousal-sponsorship', 'spousal sponsorship')} or ${h.a('dependent-child', 'dependent child')} streams.</p>
<h2>Following the file</h2>
<p>A privately sponsored refugee is followed through the sponsorship group, which receives IRCC’s letters. A protected person can use IRCC’s ${h.src('check-status', 'application status tool')}. How this site reads IRCC’s data is set out on the ${h.a('method', 'method page')}, with the limits of each dataset.</p>
`,
  },
  fr: {
    slug: 'delai-refugies',
    nav: 'Réfugiés', card: 'Réfugiés réinstallés et personnes protégées : date de décision, admissions',
    title: 'Délai de traitement des réfugiés et personnes protégées 2026',
    description: 'Estimez la date de décision d’un dossier de réfugié réinstallé ou de personne protégée à partir du délai d’IRCC, avec les réfugiés admis en 2026 au Canada.',
    h1: 'Réfugiés et personnes protégées : du délai d’IRCC à une date',
    intro: `Le Canada a admis ${F.n(total)} réfugiés, personnes protégées et membres de leur famille comme résidents permanents de ${F.w12(M)}.`,
    resume: `IRCC affiche trois lignes pour les réfugiés dans son outil « Vérifier les délais de traitement » : réfugiés pris en charge par le gouvernement, réfugiés parrainés par le secteur privé, et personnes protégées au Canada qui demandent la résidence permanente, toutes hors Québec. Choisissez la ligne, saisissez son chiffre dans le calculateur ci-dessus avec la date de réception de la demande complète, et vous obtenez une date de décision estimée, avec les jours écoulés et ceux qui restent. Les autres chiffres viennent des données ouvertes du gouvernement du Canada, publiées sous la Licence du gouvernement ouvert du Canada, et IRCC ne publie aucune norme de service pour ces programmes. De ${F.w12(M)}, ${F.n(resettled)} réfugiés réinstallés sont devenus résidents permanents, soit ${F.ch(resCh)} sur un an : ${F.n(gar.last)} pris en charge par le gouvernement, ${F.n(psr.last)} parrainés par le secteur privé et ${F.n(bv.last)} par le parrainage mixte. Sur la même période, ${F.n(pp.last)} personnes protégées au Canada et ${F.n(dep.last)} membres de leur famille ont été admis. Ensemble, ils forment ${F.pct(shareAll)} des nouveaux résidents permanents.`,
    faqs: [
      { q: 'Le délai des réfugiés dans l’outil d’IRCC inclut-il l’audience d’asile ?', a: 'Non. Pour une personne protégée, le délai affiché par IRCC part du moment où la Commission de l’immigration et du statut de réfugié a accordé l’asile et où la demande de résidence permanente a été reçue. La demande d’asile et l’audience viennent avant, devant la Commission, et ne sont comptées ni dans ce chiffre ni dans le calculateur.' },
      { q: 'Existe-t-il une norme de service pour la réinstallation des réfugiés ?', a: 'Pas dans l’inventaire des services du gouvernement du Canada. IRCC ne publie aucune norme pour les réfugiés pris en charge par le gouvernement, les réfugiés parrainés par le secteur privé ni les personnes protégées. Le seul délai disponible est le chiffre prospectif de l’outil d’IRCC, à recopier dans le calculateur avec la date de réception.' },
      { q: 'Combien de réfugiés réinstallés le Canada admet-il chaque année ?', a: `Les données ouvertes d’IRCC comptent ${F.n(r23)} réfugiés réinstallés admis en 2023, ${F.n(r24)} en 2024 et ${F.n(r25)} en 2025, en additionnant les réfugiés pris en charge par le gouvernement, parrainés par le secteur privé et du parrainage mixte. Les douze derniers mois en totalisent ${F.n(resettled)}, soit ${F.ch(resCh)} sur un an.` },
    ],
    body: (h) => `
<h2>Trois lignes, trois parcours différents</h2>
<p>Les réfugiés accèdent à la résidence permanente au Canada par deux voies très différentes. Les réfugiés réinstallés sont choisis à l’étranger, le plus souvent après un signalement de l’agence des Nations unies pour les réfugiés ou d’un répondant privé, et arrivent au Canada déjà résidents permanents. Les personnes protégées ont demandé l’asile au Canada, l’ont obtenu, puis demandent la résidence permanente depuis le Canada. L’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC donne un délai pour les réfugiés pris en charge par le gouvernement, un pour les réfugiés parrainés par le secteur privé et un pour les personnes protégées, chaque fois hors Québec.</p>
<p>Recopiez la ligne qui correspond au dossier, avec son unité, dans le calculateur, puis la date de réception de la demande complète par IRCC. Pour un parrainage privé, c’est la date à laquelle la demande du groupe de répondants est arrivée chez IRCC, pas celle de la formation du groupe. Le calculateur donne une date de décision estimée et la part du délai déjà écoulée.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'protected', m: 'none' }, t: 'Votre dossier de réfugié : date de décision estimée' })}
<h2>Aucune norme publiée</h2>
<p>L’inventaire des services du gouvernement du Canada, diffusé en ${h.src('od-std', 'données ouvertes')}, recense chaque année les normes de service d’IRCC et leurs résultats. Aucune ne couvre la réinstallation des réfugiés ni les personnes protégées. Le délai de l’outil d’IRCC est donc la seule référence. Il est prospectif : c’est le temps prévu pour un dossier reçu aujourd’hui, selon les dossiers en attente et les places du plan des niveaux. La réinstallation dépend aussi des vols, des permis de sortie et de la situation dans le pays de premier asile, qu’aucun délai ne peut prévoir.</p>
<h2>Les réfugiés réinstallés admis, par mois</h2>
<p>Les ${h.src('od-pr', 'données ouvertes sur les résidents permanents')} comptent chaque catégorie de réfugiés à part. Sur les douze derniers mois, ${h.pct(K.pctOf(K.pr12(bigger).last, resettled))} des réfugiés réinstallés sont passés par le volet ${bigger === 'psr' ? 'du parrainage privé' : 'de la prise en charge par le gouvernement'}, le plus important des trois. Les réfugiés pris en charge par le gouvernement sont ${dirFr(gar.change)} de ${h.pa(gar.change)} et les réfugiés parrainés par le secteur privé ${dirFr(psr.change)} de ${h.pa(psr.change)} sur les douze mois précédents.</p>
${h.months(M, [[K.prName('gar', 'fr'), K.prSeries('gar')], [K.prName('psr', 'fr'), K.prSeries('psr')], [K.prName('protected', 'fr'), ps], [K.prName('protectedDep', 'fr'), K.prSeries('protectedDep')]], { caption: 'Admissions de résidents permanents dans les catégories de réfugiés et de personnes protégées, par mois. Source : IRCC, Résidents permanents, mises à jour mensuelles, données ouvertes ; chiffres arrondis.' })}
<p>Par année civile, les réfugiés réinstallés étaient ${h.n(r23)} en 2023, ${h.n(r24)} en 2024 et ${h.n(r25)} en 2025. La réinstallation arrive par vagues, au rythme des vols et des départs de groupes : un mois peut compter deux fois plus que le suivant. Le parrainage mixte, où le gouvernement et un groupe privé partagent les frais, reste petit : ${h.n(bv.last)} admissions sur douze mois.</p>
<h2>Les personnes protégées au Canada</h2>
<p>Les admissions de personnes protégées suivent un autre rythme. Les douze derniers mois en apportent ${h.n(pp.last)}, ${dirFr(pp.change)} de ${h.pa(pp.change)} sur les douze précédents, ${hiP === M.length - 1 ? `et le dernier mois publié, ${h.my(M[hiP])}, est aussi le plus chargé depuis janvier 2023, avec ${h.n(lastP)} admissions.` : `et le mois le plus chargé depuis janvier 2023 a été ${h.my(M[hiP])}, avec ${h.n(ps[hiP])}. Le dernier mois publié, ${h.my(M[M.length - 1])}, en compte ${h.n(lastP)}.`} Les membres de leur famille, admis dans une catégorie distincte, totalisent ${h.n(dep.last)} sur l’année. Une personne protégée peut les inclure dans sa demande de résidence permanente : ils suivent alors le même dossier.</p>
<p>Tant que la résidence permanente n’est pas accordée, une personne protégée n’a pas de ${h.a('pr-card', 'carte de résident permanent')} et ne peut parrainer ni époux ni enfant. Une fois la résidence obtenue, les membres de la famille restés hors de la demande peuvent être parrainés par les volets du ${h.a('spousal-sponsorship', 'parrainage de l’époux')} ou de l’${h.a('dependent-child', 'enfant à charge')}.</p>
<h2>Suivre le dossier</h2>
<p>Un réfugié parrainé par le secteur privé est suivi par son groupe de répondants, qui reçoit les lettres d’IRCC. Une personne protégée peut utiliser l’${h.src('check-status', 'outil de suivi de l’état des demandes')} d’IRCC. La façon dont ce site lit les données d’IRCC est décrite sur la ${h.a('method', 'page de méthode')}, avec les limites de chaque jeu de données.</p>
`,
  },
});
