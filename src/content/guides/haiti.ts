import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dirEn, dirFr, ord, eeRank, yearsTable } from './_pays';

/* Haïti : données ouvertes d'IRCC par pays de citoyenneté (OGL-Canada 2.0), calculées au build. Angle : le contexte
 * familial et humanitaire, la hausse des dossiers temporaires finalisés et la part approuvée qui remonte. */
const C = 'HT';
const E = K.en, F = K.fr;
const tf = K.ops12('trFin', C), tin = K.ops12('trIn', C), sp = K.ops12('spFin', C), st = K.study12(C), v1 = K.ops12('v1', C), pr = K.ops12('prIn', C), co = K.ops12('copr', C), ci = K.ops12('cit', C);
const a = K.approval12(C), all = K.approval12();
const tfY = (y: string) => K.fullYear('trFin', C, y);
const t24 = tfY('2024'), t25 = tfY('2025');
const jump = K.pctOf((t25 ?? 0) - (t24 ?? 0), t24);
const ee = K.eeCountry(K.EE_FULL, C), eeR = eeRank(K.EE_FULL, C);
const sChild = K.stdOf('child')!, sSp = K.stdOf('spousal-out-roc')!, sVis = K.stdOf('visitor')!;
const ext = K.fullExtremes('trFin', C);
// « bond » n'est vrai que si les dossiers temporaires finalisés de 2025 dépassent ceux de 2024 d'au moins 30 %.
if (!(jump != null && jump >= 30)) throw new Error('haiti : les dossiers temporaires finalisés n’ont plus bondi en 2025, réécrire');
if (!(eeR == null || eeR > 20)) throw new Error('haiti : Haïti est désormais dans les vingt premiers pays d’Entrée express, réécrire « pèse peu »');

export default defineGuide({
  id: 'haiti', group: 'countries', order: 115, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['dependent-child', 'study-permit', 'visitor-visa', 'super-visa', 'cameroon', 'france'],
  sources: ['ptimes', 'open-data', 'od-pr', 'od-study', 'od-std', 'spouse', 'check-status', 'ogl'],
  en: {
    slug: 'processing-times-haiti',
    nav: 'Haiti', card: 'Family files, temporary decisions and permanent residence for Haitians',
    title: 'Haitian Applicants: IRCC Family and Visa Data for 2026',
    description: 'Haitian citizens in IRCC open data for 2026: temporary files finalized, approved share, family sponsorship, study permits and a decision date calculator.',
    h1: 'Applications to Canada by Haitian citizens',
    intro: `IRCC finalized ${E.n(tf.last)} temporary residence applications from Haitian citizens from ${E.w12()}, approving ${E.pct(a.rate)} of them.`,
    resume: `For Haitians, applications to Canada are often family matters: joining a spouse or a parent in Montreal, bringing a child, or visiting relatives while the situation at home remains difficult. IRCC’s open data show the scale. From ${E.w12()}, the department finalized ${E.n(tf.last)} temporary residence applications from Haitian citizens and approved ${E.pct(a.rate)}, against ${E.pct(a.prevRate)} the year before and ${E.pct(all.rate)} for all countries. In calendar years, temporary files finalized went from ${E.n(t24)} in 2024 to ${E.n(t25)} in 2025. New study permit applications finalized came to ${E.n(sp.last)}. On the permanent side, IRCC received ${E.n(pr.last)} permanent residence applications from Haitian citizens and issued ${E.n(co.last)} authorizations. Waiting times come from IRCC’s tool for the country you apply from, and the calculator turns them into a date.`,
    faqs: [
      { q: 'How long does it take to sponsor a child or spouse living in Haiti?', a: `IRCC’s service standard for family class files processed overseas, which covers a spouse or a dependent child in Haiti, is ${K.fmtStd(sSp.cur, 'en')}, met for ${E.pct(sSp.cur.perf)} of applications nationally in ${K.fmtFy(sSp.fy, 'en')}. The time for your own file is on IRCC’s processing times tool; medical exams and documents from Haiti can add months.` },
      { q: 'What share of Haitian temporary residence applications does IRCC approve?', a: `IRCC approved ${E.pct(a.rate)} of the temporary residence applications from Haitian citizens it finalized from ${E.w12()}, against ${E.pct(a.prevRate)} the twelve months before. Withdrawals count as finalized, so this is not a refusal rate, and it mixes visits, studies, work permits and extensions decided one file at a time.` },
      { q: 'Do Haitians living in the Dominican Republic read the Haitian processing time?', a: 'No. IRCC’s processing times tool asks for the country you apply from, normally where you live legally. A Haitian with status in the Dominican Republic or in the United States reads that country’s line. The volumes on this page count Haitian citizens wherever they filed.' },
    ],
    body: (h) => `
<h2>Families first</h2>
<p>Canada has one of the largest Haitian communities outside Haiti, mostly in Quebec, and much of the traffic with IRCC is about families: spouses, children, parents. Sponsorship of a spouse or a ${h.a('dependent-child', 'dependent child')} living in Haiti is processed overseas; IRCC’s standard for those family files is ${K.fmtStd(sChild.cur, 'en')}, met for ${h.pct(sChild.cur.perf)} of applications nationally in ${K.fmtFy(sChild.fy, 'en')}. Documents from Haiti, medical exams and interviews can lengthen a file, and IRCC lets applicants follow it through its ${h.src('check-status', 'status tools')}.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'child', c: C, m: 'none' }, t: 'Child sponsorship from Haiti: estimated decision date' })}
<p>Copy into the calculator the time IRCC’s ${h.src('ptimes', 'Check processing times tool')} shows for your type of file, and the month IRCC received it. The result is an estimate, not a date IRCC commits to.</p>
<h2>Temporary files: a jump in decisions</h2>
<p>Temporary residence files finalized for Haitian citizens rose from ${h.n(t24)} in 2024 to ${h.n(t25)} in 2025, ${dirEn(jump)} ${h.pa(jump)}. Over the latest twelve months, IRCC finalized ${h.n(tf.last)} and received ${h.n(tin.last)}, and the busiest month of the series was ${ext ? h.my(ext.hi[0]) : ''} with ${h.n(ext?.hi[1] ?? null)} files. The approved share among finalized files moved from ${h.pct(a.prevRate)} to ${h.pct(a.rate)}. Withdrawn files count as finalized, so the share is a broad signal, not the odds of a visa.</p>
${yearsTable(h, C, ['trIn', 'trFin', 'trOk', 'v1', 'spFin'], 'Haitian citizens by calendar year. Source: IRCC, Operational Processing, open data; figures rounded to 5.')}
<p>Visitor visas approved for Haitian citizens came to ${h.n(v1.last)} over twelve months, ${dirEn(v1.change)} ${h.pa(v1.change)}. IRCC’s standard for a ${h.a('visitor-visa', 'visitor visa')} is ${K.fmtStd(sVis.cur, 'en')}, met for only ${h.pct(sVis.cur.perf)} of applications nationally in ${K.fmtFy(sVis.fy, 'en')}. Parents of Canadian residents can also weigh the ${h.a('super-visa', 'super visa')} for longer stays.</p>
<h2>Studies and permanent residence</h2>
<p>New study permit applications finalized for Haitian citizens came to ${h.n(sp.last)} over twelve months, ${dirEn(sp.change)} ${h.pa(sp.change)}, and ${h.n(st.last)} study permits took effect, ${dirEn(st.change)} ${h.pa(st.change)}. Haitian students mostly choose French-language institutions in Quebec. IRCC received ${h.n(pr.last)} permanent residence applications from Haitians, ${dirEn(pr.change)} ${h.pa(pr.change)}, and issued ${h.n(co.last)} authorizations. Express Entry plays a small part: ${h.n(ee)} Haitians were invited in ${K.EE_FULL}, ${ord(eeR, 'en')} by citizenship. ${h.n(ci.last)} people born in Haiti became Canadian citizens over twelve months. The ${h.a('cameroon', 'Cameroon')} and ${h.a('france', 'France')} pages show two French-speaking profiles where studies and Express Entry weigh more.</p>
<h2>Country of residence or of citizenship</h2>
<p>IRCC’s tool keys waiting times to where you apply from; its open data count citizens. Many Haitians live in the Dominican Republic, the United States or Chile, and apply from there. They read that country’s line on the tool, while counting as Haitians in the volumes above.</p>
<h2>Practical points for Haitian files</h2>
<p>Biometrics and documents are where Haitian files most often lose time. Travel to the visa application centre in Port-au-Prince can be difficult, and some applicants give biometrics in a neighbouring country instead, which IRCC allows at any of its centres. Civil status documents should come from the Archives nationales and match across every form. For a sponsorship, proof of the relationship, such as photos, messages and money transfers over time, helps an officer decide without an interview. Keep IRCC informed of any change of address or phone number so that requests reach you.</p>
`,
  },
  fr: {
    slug: 'delais-haiti',
    nav: 'Haïti', card: 'Dossiers familiaux, décisions temporaires et résidence permanente des Haïtiens',
    title: 'Demandes des Haïtiens : famille et visas chez IRCC en 2026',
    description: 'Les citoyens haïtiens dans les données ouvertes d’IRCC en 2026 : dossiers temporaires finalisés, part approuvée, parrainage familial, études, date estimée.',
    h1: 'Les demandes des citoyens haïtiens au Canada',
    intro: `IRCC a finalisé ${F.n(tf.last)} demandes de résidence temporaire de citoyens haïtiens de ${F.w12()}, et en a approuvé ${F.pct(a.rate)}.`,
    resume: `Pour les Haïtiens, une demande au Canada est souvent une affaire de famille : rejoindre un conjoint ou un parent à Montréal, faire venir un enfant, rendre visite à des proches pendant que la situation reste difficile au pays. Les données ouvertes d’IRCC en donnent l’ampleur. De ${F.w12()}, le ministère a finalisé ${F.n(tf.last)} demandes de résidence temporaire de citoyens haïtiens et en a approuvé ${F.pct(a.rate)}, contre ${F.pct(a.prevRate)} l’année précédente et ${F.pct(all.rate)} tous pays confondus. Par année civile, les dossiers temporaires finalisés passent de ${F.n(t24)} en 2024 à ${F.n(t25)} en 2025. Les nouvelles demandes de permis d’études finalisées s’établissent à ${F.n(sp.last)}. Côté permanent, IRCC a reçu ${F.n(pr.last)} demandes de résidence permanente de citoyens haïtiens et délivré ${F.n(co.last)} autorisations. Les délais viennent de l’outil d’IRCC pour le pays depuis lequel vous déposez, et le calculateur les transforme en date.`,
    faqs: [
      { q: 'Combien de temps faut-il pour parrainer un enfant ou un conjoint en Haïti ?', a: `La norme de service d’IRCC pour les dossiers de la catégorie du regroupement familial traités à l’étranger, qui couvre un conjoint ou un enfant à charge en Haïti, est de ${K.fmtStd(sSp.cur, 'fr')}, tenue pour ${F.pct(sSp.cur.perf)} des demandes à l’échelle du pays en ${K.fmtFy(sSp.fy, 'fr')}. Le délai de votre dossier se lit dans l’outil d’IRCC ; examens médicaux et documents haïtiens peuvent ajouter des mois.` },
      { q: 'Quelle part des demandes temporaires haïtiennes IRCC approuve-t-il ?', a: `IRCC a approuvé ${F.pct(a.rate)} des demandes de résidence temporaire de citoyens haïtiens qu’il a finalisées de ${F.w12()}, contre ${F.pct(a.prevRate)} sur les douze mois précédents. Les retraits comptent parmi les dossiers finalisés : ce n’est donc pas un taux de refus, et la part mêle visites, études, permis de travail et prolongations jugés un par un.` },
      { q: 'Un Haïtien qui vit en République dominicaine lit-il le délai d’Haïti ?', a: 'Non. L’outil des délais d’IRCC demande le pays depuis lequel vous déposez, en général celui où vous résidez légalement. Un Haïtien qui a un statut en République dominicaine ou aux États-Unis lit la ligne de ce pays. Les volumes de cette page comptent les citoyens haïtiens où qu’ils aient déposé.' },
    ],
    body: (h) => `
<h2>La famille d’abord</h2>
<p>Le Canada compte l’une des plus grandes communautés haïtiennes hors d’Haïti, surtout au Québec, et une grande part des échanges avec IRCC concerne les familles : conjoints, enfants, parents. Le parrainage d’un conjoint ou d’un ${h.a('dependent-child', 'enfant à charge')} vivant en Haïti est traité à l’étranger ; la norme d’IRCC pour ces dossiers familiaux est de ${K.fmtStd(sChild.cur, 'fr')}, tenue pour ${h.pct(sChild.cur.perf)} des demandes à l’échelle du pays en ${K.fmtFy(sChild.fy, 'fr')}. Les documents haïtiens, les examens médicaux et les entrevues peuvent allonger un dossier, qu’IRCC permet de suivre avec ses ${h.src('check-status', 'outils de suivi')}.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'child', c: C, m: 'none' }, t: 'Parrainage d’un enfant depuis Haïti : date de décision estimée' })}
<p>Recopiez dans le calculateur le délai que l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC affiche pour votre type de dossier, et le mois où IRCC l’a reçu. Le résultat est une estimation, pas une date à laquelle IRCC s’engage.</p>
<h2>Dossiers temporaires : un bond des décisions</h2>
<p>Les dossiers de résidence temporaire finalisés pour des citoyens haïtiens passent de ${h.n(t24)} en 2024 à ${h.n(t25)} en 2025, ${dirFr(jump)} de ${h.pa(jump)}. Sur les douze derniers mois, IRCC en a finalisé ${h.n(tf.last)} et reçu ${h.n(tin.last)}, et le mois le plus chargé de la série a été ${ext ? h.my(ext.hi[0]) : ''} avec ${h.n(ext?.hi[1] ?? null)} dossiers. La part approuvée parmi les dossiers finalisés est passée de ${h.pct(a.prevRate)} à ${h.pct(a.rate)}. Les retraits comptent parmi les dossiers finalisés : la part est un signal général, pas la probabilité d’obtenir un visa.</p>
${yearsTable(h, C, ['trIn', 'trFin', 'trOk', 'v1', 'spFin'], 'Citoyens haïtiens par année civile. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.')}
<p>Les visas de visiteur approuvés pour des citoyens haïtiens s’établissent à ${h.n(v1.last)} en douze mois, ${dirFr(v1.change)} de ${h.pa(v1.change)}. La norme d’IRCC pour un ${h.a('visitor-visa', 'visa de visiteur')} est de ${K.fmtStd(sVis.cur, 'fr')}, tenue pour seulement ${h.pct(sVis.cur.perf)} des demandes à l’échelle du pays en ${K.fmtFy(sVis.fy, 'fr')}. Les parents de résidents canadiens peuvent aussi envisager le ${h.a('super-visa', 'super visa')} pour des séjours plus longs.</p>
<h2>Études et résidence permanente</h2>
<p>Les nouvelles demandes de permis d’études finalisées pour des citoyens haïtiens s’établissent à ${h.n(sp.last)} en douze mois, ${dirFr(sp.change)} de ${h.pa(sp.change)}, et ${h.n(st.last)} permis d’études sont entrés en vigueur, ${dirFr(st.change)} de ${h.pa(st.change)}. Les étudiants haïtiens choisissent surtout des établissements francophones du Québec. IRCC a reçu ${h.n(pr.last)} demandes de résidence permanente d’Haïtiens, ${dirFr(pr.change)} de ${h.pa(pr.change)}, et délivré ${h.n(co.last)} autorisations. Entrée express pèse peu : ${h.n(ee)} Haïtiens ont été invités en ${K.EE_FULL}, au ${ord(eeR, 'fr')} rang par citoyenneté. ${h.n(ci.last)} personnes nées en Haïti sont devenues citoyennes canadiennes en douze mois. Les pages ${h.a('cameroon', 'Cameroun')} et ${h.a('france', 'France')} montrent deux profils francophones où les études et Entrée express pèsent davantage.</p>
<h2>Pays de résidence ou de citoyenneté</h2>
<p>L’outil d’IRCC rattache les délais au pays depuis lequel vous déposez ; ses données ouvertes comptent des citoyens. Beaucoup d’Haïtiens vivent en République dominicaine, aux États-Unis ou au Chili, et déposent depuis ces pays. Ils lisent la ligne de ce pays dans l’outil, tout en comptant comme Haïtiens dans les volumes ci-dessus.</p>
`,
  },
});
