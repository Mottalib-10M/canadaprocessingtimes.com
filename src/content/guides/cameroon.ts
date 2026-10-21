import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tm, tr, rankText, median, lines, ser } from './_pays';

/* Cameroun : un visa de visiteur sorti d'une attente de près d'un an, un super visa qui remonte, des enfants qui attendent. */
const C = 'CM';
const D = K.L.dates.country;
const E = K.en, F = K.fr;
const vi = tr('visitor', C)!, sv = tr('super-visa', C)!, st = tr('study', C)!, ch = tr('child', C)!;
const ft = (g: 'visitor' | 'super-visa' | 'study' | 'work' | 'child', l: 'en' | 'fr') => K.fmtTime(tm(g, C), l);
const sv26 = K.points(ser('super-visa', C)).filter((p) => p.date >= '2026-01-01');
const svLow = sv26.reduce((a, p) => (p.v < a.v ? p : a), sv26[0]);
const childAll = K.countriesOf('child').filter((x) => K.daysOf(K.readingOf('child', x).t) != null).length;

export default defineGuide({
  id: 'cameroon', group: 'countries', order: 112, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['visitor-visa', 'super-visa', 'dependent-child', 'study-permit', 'algeria', 'haiti'],
  sources: ['ptimes-country', 'visit', 'super-visa', 'spouse', 'wayback'],
  en: {
    slug: 'processing-times-cameroon',
    nav: 'Cameroon', card: 'Visitor visa down from almost a year, super visa rising, children',
    title: 'Visitor Visa and Super Visa Times from Cameroon, 2026',
    description: 'Canadian visitor visa, super visa, study permit, work permit and child sponsorship times for applicants in Cameroon in 2026, with IRCC readings since 2024.',
    h1: 'Processing times for applications filed from Cameroon',
    intro: `A visitor visa from Cameroon takes ${ft('visitor', 'en')} in IRCC’s file of ${E.day(D)}, against ${E.d(vi.max)} in the copy of ${E.day(vi.maxDate)}.`,
    resume: `Applications filed from Cameroon currently read ${ft('visitor', 'en')} for a visitor visa, ${ft('super-visa', 'en')} for a super visa, ${ft('study', 'en')} for a study permit, ${ft('work', 'en')} for a work permit and ${ft('child', 'en')} for sponsoring a dependent child, in IRCC’s country file of ${E.day(D)}. The visitor visa is the striking line: our copies dated ${E.day(vi.firstDate!)} and ${E.day(vi.maxDate)} showed ${E.d(vi.first!)} and ${E.d(vi.max)}, close to a year, while every reading since July 2026 has been under two months. The super visa moves the other way, from ${E.d(svLow.v)} on ${E.day(svLow.date)} to ${E.d(sv.last)} today, which puts Cameroon ${rankText('super-visa', C, 'en')} countries with a figure. Children sponsored from Cameroon wait ${ft('child', 'en')}, one of only ${E.n(childAll)} countries with a published child time. These are past times, the delay within which 80% of recent files were decided, counted from receipt of a complete application and excluding biometrics.`,
    faqs: [
      { q: 'Why did the visitor visa from Cameroon take almost a year in 2024?', a: `IRCC does not explain individual lines. What its files show is ${E.d(vi.first!)} on ${E.day(vi.firstDate!)} and ${E.d(vi.max)} on ${E.day(vi.maxDate)}, then readings under two months from July 2026. The archive has no copy between March 2025 and July 2026, so the timing of the drop inside that gap is not known and is not drawn.` },
      { q: 'How long does a super visa take from Cameroon now?', a: `${ft('super-visa', 'en')} in IRCC’s file of ${E.day(D)}, up from ${E.d(svLow.v)} in the reading of ${E.day(svLow.date)}. The rise has lasted several weekly readings. The host in Canada must show income above the required threshold and the parent needs private medical insurance, so start gathering those documents before applying.` },
      { q: 'How long does it take to sponsor a child living in Cameroon?', a: `IRCC publishes ${ft('child', 'en')} for dependent children sponsored from Cameroon, counted from the day it receives the complete sponsorship and permanent residence application. Only ${E.n(childAll)} countries have a published figure for this line; the others are marked as not having enough data.` },
    ],
    body: (h) => `
<h2>Every line from Cameroon</h2>
${lines(h, C, ['visitor', 'super-visa', 'study', 'work', 'child'])}
<h2>The visitor visa after the long wait</h2>
<p>The two oldest copies of IRCC’s country file we could find tell of a very long wait: ${h.d(vi.first!)} on ${h.day(vi.firstDate!)}, then ${h.d(vi.max)} on ${h.day(vi.maxDate)}. A family member invited for a graduation or a birth could not plan around such a delay. The next copy we have dates from July 2026 and shows a different line altogether, under two months, and the weekly readings since have stayed there. At ${h.t(tm('visitor', C))}, Cameroon now ranks ${rankText('visitor', C, 'en')} countries.</p>
${h.hist(ser('visitor', C), { max: 10 })}
<p>Between ${h.day(vi.maxDate)} and July 2026 there is no copy, so the archive draws nothing: the drop happened somewhere in that span, and the site does not guess when.</p>
${h.mini('delai', { p: ['m'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visitor visa from Cameroon: your date' })}
<h2>A super visa that is getting slower</h2>
<p>Parents and grandparents applying for the ${h.a('super-visa', 'super visa')} from Cameroon face the opposite trend. The line was ${h.d(svLow.v)} on ${h.day(svLow.date)} and has risen at most readings since, to ${h.d(sv.last)}. The middle value among countries is ${h.d(median('super-visa'))}. A family that wants a parent in Canada for a specific date can apply for an ordinary visitor visa instead, which is currently faster, at the cost of shorter stays.</p>
${h.hist(ser('super-visa', C), { max: 8 })}
<h2>Children and students</h2>
<p>Sponsoring a dependent child who lives in Cameroon takes ${h.t(tm('child', C))}, ${rankText('child', C, 'en')} countries with a published figure; the line read ${h.d(ch.first!, 'm')} in our oldest copy, dated ${h.day(ch.firstDate!)}. That time covers the whole permanent residence file, from receipt to decision. The ${h.a('dependent-child', 'dependent child page')} compares it with other countries.</p>
<p>A study permit takes ${h.t(tm('study', C))}, ${rankText('study', C, 'en')} countries, after ${h.d(st.first!, 'w')} on ${h.day(st.firstDate!)}. Students admitted in Quebec also need the CAQ before applying to IRCC.</p>
<h2>Work permits</h2>
<p>A work permit requested from Cameroon takes ${h.t(tm('work', C))}, ${rankText('work', C, 'en')} countries. In the copy of ${h.day(tr('work', C)!.firstDate!)} it read ${h.d(tr('work', C)!.first!, 'w')}, so this line too is far shorter than in 2024. Most permits tied to a job need the employer’s Labour Market Impact Assessment first, and caregivers, farm workers and francophone workers hired outside Quebec each have their own route; the published time starts only once IRCC holds the complete application.</p>
<h2>Using the estimate</h2>
<p>Pick the line and the month IRCC received your file. The result adds the published time and tells you whether that date is still ahead. Because the Cameroon lines have moved so much, look at the change since the previous reading as well: a time that rose last week may keep rising for a while, and the date you get today may slip.</p>
<h2>Residence decides the line</h2>
<p>Cameroonians who live legally in another country, such as Nigeria, Côte d’Ivoire or France, usually apply from there and fall under that country’s figure. The tool lets you switch between countries to see the difference before you file.</p>
`,
  },
  fr: {
    slug: 'delais-cameroun',
    nav: 'Cameroun', card: 'Visa de visiteur sorti d’une attente de près d’un an, super visa en hausse, enfants',
    title: 'Délai visa visiteur et super visa depuis le Cameroun, 2026',
    description: 'Délais canadiens du visa de visiteur, du super visa, des permis d’études et de travail et du parrainage d’enfant depuis le Cameroun en 2026, relevés IRCC datés.',
    h1: 'Délais des demandes déposées depuis le Cameroun',
    intro: `Un visa de visiteur depuis le Cameroun prend ${ft('visitor', 'fr')} dans le fichier d’IRCC du ${F.day(D)}, contre ${F.d(vi.max)} dans la copie du ${F.day(vi.maxDate)}.`,
    resume: `Les demandes déposées depuis le Cameroun indiquent en ce moment ${ft('visitor', 'fr')} pour un visa de visiteur, ${ft('super-visa', 'fr')} pour un super visa, ${ft('study', 'fr')} pour un permis d’études, ${ft('work', 'fr')} pour un permis de travail et ${ft('child', 'fr')} pour le parrainage d’un enfant à charge, d’après le fichier par pays d’IRCC du ${F.day(D)}. Le visa de visiteur est la ligne la plus frappante : nos copies du ${F.day(vi.firstDate!)} et du ${F.day(vi.maxDate)} indiquaient ${F.d(vi.first!)} et ${F.d(vi.max)}, près d’un an, alors que chaque relevé depuis juillet 2026 est sous les deux mois. Le super visa va dans l’autre sens, de ${F.d(svLow.v)} le ${F.day(svLow.date)} à ${F.d(sv.last)} aujourd’hui, ce qui place le Cameroun au ${rankText('super-visa', C, 'fr')} pays chiffrés. Un enfant parrainé depuis le Cameroun attend ${ft('child', 'fr')}, l’un des ${F.n(childAll)} seuls pays qui ont un délai publié pour cette ligne. Ce sont des délais passés, le temps dans lequel 80 % des dossiers récents ont été tranchés, compté à partir de la réception d’une demande complète, sans la biométrie.`,
    faqs: [
      { q: 'Pourquoi le visa de visiteur depuis le Cameroun prenait-il près d’un an en 2024 ?', a: `IRCC n’explique pas ses lignes une à une. Ses fichiers montrent ${F.d(vi.first!)} le ${F.day(vi.firstDate!)} et ${F.d(vi.max)} le ${F.day(vi.maxDate)}, puis des relevés sous les deux mois à partir de juillet 2026. L’archive n’a aucune copie entre mars 2025 et juillet 2026 : le moment de la baisse dans cet intervalle n’est pas connu et n’est pas tracé.` },
      { q: 'Combien de temps prend un super visa depuis le Cameroun aujourd’hui ?', a: `${ft('super-visa', 'fr')} dans le fichier d’IRCC du ${F.day(D)}, contre ${F.d(svLow.v)} au relevé du ${F.day(svLow.date)}. La hausse dure depuis plusieurs relevés hebdomadaires. L’hôte au Canada doit prouver un revenu au-dessus du seuil exigé et le parent doit avoir une assurance médicale privée : réunissez ces pièces avant de déposer.` },
      { q: 'Combien de temps pour parrainer un enfant qui vit au Cameroun ?', a: `IRCC publie ${ft('child', 'fr')} pour un enfant à charge parrainé depuis le Cameroun, à compter de la réception de la demande complète de parrainage et de résidence permanente. Seuls ${F.n(childAll)} pays ont un chiffre publié pour cette ligne ; les autres sont marqués comme manquant de données.` },
    ],
    body: (h) => `
<h2>Toutes les lignes depuis le Cameroun</h2>
${lines(h, C, ['visitor', 'super-visa', 'study', 'work', 'child'])}
<h2>Le visa de visiteur après la longue attente</h2>
<p>Les deux plus anciennes copies du fichier par pays d’IRCC que nous avons trouvées racontent une très longue attente : ${h.d(vi.first!)} le ${h.day(vi.firstDate!)}, puis ${h.d(vi.max)} le ${h.day(vi.maxDate)}. Un parent invité pour une remise de diplôme ou une naissance ne pouvait pas s’organiser avec un tel délai. La copie suivante date de juillet 2026 et montre une tout autre ligne, sous les deux mois, et les relevés hebdomadaires depuis y sont restés. À ${h.t(tm('visitor', C))}, le Cameroun se classe au ${rankText('visitor', C, 'fr')} pays.</p>
${h.hist(ser('visitor', C), { max: 10 })}
<p>Entre le ${h.day(vi.maxDate)} et juillet 2026, il n’existe aucune copie : l’archive ne trace rien. La baisse a eu lieu quelque part dans cet intervalle, et le site ne devine pas quand.</p>
${h.mini('delai', { p: ['m'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visa de visiteur depuis le Cameroun : votre date' })}
<h2>Un super visa qui ralentit</h2>
<p>Les parents et grands-parents qui demandent le ${h.a('super-visa', 'super visa')} depuis le Cameroun vivent la tendance inverse. La ligne était à ${h.d(svLow.v)} le ${h.day(svLow.date)} et a monté à la plupart des relevés suivants, jusqu’à ${h.d(sv.last)}. La valeur médiane des pays est de ${h.d(median('super-visa'))}. Une famille qui veut un parent au Canada à une date précise peut demander plutôt un visa de visiteur ordinaire, plus rapide en ce moment, au prix de séjours plus courts.</p>
${h.hist(ser('super-visa', C), { max: 8 })}
<h2>Enfants et étudiants</h2>
<p>Parrainer un enfant à charge qui vit au Cameroun prend ${h.t(tm('child', C))}, ${rankText('child', C, 'fr')} pays chiffrés ; la ligne indiquait ${h.d(ch.first!, 'm')} dans notre plus ancienne copie, datée du ${h.day(ch.firstDate!)}. Ce délai couvre tout le dossier de résidence permanente, de la réception à la décision. La ${h.a('dependent-child', 'page des enfants à charge')} le compare aux autres pays.</p>
<p>Un permis d’études prend ${h.t(tm('study', C))}, ${rankText('study', C, 'fr')} pays, après ${h.d(st.first!, 'w')} le ${h.day(st.firstDate!)}. Les étudiants admis au Québec doivent aussi obtenir le CAQ avant la demande à IRCC.</p>
<h2>Permis de travail</h2>
<p>Un permis de travail demandé depuis le Cameroun prend ${h.t(tm('work', C))}, ${rankText('work', C, 'fr')} pays. Dans la copie du ${h.day(tr('work', C)!.firstDate!)}, la ligne indiquait ${h.d(tr('work', C)!.first!, 'w')} : elle aussi est bien plus courte qu’en 2024. La plupart des permis liés à un emploi exigent d’abord l’étude d’impact sur le marché du travail de l’employeur, et les aides familiaux, les travailleurs agricoles ou les travailleurs francophones embauchés hors du Québec ont chacun leur voie ; le délai publié ne commence qu’une fois la demande complète entre les mains d’IRCC.</p>
<h2>Se servir de l’estimation</h2>
<p>Choisissez la ligne et le mois où IRCC a reçu votre dossier. Le résultat ajoute le délai publié et dit si la date obtenue est encore devant vous. Comme les lignes du Cameroun ont beaucoup bougé, regardez aussi l’écart avec le relevé précédent : un délai qui a monté la semaine dernière peut continuer un moment, et la date obtenue aujourd’hui peut reculer.</p>
<h2>La résidence décide de la ligne</h2>
<p>Les Camerounais qui résident légalement dans un autre pays, comme le Nigeria, la Côte d’Ivoire ou la France, déposent en général depuis ce pays et relèvent de son chiffre. L’outil permet de passer d’un pays à l’autre pour voir l’écart avant de déposer.</p>
`,
  },
});
