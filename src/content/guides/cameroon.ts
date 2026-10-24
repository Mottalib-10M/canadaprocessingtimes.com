import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dirEn, dirFr, ord, eeRank } from './_pays';

/* Cameroun : données ouvertes d'IRCC par pays de citoyenneté (OGL-Canada 2.0), calculées au build. Angle : la
 * résidence permanente et Entrée express pour les francophones, où le Cameroun pèse très lourd. */
const C = 'CM';
const E = K.en, F = K.fr;
const pr = K.ops12('prIn', C), co = K.ops12('copr', C), sp = K.ops12('spFin', C), v1 = K.ops12('v1', C), tf = K.ops12('trFin', C), ci = K.ops12('cit', C);
const a = K.approval12(C), all = K.approval12();
const rPr = K.rank12('prIn', C), rCo = K.rank12('copr', C);
const YRS = ['2023', '2024', K.EE_FULL, K.EE_CUR].filter((y, i, s) => s.indexOf(y) === i);
const ee = K.eeCountry(K.EE_FULL, C), eeR = eeRank(K.EE_FULL, C), ee0 = K.eeCountry('2023', C), eeCur = K.eeCountry(K.EE_CUR, C);
const nCur = K.monthsOfYear(K.EE_CUR).length;
const eeAll = K.eeTop(K.EE_FULL, 500).reduce((s, [, n]) => s + n, 0), eeSh = K.pctOf(ee, eeAll);
const sCec = K.stdOf('cec')!, sFsw = K.stdOf('fsw')!, sChild = K.stdOf('child')!;
const prY = (y: string) => K.fullYear('prIn', C, y);
// « parmi les tout premiers pays » n'est vrai que si le Cameroun reste dans les cinq premiers pour les invitations.
if (!(eeR != null && eeR <= 5)) throw new Error('cameroon : le Cameroun n’est plus dans les cinq premiers pays invités par Entrée express, réécrire');
if (!(rPr.rank != null && rPr.rank <= 5)) throw new Error('cameroon : le Cameroun n’est plus dans les cinq premiers pays pour la résidence permanente, réécrire « peu de pays »');

export default defineGuide({
  id: 'cameroon', group: 'countries', order: 112, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['visitor-visa', 'super-visa', 'dependent-child', 'study-permit', 'algeria', 'haiti'],
  sources: ['ptimes', 'open-data', 'od-pr', 'od-ee', 'od-std', 'express-entry', 'study-permit', 'ogl'],
  en: {
    slug: 'processing-times-cameroon',
    nav: 'Cameroon', card: 'Permanent residence and Express Entry for French-speaking Cameroonians',
    title: 'Cameroonian Applicants: IRCC Permanent Residence 2026',
    description: 'Cameroonian citizens in IRCC open data for 2026: permanent residence applications, Express Entry invitations to French speakers, study and visitor files.',
    h1: 'Applications to Canada by Cameroonian citizens',
    intro: `IRCC received ${E.n(pr.last)} permanent residence applications from Cameroonian citizens from ${E.w12()}, ${E.ch(pr.change)} on the year before.`,
    resume: `Cameroon stands out in IRCC’s open data for permanent residence rather than visits. From ${E.w12()}, the department received ${E.n(pr.last)} permanent residence applications from Cameroonian citizens, which ranks Cameroon ${ord(rPr.rank, 'en')} of ${E.n(rPr.of)} countries of citizenship, and issued ${E.n(co.last)} confirmations and visas of permanent residence (${ord(rCo.rank, 'en')}). Express Entry drives much of it: ${E.n(ee)} Cameroonians were invited in ${K.EE_FULL}, ${E.pct(eeSh)} of all invitations and the ${ord(eeR, 'en')} highest count by citizenship, helped by rounds for strong French speakers. On the temporary side, IRCC approved ${E.pct(a.rate)} of the files it finalized, against ${E.pct(a.prevRate)} a year earlier and ${E.pct(all.rate)} for all countries. Waiting times are the ones IRCC’s tool shows for the country you apply from; the calculator converts them into a date.`,
    faqs: [
      { q: 'Why are so many Cameroonians invited through Express Entry?', a: `IRCC invited ${E.n(ee)} Cameroonian citizens in ${K.EE_FULL}, against ${E.n(ee0)} in 2023. Many candidates educated in Cameroon are fluent in French, and IRCC runs category rounds for strong French speakers with lower score cut-offs than general rounds. Many of those invited were already in Canada as students or workers, which adds Canadian experience points.` },
      { q: 'How long does Express Entry take for a Cameroonian candidate?', a: `IRCC’s service standard for Express Entry is ${K.fmtStd(sCec.cur, 'en')} after a complete application, met for ${E.pct(sCec.cur.perf)} of Canadian Experience Class files and ${E.pct(sFsw.cur.perf)} of Federal Skilled Worker files in ${K.fmtFy(sCec.fy, 'en')}. The time IRCC currently shows is on its processing times tool; the standard is the same whatever your citizenship.` },
      { q: 'Does a Cameroonian already in Canada count as Cameroon in these figures?', a: 'Yes. IRCC’s open data count applicants by country of citizenship, wherever they live. The processing times tool works differently: it asks where you apply from, and applicants inside Canada read the Canadian line. A Cameroonian student applying for permanent residence from Montreal counts here as Cameroonian.' },
    ],
    body: (h) => `
<h2>A leading source of new permanent residents</h2>
<p>Few countries send as many permanent residence applications to IRCC as Cameroon. The operational processing tables count ${h.n(pr.last)} applications received from Cameroonian citizens over the latest twelve months, ${dirEn(pr.change)} ${h.pa(pr.change)}, and ${h.n(co.last)} confirmations and visas of permanent residence issued. In calendar years, applications received went from ${h.n(prY('2023'))} in 2023 to ${h.n(prY(K.EE_FULL))} in ${K.EE_FULL}. Cameroonians apply through Express Entry, through provincial nominee programs, through Quebec and through family sponsorship, often for a ${h.a('dependent-child', 'dependent child')} left in Cameroon.</p>
<p>For family files, IRCC’s standard for a dependent child abroad is ${K.fmtStd(sChild.cur, 'en')}, met for ${h.pct(sChild.cur.perf)} of applications nationally in ${K.fmtFy(sChild.fy, 'en')}. The standard is national; the time for your own file is on IRCC’s ${h.src('ptimes', 'Check processing times tool')}.</p>
<h2>Express Entry and French speakers</h2>
<p>The ${h.src('od-ee', 'invited candidates open data')} show how fast Cameroon rose: invitations went from ${h.n(ee0)} in 2023 to ${h.n(ee)} in ${K.EE_FULL}, and the first ${nCur} months of ${K.EE_CUR} already count ${h.n(eeCur)}. In ${K.EE_FULL}, Cameroon ranked ${ord(eeR, 'en')} among countries of citizenship. Rounds for strong French speakers, with lower cut-off scores, reward the bilingual profile of many Cameroonian graduates; candidates already studying or working in Canada add Canadian experience on top.</p>
${h.table(['Year', 'Cameroonians invited', 'Rank by citizenship'], YRS.map((y) => [y === K.EE_CUR ? `${y} (${nCur} months)` : y, h.n(K.eeCountry(y, C)), ord(eeRank(y, C), 'en')]), 'Express Entry invitations to Cameroonian citizens. Source: IRCC, Express Entry invited candidates, open data; figures rounded to 5.', ['l', 'r', 'r'])}
<p>Once invited, a candidate files the permanent residence application. IRCC aims to decide ${h.a('express-entry', 'Express Entry')} files within ${K.fmtStd(sCec.cur, 'en')}; enter the time its tool shows and the date IRCC received your file here.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'cec', c: C, m: 'none' }, t: 'Express Entry for a Cameroonian candidate: estimated decision date' })}
<h2>Temporary files: studies and visits</h2>
<p>IRCC finalized ${h.n(tf.last)} temporary residence applications from Cameroonian citizens over twelve months and approved ${h.pct(a.rate)} of them, a share ${dirEn(a.rate != null && a.prevRate != null ? a.rate - a.prevRate : null)} from ${h.pct(a.prevRate)}. New study permit applications finalized fell to ${h.n(sp.last)}, ${dirEn(sp.change)} ${h.pa(sp.change)}, after the national cap on study permits. Visitor visas approved reached ${h.n(v1.last)}. The approved share counts withdrawn files as finalized, so read it as a trend, not a refusal rate.</p>
${h.months(K.MONTHS, [['PR applications received', K.full('prIn', C)], ['PR authorizations issued', K.full('copr', C)], ['Study permits finalized', K.full('spFin', C)]], { caption: 'Cameroonian citizens, by month. Source: IRCC, Operational Processing, open data; figures rounded to 5.' })}
<p>${h.n(ci.last)} people born in Cameroon became Canadian citizens over the latest twelve months. The ${h.a('haiti', 'Haiti')} and ${h.a('algeria', 'Algeria')} pages show two other French-speaking countries with different profiles.</p>
<h2>Two ways of counting a country</h2>
<p>IRCC’s processing times tool asks for the country you apply from; its open data count citizens. Many Cameroonians apply for permanent residence from inside Canada, so they read the Canadian line on the tool while appearing under Cameroon here.</p>
<h2>What slows a Cameroonian file</h2>
<p>For applicants still in Cameroon, biometrics are taken at the visa application centre in Yaoundé, and the closest IRCC office handling the file may be abroad. Civil status documents are a frequent stumbling block: birth and marriage certificates must be consistent across the whole application, and IRCC may ask to verify them. For Express Entry, a police certificate from every country where you lived six months or more is required before you file. Gathering these papers before an invitation arrives avoids losing part of the sixty days IRCC gives to submit.</p>
`,
  },
  fr: {
    slug: 'delais-cameroun',
    nav: 'Cameroun', card: 'Résidence permanente et Entrée express des Camerounais francophones',
    title: 'Demandes des Camerounais : résidence permanente IRCC 2026',
    description: 'Les citoyens camerounais dans les données ouvertes d’IRCC en 2026 : résidence permanente, invitations Entrée express des francophones, études et visites.',
    h1: 'Les demandes des citoyens camerounais au Canada',
    intro: `IRCC a reçu ${F.n(pr.last)} demandes de résidence permanente de citoyens camerounais de ${F.w12()}, soit ${F.ch(pr.change)} sur un an.`,
    resume: `Le Cameroun se distingue dans les données ouvertes d’IRCC par la résidence permanente plus que par les visites. De ${F.w12()}, le ministère a reçu ${F.n(pr.last)} demandes de résidence permanente de citoyens camerounais, ce qui place le Cameroun au ${ord(rPr.rank, 'fr')} rang sur ${F.n(rPr.of)} pays de citoyenneté, et a délivré ${F.n(co.last)} confirmations et visas de résidence permanente (${ord(rCo.rank, 'fr')} rang). Entrée express en explique une grande part : ${F.n(ee)} Camerounais ont été invités en ${K.EE_FULL}, soit ${F.pct(eeSh)} de toutes les invitations et le ${ord(eeR, 'fr')} total par citoyenneté, grâce notamment aux rondes réservées aux francophones. Côté temporaire, IRCC a approuvé ${F.pct(a.rate)} des dossiers finalisés, contre ${F.pct(a.prevRate)} un an plus tôt et ${F.pct(all.rate)} tous pays confondus. Les délais sont ceux que l’outil d’IRCC affiche pour le pays depuis lequel vous déposez ; le calculateur les convertit en date.`,
    faqs: [
      { q: 'Pourquoi autant de Camerounais sont-ils invités par Entrée express ?', a: `IRCC a invité ${F.n(ee)} citoyens camerounais en ${K.EE_FULL}, contre ${F.n(ee0)} en 2023. Beaucoup de candidats formés au Cameroun parlent couramment français, et IRCC organise des rondes par catégorie pour les francophones avec des seuils plus bas que les rondes générales. Bon nombre d’invités étaient déjà au Canada comme étudiants ou travailleurs, ce qui ajoute des points d’expérience canadienne.` },
      { q: 'Combien de temps prend Entrée express pour un candidat camerounais ?', a: `La norme de service d’IRCC pour Entrée express est de ${K.fmtStd(sCec.cur, 'fr')} après une demande complète ; elle a été tenue pour ${F.pct(sCec.cur.perf)} des dossiers de la catégorie de l’expérience canadienne et ${F.pct(sFsw.cur.perf)} des travailleurs qualifiés du fédéral en ${K.fmtFy(sCec.fy, 'fr')}. Le délai actuel se lit dans l’outil d’IRCC ; la norme est la même quelle que soit la citoyenneté.` },
      { q: 'Un Camerounais déjà au Canada compte-t-il pour le Cameroun dans ces chiffres ?', a: 'Oui. Les données ouvertes d’IRCC comptent les demandeurs par pays de citoyenneté, où qu’ils vivent. L’outil des délais fonctionne autrement : il demande d’où vous déposez, et les demandeurs au Canada lisent la ligne canadienne. Un étudiant camerounais qui demande la résidence permanente depuis Montréal compte ici comme Camerounais.' },
    ],
    body: (h) => `
<h2>Une grande source de nouveaux résidents permanents</h2>
<p>Peu de pays envoient autant de demandes de résidence permanente à IRCC que le Cameroun. Les tableaux du traitement opérationnel comptent ${h.n(pr.last)} demandes reçues de citoyens camerounais sur les douze derniers mois, ${dirFr(pr.change)} de ${h.pa(pr.change)}, et ${h.n(co.last)} confirmations et visas de résidence permanente délivrés. Par année civile, les demandes reçues passent de ${h.n(prY('2023'))} en 2023 à ${h.n(prY(K.EE_FULL))} en ${K.EE_FULL}. Les Camerounais passent par Entrée express, par les programmes des candidats des provinces, par le Québec et par le parrainage familial, souvent pour un ${h.a('dependent-child', 'enfant à charge')} resté au Cameroun.</p>
<p>Pour les dossiers familiaux, la norme d’IRCC pour un enfant à charge à l’étranger est de ${K.fmtStd(sChild.cur, 'fr')}, tenue pour ${h.pct(sChild.cur.perf)} des demandes à l’échelle du pays en ${K.fmtFy(sChild.fy, 'fr')}. La norme est nationale ; le délai de votre propre dossier se lit dans l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC.</p>
<h2>Entrée express et francophones</h2>
<p>Les ${h.src('od-ee', 'données ouvertes sur les candidats invités')} montrent la vitesse de la progression : les invitations passent de ${h.n(ee0)} en 2023 à ${h.n(ee)} en ${K.EE_FULL}, et les ${nCur} premiers mois de ${K.EE_CUR} en comptent déjà ${h.n(eeCur)}. En ${K.EE_FULL}, le Cameroun se classe au ${ord(eeR, 'fr')} rang des pays de citoyenneté. Les rondes réservées aux francophones, aux seuils plus bas, récompensent le profil bilingue de nombreux diplômés camerounais ; ceux qui étudient ou travaillent déjà au Canada y ajoutent l’expérience canadienne.</p>
${h.table(['Année', 'Camerounais invités', 'Rang par citoyenneté'], YRS.map((y) => [y === K.EE_CUR ? `${y} (${nCur} mois)` : y, h.n(K.eeCountry(y, C)), ord(eeRank(y, C), 'fr')]), 'Invitations Entrée express de citoyens camerounais. Source : IRCC, candidats invités d’Entrée express, données ouvertes ; chiffres arrondis à 5.', ['l', 'r', 'r'])}
<p>Une fois invité, le candidat dépose sa demande de résidence permanente. IRCC vise une décision sur les dossiers ${h.a('express-entry', 'Entrée express')} en ${K.fmtStd(sCec.cur, 'fr')} ; saisissez le délai que montre son outil et la date de réception de votre dossier.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'cec', c: C, m: 'none' }, t: 'Entrée express pour un candidat camerounais : date de décision estimée' })}
<h2>Dossiers temporaires : études et visites</h2>
<p>IRCC a finalisé ${h.n(tf.last)} demandes de résidence temporaire de citoyens camerounais en douze mois et en a approuvé ${h.pct(a.rate)}, une part ${dirFr(a.rate != null && a.prevRate != null ? a.rate - a.prevRate : null)} par rapport aux ${h.pct(a.prevRate)} d’avant. Les nouvelles demandes de permis d’études finalisées sont tombées à ${h.n(sp.last)}, ${dirFr(sp.change)} de ${h.pa(sp.change)}, après le plafond national des permis d’études. Les visas de visiteur approuvés atteignent ${h.n(v1.last)}. La part approuvée compte les retraits parmi les dossiers finalisés : lisez-la comme une tendance, pas comme un taux de refus.</p>
${h.months(K.MONTHS, [['Demandes de RP reçues', K.full('prIn', C)], ['Autorisations de RP délivrées', K.full('copr', C)], ['Permis d’études finalisés', K.full('spFin', C)]], { caption: 'Citoyens camerounais, par mois. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.' })}
<p>${h.n(ci.last)} personnes nées au Cameroun sont devenues citoyennes canadiennes sur les douze derniers mois. Les pages ${h.a('haiti', 'Haïti')} et ${h.a('algeria', 'Algérie')} présentent deux autres pays francophones aux profils différents.</p>
<h2>Deux façons de compter un pays</h2>
<p>L’outil des délais d’IRCC demande le pays depuis lequel vous déposez ; ses données ouvertes comptent des citoyens. Beaucoup de Camerounais demandent la résidence permanente depuis le Canada : ils lisent la ligne canadienne de l’outil tout en figurant ici sous le Cameroun.</p>
<h2>Ce qui ralentit un dossier camerounais</h2>
<p>Pour les demandeurs encore au Cameroun, la biométrie se fait au centre de réception des demandes de visa de Yaoundé, et le bureau d’IRCC qui traite le dossier peut se trouver à l’étranger. Les actes d’état civil sont un écueil fréquent : actes de naissance et de mariage doivent concorder dans toute la demande, et IRCC peut demander à les vérifier. Pour Entrée express, un certificat de police de chaque pays où vous avez vécu six mois ou plus est exigé avant le dépôt. Réunir ces pièces avant l’invitation évite de perdre une partie des soixante jours qu’IRCC accorde pour déposer.</p>
`,
  },
});
