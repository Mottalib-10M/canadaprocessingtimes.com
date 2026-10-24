import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Programme des travailleurs qualifiés (fédéral) : norme de service (Inventaire des services du GC), invitations
 * (Entrée express, candidats invités) et admissions mensuelles (Permanent Residents, Monthly IRCC Updates), données
 * ouvertes sous la Licence du gouvernement ouvert du Canada. La catégorie « fsw » des admissions compte tous les
 * travailleurs qualifiés (fédéral et Québec) ; « qsw » ceux admis au Québec ; la différence donne le reste du Canada. */
const E = K.en, F = K.fr;
const M = K.PRD.months;
const all = K.prSeries('fsw'), qc = K.prSeries('qsw');
const roc = all.map((x, i) => (x == null || qc[i] == null ? null : x - qc[i]!));
if (roc.some((x) => x != null && x < 0)) throw new Error('fsw : travailleurs qualifiés du Québec plus nombreux que le total, revoir les séries');
const end = M.length - 1;
const roc12 = K.yearOverYear(roc, end), all12 = K.pr12('fsw'), qc12 = K.pr12('qsw');
const rocShare = K.pctOf(roc12.last, all12.last);
const st = K.stdOf('fsw')!, cecSt = K.stdOf('cec')!;
if (st.cur.n !== 6 || st.cur.u !== 'm') throw new Error('fsw : la norme n’est plus de six mois, revoir titre et texte');
const full = K.EE_FULL, cur = K.EE_CUR, prevFull = String(Number(full) - 1);
const inv = (y: string) => K.eeYear(y, 'fsw');
const invCh = K.pctOf(inv(full) - inv(prevFull), inv(prevFull));
const invShare = K.pctOf(inv(full), K.eeYear(full));
const i501 = K.EED.bandOrder.indexOf('501-600');
const under501 = K.pctOf(K.eeBands(full, 'fsw').slice(0, i501).reduce((a, x) => a + x, 0), inv(full));
const cecUnder501 = K.pctOf(K.eeBands(full, 'cec').slice(0, i501).reduce((a, x) => a + x, 0), K.eeYear(full, 'cec'));
if (under501 == null || cecUnder501 == null || under501 <= cecUnder501) throw new Error('fsw : les invitations FSW ne sont plus plus basses que celles de la CEC, revoir le texte');
const vsCec = st.cur.perf != null && cecSt.cur.perf != null ? (st.cur.perf > cecSt.cur.perf ? 1 : st.cur.perf < cecSt.cur.perf ? -1 : 0) : 0;
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');

const chEn = (x: number | null) => (x == null ? 'unchanged' : Math.abs(x) < 0.5 ? 'stable' : `${x > 0 ? 'up' : 'down'} ${K.en.pa(x)}`);
const chFr = (x: number | null) => (x == null ? 'stable' : Math.abs(x) < 0.5 ? 'stable' : `${x > 0 ? 'en hausse' : 'en baisse'} de ${K.fr.pa(x)}`);

export default defineGuide({
  id: 'fsw', group: 'pr', order: 42,
  tool: 'delai', toolArg: { g: 'fsw' },
  related: ['express-entry', 'cec', 'pnp', 'express-entry-draws', 'quebec-skilled-worker', 'history'],
  sources: ['ptimes', 'od-std', 'od-pr', 'od-ee', 'express-entry', 'ogl'],
  en: {
    slug: 'federal-skilled-worker-processing-time',
    nav: 'Federal Skilled Worker', card: 'FSW decision date, six-month standard, invitations and skilled workers admitted',
    title: 'Federal Skilled Worker Processing Time 2026: FSW Standard',
    description: 'Federal Skilled Worker Program in 2026: IRCC’s six-month standard and its record, FSW invitations by score and admissions, plus your date from IRCC’s time.',
    h1: 'Federal Skilled Worker: standard, invitations and your decision date',
    intro: `IRCC’s standard for a Federal Skilled Worker application is ${K.fmtStd(st.cur, 'en')} for 80% of files; it met it for ${E.pct(st.cur.perf)} of them in ${K.fmtFy(st.fy, 'en')}.`,
    resume: `The Federal Skilled Worker Program selects people with skilled work experience, usually gained abroad, through Express Entry. Once invited and once your application is filed, IRCC shows the time it expects on its “Check processing times” tool; enter that time in the calculator above with the day IRCC received your file to get an estimated decision date. IRCC publishes as open data a service standard of ${K.fmtStd(st.cur, 'en')} for 80% of FSW applications. In ${K.fmtFy(st.fy, 'en')}, ${E.n(st.cur.met)} of ${E.n(st.cur.total)} applications, or ${E.pct(st.cur.perf)}, were processed within it. IRCC invited ${E.n(inv(full))} FSW candidates in ${full}, ${invCh != null && invCh < 0 ? `${E.pa(invCh)} fewer than` : `${E.pa(invCh)} more than`} in ${prevFull}, and ${E.n(inv(cur))} so far in ${cur}; ${E.pct(under501)} of the ${full} invitations went to scores under 501. From ${E.w12(M)}, ${E.n(roc12.last)} skilled workers were admitted outside Quebec, ${chEn(roc12.change)} on the twelve months before.`,
    faqs: [
      { q: 'Does a Federal Skilled Worker applicant abroad wait longer than one in Canada?', a: 'The service standard is the same wherever you apply from, but applicants abroad more often need a medical exam at a panel physician, police certificates from several countries and a passport request after approval. Each of these steps can add time that the standard does not count, so leave a margin beyond the date the calculator gives.' },
      { q: 'Why does this page count skilled workers admitted outside Quebec?', a: `IRCC’s monthly admissions data has one category for all skilled workers, federal and Quebec together, and a separate count for those admitted to Quebec. Subtracting the second from the first gives the skilled workers admitted elsewhere in Canada: ${E.n(roc12.last)} over the last twelve months, ${E.pct(rocShare)} of all skilled workers admitted.` },
      { q: 'What CRS scores were invited under the Federal Skilled Worker Program?', a: `In ${full}, ${E.pct(under501)} of FSW invitations went to candidates who scored under 501, against ${E.pct(cecUnder501)} for the Canadian Experience Class. Category rounds for certain occupations or for French speakers reached lower scores. The page on invitations by score band shows each band and places your own score.` },
    ],
    body: (h) => `
<h2>From the time IRCC shows to your decision date</h2>
<p>For a Federal Skilled Worker application, the processing time runs from the day IRCC receives your complete permanent residence application, after an invitation through Express Entry, to the final decision. IRCC shows the time it expects for that stage on its ${h.src('ptimes', 'Check processing times tool')}. This site does not copy that figure; enter it below with your filing date. The calculator adds the time in the unit you choose, so a time in months gives a date to the month, and it also tells you what share of the time has already gone by.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'fsw', u: 'm' }, t: 'Your FSW application: estimated decision date' })}
<h2>The service standard and its record</h2>
<p>IRCC’s Federal Skilled Worker standard is ${K.fmtStd(st.cur, 'en')} for 80% of complete electronic applications, reported each year in the Government of Canada service inventory released as ${h.src('od-std', 'open data')}. In ${K.fmtFy(st.fy, 'en')}, IRCC processed ${h.pct(st.cur.perf)} of ${h.n(st.cur.total)} applications within it${st.prev ? `, against ${h.pct(st.prev.perf)} of ${h.n(st.prev.total)} in ${K.fmtFy(st.pfy!, 'en')}` : ''}. ${vsCec > 0 ? `That is a better record than the ${h.a('cec', 'Canadian Experience Class')}, at ${h.pct(cecSt.cur.perf)} the same year.` : vsCec < 0 ? `That is below the ${h.a('cec', 'Canadian Experience Class')}, at ${h.pct(cecSt.cur.perf)} the same year.` : `That matches the ${h.a('cec', 'Canadian Experience Class')} the same year.`} The standard counts only IRCC’s own processing time: days spent waiting for an applicant to send a document or attend a medical exam are set aside.</p>
<h2>Documents that set the pace</h2>
<p>A Federal Skilled Worker file asks for more paperwork than most Express Entry files, and the completeness of that paperwork decides whether the clock runs smoothly. Unless you already hold a valid job offer or are authorized to work in Canada, you must prove you have enough money to settle, with official bank letters covering the recent months. A degree earned abroad needs an Educational Credential Assessment from a designated organization, and your language test results must still be valid when you apply. Police certificates are required from every country where you lived for a significant time as an adult. Gathering these before the invitation, rather than after, leaves the time on IRCC’s tool as the main wait.</p>
<h2>Who gets invited</h2>
<p>IRCC’s ${h.src('od-ee', 'open data on invited candidates')} counted ${h.n(inv(full))} FSW invitations in ${full}, ${h.pct(invShare)} of all Express Entry invitations that year, and ${h.n(inv(cur))} so far in ${cur}. FSW candidates usually have less Canadian experience than CEC candidates and so fewer points: ${h.pct(under501)} of the ${full} FSW invitations went to scores under 501, against ${h.pct(cecUnder501)} for the CEC. IRCC’s rounds page shows which rounds, general or by category, reached those scores. The ${h.a('express-entry-draws', 'invitations by score band')} page lets you check the bands for any year.</p>
<h2>Skilled workers admitted, month by month</h2>
<p>IRCC’s ${h.src('od-pr', 'permanent residents open data')} counts all skilled workers in one category, federal and Quebec together, and gives Quebec separately. The table shows both and the difference, the skilled workers admitted elsewhere in Canada, most of them through this program. From ${h.w12(M)}, that difference came to ${h.n(roc12.last)}, ${dirEn(roc12.change)} ${h.pa(roc12.change)} on the previous twelve months, out of ${h.n(all12.last)} skilled workers in all. Quebec admitted ${h.n(qc12.last)} of its own, ${h.lang === 'fr' ? chFr(qc12.change) : chEn(qc12.change)}; its program has a page of its own, the ${h.a('quebec-skilled-worker', 'Quebec Skilled Worker')} page.</p>
${h.months(M, [['All skilled workers', all], ['Admitted to Quebec', qc], ['Outside Quebec', roc]], { max: 12, caption: 'Permanent residents admitted as skilled workers, by month, newest first. Outside Quebec = all skilled workers minus those admitted to Quebec, computed by this site. Source: IRCC, Permanent Residents, Monthly IRCC Updates, open data; figures rounded.' })}
<p>Admissions include spouses and children admitted with the principal applicant, and they count people when they become permanent residents, often months after the decision for those who still have to travel to Canada. They show how many files IRCC is closing, not how long any single file took. For the longer view, the ${h.a('history', 'history page')} sets these flows against previous years.</p>
`,
  },
  fr: {
    slug: 'delai-travailleurs-qualifies-federal',
    nav: 'Travailleurs qualifiés du fédéral', card: 'Date de décision, norme de six mois, invitations et travailleurs qualifiés admis',
    title: 'Délai des travailleurs qualifiés du fédéral en 2026',
    description: 'Travailleurs qualifiés du fédéral en 2026 : norme de six mois d’IRCC et son bilan, invitations par score et admissions, plus votre date selon le délai d’IRCC.',
    h1: 'Travailleurs qualifiés du fédéral : norme, invitations et votre date',
    intro: `La norme d’IRCC pour une demande de travailleur qualifié du fédéral est de ${K.fmtStd(st.cur, 'fr')} pour 80 % des dossiers ; elle a été tenue pour ${F.pct(st.cur.perf)} d’entre eux en ${K.fmtFy(st.fy, 'fr')}.`,
    resume: `Le Programme des travailleurs qualifiés du fédéral sélectionne, par l’Entrée express, des personnes qui ont une expérience de travail qualifié, le plus souvent acquise à l’étranger. Après l’invitation et le dépôt de la demande, IRCC affiche dans son outil « Vérifier les délais de traitement » le délai qu’il prévoit ; saisissez-le dans le calculateur ci-dessus avec le jour où IRCC a reçu votre dossier pour obtenir une date de décision estimée. IRCC publie en données ouvertes une norme de service de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes de ce programme. En ${K.fmtFy(st.fy, 'fr')}, ${F.n(st.cur.met)} des ${F.n(st.cur.total)} demandes, soit ${F.pct(st.cur.perf)}, ont été traitées dans ce délai. IRCC a invité ${F.n(inv(full))} candidats de ce programme en ${full}, ${invCh != null && invCh < 0 ? `soit ${F.pa(invCh)} de moins` : `soit ${F.pa(invCh)} de plus`} qu’en ${prevFull}, et ${F.n(inv(cur))} depuis le début de ${cur} ; ${F.pct(under501)} des invitations de ${full} sont allées à des scores inférieurs à 501. De ${F.w12(M)}, ${F.n(roc12.last)} travailleurs qualifiés ont été admis hors du Québec, ${chFr(roc12.change)} sur les douze mois d’avant.`,
    faqs: [
      { q: 'Un travailleur qualifié du fédéral à l’étranger attend-il plus longtemps qu’au Canada ?', a: 'La norme de service est la même d’où que vous présentiez la demande, mais les demandeurs à l’étranger ont plus souvent besoin d’un examen médical chez un médecin désigné, de certificats de police de plusieurs pays et d’une demande de passeport après l’acceptation. Chacune de ces étapes peut ajouter un temps que la norme ne compte pas : prévoyez une marge au-delà de la date du calculateur.' },
      { q: 'Pourquoi cette page compte-t-elle les travailleurs qualifiés admis hors du Québec ?', a: `Les données mensuelles d’IRCC sur les admissions ont une seule catégorie pour tous les travailleurs qualifiés, fédéral et Québec ensemble, et un compte à part pour ceux admis au Québec. La différence donne les travailleurs qualifiés admis ailleurs au Canada : ${F.n(roc12.last)} sur les douze derniers mois, soit ${F.pct(rocShare)} de tous les travailleurs qualifiés admis.` },
      { q: 'Quels scores SCG ont été invités au titre des travailleurs qualifiés du fédéral ?', a: `En ${full}, ${F.pct(under501)} des invitations de ce programme sont allées à des candidats ayant moins de 501 points, contre ${F.pct(cecUnder501)} pour l’expérience canadienne. Des rondes ciblées sur certaines professions ou sur les francophones sont descendues plus bas. La page des invitations par tranche de score montre chaque tranche et situe votre propre score.` },
    ],
    body: (h) => `
<h2>Du délai affiché par IRCC à votre date de décision</h2>
<p>Pour une demande de travailleur qualifié du fédéral, le délai de traitement court du jour où IRCC reçoit votre demande complète de résidence permanente, après une invitation de l’Entrée express, jusqu’à la décision finale. IRCC affiche le délai qu’il prévoit pour cette étape dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. Ce site ne recopie pas ce chiffre : saisissez-le ci-dessous avec votre date de dépôt. Le calculateur ajoute le délai dans l’unité choisie : un délai en mois donne une date au mois près, et le résultat indique aussi la part du délai déjà écoulée.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'fsw', u: 'm' }, t: 'Votre demande de travailleur qualifié : date de décision estimée' })}
<h2>La norme de service et son bilan</h2>
<p>La norme d’IRCC pour les travailleurs qualifiés du fédéral est de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes électroniques complètes, publiée chaque année dans l’inventaire des services du gouvernement du Canada diffusé en ${h.src('od-std', 'données ouvertes')}. En ${K.fmtFy(st.fy, 'fr')}, IRCC a traité ${h.pct(st.cur.perf)} des ${h.n(st.cur.total)} demandes dans ce délai${st.prev ? `, contre ${h.pct(st.prev.perf)} des ${h.n(st.prev.total)} demandes en ${K.fmtFy(st.pfy!, 'fr')}` : ''}. ${vsCec > 0 ? `C’est un meilleur bilan que celui de l’${h.a('cec', 'expérience canadienne')}, à ${h.pct(cecSt.cur.perf)} la même année.` : vsCec < 0 ? `C’est moins bien que l’${h.a('cec', 'expérience canadienne')}, à ${h.pct(cecSt.cur.perf)} la même année.` : `C’est le même résultat que l’${h.a('cec', 'expérience canadienne')} la même année.`} La norme ne compte que le temps de traitement d’IRCC : les jours passés à attendre un document ou un examen médical du demandeur sont mis à part.</p>
<h2>Les documents qui donnent le rythme</h2>
<p>Un dossier de travailleur qualifié du fédéral demande plus de pièces que la plupart des dossiers de l’Entrée express. Sauf offre d’emploi valide ou autorisation de travailler au Canada, il faut prouver des fonds suffisants pour s’établir, par des lettres bancaires officielles couvrant les derniers mois. Un diplôme étranger exige une évaluation des diplômes d’études par un organisme désigné, et les résultats du test de langue doivent encore être valides au dépôt. Réunir ces pièces avant l’invitation laisse le délai de l’outil d’IRCC comme seule vraie attente.</p>
<h2>Qui reçoit une invitation</h2>
<p>Les ${h.src('od-ee', 'données ouvertes sur les candidats invités')} comptent ${h.n(inv(full))} invitations de travailleurs qualifiés du fédéral en ${full}, soit ${h.pct(invShare)} de toutes les invitations de l’Entrée express cette année-là, et ${h.n(inv(cur))} depuis le début de ${cur}. Ces candidats ont en général moins d’expérience canadienne que ceux de l’expérience canadienne, donc moins de points : ${h.pct(under501)} de leurs invitations de ${full} sont allées à des scores inférieurs à 501, contre ${h.pct(cecUnder501)} pour l’expérience canadienne. La page des rondes d’IRCC montre quelles rondes, générales ou ciblées, ont atteint ces scores. La page des ${h.a('express-entry-draws', 'invitations par tranche de score')} permet de vérifier les tranches de chaque année.</p>
<h2>Les travailleurs qualifiés admis, mois par mois</h2>
<p>Les ${h.src('od-pr', 'données ouvertes sur les résidents permanents')} comptent tous les travailleurs qualifiés dans une seule catégorie, fédéral et Québec ensemble, et donnent le Québec à part. Le tableau montre les deux et la différence, les travailleurs qualifiés admis ailleurs au Canada, en majorité par ce programme. De ${h.w12(M)}, cette différence atteint ${h.n(roc12.last)}, ${dirFr(roc12.change)} de ${h.pa(roc12.change)} sur les douze mois précédents, sur ${h.n(all12.last)} travailleurs qualifiés en tout. Le Québec en a admis ${h.n(qc12.last)}, ${h.lang === 'fr' ? chFr(qc12.change) : chEn(qc12.change)} ; son programme a sa propre page, celle du ${h.a('quebec-skilled-worker', 'travailleur qualifié du Québec')}.</p>
${h.months(M, [['Tous les travailleurs qualifiés', all], ['Admis au Québec', qc], ['Hors du Québec', roc]], { max: 12, caption: 'Résidents permanents admis comme travailleurs qualifiés, par mois, du plus récent au plus ancien. Hors du Québec = tous les travailleurs qualifiés moins ceux admis au Québec, calcul de ce site. Source : IRCC, Résidents permanents, mises à jour mensuelles, données ouvertes ; chiffres arrondis.' })}
<p>Les admissions comprennent les époux et enfants admis avec le demandeur principal, et elles comptent les personnes au moment où elles deviennent résidents permanents, souvent des mois après la décision pour celles qui doivent encore venir au Canada. Elles montrent combien de dossiers IRCC ferme, pas la durée d’un dossier donné. Pour une vue plus longue, la page d’${h.a('history', 'historique')} met ces flux en regard des années précédentes.</p>
`,
  },
});
