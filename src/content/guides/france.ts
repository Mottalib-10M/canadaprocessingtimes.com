import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dirEn, dirFr, ord, yearsTable } from './_pays';

/* France : données ouvertes d'IRCC par pays de citoyenneté (OGL-Canada 2.0), calculées au build. Angle : les Français
 * sont dispensés de visa (AVE), viennent pour EIC/PVT et les études, et l'outil d'IRCC distingue résidents de France
 * et citoyens français. */
const C = 'FR';
const E = K.en, F = K.fr;
const v1 = K.ops12('v1', C), tf = K.ops12('trFin', C), sp = K.ops12('spFin', C), st = K.study12(C), pr = K.ops12('prIn', C), co = K.ops12('copr', C), ci = K.ops12('cit', C);
const a = K.approval12(C), all = K.approval12();
const rSp = K.rank12('spFin', C), rCi = K.rank12('cit', C);
const iec = K.imp12('iec');
const sEta = K.stdOf('eta'), sStudy = K.stdOf('study')!, sQsw = K.stdOf('qsw');
const prY = (y: string) => K.fullYear('prIn', C, y);
// La France est dispensée de visa : si les visas de visiteur approuvés dépassaient 1 000 par an, le passage « presque aucun visa » deviendrait faux.
if (!(v1.last != null && v1.last < 1000)) throw new Error('france : plus de 1 000 visas de visiteur approuvés pour des Français, réécrire le passage sur la dispense de visa');
if (!(rSp.rank != null && rSp.rank <= 10)) throw new Error('france : la France n’est plus dans les dix premiers pays pour les permis d’études, réécrire');

export default defineGuide({
  id: 'france', group: 'countries', order: 114, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['iec', 'eta', 'study-permit', 'work-permit', 'morocco', 'cameroon'],
  sources: ['ptimes', 'open-data', 'od-study', 'od-work', 'od-std', 'eta', 'iec', 'qsw', 'ogl'],
  en: {
    slug: 'processing-times-france',
    nav: 'France', card: 'eTA, IEC working holidays, study permits and residence for the French',
    title: 'eTA, IEC and Study Permits for French Applicants in 2026',
    description: 'French citizens in IRCC open data for 2026: visa exemption and eTA, IEC working holidays, study permits, permanent residence and a decision date calculator.',
    h1: 'Applications to Canada by French citizens',
    intro: `IRCC finalized ${E.n(sp.last)} new study permit applications from French citizens from ${E.w12()}, ${ord(rSp.rank, 'en')} among countries of citizenship.`,
    resume: `French citizens do not need a visitor visa for Canada: they fly with an electronic travel authorization, the eTA, which is why IRCC approved only ${E.n(v1.last)} visitor visas for French citizens from ${E.w12()}, mostly for people with a second nationality or special cases. Their files with IRCC are therefore study permits, work permits, International Experience Canada and permanent residence. IRCC finalized ${E.n(sp.last)} new study permit applications from French citizens, ${ord(rSp.rank, 'en')} by citizenship, and approved ${E.pct(a.rate)} of all temporary residence files it finalized, against ${E.pct(all.rate)} for all countries. Permanent residence applications received came to ${E.n(pr.last)}, and ${E.n(ci.last)} people born in France became Canadian citizens. One point matters for waiting times: IRCC’s tool keys them to the country you apply from, not to your passport.`,
    faqs: [
      { q: 'Do French citizens need a visa to visit Canada?', a: `No. French citizens flying to Canada need an electronic travel authorization (eTA), applied for online, ${sEta?.cur.n ? `which IRCC aims to issue within ${K.fmtStd(sEta.cur, 'en')} in most cases` : 'usually approved within minutes'}. A visa is only needed in rare cases. That is why IRCC approved only ${E.n(v1.last)} visitor visas for French citizens over twelve months.` },
      { q: 'Does a French citizen living in Morocco read the French processing time?', a: 'No. IRCC’s processing times tool asks for the country you apply from, normally the country where you live legally. A French citizen living in Morocco reads the Moroccan line, and a Moroccan student in Lyon reads the French one. The open data on this page count French citizens wherever they live.' },
      { q: 'How many French citizens get a study permit for Canada?', a: `IRCC finalized ${E.n(sp.last)} new study permit applications from French citizens from ${E.w12()}, and ${E.n(st.last)} study permits took effect for French citizens over the latest twelve months of that dataset, ${dirEn(st.change)} ${E.pa(st.change)}. Many French students go to Quebec, where tuition agreements apply and a Quebec acceptance certificate is needed.` },
    ],
    body: (h) => `
<h2>No visa, but an eTA</h2>
<p>France is on the list of visa-exempt countries. A French citizen flying to Canada for a holiday or a business trip applies online for an ${h.a('eta', 'electronic travel authorization')}, linked to the passport and valid for up to five years. The open data reflect this: IRCC approved only ${h.n(v1.last)} visitor visas for French citizens over the latest twelve months, against tens of thousands for many visa-required countries. People with a second nationality that requires a visa, or who travel on another passport, are the main exceptions.</p>
<h2>International Experience Canada</h2>
<p>The working holiday program, known in France as the PVT, is one of the main reasons French people live in Canada for a while. Under ${h.a('iec', 'International Experience Canada')}, young French citizens can get an open work permit for a set period. IRCC’s open data on the International Mobility Program count ${h.n(iec.last)} IEC work permits taking effect across all countries over the latest twelve months, ${h.ch(iec.change)} on the year before; they do not split IEC by country of citizenship. IEC permits are issued after an invitation from a pool, so waiting depends on the draws as much as on processing.</p>
<h2>Studies: a top source country</h2>
<p>France ranks ${ord(rSp.rank, 'en')} among countries of citizenship for new study permit applications finalized, with ${h.n(sp.last)} over twelve months, ${dirEn(sp.change)} ${h.pa(sp.change)}. The study permits dataset counts ${h.n(st.last)} permits taking effect for French citizens. Most go to Quebec universities and CEGEPs, which also require a Quebec acceptance certificate before the federal permit. IRCC’s standard for a ${h.a('study-permit', 'study permit')} from outside Canada is ${K.fmtStd(sStudy.cur, 'en')}, met for ${h.pct(sStudy.cur.perf)} of files nationally in ${K.fmtFy(sStudy.fy, 'en')}. The time for France is on IRCC’s ${h.src('ptimes', 'Check processing times tool')}.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'Study permit from France: estimated decision date' })}
<p>Across all temporary residence files, IRCC approved ${h.pct(a.rate)} of those it finalized for French citizens, against ${h.pct(a.prevRate)} the year before. The share counts withdrawals and mixes studies, work and extensions; it is not a refusal rate.</p>
<h2>Permanent residence and citizenship</h2>
<p>Permanent residence applications from French citizens came to ${h.n(pr.last)} over twelve months, ${dirEn(pr.change)} ${h.pa(pr.change)}, and IRCC issued ${h.n(co.last)} authorizations, ${dirEn(co.change)} ${h.pa(co.change)}. Many go through Quebec: the province selects ${h.a('quebec-skilled-worker', 'skilled workers')} first${sQsw ? `, then IRCC aims to decide the federal stage within ${K.fmtStd(sQsw.cur, 'en')}` : ''}. In calendar years, applications received were ${h.n(prY('2023'))} in 2023 and ${h.n(prY('2025'))} in 2025. ${h.n(ci.last)} people born in France became Canadian citizens over twelve months, ${ord(rCi.rank, 'en')} among countries of birth.</p>
${yearsTable(h, C, ['spFin', 'trFin', 'prIn', 'copr', 'cit'], 'French citizens by calendar year (new citizens by country of birth). Source: IRCC open data; figures rounded to 5.')}
<h2>Residents of France and French citizens</h2>
<p>The distinction is sharper for France than for most countries. IRCC’s processing times tool keys waiting times to the country you apply from: a Moroccan, Algerian or Cameroonian student living in France reads the French line. The open data here count French citizens only, wherever they file. See the ${h.a('morocco', 'Morocco')} and ${h.a('cameroon', 'Cameroon')} pages for two citizenships often found among applicants who live in France.</p>
`,
  },
  fr: {
    slug: 'delais-france',
    nav: 'France', card: 'AVE, PVT, permis d’études et résidence pour les Français',
    title: 'Demandes des Français : AVE, PVT et permis d’études 2026',
    description: 'Les citoyens français dans les données ouvertes d’IRCC en 2026 : dispense de visa et AVE, PVT (EIC), permis d’études, résidence permanente et date de décision.',
    h1: 'Les demandes des citoyens français au Canada',
    intro: `IRCC a finalisé ${F.n(sp.last)} nouvelles demandes de permis d’études de citoyens français de ${F.w12()}, au ${ord(rSp.rank, 'fr')} rang des pays de citoyenneté.`,
    resume: `Les citoyens français n’ont pas besoin de visa de visiteur pour le Canada : ils voyagent avec une autorisation de voyage électronique, l’AVE. C’est pourquoi IRCC n’a approuvé que ${F.n(v1.last)} visas de visiteur pour des citoyens français de ${F.w12()}, surtout pour des binationaux ou des cas particuliers. Leurs dossiers chez IRCC sont donc des permis d’études, des permis de travail, Expérience internationale Canada et la résidence permanente. IRCC a finalisé ${F.n(sp.last)} nouvelles demandes de permis d’études de citoyens français, au ${ord(rSp.rank, 'fr')} rang par citoyenneté, et approuvé ${F.pct(a.rate)} de tous les dossiers de résidence temporaire finalisés, contre ${F.pct(all.rate)} tous pays confondus. Les demandes de résidence permanente reçues s’établissent à ${F.n(pr.last)}, et ${F.n(ci.last)} personnes nées en France sont devenues canadiennes. Un point compte pour les délais : l’outil d’IRCC les rattache au pays depuis lequel vous déposez, pas à votre passeport.`,
    faqs: [
      { q: 'Les citoyens français ont-ils besoin d’un visa pour le Canada ?', a: `Non. Un citoyen français qui prend l’avion pour le Canada a besoin d’une autorisation de voyage électronique (AVE), demandée en ligne, ${sEta?.cur.n ? `qu’IRCC vise à délivrer en ${K.fmtStd(sEta.cur, 'fr')} dans la plupart des cas` : 'en général accordée en quelques minutes'}. Un visa n’est exigé que dans de rares cas. C’est pourquoi IRCC n’a approuvé que ${F.n(v1.last)} visas de visiteur pour des Français en douze mois.` },
      { q: 'Un Français qui vit au Maroc lit-il le délai de la France ?', a: 'Non. L’outil des délais d’IRCC demande le pays depuis lequel vous déposez, en général celui où vous résidez légalement. Un Français installé au Maroc lit la ligne du Maroc, et un étudiant marocain à Lyon lit celle de la France. Les données ouvertes de cette page comptent les citoyens français où qu’ils vivent.' },
      { q: 'Combien de Français obtiennent un permis d’études pour le Canada ?', a: `IRCC a finalisé ${F.n(sp.last)} nouvelles demandes de permis d’études de citoyens français de ${F.w12()}, et ${F.n(st.last)} permis d’études sont entrés en vigueur pour des Français sur les douze derniers mois de ce jeu de données, ${dirFr(st.change)} de ${F.pa(st.change)}. Beaucoup d’étudiants français vont au Québec, où s’appliquent des ententes sur les droits de scolarité et où un CAQ est exigé.` },
    ],
    body: (h) => `
<h2>Pas de visa, mais une AVE</h2>
<p>La France figure parmi les pays dispensés de visa. Un citoyen français qui part au Canada en vacances ou pour affaires demande en ligne une ${h.a('eta', 'autorisation de voyage électronique')}, liée au passeport et valable jusqu’à cinq ans. Les données ouvertes le reflètent : IRCC n’a approuvé que ${h.n(v1.last)} visas de visiteur pour des citoyens français sur les douze derniers mois, contre des dizaines de milliers pour bien des pays soumis au visa. Les binationaux dont l’autre nationalité exige un visa, ou qui voyagent avec un autre passeport, sont les principales exceptions.</p>
<h2>Le PVT et Expérience internationale Canada</h2>
<p>Le programme vacances-travail, le PVT, est l’une des grandes raisons pour lesquelles des Français vivent un temps au Canada. Dans le cadre d’${h.a('iec', 'Expérience internationale Canada')}, les jeunes Français peuvent obtenir un permis de travail ouvert pour une durée déterminée. Les données ouvertes d’IRCC sur le Programme de mobilité internationale comptent ${h.n(iec.last)} permis EIC entrés en vigueur tous pays confondus sur les douze derniers mois, soit ${h.ch(iec.change)} sur un an ; elles ne ventilent pas EIC par citoyenneté. Les permis EIC sont délivrés après une invitation tirée d’un bassin : l’attente dépend des tirages autant que du traitement.</p>
<h2>Études : un des premiers pays d’origine</h2>
<p>La France se classe au ${ord(rSp.rank, 'fr')} rang des pays de citoyenneté pour les nouvelles demandes de permis d’études finalisées, avec ${h.n(sp.last)} en douze mois, ${dirFr(sp.change)} de ${h.pa(sp.change)}. Le jeu de données des permis d’études compte ${h.n(st.last)} permis entrés en vigueur pour des citoyens français. La plupart vont dans les universités et cégeps du Québec, qui exigent aussi un certificat d’acceptation du Québec avant le permis fédéral. La norme d’IRCC pour un ${h.a('study-permit', 'permis d’études')} demandé hors du Canada est de ${K.fmtStd(sStudy.cur, 'fr')}, tenue pour ${h.pct(sStudy.cur.perf)} des dossiers à l’échelle du pays en ${K.fmtFy(sStudy.fy, 'fr')}. Le délai de la France se lit dans l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'Permis d’études depuis la France : date de décision estimée' })}
<p>Sur l’ensemble des dossiers de résidence temporaire, IRCC a approuvé ${h.pct(a.rate)} de ceux qu’il a finalisés pour des citoyens français, contre ${h.pct(a.prevRate)} l’année précédente. La part compte les retraits et mêle études, travail et prolongations : ce n’est pas un taux de refus.</p>
<h2>Résidence permanente et citoyenneté</h2>
<p>Les demandes de résidence permanente de citoyens français s’établissent à ${h.n(pr.last)} en douze mois, ${dirFr(pr.change)} de ${h.pa(pr.change)}, et IRCC a délivré ${h.n(co.last)} autorisations, ${dirFr(co.change)} de ${h.pa(co.change)}. Beaucoup passent par le Québec : la province sélectionne d’abord les ${h.a('quebec-skilled-worker', 'travailleurs qualifiés')}${sQsw ? `, puis IRCC vise une décision sur l’étape fédérale en ${K.fmtStd(sQsw.cur, 'fr')}` : ''}. Par année civile, les demandes reçues étaient de ${h.n(prY('2023'))} en 2023 et de ${h.n(prY('2025'))} en 2025. ${h.n(ci.last)} personnes nées en France sont devenues citoyennes canadiennes en douze mois, au ${ord(rCi.rank, 'fr')} rang des pays de naissance.</p>
${yearsTable(h, C, ['spFin', 'trFin', 'prIn', 'copr', 'cit'], 'Citoyens français par année civile (nouveaux citoyens par pays de naissance). Source : IRCC, données ouvertes ; chiffres arrondis à 5.')}
<h2>Résidents de France et citoyens français</h2>
<p>La distinction est plus marquée pour la France que pour la plupart des pays. L’outil des délais d’IRCC rattache l’attente au pays depuis lequel vous déposez : un étudiant marocain, algérien ou camerounais qui vit en France lit la ligne française. Les données ouvertes de cette page ne comptent que les citoyens français, où qu’ils déposent. Les pages ${h.a('morocco', 'Maroc')} et ${h.a('cameroon', 'Cameroun')} couvrent deux citoyennetés fréquentes parmi les demandeurs qui vivent en France.</p>
`,
  },
});
