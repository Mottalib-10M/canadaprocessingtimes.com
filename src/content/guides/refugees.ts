import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Réfugiés réinstallés (pris en charge par l'État, parrainés par le privé) et personnes protégées au Canada :
   lignes prospectives hors Québec et Québec, membres de la famille à l'étranger, délai par pays des réfugiés
   pris en charge par le gouvernement. Tout vient des fichiers d'IRCC relus. */
const D = K.L.dates.flpt;
const F0 = K.firstReading('flpt')!;
const G = K.readingOf('refugees-gov'), PV = K.readingOf('refugees-priv'), PR = K.readingOf('protected');
const tg = K.fullTrend(G.series)!, tp = K.fullTrend(PV.series)!, tpr = K.fullTrend(PR.series)!;
const fl = (k: string) => K.L.flpt[k];
const GQ = fl('government-refugees-quebec'), PQ = fl('private-refugees-quebec'), PRQ = fl('protected-persons-in-canada-quebec');
const DA = fl('dependants-abroad-roc'), DAQ = fl('dependants-abroad-quebec');
const tgq = K.fullTrend('f:government-refugees-quebec')!, tda = K.fullTrend('f:dependants-abroad-roc')!;
const PQ0 = PV.queue![0];
const yrs = Number(K.READ.slice(0, 4)) - Number(PQ0[0].slice(0, 4));
const my = (key: string, l: Lang) => K.monthYear(`${key}-15`, l);
const GOV = K.L.country.refugees_gov ?? {};
const govC = Object.keys(GOV).filter((c) => c !== 'CA' && K.isTime(GOV[c])).sort((a, b) => (K.daysOf(GOV[a]) ?? 0) - (K.daysOf(GOV[b]) ?? 0));
const gLo = govC[0], gHi = govC[govC.length - 1];
const REF = { en: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees.html', fr: 'https://www.canada.ca/fr/immigration-refugies-citoyennete/services/refugies.html' };

function lines(h: Helpers) {
  const l = h.lang, fr = l === 'fr';
  const row = (name: string, roc: { cur: unknown; waiting: number | null }, qc: { cur: unknown; waiting: number | null }) =>
    [name, h.t(roc.cur as never), h.n(roc.waiting ?? 0), h.t(qc.cur as never), h.n(qc.waiting ?? 0)];
  return [
    row(fr ? 'Réfugiés pris en charge par le gouvernement' : 'Government-assisted refugees', { cur: G.t, waiting: G.waiting ?? null }, GQ),
    row(fr ? 'Réfugiés parrainés par le secteur privé' : 'Privately sponsored refugees', { cur: PV.t, waiting: PV.waiting ?? null }, PQ),
    row(fr ? 'Personnes protégées au Canada' : 'Protected persons in Canada', { cur: PR.t, waiting: PR.waiting ?? null }, PRQ),
    row(fr ? 'Membres de la famille à l’étranger' : 'Family members abroad', DA, DAQ),
  ];
}
function govRows(h: Helpers) {
  return govC.map((c) => [h.cn(c), h.t(GOV[c])]);
}

export default defineGuide({
  id: 'refugees', group: 'family', order: 53,
  tool: 'delai', toolArg: { g: 'refugees-gov', only: 'refugees-gov,refugees-priv,protected' },
  related: ['spousal-sponsorship', 'dependent-child', 'pr-card', 'history', 'method'],
  sources: ['ptimes-flpt', 'ptimes-country', 'ptimes', 'check-status', 'wayback'],
  en: {
    slug: 'refugee-processing-time',
    nav: 'Refugees', card: 'Resettled refugees, protected persons, Quebec and family abroad',
    title: 'Refugee and Protected Person Processing Times, 2026',
    description: 'Refugee processing times in 2026: government-assisted and privately sponsored refugees, protected persons in Canada, Quebec, family abroad, trend since 2025.',
    h1: 'Refugees and protected persons: the published times',
    intro: `IRCC’s file of ${K.en.day(D)} gives ${K.fmtTime(G.t, 'en')} for government-assisted refugees and ${K.fmtTime(PV.t, 'en')} for privately sponsored refugees, outside Quebec.`,
    resume: `A refugee resettled to Canada with government support currently waits ${K.fmtTime(G.t, 'en')}, and a privately sponsored refugee ${K.fmtTime(PV.t, 'en')}, for destinations outside Quebec, according to the forward-looking times IRCC published on ${K.en.day(D)}. A person who already received refugee protection inside Canada and applies for permanent residence is looking at ${K.fmtTime(PR.t, 'en')}. The Quebec lines differ: ${K.fmtTime(GQ.cur, 'en')} for government-assisted refugees, ${K.fmtTime(PQ.cur, 'en')} for privately sponsored ones and ${K.fmtTime(PRQ.cur, 'en')} for protected persons. The private sponsorship line is the one that has moved most: it stood at ${K.fmtDays(tp.first!, 'm', 'en')} in our first copy, dated ${K.en.day(tp.firstDate!)}, and has fallen since, while ${K.num(PV.waiting ?? 0, 'en')} applications were still waiting. These figures describe the permanent residence step only. They say nothing about a refugee claim heard by the Immigration and Refugee Board, which has its own schedule. The tool above reads each line and its queue by month of filing.`,
    faqs: [
      { q: 'How long does private refugee sponsorship take in 2026?', a: `For a refugee going to a province other than Quebec, IRCC expects ${K.fmtTime(PV.t, 'en')} (${K.en.day(D)}), with ${K.num(PV.waiting ?? 0, 'en')} files waiting. Applications received in ${my(PQ0[0], 'en')} still had ${K.num(PQ0[1] as number, 'en')} months to go. For Quebec, where sponsors deal with the Quebec government, the figure is ${K.fmtTime(PQ.cur, 'en')}.` },
      { q: 'How long does permanent residence take for a protected person in Canada?', a: `Once the Immigration and Refugee Board grants protection, the person can apply for permanent residence. IRCC’s current estimate is ${K.fmtTime(PR.t, 'en')} outside Quebec and ${K.fmtTime(PRQ.cur, 'en')} in Quebec. The outside-Quebec line was ${K.fmtDays(tpr.first!, 'm', 'en')} when it first appeared in our archive on ${K.en.day(tpr.firstDate!)}.` },
      { q: 'Does the time for government-assisted refugees depend on the country?', a: `Yes. Besides the overall figure, IRCC’s country file gives a time for government-assisted refugees in ${K.num(govC.length, 'en')} countries, from ${K.fmtTime(GOV[gLo], 'en')} in ${K.countryName(gLo, 'en')} to ${K.fmtTime(GOV[gHi], 'en')} in ${K.countryName(gHi, 'en')}. The country is where the refugee is when the case is processed. Other countries show no figure.` },
    ],
    body: (h) => `
<h2>Four groups, two sides of Quebec</h2>
<p>IRCC publishes forward-looking times for each way a refugee or protected person becomes a permanent resident, split between Quebec and the rest of Canada. Resettled refugees are selected abroad, usually after a referral, and come either with government support or with a private sponsor such as a community group. Protected persons are people whose refugee claim was accepted in Canada. Family members abroad are relatives of a protected person who apply from outside Canada.</p>
${h.table(['Group', 'Outside Quebec', 'Waiting', 'Quebec', 'Waiting'], lines(h), `Forward-looking times and applications waiting, IRCC file of ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The size of each line explains part of the gap. Outside Quebec, ${h.n(PR.waiting ?? 0)} protected persons and ${h.n(PV.waiting ?? 0)} privately sponsored refugees were waiting, against ${h.n(G.waiting ?? 0)} government-assisted refugees. Government-assisted arrivals follow yearly targets set in the immigration levels plan, which keeps that line comparatively steady: it moved between ${h.d(tg.min, 'm')} and ${h.d(tg.max, 'm')} over our archive.</p>
<h2>Private sponsorship: a long line getting shorter</h2>
<p>The privately sponsored line outside Quebec dropped from ${h.d(tp.first!, 'm')} on ${h.day(tp.firstDate!)} to ${h.d(tp.last, 'm')} now. It is still the longest of the three outside Quebec, and the queue shows why: files received in ${h.my(`${PQ0[0]}-15`)}, the oldest month IRCC lists, still had ${h.n(PQ0[1] as number)} months to go, with ${K.fmtAhead(PQ0[2], 'en')} people ahead. In other words, a sponsorship group that applied ${h.n(yrs)} years ago is not near the front. Our archive of these times starts on ${h.day(F0)}; every reading since is below, with the copy it comes from.</p>
${h.hist(PV.series, { max: 12, unit: 'm' })}
${h.mini('delai', { p: ['g', 'm'], d: { g: 'refugees-priv', m: PV.queue![PV.queue!.length - 13][0] }, t: 'Your refugee file: time left for your month' })}
<h2>Government-assisted refugees by country</h2>
<p>IRCC’s weekly country file carries a separate line for government-assisted refugees, by the country where the refugee is when the case is processed. Only ${h.n(govC.length)} countries had a figure on ${h.day(K.L.dates.country)}; the rest show no published time. This is a past time, the delay within which most recent cases from that country were finished, so it is not directly comparable with the forward-looking line above.</p>
${h.table(['Country', 'Published time'], govRows(h), `Government-assisted refugees, IRCC country file of ${h.day(K.L.dates.country)}.`, ['l', 'r'])}
<h2>Quebec and families abroad</h2>
<p>In Quebec, the government-assisted line is short, ${h.t(GQ.cur as never)}, but it has lengthened from ${h.d(tgq.first!, 'm')} in the first copy we hold, and very few files are in it (${h.n(GQ.waiting ?? 0)}). The protected person line in Quebec is published as ${h.t(PRQ.cur as never)}, the longest mention IRCC’s file uses, and ${h.n(PRQ.waiting ?? 0)} people were waiting. Family members abroad of a protected person outside Quebec face ${h.t(DA.cur as never)}; that line was ${h.d(tda.first!, 'm')} when it first appeared in our copies on ${h.day(tda.firstDate!)}.</p>
<p>For a protected person, the wait for relatives abroad matters as much as their own file: family members listed in the application can be processed with it, but those abroad go through visa offices, medical exams and security checks in their country. The longer line abroad reflects that extra distance, not a lower priority.</p>
<h2>What these figures do not cover</h2>
<p>None of these times covers a refugee claim made in Canada: that hearing belongs to the Immigration and Refugee Board, an independent tribunal that publishes its own figures. The times here start once a complete permanent residence application is with IRCC, and they do not include medical exams, security screening abroad or travel arrangements. Readers can follow the official program pages on ${h.ext(h.lang === 'fr' ? REF.fr : REF.en, 'IRCC’s refugee section')}, and our ${h.a('method', 'method page')} explains how the forward-looking file is read and dated. Older readings for every line are on the ${h.a('history', 'history page')}.</p>
`,
  },
  fr: {
    slug: 'delai-refugies',
    nav: 'Réfugiés', card: 'Réfugiés réinstallés, personnes protégées, Québec et famille',
    title: 'Délai des réfugiés réinstallés et personnes protégées 2026',
    description: 'Délais 2026 des réfugiés pris en charge par l’État ou parrainés, des personnes protégées au Canada et de leur famille, au Québec et ailleurs, depuis 2025.',
    h1: 'Réfugiés et personnes protégées : les délais publiés',
    intro: `Au Québec, IRCC prévoit ${K.fmtTime(GQ.cur, 'fr')} pour un réfugié pris en charge par l’État et ${K.fmtTime(PQ.cur, 'fr')} pour un réfugié parrainé par le secteur privé (${K.fr.day(D)}).`,
    resume: `Un réfugié réinstallé au Québec avec l’aide de l’État attend aujourd’hui ${K.fmtTime(GQ.cur, 'fr')}, et un réfugié parrainé par un groupe privé québécois ${K.fmtTime(PQ.cur, 'fr')}, selon les délais prospectifs publiés par IRCC le ${K.fr.day(D)}. Ailleurs au Canada, les chiffres sont de ${K.fmtTime(G.t, 'fr')} et de ${K.fmtTime(PV.t, 'fr')}. Une personne qui a obtenu l’asile au Canada et demande la résidence permanente doit compter ${K.fmtTime(PRQ.cur, 'fr')} au Québec, la mention la plus longue du fichier d’IRCC, contre ${K.fmtTime(PR.t, 'fr')} dans le reste du pays. La ligne québécoise des réfugiés pris en charge par l’État est courte mais s’allonge : elle était de ${K.fmtDays(tgq.first!, 'm', 'fr')} dans notre première copie, datée du ${K.fr.day(tgq.firstDate!)}. Ces délais ne portent que sur l’étape de la résidence permanente ; ils ne disent rien de l’audience d’une demande d’asile devant la Commission de l’immigration et du statut de réfugié, qui suit son propre calendrier. L’outil ci-dessus lit chaque ligne et sa file par mois de dépôt.`,
    faqs: [
      { q: 'Combien de temps prend le parrainage privé d’un réfugié au Québec ?', a: `IRCC prévoit ${K.fmtTime(PQ.cur, 'fr')} au ${K.fr.day(D)}, avec ${K.num(PQ.waiting ?? 0, 'fr')} demandes en attente. Le groupe parrain québécois passe d’abord par le gouvernement du Québec, qui délivre son engagement, avant l’examen fédéral. Hors Québec, le même parrainage est estimé à ${K.fmtTime(PV.t, 'fr')}.` },
      { q: 'Quel est le délai de résidence permanente d’une personne protégée au Québec ?', a: `IRCC publie ${K.fmtTime(PRQ.cur, 'fr')} pour cette ligne au ${K.fr.day(D)}, avec ${K.num(PRQ.waiting ?? 0, 'fr')} personnes en attente. Hors Québec, la même demande est estimée à ${K.fmtTime(PR.t, 'fr')}. La personne doit d’abord obtenir le Certificat de sélection du Québec avant que le dossier fédéral se termine.` },
      { q: 'Le délai des réfugiés pris en charge par l’État varie-t-il selon le pays ?', a: `Oui. Le fichier par pays d’IRCC donne un délai pour ${K.num(govC.length, 'fr')} pays, de ${K.fmtTime(GOV[gLo], 'fr')} (${K.countryName(gLo, 'fr')}) à ${K.fmtTime(GOV[gHi], 'fr')} (${K.countryName(gHi, 'fr')}). Le pays retenu est celui où se trouve le réfugié pendant le traitement. Les autres pays n’ont pas de chiffre publié.` },
    ],
    body: (h) => `
<h2>Quatre groupes, deux côtés du Québec</h2>
<p>IRCC publie un délai prospectif pour chaque voie qui mène un réfugié ou une personne protégée à la résidence permanente, en séparant le Québec du reste du Canada. Les réfugiés réinstallés sont choisis à l’étranger, le plus souvent sur recommandation, et arrivent avec l’aide de l’État ou avec un parrain privé, par exemple un groupe communautaire. Les personnes protégées ont vu leur demande d’asile acceptée au Canada. Les membres de la famille à l’étranger sont des proches d’une personne protégée qui présentent leur demande hors du Canada.</p>
${h.table(['Groupe', 'Hors Québec', 'En attente', 'Québec', 'En attente'], lines(h), `Délais prospectifs et demandes en attente, fichier d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Au Québec, le gouvernement provincial sélectionne les réfugiés réinstallés et délivre le Certificat de sélection du Québec aux personnes protégées. Cette étape explique en partie des chiffres très différents de ceux du reste du pays : la ligne des personnes protégées y est publiée comme ${h.t(PRQ.cur as never)}, alors que celle des réfugiés pris en charge par l’État compte peu de dossiers, ${h.n(GQ.waiting ?? 0)} au dernier relevé.</p>
<h2>L’évolution côté Québec</h2>
<p>La ligne québécoise des réfugiés pris en charge par l’État est passée de ${h.d(tgq.first!, 'm')} le ${h.day(tgq.firstDate!)} à ${h.d(tgq.last, 'm')} aujourd’hui : peu de dossiers, mais un délai qui s’allonge. Notre archive de ces délais commence le ${h.day(F0)} ; chaque relevé est listé ci-dessous avec la copie d’où il vient, sans aucun point ajouté.</p>
${h.hist('f:government-refugees-quebec', { max: 12, unit: 'm' })}
<p>Hors Québec, le parrainage privé a beaucoup reculé, de ${h.d(tp.first!, 'm')} à ${h.d(tp.last, 'm')}, mais la file reste lourde : les dossiers reçus en ${h.my(`${PQ0[0]}-15`)}, le plus ancien mois listé, avaient encore ${h.n(PQ0[1] as number)} mois devant eux, avec ${K.fmtAhead(PQ0[2], 'fr')} personnes devant. Un groupe parrain qui a déposé il y a ${h.n(yrs)} ans n’est donc pas près de la tête de file.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'refugees-gov', m: G.queue![G.queue!.length - 13][0] }, t: 'Votre dossier de réfugié : temps restant pour votre mois' })}
<h2>Réfugiés pris en charge par l’État, par pays</h2>
<p>Le fichier hebdomadaire par pays d’IRCC contient une ligne distincte pour les réfugiés pris en charge par le gouvernement, selon le pays où se trouve le réfugié pendant le traitement. Seuls ${h.n(govC.length)} pays avaient un chiffre le ${h.day(K.L.dates.country)}. C’est un délai passé, le temps dans lequel la plupart des dossiers récents de ce pays ont été terminés : il ne se compare pas directement à la ligne prospective plus haut.</p>
${h.table(['Pays', 'Délai publié'], govRows(h), `Réfugiés pris en charge par le gouvernement, fichier par pays d’IRCC du ${h.day(K.L.dates.country)}.`, ['l', 'r'])}
<p>Pour une personne protégée, l’attente de la famille restée à l’étranger compte autant que son propre dossier. Les proches inscrits dans la demande peuvent être traités avec elle, mais ceux qui vivent hors du Canada passent par un bureau des visas, un examen médical et des contrôles de sécurité dans leur pays, ce qui allonge la ligne sans traduire une priorité moindre.</p>
<h2>Ce que ces délais ne couvrent pas</h2>
<p>Aucun de ces délais ne concerne l’examen d’une demande d’asile faite au Canada : cette audience relève de la Commission de l’immigration et du statut de réfugié, un tribunal indépendant qui publie ses propres chiffres. Les délais de cette page partent du moment où IRCC reçoit une demande de résidence permanente complète. Ils ne comprennent pas l’examen médical, les contrôles de sécurité à l’étranger ni l’organisation du voyage. La famille à l’étranger d’une personne protégée hors Québec doit compter ${h.t(DA.cur as never)}, une ligne qui était de ${h.d(tda.first!, 'm')} à sa première apparition dans nos copies, le ${h.day(tda.firstDate!)}. Les pages officielles sont dans la ${h.ext(h.lang === 'fr' ? REF.fr : REF.en, 'section Réfugiés d’IRCC')}, et notre ${h.a('method', 'page de méthode')} explique comment le fichier prospectif est lu et daté. Les relevés de chaque ligne sont sur la ${h.a('history', 'page de l’historique')}.</p>
`,
  },
});
