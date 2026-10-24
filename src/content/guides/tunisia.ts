import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dirEn, dirFr, ord, eeRank, yoyTable } from './_pays';

/* Tunisie : données ouvertes d'IRCC par pays de citoyenneté (OGL-Canada 2.0), calculées au build. Angle : les
 * visites de famille (visa de visiteur, super visa) et une part approuvée élevée et stable. */
const C = 'TN';
const E = K.en, F = K.fr;
const v1 = K.ops12('v1', C), tf = K.ops12('trFin', C), sp = K.ops12('spFin', C), pr = K.ops12('prIn', C), co = K.ops12('copr', C), ci = K.ops12('cit', C);
const a = K.approval12(C), all = K.approval12();
const nb = ['MA', 'DZ'].map((c) => ({ c, r: K.approval12(c).rate }));
const above = nb.every((x) => a.rate != null && x.r != null && a.rate > x.r);
const ee = K.eeCountry(K.EE_FULL, C), eeR = eeRank(K.EE_FULL, C);
const sVis = K.stdOf('visitor')!, sSuper = K.stdOf('super-visa')!;
const v1Y = (y: string) => K.fullYear('v1', C, y);
const okY = (y: string) => K.pctOf(K.fullYear('trOk', C, y), K.fullYear('trFin', C, y));
const YRS = ['2023', '2024', '2025'];
// Le titre « au-dessus des voisins » n'est vrai que si la part approuvée tunisienne dépasse celles du Maroc et de l'Algérie.
if (!above) throw new Error('tunisia : la part approuvée de la Tunisie ne dépasse plus celles du Maroc et de l’Algérie, réécrire');
if (!(a.rate != null && a.prevRate != null && Math.abs(a.rate - a.prevRate) < 3)) throw new Error('tunisia : la part approuvée a bougé de plus de 3 points, réécrire « proche de »');
if (!(a.rate != null && all.rate != null && a.rate > all.rate)) throw new Error('tunisia : la part approuvée n’est plus au-dessus de la moyenne, réécrire');

export default defineGuide({
  id: 'tunisia', group: 'countries', order: 113, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['super-visa', 'work-permit', 'study-permit', 'visitor-visa', 'morocco', 'algeria'],
  sources: ['ptimes', 'open-data', 'od-std', 'visit', 'super-visa', 'biometrics', 'ogl'],
  en: {
    slug: 'processing-times-tunisia',
    nav: 'Tunisia', card: 'Visitor visas, super visas and approved share for Tunisians',
    title: 'Tunisian Visitors: IRCC Visas and Decision Dates in 2026',
    description: 'Tunisian citizens in IRCC open data for 2026: visitor visas approved, super visa context, approved share of temporary files and a decision date calculator.',
    h1: 'Applications to Canada by Tunisian citizens',
    intro: `IRCC approved ${E.n(v1.last)} visitor visas for Tunisian citizens from ${E.w12()}, ${E.ch(v1.change)} on the year before.`,
    resume: `Many Tunisian files are family visits: parents visiting children settled in Montreal or Ottawa, siblings coming for a wedding or a birth. IRCC’s open data show ${E.n(v1.last)} visitor visas approved for Tunisian citizens from ${E.w12()}, ${dirEn(v1.change)} ${E.pa(v1.change)} on the year before. Across all temporary residence files, IRCC finalized ${E.n(tf.last)} and approved ${E.pct(a.rate)}, close to the ${E.pct(a.prevRate)} of the previous twelve months and above the ${E.pct(all.rate)} seen across all countries, as well as above the shares for Moroccan and Algerian citizens. Study permit decisions are fewer, at ${E.n(sp.last)}. Parents who want to stay longer can ask for the super visa. The waiting time for Tunisia is the one IRCC shows on its tool; copy it into the calculator to get a date.`,
    faqs: [
      { q: 'How many visitor visas does IRCC approve for Tunisian citizens?', a: `IRCC approved ${E.n(v1.last)} visitor visas for Tunisian citizens from ${E.w12()}, against ${E.n(v1.prev)} the twelve months before. In calendar years, the count was ${E.n(v1Y('2023'))} in 2023 and ${E.n(v1Y('2025'))} in 2025. The figure counts visas approved, rounded to 5, and does not show how many people actually travelled.` },
      { q: 'Should Tunisian parents apply for a visitor visa or a super visa?', a: `A visitor visa usually allows stays of up to six months at a time. The super visa lets parents and grandparents stay up to five years per entry, but needs a minimum income from the host and Canadian medical insurance. IRCC’s standard is ${K.fmtStd(sSuper.cur, 'en')} for a super visa, against ${K.fmtStd(sVis.cur, 'en')} for a visitor visa.` },
      { q: 'Is the Tunisian approved share the same as the chance of a visa?', a: `No. The ${E.pct(a.rate)} share for Tunisian citizens divides approved files by all files finalized, including withdrawals, and mixes visits, studies, work and extensions. Each officer decides on the file in front of them: ties to Tunisia, funds and the purpose of the trip weigh far more than any national average.` },
    ],
    body: (h) => `
<h2>Family visits come first</h2>
<p>Tunisia has a large community in Quebec and Ontario, and much of its traffic with IRCC is family travel. The operational processing tables count ${h.n(v1.last)} visitor visas approved for Tunisian citizens over the latest twelve months, ${dirEn(v1.change)} ${h.pa(v1.change)}. A first visa requires ${h.src('biometrics', 'biometrics')} at a visa application centre, which adds a few days to the file before IRCC can decide.</p>
<p>IRCC sets itself a service standard of ${K.fmtStd(sVis.cur, 'en')} for a ${h.a('visitor-visa', 'visitor visa')} requested outside Canada. Nationally, it met that standard for only ${h.pct(sVis.cur.perf)} of applications in ${K.fmtFy(sVis.fy, 'en')}, so the time for Tunisia on IRCC’s ${h.src('ptimes', 'Check processing times tool')} is often longer. Copy that time below, with your filing month, to get an estimate.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visitor visa from Tunisia: estimated decision date' })}
<h2>An approved share above its neighbours</h2>
<p>Across all temporary residence files, IRCC approved ${h.pct(a.rate)} of those it finalized for Tunisian citizens, against ${h.pct(nb[0].r)} for Moroccans, ${h.pct(nb[1].r)} for Algerians and ${h.pct(all.rate)} for all countries. Year by year, the Tunisian share was ${YRS.map((y) => `${h.pct(okY(y))} in ${y}`).join(', ')}. Withdrawn files count as finalized, and the mix of visits, studies and work differs between countries, so the gap says something about profiles, not about how an officer will read your file.</p>
${yoyTable(h, C, ['trIn', 'trFin', 'trOk', 'v1', 'spFin'], `Tunisian citizens, ${h.w12()} against the twelve months before. Source: IRCC, Operational Processing, open data; figures rounded to 5.`)}
<h2>Super visa for parents</h2>
<p>Tunisian parents who want to spend long periods with their children in Canada often weigh the ${h.a('super-visa', 'super visa')}. It allows stays of up to five years per entry, against six months for a regular visit, in exchange for an income test on the host and private medical insurance. IRCC’s standard is ${K.fmtStd(sSuper.cur, 'en')}, met for ${h.pct(sSuper.cur.perf)} of applications in ${K.fmtFy(sSuper.fy, 'en')}. The open data do not separate super visas by country, so the volumes above cover all visitor visas.</p>
<h2>Studies, work and permanent residence</h2>
<p>New study permit applications finalized for Tunisian citizens came to ${h.n(sp.last)} over twelve months, ${dirEn(sp.change)} ${h.pa(sp.change)}. IRCC received ${h.n(pr.last)} permanent residence applications from Tunisians and issued ${h.n(co.last)} authorizations; ${h.n(ee)} Tunisians were invited through Express Entry in ${K.EE_FULL} (${ord(eeR, 'en')} by citizenship). ${h.n(ci.last)} people born in Tunisia became Canadian citizens over twelve months. Compare with ${h.a('morocco', 'Morocco')} and ${h.a('algeria', 'Algeria')}.</p>
<h2>Where you apply from matters for the time</h2>
<p>IRCC’s tool gives the time for the country you apply from, normally where you live legally. The volumes here count citizens. A Tunisian living in Italy reads the Italian line, yet counts as Tunisian in the open data.</p>
<h2>Making a Tunisian visit file stronger</h2>
<p>An officer reading a visitor visa application from Tunisia looks for a clear purpose and a reason to return. An invitation letter from the relative in Canada, with proof of their status, helps explain the trip. Proof of employment, leave approved by the employer, property or family ties in Tunisia show that the stay is temporary. Funds should cover the trip without relying on a deposit made a few days before applying. Documents in Arabic need a certified translation into English or French, and a previous Schengen or Canadian visa used correctly carries weight.</p>
`,
  },
  fr: {
    slug: 'delais-tunisie',
    nav: 'Tunisie', card: 'Visas de visiteur, super visas et part approuvée des Tunisiens',
    title: 'Visites des Tunisiens : visas IRCC et dates estimées 2026',
    description: 'Les citoyens tunisiens dans les données ouvertes d’IRCC en 2026 : visas de visiteur approuvés, super visa, part approuvée des dossiers temporaires et date.',
    h1: 'Les demandes des citoyens tunisiens au Canada',
    intro: `IRCC a approuvé ${F.n(v1.last)} visas de visiteur pour des citoyens tunisiens de ${F.w12()}, soit ${F.ch(v1.change)} sur un an.`,
    resume: `Une bonne part des dossiers tunisiens sont des visites de famille : parents qui rendent visite à leurs enfants installés à Montréal ou à Ottawa, frères et sœurs venus pour un mariage ou une naissance. Les données ouvertes d’IRCC comptent ${F.n(v1.last)} visas de visiteur approuvés pour des citoyens tunisiens de ${F.w12()}, ${dirFr(v1.change)} de ${F.pa(v1.change)} sur un an. Sur l’ensemble des dossiers de résidence temporaire, IRCC en a finalisé ${F.n(tf.last)} et approuvé ${F.pct(a.rate)}, proche des ${F.pct(a.prevRate)} des douze mois précédents et au-dessus des ${F.pct(all.rate)} tous pays confondus, comme des parts marocaine et algérienne. Les décisions de permis d’études sont moins nombreuses, à ${F.n(sp.last)}. Les parents qui veulent rester plus longtemps peuvent demander le super visa. Le délai de la Tunisie est celui qu’IRCC affiche dans son outil ; recopiez-le dans le calculateur pour obtenir une date.`,
    faqs: [
      { q: 'Combien de visas de visiteur IRCC approuve-t-il pour des Tunisiens ?', a: `IRCC a approuvé ${F.n(v1.last)} visas de visiteur pour des citoyens tunisiens de ${F.w12()}, contre ${F.n(v1.prev)} sur les douze mois précédents. Par année civile, on compte ${F.n(v1Y('2023'))} visas en 2023 et ${F.n(v1Y('2025'))} en 2025. Le chiffre compte des visas approuvés, arrondis à 5, et ne dit pas combien de personnes ont réellement voyagé.` },
      { q: 'Des parents tunisiens doivent-ils demander un visa de visiteur ou un super visa ?', a: `Un visa de visiteur permet en général des séjours de six mois au plus. Le super visa permet aux parents et grands-parents de rester jusqu’à cinq ans par entrée, mais exige un revenu minimal de l’hôte et une assurance médicale canadienne. La norme d’IRCC est de ${K.fmtStd(sSuper.cur, 'fr')} pour un super visa, contre ${K.fmtStd(sVis.cur, 'fr')} pour un visa de visiteur.` },
      { q: 'La part approuvée des Tunisiens est-elle la chance d’obtenir un visa ?', a: `Non. La part de ${F.pct(a.rate)} pour les citoyens tunisiens divise les dossiers approuvés par tous les dossiers finalisés, retraits compris, et mêle visites, études, travail et prolongations. Chaque agent juge le dossier qu’il a devant lui : attaches en Tunisie, fonds et motif du voyage pèsent bien plus qu’une moyenne nationale.` },
    ],
    body: (h) => `
<h2>Les visites de famille d’abord</h2>
<p>La Tunisie a une communauté importante au Québec et en Ontario, et une grande part de ses échanges avec IRCC sont des voyages de famille. Les tableaux du traitement opérationnel comptent ${h.n(v1.last)} visas de visiteur approuvés pour des citoyens tunisiens sur les douze derniers mois, ${dirFr(v1.change)} de ${h.pa(v1.change)}. Un premier visa exige des ${h.src('biometrics', 'données biométriques')} dans un centre de réception des demandes de visa, ce qui ajoute quelques jours avant qu’IRCC puisse décider.</p>
<p>IRCC se fixe une norme de service de ${K.fmtStd(sVis.cur, 'fr')} pour un ${h.a('visitor-visa', 'visa de visiteur')} demandé hors du Canada. À l’échelle du pays, il l’a tenue pour seulement ${h.pct(sVis.cur.perf)} des demandes en ${K.fmtFy(sVis.fy, 'fr')} : le délai de la Tunisie dans l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC est donc souvent plus long. Recopiez-le ci-dessous, avec le mois de dépôt, pour obtenir une estimation.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visa de visiteur depuis la Tunisie : date de décision estimée' })}
<h2>Une part approuvée au-dessus des voisins</h2>
<p>Sur l’ensemble des dossiers de résidence temporaire, IRCC a approuvé ${h.pct(a.rate)} de ceux qu’il a finalisés pour des citoyens tunisiens, contre ${h.pct(nb[0].r)} pour les Marocains, ${h.pct(nb[1].r)} pour les Algériens et ${h.pct(all.rate)} tous pays confondus. Année par année, la part tunisienne a été de ${YRS.map((y) => `${h.pct(okY(y))} en ${y}`).join(', ')}. Les retraits comptent parmi les dossiers finalisés et le mélange de visites, d’études et de travail diffère d’un pays à l’autre : l’écart dit quelque chose des profils, pas de la façon dont un agent lira votre dossier.</p>
${yoyTable(h, C, ['trIn', 'trFin', 'trOk', 'v1', 'spFin'], `Citoyens tunisiens, ${h.w12()} comparés aux douze mois d’avant. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.`)}
<h2>Le super visa pour les parents</h2>
<p>Les parents tunisiens qui veulent passer de longues périodes auprès de leurs enfants au Canada envisagent souvent le ${h.a('super-visa', 'super visa')}. Il permet des séjours de cinq ans au plus par entrée, contre six mois pour une visite ordinaire, en échange d’un critère de revenu pour l’hôte et d’une assurance médicale privée. La norme d’IRCC est de ${K.fmtStd(sSuper.cur, 'fr')}, tenue pour ${h.pct(sSuper.cur.perf)} des demandes en ${K.fmtFy(sSuper.fy, 'fr')}. Les données ouvertes ne distinguent pas les super visas par pays : les volumes ci-dessus couvrent tous les visas de visiteur.</p>
<h2>Études, travail et résidence permanente</h2>
<p>Les nouvelles demandes de permis d’études finalisées pour des citoyens tunisiens atteignent ${h.n(sp.last)} en douze mois, ${dirFr(sp.change)} de ${h.pa(sp.change)}. IRCC a reçu ${h.n(pr.last)} demandes de résidence permanente de Tunisiens et délivré ${h.n(co.last)} autorisations ; ${h.n(ee)} Tunisiens ont été invités par Entrée express en ${K.EE_FULL} (${ord(eeR, 'fr')} rang par citoyenneté). ${h.n(ci.last)} personnes nées en Tunisie sont devenues citoyennes canadiennes en douze mois. Comparez avec le ${h.a('morocco', 'Maroc')} et l’${h.a('algeria', 'Algérie')}.</p>
<h2>Le pays de dépôt compte pour le délai</h2>
<p>L’outil d’IRCC donne le délai du pays depuis lequel vous déposez, en général celui où vous résidez légalement. Les volumes de cette page comptent des citoyens. Un Tunisien qui vit en Italie lit la ligne de l’Italie, mais il compte comme Tunisien dans les données ouvertes.</p>
`,
  },
});
