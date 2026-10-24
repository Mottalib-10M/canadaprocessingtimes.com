import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dirEn, dirFr, ord, eeRank, yearsTable } from './_pays';

/* Algérie : données ouvertes d'IRCC par pays de citoyenneté (OGL-Canada 2.0), calculées au build. Angle : le volume
 * des dossiers temporaires, la part approuvée qui bouge, l'effondrement des décisions d'études et la poussée
 * d'Entrée express. */
const C = 'DZ';
const E = K.en, F = K.fr;
const tin = K.ops12('trIn', C), tf = K.ops12('trFin', C), sp = K.ops12('spFin', C), v1 = K.ops12('v1', C), pr = K.ops12('prIn', C), ci = K.ops12('cit', C);
const a = K.approval12(C), all = K.approval12();
const rTr = K.rank12('trFin', C), rPr = K.rank12('prIn', C);
const gap = a.rate != null && a.prevRate != null ? a.rate - a.prevRate : null;
const Y0 = '2023', ee0 = K.eeCountry(Y0, C), ee = K.eeCountry(K.EE_FULL, C), eeCur = K.eeCountry(K.EE_CUR, C), eeR = eeRank(K.EE_FULL, C);
const nCur = K.monthsOfYear(K.EE_CUR).length;
const ext = K.fullExtremes('spFin', C);
const sWork = K.stdOf('work')!, sVis = K.stdOf('visitor')!;
// « bondi » n'est vrai que si les invitations ont progressé d'au moins moitié depuis 2023.
if (!(ee >= 1.5 * ee0)) throw new Error('algeria : les invitations Entrée express n’ont plus progressé d’au moins moitié depuis 2023, réécrire le paragraphe');
if (!(sp.change != null && sp.change <= -40)) throw new Error('algeria : les décisions d’études ne se sont plus effondrées, réécrire le titre « effondrées »');

export default defineGuide({
  id: 'algeria', group: 'countries', order: 111, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['work-permit', 'visitor-visa', 'study-permit', 'quebec-skilled-worker', 'morocco', 'tunisia'],
  sources: ['ptimes', 'open-data', 'od-ee', 'od-std', 'visit', 'work-permit', 'qsw', 'ogl'],
  en: {
    slug: 'processing-times-algeria',
    nav: 'Algeria', card: 'Temporary files, approved share and Express Entry invitations for Algerians',
    title: 'Algerian Applicants: IRCC Files and Decision Dates 2026',
    description: 'Algerian applications to Canada in 2026 in IRCC open data: temporary files received and finalized, approved share, study permits, Express Entry invitations.',
    h1: 'Applications to Canada by Algerian citizens',
    intro: `IRCC finalized ${E.n(tf.last)} temporary residence applications from Algerian citizens from ${E.w12()}, approving ${E.pct(a.rate)} of them.`,
    resume: `Algeria is one of the larger sources of temporary residence files at IRCC: from ${E.w12()}, the department received ${E.n(tin.last)} applications from Algerian citizens and finalized ${E.n(tf.last)}, which ranks Algeria ${ord(rTr.rank, 'en')} of ${E.n(rTr.of)} countries of citizenship by files finalized. The share approved among those finalized moved from ${E.pct(a.prevRate)} to ${E.pct(a.rate)}, still below the ${E.pct(all.rate)} seen across all countries. Study permit decisions went the other way, down to ${E.n(sp.last)} new applications finalized, while visitor visas approved reached ${E.n(v1.last)}. On the permanent side, ${E.n(pr.last)} permanent residence applications were received and ${E.n(ee)} Algerians were invited through Express Entry in ${K.EE_FULL}. Waiting times come from IRCC’s own tool for the country you apply from; the calculator turns them into a date.`,
    faqs: [
      { q: 'What share of Algerian temporary residence applications does IRCC approve?', a: `From ${E.w12()}, IRCC approved ${E.pct(a.rate)} of the temporary residence applications from Algerian citizens it finalized, against ${E.pct(a.prevRate)} the twelve months before. Finalized files include withdrawals, so this is not a refusal rate. It mixes visitor visas, study and work permits and extensions, and every file is decided on its own merits.` },
      { q: 'How many Algerians were invited through Express Entry?', a: `IRCC’s invited candidates open data count ${E.n(ee0)} Algerian citizens invited in ${Y0} and ${E.n(ee)} in ${K.EE_FULL}, the ${ord(eeR, 'en')} highest count by country of citizenship that year. The first ${nCur} months of ${K.EE_CUR} already reached ${E.n(eeCur)}. Rounds reserved for strong French speakers explain much of the rise.` },
      { q: 'Does an Algerian living in Tunisia read the Algerian processing time?', a: 'No. IRCC’s processing times tool asks for the country you apply from, which is normally the country where you hold legal status. An Algerian resident of Tunisia reads the Tunisian line. The volumes on this page, though, count Algerian citizens wherever they filed, so both views answer different questions.' },
    ],
    body: (h) => `
<h2>A large flow of temporary files</h2>
<p>Most applications from Algerian citizens are temporary: visitor visas to see family, study permits and work permits. IRCC’s operational processing tables count ${h.n(tin.last)} temporary residence applications received from Algerians over the latest twelve months, ${h.ch(tin.change)} on the year before, and ${h.n(tf.last)} finalized. The approved share among finalized files is ${h.pct(a.rate)}, ${gap != null && gap > 0 ? `${h.n(Math.round(gap * 10) / 10)} points higher` : gap != null && gap < 0 ? `${h.n(Math.round(-gap * 10) / 10)} points lower` : 'unchanged'} than the twelve months before. Withdrawn files count as finalized, so the share is a broad signal rather than an odds table.</p>
<p>Visitor visas approved for Algerians reached ${h.n(v1.last)}, ${dirEn(v1.change)} ${h.pa(v1.change)}. Nationally, IRCC aims to decide a ${h.a('visitor-visa', 'visitor visa')} within ${K.fmtStd(sVis.cur, 'en')} and met that standard for ${h.pct(sVis.cur.perf)} of applications in ${K.fmtFy(sVis.fy, 'en')}; for a ${h.a('work-permit', 'work permit')} requested outside Canada the standard is ${K.fmtStd(sWork.cur, 'en')}, met for ${h.pct(sWork.cur.perf)}. These are targets set by IRCC, not the time for Algeria, which is shown on its ${h.src('ptimes', 'Check processing times tool')}.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visitor visa from Algeria: estimated decision date' })}
<h2>Study permits: decisions have collapsed</h2>
<p>New study permit applications finalized for Algerian citizens fell to ${h.n(sp.last)} over twelve months, against ${h.n(sp.prev)} the year before. The monthly peak of the series was ${h.n(ext?.hi[1] ?? null)} in ${ext ? h.my(ext.hi[0]) : ''}. The national cap on study permits introduced in 2024 and the provincial attestation letter it requires weigh on the number of files filed, and so on the number decided.</p>
${h.months(K.MONTHS, [['Temporary residence finalized', K.full('trFin', C)], ['Temporary residence approved', K.full('trOk', C)], ['Study permits finalized', K.full('spFin', C)]], { caption: 'Algerian citizens, by month. Source: IRCC, Operational Processing, open data; figures rounded to 5.' })}
<h2>Express Entry and permanent residence</h2>
<p>The fastest growth is in Express Entry. Invitations to Algerian citizens have jumped since ${Y0}, from ${h.n(ee0)} to ${h.n(ee)} in ${K.EE_FULL}, and the first ${nCur} months of ${K.EE_CUR} already count ${h.n(eeCur)}. Category rounds reserved for strong French speakers favour candidates educated in French. IRCC received ${h.n(pr.last)} permanent residence applications from Algerian citizens over twelve months, ${h.ch(pr.change)}, which ranks Algeria ${ord(rPr.rank, 'en')} of ${h.n(rPr.of)}. Quebec remains a frequent destination through the ${h.a('quebec-skilled-worker', 'Quebec skilled worker')} program, where the province selects first.</p>
${yearsTable(h, C, ['trFin', 'spFin', 'prIn', 'copr', 'cit'], 'Algerian citizens by calendar year (new citizens by country of birth). Source: IRCC open data; figures rounded to 5.')}
<p>${h.n(ci.last)} people born in Algeria became Canadian citizens over the latest twelve months. Neighbouring trends are on the ${h.a('morocco', 'Morocco')} and ${h.a('tunisia', 'Tunisia')} pages.</p>
<h2>Residence and citizenship are not the same key</h2>
<p>When you look up a waiting time, IRCC’s tool keys it to the country you apply from. Its open data key volumes to citizenship. An Algerian student already in France applies from France for a new permit and reads the French line, yet still counts here as Algerian. Use the volumes for context and the tool for your own date.</p>
<h2>Preparing an Algerian file</h2>
<p>Most delays on Algerian files come from steps outside the processing queue itself. A first visitor visa or study permit requires biometrics at a visa application centre, and appointments in Algiers can take time to obtain. Documents in Arabic need a certified translation into English or French. Bank statements that show a sudden deposit, or a travel history that does not match the purpose of the trip, often lead to requests for more information. Sending a complete file the first time is the surest way to keep the wait close to the time IRCC shows.</p>
`,
  },
  fr: {
    slug: 'delais-algerie',
    nav: 'Algérie', card: 'Dossiers temporaires, part approuvée et invitations Entrée express des Algériens',
    title: 'Demandes des Algériens : dossiers IRCC et dates en 2026',
    description: 'Demandes algériennes au Canada en 2026 selon les données ouvertes d’IRCC : dossiers temporaires, part approuvée, permis d’études, invitations Entrée express.',
    h1: 'Les demandes des citoyens algériens au Canada',
    intro: `IRCC a finalisé ${F.n(tf.last)} demandes de résidence temporaire de citoyens algériens de ${F.w12()}, et en a approuvé ${F.pct(a.rate)}.`,
    resume: `L’Algérie est l’une des grandes sources de dossiers de résidence temporaire chez IRCC : de ${F.w12()}, le ministère a reçu ${F.n(tin.last)} demandes de citoyens algériens et en a finalisé ${F.n(tf.last)}, ce qui place l’Algérie au ${ord(rTr.rank, 'fr')} rang sur ${F.n(rTr.of)} pays de citoyenneté pour les dossiers finalisés. La part approuvée parmi ces dossiers est passée de ${F.pct(a.prevRate)} à ${F.pct(a.rate)}, toujours sous les ${F.pct(all.rate)} observés tous pays confondus. Les décisions de permis d’études ont suivi le chemin inverse, avec ${F.n(sp.last)} nouvelles demandes finalisées, tandis que les visas de visiteur approuvés atteignent ${F.n(v1.last)}. Côté permanent, ${F.n(pr.last)} demandes de résidence permanente ont été reçues et ${F.n(ee)} Algériens ont été invités par Entrée express en ${K.EE_FULL}. Les délais viennent de l’outil d’IRCC pour le pays depuis lequel vous déposez ; le calculateur les transforme en date.`,
    faqs: [
      { q: 'Quelle part des demandes temporaires algériennes IRCC approuve-t-il ?', a: `De ${F.w12()}, IRCC a approuvé ${F.pct(a.rate)} des demandes de résidence temporaire de citoyens algériens qu’il a finalisées, contre ${F.pct(a.prevRate)} sur les douze mois précédents. Les dossiers finalisés incluent les retraits : ce n’est donc pas un taux de refus. La part mêle visas de visiteur, permis d’études, permis de travail et prolongations, et chaque dossier est jugé sur son contenu.` },
      { q: 'Combien d’Algériens ont été invités par Entrée express ?', a: `Les données ouvertes d’IRCC sur les candidats invités comptent ${F.n(ee0)} citoyens algériens invités en ${Y0} et ${F.n(ee)} en ${K.EE_FULL}, ce qui place l’Algérie au ${ord(eeR, 'fr')} rang des pays de citoyenneté cette année-là. Les ${nCur} premiers mois de ${K.EE_CUR} atteignent déjà ${F.n(eeCur)}. Les rondes réservées aux francophones expliquent une grande part de la hausse.` },
      { q: 'Un Algérien qui vit en Tunisie lit-il le délai de l’Algérie ?', a: 'Non. L’outil des délais d’IRCC demande le pays depuis lequel vous déposez, en général celui où vous avez un statut légal. Un Algérien résidant en Tunisie lit la ligne de la Tunisie. Les volumes de cette page comptent en revanche les citoyens algériens où qu’ils aient déposé : les deux vues répondent à des questions différentes.' },
    ],
    body: (h) => `
<h2>Un gros flux de dossiers temporaires</h2>
<p>La plupart des demandes de citoyens algériens sont temporaires : visas de visiteur pour voir la famille, permis d’études et permis de travail. Les tableaux du traitement opérationnel d’IRCC comptent ${h.n(tin.last)} demandes de résidence temporaire reçues d’Algériens sur les douze derniers mois, soit ${h.ch(tin.change)} sur un an, et ${h.n(tf.last)} finalisées. La part approuvée parmi les dossiers finalisés est de ${h.pct(a.rate)}, ${gap != null && gap > 0 ? `${h.n(Math.round(gap * 10) / 10)} points de plus` : gap != null && gap < 0 ? `${h.n(Math.round(-gap * 10) / 10)} points de moins` : 'sans changement'} que sur les douze mois précédents. Les retraits comptent parmi les dossiers finalisés : la part est un signal général, pas une table de probabilités.</p>
<p>Les visas de visiteur approuvés pour des Algériens atteignent ${h.n(v1.last)}, ${dirFr(v1.change)} de ${h.pa(v1.change)}. À l’échelle du pays, IRCC vise une décision sur un ${h.a('visitor-visa', 'visa de visiteur')} en ${K.fmtStd(sVis.cur, 'fr')} et a tenu cette norme pour ${h.pct(sVis.cur.perf)} des demandes en ${K.fmtFy(sVis.fy, 'fr')} ; pour un ${h.a('work-permit', 'permis de travail')} demandé hors du Canada, la norme est de ${K.fmtStd(sWork.cur, 'fr')}, tenue pour ${h.pct(sWork.cur.perf)}. Ce sont des objectifs fixés par IRCC, pas le délai de l’Algérie, qui s’affiche dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visa de visiteur depuis l’Algérie : date de décision estimée' })}
<h2>Permis d’études : les décisions se sont effondrées</h2>
<p>Les nouvelles demandes de permis d’études finalisées pour des citoyens algériens sont tombées à ${h.n(sp.last)} en douze mois, contre ${h.n(sp.prev)} l’année précédente. Le pic mensuel de la série a été de ${h.n(ext?.hi[1] ?? null)} en ${ext ? h.my(ext.hi[0]) : ''}. Le plafond national des permis d’études instauré en 2024, et la lettre d’attestation provinciale qu’il impose, pèsent sur le nombre de dossiers déposés, donc sur le nombre de décisions.</p>
${h.months(K.MONTHS, [['Résidence temporaire finalisée', K.full('trFin', C)], ['Résidence temporaire approuvée', K.full('trOk', C)], ['Permis d’études finalisés', K.full('spFin', C)]], { caption: 'Citoyens algériens, par mois. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.' })}
<h2>Entrée express et résidence permanente</h2>
<p>La croissance la plus forte se trouve dans Entrée express. Les invitations de citoyens algériens ont bondi depuis ${Y0}, de ${h.n(ee0)} à ${h.n(ee)} en ${K.EE_FULL}, et les ${nCur} premiers mois de ${K.EE_CUR} en comptent déjà ${h.n(eeCur)}. Les rondes par catégorie réservées aux francophones avantagent les candidats formés en français. IRCC a reçu ${h.n(pr.last)} demandes de résidence permanente de citoyens algériens en douze mois, soit ${h.ch(pr.change)}, ce qui place l’Algérie au ${ord(rPr.rank, 'fr')} rang sur ${h.n(rPr.of)}. Le Québec reste une destination fréquente par le programme des ${h.a('quebec-skilled-worker', 'travailleurs qualifiés du Québec')}, où la province sélectionne en premier.</p>
${yearsTable(h, C, ['trFin', 'spFin', 'prIn', 'copr', 'cit'], 'Citoyens algériens par année civile (nouveaux citoyens par pays de naissance). Source : IRCC, données ouvertes ; chiffres arrondis à 5.')}
<p>${h.n(ci.last)} personnes nées en Algérie sont devenues citoyennes canadiennes sur les douze derniers mois. Les tendances voisines se lisent sur les pages ${h.a('morocco', 'Maroc')} et ${h.a('tunisia', 'Tunisie')}.</p>
<h2>Résidence et citoyenneté ne sont pas la même clé</h2>
<p>Quand vous cherchez un délai, l’outil d’IRCC le rattache au pays depuis lequel vous déposez. Ses données ouvertes rattachent les volumes à la citoyenneté. Un étudiant algérien déjà en France dépose depuis la France pour un nouveau permis et lit la ligne française, mais il compte ici comme Algérien. Servez-vous des volumes pour le contexte et de l’outil pour votre propre date.</p>
`,
  },
});
