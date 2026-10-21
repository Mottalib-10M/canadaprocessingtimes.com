import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tm, tr, rankText, median, lines, ser } from './_pays';

/* France : citoyens dispensés de visa (AVE), mais une ligne « France » pour les permis et pour les résidents d'autres nationalités. */
const C = 'FR';
const D = K.L.dates.country;
const E = K.en, F = K.fr;
const vi = tr('visitor', C)!, sv = tr('super-visa', C), st = tr('study', C)!, wk = tr('work', C)!;
const ft = (g: 'visitor' | 'super-visa' | 'study' | 'work' | 'child', l: 'en' | 'fr') => K.fmtTime(tm(g, C), l);
const eta = K.readingOf('eta'), iec = K.readingOf('iec');

export default defineGuide({
  id: 'france', group: 'countries', order: 114, country: C,
  tool: 'delai', toolArg: { g: 'study', c: C, only: 'study,work,visitor,super-visa,iec,eta' },
  related: ['iec', 'eta', 'study-permit', 'work-permit', 'morocco', 'cameroon'],
  sources: ['ptimes-country', 'ptimes-noncountry', 'eta', 'iec', 'study-permit', 'wayback'],
  en: {
    slug: 'processing-times-france',
    nav: 'France', card: 'Study and work permits from France, eTA and IEC for French citizens',
    title: 'Study Permit and Work Permit Times from France, 2026',
    description: 'Canadian study permit, work permit, IEC and eTA times for applicants in France in 2026, plus the visitor visa line for France residents with another passport.',
    h1: 'Processing times for applications filed from France',
    intro: `A study permit requested from France takes ${ft('study', 'en')} and a work permit ${ft('work', 'en')} in IRCC’s file of ${E.day(D)}.`,
    resume: `French citizens do not need a visitor visa for Canada: they need an Electronic Travel Authorization to fly in, which IRCC currently processes in ${K.fmtTime(eta.t, 'en')} for most applicants. The France line of IRCC’s country file still matters for two groups. Students and workers who apply from France see ${ft('study', 'en')} for a study permit, ${rankText('study', C, 'en')} countries, and ${ft('work', 'en')} for a work permit, ${rankText('work', C, 'en')}, in the update of ${E.day(D)}. Residents of France who hold another passport and need a visa see ${ft('visitor', 'en')} for a visitor visa. International Experience Canada, the route of most young French workers, has its own single line at ${K.fmtTime(iec.t, 'en')}. Our oldest copy of the country file, dated ${E.day(st.firstDate!)}, showed ${E.d(st.first!, 'w')} for a study permit and ${E.d(wk.first!, 'w')} for a work permit from France. These are past times, the delay within which IRCC finished 80% of recent files, counted from receipt of a complete application, biometrics excluded.`,
    faqs: [
      { q: 'Do French citizens need a visa or an eTA to visit Canada?', a: `An eTA, not a visa, when flying to or through a Canadian airport; arriving by land or sea needs only the passport. IRCC’s single figure for an eTA is ${K.fmtTime(eta.t, 'en')} at its update of ${E.day(eta.date)}, though some requests are held for checks and take several days. Apply only on the official canada.ca form.` },
      { q: 'How long does a study permit take for a French student?', a: `${ft('study', 'en')} when applying from France, according to IRCC’s file of ${E.day(D)}; the middle value among countries is ${E.d(median('study'), 'w')}. Students going to Quebec need the CAQ before applying to IRCC, and that Quebec step has its own wait. Biometrics, given in France, are not counted in IRCC’s figure.` },
      { q: 'Which line applies to someone living in France with another passport?', a: `The France line, because IRCC sorts visa applications by the country you apply from. A Moroccan or Cameroonian resident of France who applies from France waits ${ft('visitor', 'en')} for a visitor visa, against ${K.fmtTime(K.readingOf('visitor', 'MA').t, 'en')} from Morocco and ${K.fmtTime(K.readingOf('visitor', 'CM').t, 'en')} from Cameroon on the same date.` },
    ],
    body: (h) => `
<h2>The France lines at a glance</h2>
${lines(h, C, ['study', 'work', 'visitor', 'super-visa', 'child'])}
<p>The super visa and dependent child lines show no current figure for France: IRCC marks them as having no time available. ${sv ? `The archive still holds earlier super visa figures, from ${h.d(sv.first!)} on ${h.day(sv.firstDate!)} to ${h.d(sv.last)} on ${h.day(sv.lastDate)}.` : ''}</p>
<h2>Study permits</h2>
<p>France is one of the faster places to apply from for a study permit: ${h.t(tm('study', C))}, ${rankText('study', C, 'en')} countries. The line has varied from ${h.d(st.min, 'w')} to ${h.d(st.max, 'w')} across our copies. Most French students in Canada go to Quebec, where the CAQ issued by the Quebec government must be obtained before the federal application; elsewhere, most students need a provincial attestation letter.</p>
${h.hist(ser('study', C), { max: 10, unit: 'w' })}
${h.mini('delai', { p: ['m'], d: { g: 'study', c: C, m: 'none' }, t: 'Study permit from France: your date' })}
<h2>Work permits and IEC</h2>
<p>A work permit requested from France takes ${h.t(tm('work', C))}, ${rankText('work', C, 'en')} countries, after ${h.d(wk.first!, 'w')} in the copy of ${h.day(wk.firstDate!)}. This line covers employer-specific and other work permits filed from France, including the Francophone Mobility stream for French-speaking workers hired outside Quebec. Young French people more often go through ${h.a('iec', 'International Experience Canada')}: Working Holiday, Young Professionals and International Co-op. IEC has its own single time, ${h.t(iec.t)}, counted after the invitation and the complete application, not from the day the profile enters the pool.</p>
<h2>The eTA</h2>
<p>For a holiday or a business trip, a French citizen needs only an ${h.a('eta', 'eTA')} to board a flight to Canada. Most are approved within minutes; IRCC asks some applicants for more documents, which can take days. The eTA is linked to the passport, so a new passport means a new eTA.</p>
<h2>Biometrics and timing</h2>
<p>Study and work permit applicants from France give fingerprints and a photo at a visa application centre once IRCC’s instruction letter arrives, unless they gave them in the last ten years for another application. The appointment is not part of the published time. For a September start, an application in spring leaves room for the CAQ, the biometrics and IRCC’s own delay; one sent in July leaves little.</p>
<h2>After the permit</h2>
<p>Many French students and IEC participants later apply for permanent residence from inside Canada. Those lines do not depend on the country of citizenship: the ${h.a('cec', 'Canadian Experience Class')} and the ${h.a('quebec-skilled-worker', 'Quebec-selected skilled worker')} lines are national forward-looking times, with IRCC’s queue by month of filing. A graduate who stays to work applies from inside Canada, where the ${h.a('pgwp', 'work permit in Canada')} line applies, not the France line.</p>
<h2>Residents of France with another passport</h2>
<p>A visitor visa requested from France takes ${h.t(tm('visitor', C))}, ${rankText('visitor', C, 'en')} countries. It read ${h.d(vi.first!)} in the copy of ${h.day(vi.firstDate!)}. For a resident of France whose own country has a slower line, filing from France can be the faster route; the tool compares both on today’s figures.</p>
`,
  },
  fr: {
    slug: 'delais-france',
    nav: 'France', card: 'Permis d’études et de travail depuis la France, AVE et PVT pour les Français',
    title: 'Délai permis d’études et de travail depuis la France, 2026',
    description: 'Délais canadiens du permis d’études, du permis de travail, de l’EIC (PVT) et de l’AVE pour une demande déposée en France en 2026, et visa des résidents.',
    h1: 'Délais des demandes déposées depuis la France',
    intro: `Un permis d’études demandé depuis la France prend ${ft('study', 'fr')} et un permis de travail ${ft('work', 'fr')} dans le fichier d’IRCC du ${F.day(D)}.`,
    resume: `Les citoyens français n’ont pas besoin de visa de visiteur pour le Canada : il leur faut une autorisation de voyage électronique (AVE) pour arriver en avion, qu’IRCC traite en ce moment en ${K.fmtTime(eta.t, 'fr')} pour la plupart des demandeurs. La ligne France du fichier par pays d’IRCC compte pourtant pour deux groupes. Les étudiants et travailleurs qui déposent depuis la France voient ${ft('study', 'fr')} pour un permis d’études, au ${rankText('study', C, 'fr')} pays, et ${ft('work', 'fr')} pour un permis de travail, au ${rankText('work', C, 'fr')}, à la mise à jour du ${F.day(D)}. Les résidents de France qui ont un autre passeport et ont besoin d’un visa voient ${ft('visitor', 'fr')} pour un visa de visiteur. Expérience internationale Canada, la voie de la plupart des jeunes Français qui partent travailler (PVT, Jeunes professionnels, stage), a sa propre ligne unique à ${K.fmtTime(iec.t, 'fr')}. Notre plus ancienne copie du fichier par pays, datée du ${F.day(st.firstDate!)}, indiquait ${F.d(st.first!, 'w')} pour un permis d’études et ${F.d(wk.first!, 'w')} pour un permis de travail depuis la France. Ce sont des délais passés, le temps dans lequel IRCC a terminé 80 % des dossiers récents, à partir de la réception d’une demande complète, sans la biométrie.`,
    faqs: [
      { q: 'Un Français a-t-il besoin d’un visa ou d’une AVE pour le Canada ?', a: `D’une AVE, pas d’un visa, pour arriver en avion au Canada ou y transiter ; par la route ou la mer, le passeport suffit. Le délai unique publié par IRCC pour l’AVE est de ${K.fmtTime(eta.t, 'fr')} à sa mise à jour du ${F.day(eta.date)}, même si certaines demandes sont retenues pour vérification plusieurs jours. Passez uniquement par le formulaire officiel de canada.ca.` },
      { q: 'Combien de temps prend un permis d’études pour un étudiant français ?', a: `${ft('study', 'fr')} pour une demande faite depuis la France, d’après le fichier d’IRCC du ${F.day(D)} ; la valeur médiane des pays est de ${F.d(median('study'), 'w')}. Pour le Québec, il faut le CAQ avant la demande à IRCC, et cette étape québécoise a son propre délai. La biométrie, donnée en France, n’entre pas dans le chiffre d’IRCC.` },
      { q: 'Quelle ligne s’applique à un résident de France qui a un autre passeport ?', a: `La ligne France, car IRCC classe les demandes de visa selon le pays d’où l’on dépose. Un Marocain ou un Camerounais qui réside en France et dépose depuis la France attend ${ft('visitor', 'fr')} pour un visa de visiteur, contre ${K.fmtTime(K.readingOf('visitor', 'MA').t, 'fr')} depuis le Maroc et ${K.fmtTime(K.readingOf('visitor', 'CM').t, 'fr')} depuis le Cameroun à la même date.` },
    ],
    body: (h) => `
<h2>Les lignes France en un coup d’œil</h2>
${lines(h, C, ['study', 'work', 'visitor', 'super-visa', 'child'])}
<p>Le super visa et les enfants à charge n’ont pas de chiffre actuel pour la France : IRCC les marque sans délai disponible. ${sv ? `L’archive garde des chiffres plus anciens du super visa, de ${h.d(sv.first!)} le ${h.day(sv.firstDate!)} à ${h.d(sv.last)} le ${h.day(sv.lastDate)}.` : ''}</p>
<h2>Permis d’études</h2>
<p>La France fait partie des pays d’où le permis d’études est le plus rapide : ${h.t(tm('study', C))}, au ${rankText('study', C, 'fr')} pays. La ligne a varié de ${h.d(st.min, 'w')} à ${h.d(st.max, 'w')} dans nos copies. La plupart des étudiants français au Canada vont au Québec, où le CAQ délivré par le gouvernement du Québec doit être obtenu avant la demande fédérale ; ailleurs, la plupart des étudiants ont besoin d’une lettre d’attestation de la province.</p>
${h.hist(ser('study', C), { max: 10, unit: 'w' })}
${h.mini('delai', { p: ['m'], d: { g: 'study', c: C, m: 'none' }, t: 'Permis d’études depuis la France : votre date' })}
<h2>Permis de travail et EIC</h2>
<p>Un permis de travail demandé depuis la France prend ${h.t(tm('work', C))}, au ${rankText('work', C, 'fr')} pays, après ${h.d(wk.first!, 'w')} dans la copie du ${h.day(wk.firstDate!)}. Cette ligne couvre les permis liés à un employeur et les autres permis déposés depuis la France, dont le volet Mobilité francophone pour les travailleurs d’expression française embauchés hors du Québec. Les jeunes Français passent plus souvent par ${h.a('iec', 'Expérience internationale Canada')} : Programme vacances-travail, Jeunes professionnels et Stage coop international. L’EIC a son propre délai unique, ${h.t(iec.t)}, compté après l’invitation et la demande complète, et non depuis l’entrée du profil dans le bassin.</p>
<h2>L’AVE</h2>
<p>Pour des vacances ou un voyage d’affaires, un citoyen français n’a besoin que d’une ${h.a('eta', 'AVE')} pour embarquer sur un vol vers le Canada. La plupart sont accordées en quelques minutes ; IRCC demande des documents à certains demandeurs, ce qui peut prendre des jours. L’AVE est liée au passeport : un nouveau passeport demande une nouvelle AVE.</p>
<h2>Biométrie et calendrier</h2>
<p>Les demandeurs de permis d’études ou de travail en France donnent empreintes et photo dans un centre de réception des demandes de visa après la lettre d’instruction d’IRCC, sauf s’ils l’ont déjà fait dans les dix dernières années pour une autre demande. Ce rendez-vous n’entre pas dans le délai publié. Pour une rentrée en septembre, une demande au printemps laisse le temps du CAQ, de la biométrie et du délai d’IRCC ; une demande envoyée en juillet en laisse peu.</p>
<h2>Après le permis</h2>
<p>Beaucoup d’étudiants français et de participants à l’EIC demandent ensuite la résidence permanente depuis le Canada. Ces lignes ne dépendent pas de la nationalité : la ${h.a('cec', 'catégorie de l’expérience canadienne')} et les ${h.a('quebec-skilled-worker', 'travailleurs qualifiés sélectionnés par le Québec')} ont des délais prospectifs nationaux, avec la file d’IRCC par mois de dépôt. Un diplômé qui reste pour travailler dépose depuis le Canada, où s’applique la ligne du ${h.a('pgwp', 'permis de travail au Canada')}, et non la ligne France.</p>
<h2>Les résidents de France qui ont un autre passeport</h2>
<p>Un visa de visiteur demandé depuis la France prend ${h.t(tm('visitor', C))}, au ${rankText('visitor', C, 'fr')} pays. La ligne indiquait ${h.d(vi.first!)} dans la copie du ${h.day(vi.firstDate!)}. Pour un résident de France dont le pays d’origine a une ligne plus lente, déposer depuis la France peut être la voie la plus rapide ; l’outil compare les deux sur les chiffres du jour.</p>
`,
  },
});
