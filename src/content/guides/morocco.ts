import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dirEn, dirFr, ord, eeRank, yearsTable, yoyTable } from './_pays';

/* Maroc : données ouvertes d'IRCC par pays de citoyenneté (OGL-Canada 2.0), calculées au build. Angle : les
 * études, qui ont reculé, et la résidence permanente, qui tient. */
const C = 'MA';
const E = K.en, F = K.fr;
const sp = K.ops12('spFin', C), st = K.study12(C), v1 = K.ops12('v1', C), pr = K.ops12('prIn', C), co = K.ops12('copr', C), ci = K.ops12('cit', C);
const a = K.approval12(C), all = K.approval12(), nt = K.net12(C);
const rPr = K.rank12('prIn', C), rTr = K.rank12('trFin', C);
const sp23 = K.fullYear('spFin', C, '2023'), sp25 = K.fullYear('spFin', C, '2025');
const ee = K.eeCountry(K.EE_FULL, C), eeR = eeRank(K.EE_FULL, C), eeP = K.eeCountry(String(Number(K.EE_FULL) - 1), C);
const sStudy = K.stdOf('study')!, sVis = K.stdOf('visitor')!;
// « garde son rythme » : les demandes de résidence permanente ne doivent pas avoir reculé de plus de 15 %.
if (!(pr.change != null && pr.change > -15)) throw new Error('morocco : la résidence permanente a nettement reculé, réécrire « garde son rythme »');


export default defineGuide({
  id: 'morocco', group: 'countries', order: 110, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['visitor-visa', 'study-permit', 'super-visa', 'quebec-skilled-worker', 'algeria', 'tunisia'],
  sources: ['ptimes', 'open-data', 'od-study', 'od-ee', 'od-std', 'study-permit', 'qsw', 'ogl'],
  en: {
    slug: 'processing-times-morocco',
    nav: 'Morocco', card: 'Study decisions, visitor visas and permanent residence for Moroccans',
    title: 'IRCC Volumes and Decision Dates for Moroccans in 2026',
    description: 'IRCC open data for Moroccan citizens in 2026: study permit decisions, visitor visas, permanent residence and Express Entry invitations, and a date tool.',
    h1: 'Applications to Canada by Moroccan citizens',
    intro: `IRCC finalized ${E.n(sp.last)} new study permit applications from Moroccan citizens from ${E.w12()}, ${E.ch(sp.change)} on the year before.`,
    resume: `Moroccan citizens file a steady flow of applications with IRCC, and its open data show where that flow has shifted. From ${E.w12()}, IRCC finalized ${E.n(K.ops12('trFin', C).last)} temporary residence applications for Moroccan citizens and approved ${E.pct(a.rate)} of them, against ${E.pct(a.prevRate)} the year before and ${E.pct(all.rate)} for all countries. New study permit applications finalized fell to ${E.n(sp.last)}, ${dirEn(sp.change)} ${E.pa(sp.change)}, while ${E.n(st.last)} study permits took effect for Moroccans. On the permanent side, IRCC received ${E.n(pr.last)} permanent residence applications from Moroccan citizens and issued ${E.n(co.last)} permanent residence authorizations, and ${E.n(ee)} Moroccans were invited through Express Entry in ${K.EE_FULL}. The processing time itself is the one IRCC shows on its tool for the country you apply from; copy it into the calculator to get a decision date.`,
    faqs: [
      { q: 'How many study permit applications from Moroccan citizens does IRCC decide?', a: `IRCC finalized ${E.n(sp.last)} new study permit applications from Moroccan citizens from ${E.w12()}, against ${E.n(sp.prev)} the twelve months before. In calendar years, the count went from ${E.n(sp23)} in 2023 to ${E.n(sp25)} in 2025. Finalized means approved, refused or withdrawn, so the number measures how many files reached an end, not how many students arrived.` },
      { q: 'Is a Moroccan applying from France counted as Morocco?', a: 'In the open data on this page, yes: IRCC counts people by country of citizenship. On IRCC’s processing times tool, no: the time shown depends on the country you apply from, normally where you live legally. A Moroccan student in France reads the time for France, and still appears among Moroccan citizens in the volumes here.' },
      { q: 'How many Moroccans are invited through Express Entry?', a: `IRCC’s open data on invited candidates count ${E.n(ee)} Moroccan citizens invited in ${K.EE_FULL}, which puts Morocco ${ord(eeR, 'en')} among countries of citizenship, after ${E.n(eeP)} the year before. Strong French scores help in the category rounds for French speakers, but an invitation still depends on the full ranking score.` },
    ],
    body: (h) => `
<h2>Studying in Canada: fewer decisions</h2>
<p>For Moroccan students, the clearest change in IRCC’s open data is the fall in study permit decisions. The operational processing tables count new study permit applications finalized each month by country of citizenship: ${h.n(sp23)} for Moroccans in 2023, ${h.n(sp25)} in 2025, and ${h.n(sp.last)} over the latest twelve months. A separate dataset counts study permits that actually took effect: ${h.n(st.last)} for Moroccan citizens over its latest twelve months, ${dirEn(st.change)} ${h.pa(st.change)} on the year before. Fewer files finalized usually means fewer filed, after Canada capped new study permits in 2024 and asked most students for a provincial attestation letter.</p>
<p>The time IRCC sets itself for a study permit requested outside Canada, its service standard, is ${K.fmtStd(sStudy.cur, 'en')} for 80% of applications; across all countries it met that standard for ${h.pct(sStudy.cur.perf)} of files in ${K.fmtFy(sStudy.fy, 'en')}. The time for Morocco itself is on IRCC’s ${h.src('ptimes', 'Check processing times tool')}; copy it into the calculator below with the day IRCC received your application.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'Study permit from Morocco: estimated decision date' })}
<h2>Visits and other temporary files</h2>
<p>IRCC approved ${h.n(v1.last)} visitor visas for Moroccan citizens over the latest twelve months, ${dirEn(v1.change)} ${h.pa(v1.change)}. Across all temporary residence files (visitor visas, visitor records, study and work permits and their extensions), it finalized ${h.n(nt.fin)} and received ${h.n(nt.rin)}, which places Morocco ${ord(rTr.rank, 'en')} of ${h.n(rTr.of)} countries of citizenship by files finalized. The approved share, ${h.pct(a.rate)}, counts withdrawn files among those finalized, so it is a broad signal and never a refusal rate. IRCC’s standard for a new visitor visa is ${K.fmtStd(sVis.cur, 'en')}, met for only ${h.pct(sVis.cur.perf)} of applications nationally in ${K.fmtFy(sVis.fy, 'en')}.</p>
${yoyTable(h, C, ['trIn', 'trFin', 'trOk', 'spFin', 'v1'], `Moroccan citizens, ${h.w12()} against the twelve months before. Source: IRCC, Operational Processing, open data; figures rounded to 5.`)}
<h2>Permanent residence keeps its pace</h2>
<p>The permanent side has held up better than studies. IRCC received ${h.n(pr.last)} permanent residence applications from Moroccan citizens over twelve months, ${h.ch(pr.change)} on the year before, which ranks Morocco ${ord(rPr.rank, 'en')} among countries of citizenship. It issued ${h.n(co.last)} confirmations and visas of permanent residence over the same months. Many Moroccans settle in Quebec, where the province selects skilled workers first and IRCC then handles the federal stage of the ${h.a('quebec-skilled-worker', 'Quebec skilled worker')} file. Express Entry is the other route: ${h.n(ee)} Moroccan citizens were invited in ${K.EE_FULL}, according to the ${h.src('od-ee', 'invited candidates open data')}.</p>
${yearsTable(h, C, ['prIn', 'copr', 'cit'], 'Moroccan citizens by calendar year (new citizens by country of birth). Source: IRCC open data; figures rounded to 5.')}
<p>Citizenship closes the path. IRCC’s monthly data count new citizens by country of birth: ${h.n(ci.last)} people born in Morocco became Canadian over the latest twelve months. The ${h.a('algeria', 'Algeria')} and ${h.a('tunisia', 'Tunisia')} pages show the same indicators for the two neighbours, with different trends.</p>
<h2>Which country your file counts under</h2>
<p>Two definitions coexist. IRCC’s processing times tool asks for the country you apply from, normally your country of legal residence. The open data on this page count citizens. A Moroccan living in Spain reads the Spanish line on IRCC’s tool but is counted here as Moroccan. Keep that in mind before comparing your wait with the volumes above.</p>
`,
  },
  fr: {
    slug: 'delais-maroc',
    nav: 'Maroc', card: 'Décisions d’études, visas de visiteur et résidence permanente des Marocains',
    title: 'Demandes des Marocains : volumes IRCC et dates en 2026',
    description: 'Données ouvertes d’IRCC sur les citoyens marocains en 2026 : décisions de permis d’études, visas de visiteur, résidence permanente, Entrée express et date.',
    h1: 'Les demandes des citoyens marocains au Canada',
    intro: `IRCC a finalisé ${F.n(sp.last)} nouvelles demandes de permis d’études de citoyens marocains de ${F.w12()}, soit ${F.ch(sp.change)} sur un an.`,
    resume: `Les citoyens marocains déposent un flux régulier de demandes auprès d’IRCC, et ses données ouvertes montrent où ce flux s’est déplacé. De ${F.w12()}, IRCC a finalisé ${F.n(K.ops12('trFin', C).last)} demandes de résidence temporaire de citoyens marocains et en a approuvé ${F.pct(a.rate)}, contre ${F.pct(a.prevRate)} l’année précédente et ${F.pct(all.rate)} tous pays confondus. Les nouvelles demandes de permis d’études finalisées sont tombées à ${F.n(sp.last)}, ${dirFr(sp.change)} de ${F.pa(sp.change)}, tandis que ${F.n(st.last)} permis d’études sont entrés en vigueur pour des Marocains. Côté permanent, IRCC a reçu ${F.n(pr.last)} demandes de résidence permanente de citoyens marocains et délivré ${F.n(co.last)} autorisations de résidence permanente, et ${F.n(ee)} Marocains ont été invités par Entrée express en ${K.EE_FULL}. Le délai lui-même est celui qu’IRCC affiche dans son outil pour le pays depuis lequel vous déposez : recopiez-le dans le calculateur pour obtenir une date de décision.`,
    faqs: [
      { q: 'Combien de demandes de permis d’études de Marocains IRCC tranche-t-il ?', a: `IRCC a finalisé ${F.n(sp.last)} nouvelles demandes de permis d’études de citoyens marocains de ${F.w12()}, contre ${F.n(sp.prev)} sur les douze mois précédents. Par année civile, on passe de ${F.n(sp23)} en 2023 à ${F.n(sp25)} en 2025. Finalisée veut dire approuvée, refusée ou retirée : le nombre mesure les dossiers arrivés à leur terme, pas les étudiants arrivés.` },
      { q: 'Un Marocain qui dépose depuis la France compte-t-il pour le Maroc ?', a: 'Dans les données ouvertes de cette page, oui : IRCC compte les personnes par pays de citoyenneté. Dans l’outil des délais d’IRCC, non : le délai affiché dépend du pays depuis lequel vous déposez, en général celui où vous résidez légalement. Un étudiant marocain en France lit le délai de la France et figure quand même parmi les Marocains ici.' },
      { q: 'Combien de Marocains sont invités par Entrée express ?', a: `Les données ouvertes d’IRCC sur les candidats invités comptent ${F.n(ee)} citoyens marocains invités en ${K.EE_FULL}, ce qui place le Maroc au ${ord(eeR, 'fr')} rang des pays de citoyenneté, après ${F.n(eeP)} l’année précédente. Un bon niveau de français aide dans les rondes réservées aux francophones, mais l’invitation dépend toujours du score global.` },
    ],
    body: (h) => `
<h2>Étudier au Canada : moins de décisions</h2>
<p>Pour les étudiants marocains, le changement le plus net des données ouvertes d’IRCC est la baisse des décisions de permis d’études. Les tableaux du traitement opérationnel comptent chaque mois les nouvelles demandes de permis d’études finalisées par pays de citoyenneté : ${h.n(sp23)} pour les Marocains en 2023, ${h.n(sp25)} en 2025 et ${h.n(sp.last)} sur les douze derniers mois. Un autre jeu de données compte les permis d’études réellement entrés en vigueur : ${h.n(st.last)} pour des citoyens marocains sur ses douze derniers mois, ${dirFr(st.change)} de ${h.pa(st.change)} sur un an. Moins de dossiers finalisés signifie le plus souvent moins de dossiers déposés, depuis que le Canada a plafonné les nouveaux permis d’études en 2024 et exige de la plupart des étudiants une lettre d’attestation provinciale.</p>
<p>Le délai qu’IRCC se fixe pour un permis d’études demandé hors du Canada, sa norme de service, est de ${K.fmtStd(sStudy.cur, 'fr')} pour 80 % des demandes ; tous pays confondus, elle a été tenue pour ${h.pct(sStudy.cur.perf)} des dossiers en ${K.fmtFy(sStudy.fy, 'fr')}. Le délai propre au Maroc se lit dans l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC ; recopiez-le dans le calculateur ci-dessous avec le jour où IRCC a reçu votre demande.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'Permis d’études depuis le Maroc : date de décision estimée' })}
<h2>Visites et autres dossiers temporaires</h2>
<p>IRCC a approuvé ${h.n(v1.last)} visas de visiteur pour des citoyens marocains sur les douze derniers mois, ${dirFr(v1.change)} de ${h.pa(v1.change)}. Sur l’ensemble des dossiers de résidence temporaire (visas de visiteur, fiches du visiteur, permis d’études et de travail et leurs prolongations), il en a finalisé ${h.n(nt.fin)} et reçu ${h.n(nt.rin)}, ce qui place le Maroc au ${ord(rTr.rank, 'fr')} rang sur ${h.n(rTr.of)} pays de citoyenneté pour les dossiers finalisés. La part approuvée, ${h.pct(a.rate)}, compte les retraits parmi les dossiers finalisés : c’est un signal général, jamais un taux de refus. La norme d’IRCC pour un nouveau visa de visiteur est de ${K.fmtStd(sVis.cur, 'fr')}, tenue pour seulement ${h.pct(sVis.cur.perf)} des demandes à l’échelle du pays en ${K.fmtFy(sVis.fy, 'fr')}.</p>
${yoyTable(h, C, ['trIn', 'trFin', 'trOk', 'spFin', 'v1'], `Citoyens marocains, ${h.w12()} comparés aux douze mois d’avant. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.`)}
<h2>La résidence permanente garde son rythme</h2>
<p>Le versant permanent a mieux résisté que les études. IRCC a reçu ${h.n(pr.last)} demandes de résidence permanente de citoyens marocains en douze mois, soit ${h.ch(pr.change)} sur un an, ce qui classe le Maroc au ${ord(rPr.rank, 'fr')} rang des pays de citoyenneté. Il a délivré ${h.n(co.last)} confirmations et visas de résidence permanente sur la même période. Beaucoup de Marocains s’installent au Québec, où la province sélectionne d’abord les travailleurs qualifiés avant qu’IRCC ne traite l’étape fédérale du dossier de ${h.a('quebec-skilled-worker', 'travailleur qualifié du Québec')}. Entrée express est l’autre voie : ${h.n(ee)} citoyens marocains ont été invités en ${K.EE_FULL}, d’après les ${h.src('od-ee', 'données ouvertes sur les candidats invités')}.</p>
${yearsTable(h, C, ['prIn', 'copr', 'cit'], 'Citoyens marocains par année civile (nouveaux citoyens par pays de naissance). Source : IRCC, données ouvertes ; chiffres arrondis à 5.')}
<p>La citoyenneté ferme le parcours. Les données mensuelles d’IRCC comptent les nouveaux citoyens par pays de naissance : ${h.n(ci.last)} personnes nées au Maroc sont devenues canadiennes sur les douze derniers mois. Les pages ${h.a('algeria', 'Algérie')} et ${h.a('tunisia', 'Tunisie')} donnent les mêmes indicateurs pour les deux voisins, avec des tendances différentes.</p>
<h2>Sous quel pays votre dossier est compté</h2>
<p>Deux définitions coexistent. L’outil des délais d’IRCC demande le pays depuis lequel vous déposez, en général votre pays de résidence légale. Les données ouvertes de cette page comptent des citoyens. Un Marocain qui vit en Espagne lit la ligne de l’Espagne dans l’outil d’IRCC, mais il est compté ici comme Marocain. Gardez cette différence en tête avant de comparer votre attente aux volumes ci-dessus.</p>
`,
  },
});
