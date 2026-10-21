import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tm, tr, rankText, median, lines, ser } from './_pays';

/* Haïti : des permis d'études parmi les plus rapides, des enfants parrainés parmi les plus lents. */
const C = 'HT';
const D = K.L.dates.country;
const E = K.en, F = K.fr;
const vi = tr('visitor', C)!, sv = tr('super-visa', C)!, st = tr('study', C)!, wk = tr('work', C)!, ch = tr('child', C)!;
const ft = (g: 'visitor' | 'super-visa' | 'study' | 'work' | 'child', l: 'en' | 'fr') => K.fmtTime(tm(g, C), l);
const childAll = K.countriesOf('child').filter((x) => K.daysOf(K.readingOf('child', x).t) != null);
const DO = (g: 'visitor' | 'study' | 'work', l: 'en' | 'fr') => K.fmtTime(K.readingOf(g, 'DO').t, l);
const childRows = (l: 'en' | 'fr') => childAll.map((c) => [c, K.daysOf(K.readingOf('child', c).t)!] as const).sort((a, b) => a[1] - b[1]).map(([c]) => [c === C ? `<strong>${K.countryName(c, l)}</strong>` : K.countryName(c, l), K.fmtTime(K.readingOf('child', c).t, l)]);

export default defineGuide({
  id: 'haiti', group: 'countries', order: 115, country: C,
  tool: 'delai', toolArg: { g: 'child', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['dependent-child', 'study-permit', 'visitor-visa', 'super-visa', 'cameroon', 'france'],
  sources: ['ptimes-country', 'spouse', 'study-permit', 'visit', 'wayback'],
  en: {
    slug: 'processing-times-haiti',
    nav: 'Haiti', card: 'Fast study permits, slow child sponsorship, visitor visa from Haiti',
    title: 'Child Sponsorship and Visa Processing Times from Haiti, 2026',
    description: 'Canadian child sponsorship, study permit, visitor visa, super visa and work permit processing times for applicants in Haiti in 2026, with each dated reading.',
    h1: 'Processing times for applications filed from Haiti',
    intro: `IRCC’s file of ${E.day(D)} shows the two extremes from Haiti: ${ft('study', 'en')} for a study permit, ${ft('child', 'en')} to sponsor a child.`,
    resume: `Applications filed from Haiti sit at both ends of IRCC’s country file of ${E.day(D)}. A study permit takes ${ft('study', 'en')}, ${rankText('study', C, 'en')} countries with a figure, where the middle value is ${E.d(median('study'), 'w')}. Sponsoring a dependent child who lives in Haiti takes ${ft('child', 'en')}, the longest of the ${E.n(childAll.length)} countries for which IRCC publishes that line. In between, a visitor visa takes ${ft('visitor', 'en')}, a super visa ${ft('super-visa', 'en')} and a work permit ${ft('work', 'en')}. The child line has stayed long in every copy we keep: ${E.d(ch.first!, 'm')} on ${E.day(ch.firstDate!)}, ${E.d(ch.max, 'm')} at its highest on ${E.day(ch.maxDate)}. The visitor visa, by contrast, read ${E.d(vi.max)} on ${E.day(vi.maxDate)} and has been under a month in recent readings. These are past times: the delay within which IRCC finished 80% of recent files from Haiti, counted from receipt of a complete application and without the time needed to give biometrics.`,
    faqs: [
      { q: 'How long does it take to sponsor a child living in Haiti?', a: `${ft('child', 'en')} in IRCC’s file of ${E.day(D)}, the longest among the ${E.n(childAll.length)} countries with a published figure. The time runs from receipt of the complete sponsorship and permanent residence application to the decision. Identity and relationship documents, and in some cases DNA testing requested by IRCC, can add time that the figure does not include.` },
      { q: 'Why is a study permit so fast from Haiti?', a: `IRCC does not explain individual lines. Its file shows ${ft('study', 'en')} for Haiti on ${E.day(D)}, after ${E.d(st.first!, 'w')} in our oldest copy, dated ${E.day(st.firstDate!)}. A past time only describes files that were decided; how many applications were refused or withdrawn is not part of it.` },
      { q: 'Can a Haitian living in the Dominican Republic or the United States use that country’s line?', a: 'If you legally reside there, yes: IRCC sorts visa and permit applications by the country you apply from. The tool lets you compare the line for Haiti with the line for your country of residence on the same date before you file.' },
    ],
    body: (h) => `
<h2>Every line from Haiti</h2>
${lines(h, C, ['study', 'visitor', 'super-visa', 'work', 'child'])}
<h2>Sponsoring a child: the longest line</h2>
<p>For a Canadian citizen or permanent resident whose child lives in Haiti, the wait is long. IRCC publishes ${h.t(tm('child', C))} for this line, and only ${h.n(childAll.length)} countries have a dependent child figure at all. The table ranks them from shortest to longest.</p>
${h.table(['Country', 'Dependent child'], childRows('en'), `IRCC country file of ${h.day(D)}; the other countries are marked as not having enough data.`, ['l', 'r'])}
${h.hist(ser('child', C), { max: 10, unit: 'm' })}
${h.mini('delai', { p: ['m'], d: { g: 'child', c: C, m: 'none' }, t: 'Child sponsored from Haiti: your date' })}
<p>The figure covers the whole permanent residence file of the child, from the day IRCC receives the complete application to the decision. Interviews, document checks and, when IRCC asks for it, DNA testing to prove the relationship are part of what makes the line long, and the time to complete them on your side is not counted. The ${h.a('dependent-child', 'dependent child page')} explains the forms and what IRCC checks.</p>
<h2>Studies: one of the shortest lines</h2>
<p>A study permit from Haiti takes ${h.t(tm('study', C))}. The line was ${h.d(st.first!, 'w')} in the copy of ${h.day(st.firstDate!)} and has shortened in the readings of 2026. Students admitted in Quebec, the most common destination for French-speaking Haitian students, need a CAQ before applying to IRCC; that Quebec step has its own time.</p>
<h2>Visits and work</h2>
<p>A visitor visa takes ${h.t(tm('visitor', C))}, ${rankText('visitor', C, 'en')} countries, after a reading of ${h.d(vi.max)} on ${h.day(vi.maxDate)}. Parents and grandparents can apply for the ${h.a('super-visa', 'super visa')}, at ${h.t(tm('super-visa', C))} from Haiti, ${rankText('super-visa', C, 'en')} countries; the line read ${h.d(sv.first!)} on ${h.day(sv.firstDate!)}. A work permit takes ${h.t(tm('work', C))}, against ${h.d(wk.first!, 'w')} in our oldest copy.</p>
<h2>Reading the estimate for a family file</h2>
<p>Choose the dependent child line and the month IRCC received the sponsorship. The tool adds ${h.t(tm('child', C))} and says how far you are from that date. With a line this long, a small weekly change in the figure moves the estimate by weeks, so compare the result with the change since the previous reading. Being past the date is not a refusal: one file in five takes longer than the published time. At that point, check your account for any request you missed, then use IRCC’s web form; the ${h.a('beyond-processing-time', 'page on delays beyond the published time')} lists the steps.</p>
<h2>Haiti next to its neighbour</h2>
<p>On the same date, a resident of the Dominican Republic waits ${DO('visitor', 'en')} for a visitor visa, ${DO('study', 'en')} for a study permit and ${DO('work', 'en')} for a work permit. Comparing lines only helps someone who legally lives in the other country; IRCC applies the line of the country you file from.</p>
<h2>Biometrics and where you apply</h2>
<p>Each visa or permit application needs biometrics given at a visa application centre, and that wait is not part of IRCC’s figure. Haitians who live legally in another country usually apply from there, and the figure of that country applies to them.</p>
`,
  },
  fr: {
    slug: 'delais-haiti',
    nav: 'Haïti', card: 'Permis d’études rapides, parrainage d’enfant lent, visa de visiteur depuis Haïti',
    title: 'Délai parrainage d’enfant et visa depuis Haïti, 2026',
    description: 'Délais canadiens du parrainage d’enfant, du permis d’études, du visa de visiteur, du super visa et du permis de travail depuis Haïti en 2026, avec historique.',
    h1: 'Délais des demandes déposées depuis Haïti',
    intro: `Le fichier d’IRCC du ${F.day(D)} montre les deux extrêmes depuis Haïti : ${ft('study', 'fr')} pour un permis d’études, ${ft('child', 'fr')} pour parrainer un enfant.`,
    resume: `Les demandes déposées depuis Haïti se trouvent aux deux bouts du fichier par pays d’IRCC du ${F.day(D)}. Un permis d’études prend ${ft('study', 'fr')}, au ${rankText('study', C, 'fr')} pays chiffrés, pour une valeur médiane de ${F.d(median('study'), 'w')}. Parrainer un enfant à charge qui vit en Haïti prend ${ft('child', 'fr')}, le plus long des ${F.n(childAll.length)} pays pour lesquels IRCC publie cette ligne. Entre les deux, un visa de visiteur prend ${ft('visitor', 'fr')}, un super visa ${ft('super-visa', 'fr')} et un permis de travail ${ft('work', 'fr')}. La ligne des enfants est restée longue dans chaque copie que nous gardons : ${F.d(ch.first!, 'm')} le ${F.day(ch.firstDate!)}, ${F.d(ch.max, 'm')} au plus haut le ${F.day(ch.maxDate)}. Le visa de visiteur, lui, indiquait ${F.d(vi.max)} le ${F.day(vi.maxDate)} et reste sous le mois dans les relevés récents. Ce sont des délais passés : le temps dans lequel IRCC a terminé 80 % des dossiers récents venus d’Haïti, à partir de la réception d’une demande complète, sans le temps de la biométrie.`,
    faqs: [
      { q: 'Combien de temps pour parrainer un enfant qui vit en Haïti ?', a: `${ft('child', 'fr')} dans le fichier d’IRCC du ${F.day(D)}, le plus long des ${F.n(childAll.length)} pays qui ont un chiffre publié. Le délai court de la réception de la demande complète de parrainage et de résidence permanente jusqu’à la décision. Les pièces d’identité et de filiation, et parfois un test d’ADN demandé par IRCC, ajoutent un temps que le chiffre ne compte pas.` },
      { q: 'Pourquoi le permis d’études est-il si rapide depuis Haïti ?', a: `IRCC n’explique pas ses lignes une à une. Son fichier indique ${ft('study', 'fr')} pour Haïti le ${F.day(D)}, après ${F.d(st.first!, 'w')} dans notre plus ancienne copie, datée du ${F.day(st.firstDate!)}. Un délai passé décrit seulement les dossiers tranchés ; la part de refus ou de désistements n’y entre pas.` },
      { q: 'Un Haïtien qui vit en République dominicaine ou aux États-Unis peut-il utiliser la ligne de ce pays ?', a: 'S’il y réside légalement, oui : IRCC classe les demandes de visa et de permis selon le pays d’où l’on dépose. L’outil permet de comparer la ligne d’Haïti et celle de votre pays de résidence à la même date avant de déposer.' },
    ],
    body: (h) => `
<h2>Toutes les lignes depuis Haïti</h2>
${lines(h, C, ['study', 'visitor', 'super-visa', 'work', 'child'])}
<h2>Parrainer un enfant : la ligne la plus longue</h2>
<p>Pour un citoyen canadien ou un résident permanent dont l’enfant vit en Haïti, l’attente est longue. IRCC publie ${h.t(tm('child', C))} pour cette ligne, et seuls ${h.n(childAll.length)} pays ont un chiffre pour les enfants à charge. Le tableau les classe du plus court au plus long.</p>
${h.table(['Pays', 'Enfant à charge'], childRows('fr'), `Fichier par pays d’IRCC du ${h.day(D)} ; les autres pays sont marqués comme manquant de données.`, ['l', 'r'])}
${h.hist(ser('child', C), { max: 10, unit: 'm' })}
${h.mini('delai', { p: ['m'], d: { g: 'child', c: C, m: 'none' }, t: 'Enfant parrainé depuis Haïti : votre date' })}
<p>Le chiffre couvre tout le dossier de résidence permanente de l’enfant, du jour où IRCC reçoit la demande complète jusqu’à la décision. Les entrevues, la vérification des documents et, quand IRCC le demande, le test d’ADN pour prouver le lien de filiation expliquent en partie la longueur de la ligne, et le temps de les faire de votre côté n’est pas compté. La ${h.a('dependent-child', 'page des enfants à charge')} explique les formulaires et ce qu’IRCC vérifie.</p>
<h2>Études : une des lignes les plus courtes</h2>
<p>Un permis d’études depuis Haïti prend ${h.t(tm('study', C))}. La ligne indiquait ${h.d(st.first!, 'w')} dans la copie du ${h.day(st.firstDate!)} et s’est raccourcie dans les relevés de 2026. Les étudiants admis au Québec, destination la plus fréquente des étudiants haïtiens francophones, doivent obtenir le CAQ avant la demande à IRCC ; cette étape québécoise a son propre délai.</p>
<h2>Visites et travail</h2>
<p>Un visa de visiteur prend ${h.t(tm('visitor', C))}, au ${rankText('visitor', C, 'fr')} pays, après un relevé de ${h.d(vi.max)} le ${h.day(vi.maxDate)}. Les parents et grands-parents peuvent demander le ${h.a('super-visa', 'super visa')}, à ${h.t(tm('super-visa', C))} depuis Haïti, au ${rankText('super-visa', C, 'fr')} pays ; la ligne indiquait ${h.d(sv.first!)} le ${h.day(sv.firstDate!)}. Un permis de travail prend ${h.t(tm('work', C))}, contre ${h.d(wk.first!, 'w')} dans notre plus ancienne copie.</p>
<h2>Lire l’estimation pour un dossier familial</h2>
<p>Choisissez la ligne des enfants à charge et le mois où IRCC a reçu le parrainage. L’outil ajoute ${h.t(tm('child', C))} et dit à quelle distance vous êtes de cette date. Avec une ligne aussi longue, un petit changement hebdomadaire du chiffre déplace l’estimation de plusieurs semaines : comparez le résultat avec l’écart au relevé précédent. Dépasser la date n’est pas un refus : un dossier sur cinq prend plus longtemps que le délai publié. À ce moment, vérifiez dans votre compte qu’aucune demande ne vous a échappé, puis utilisez le formulaire Web d’IRCC ; la ${h.a('beyond-processing-time', 'page sur les demandes qui dépassent le délai')} liste les démarches.</p>
<h2>Haïti et son voisin</h2>
<p>À la même date, un résident de la République dominicaine attend ${DO('visitor', 'fr')} pour un visa de visiteur, ${DO('study', 'fr')} pour un permis d’études et ${DO('work', 'fr')} pour un permis de travail. Comparer les lignes n’aide que la personne qui réside légalement dans l’autre pays : IRCC applique la ligne du pays d’où l’on dépose.</p>
<p>Les deux pays n’ont pas la même ligne pour les enfants à charge : la République dominicaine ${K.daysOf(K.readingOf('child', 'DO').t) != null ? `affiche ${K.fmtTime(K.readingOf('child', 'DO').t, 'fr')}` : 'n’a pas de chiffre publié'}, alors qu’Haïti est le plus long des pays chiffrés.</p><h2>Biométrie et lieu de dépôt</h2>
<p>Chaque demande de visa ou de permis exige une biométrie donnée dans un centre de réception des demandes de visa, et cette attente n’entre pas dans le chiffre d’IRCC. Les Haïtiens qui résident légalement dans un autre pays déposent en général depuis ce pays, et c’est le chiffre de ce pays qui s’applique.</p>
`,
  },
});
