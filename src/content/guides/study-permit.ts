import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Permis d'études demandé hors du Canada (fichier par pays) et au Canada (ligne « CA » du même fichier). */
const P = 'study';
const rng = K.rangeOf(P)!;
const all = K.countriesOf(P).map((c) => [c, K.daysOf(K.readingOf(P, c).t)] as const).filter((x): x is readonly [string, number] => x[1] != null).sort((a, b) => a[1] - b[1]);
const medianW = Math.round(all[Math.floor(all.length / 2)][1] / 7);
const upTo4 = all.filter((x) => x[1] <= 28).length;
const over12 = all.filter((x) => x[1] > 84).length;
const t = (c: string) => K.readingOf(P, c).t;
const ser = (c: string) => `c:study:${c}`;
const inT = K.fullTrend(ser('IN'))!, cnT = K.fullTrend(ser('CN'))!, ngT = K.fullTrend(ser('NG'))!;
const inside = K.readingOf('study-inside');
const caT = K.fullTrend('c:study:CA')!;
const rankIN = all.findIndex((x) => x[0] === 'IN') + 1;
const D = K.L.dates.country;
const NREAD = K.readingsCount('country');
const E = K.en, F = K.fr;

function rows(h: Helpers) {
  const codes = K.MAJOR.filter((c) => K.countriesOf(P).includes(c) && K.daysOf(t(c)) != null);
  return codes.map((c) => {
    const tr = K.fullTrend(ser(c));
    return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.t(t(c)), tr?.firstDate ? `${h.d(tr.first!, 'w')} (${h.day(tr.firstDate)})` : '', tr ? `${h.d(tr.min, 'w')} (${h.day(tr.minDate)})` : ''];
  });
}

export default defineGuide({
  id: 'study-permit', group: 'study', order: 20,
  tool: 'delai', toolArg: { g: 'study', c: 'IN', only: 'study,study-inside,study-ext' },
  related: ['study-permit-extension', 'pgwp', 'work-permit', 'india', 'vietnam', 'nigeria'],
  sources: ['study-permit', 'ptimes-country', 'biometrics', 'wayback'],
  en: {
    slug: 'study-permit-processing-time',
    nav: 'Study permit', card: 'Weeks by country, inside Canada line, archive since 2024',
    title: 'Study Permit Processing Time by Country, Canada 2026',
    description: 'Study permit processing time in 2026 by country of filing, plus the line for permits requested inside Canada, with dated IRCC readings kept since May 2024.',
    h1: 'Study permit processing time, by country of filing',
    intro: `On ${E.day(D)} IRCC listed study permit times from ${K.fmtTime(rng.lo[1], 'en')} to ${K.fmtTime(rng.hi[1], 'en')}, across ${E.n(rng.n)} countries with a figure.`,
    resume: `A study permit requested from outside Canada currently takes ${K.fmtTime(t('IN'), 'en')} from India, ${K.fmtTime(t('CN'), 'en')} from China, ${K.fmtTime(t('VN'), 'en')} from Vietnam, ${K.fmtTime(t('PH'), 'en')} from the Philippines and ${K.fmtTime(t('NG'), 'en')} from Nigeria, according to the figures IRCC published on ${E.day(D)}. Of the ${E.n(all.length)} countries with a published time, the middle one sits at ${E.n(medianW)} weeks, ${E.n(upTo4)} are at four weeks or less and ${E.n(over12)} are above twelve weeks. The fastest line is ${K.countryName(rng.lo[0], 'en')} at ${K.fmtTime(rng.lo[1], 'en')}; the slowest is ${K.countryName(rng.hi[0], 'en')} at ${K.fmtTime(rng.hi[1], 'en')}. A permit requested from inside Canada, for instance by a visitor who has been admitted to a school, is a separate line at ${K.fmtTime(inside.t, 'en')}. Each figure is the time IRCC took for 80% of the files it decided recently, counted from receipt of a complete application, without the biometrics step. The tool adds that time to your filing date and shows the readings we have kept since ${E.day(K.firstReading('country'))}.`,
    faqs: [
      { q: 'How long is the study permit processing time from India right now?', a: `IRCC’s figure dated ${E.day(D)} is ${K.fmtTime(t('IN'), 'en')} for a study permit filed from India, which places India ${E.n(rankIN)}th of ${E.n(all.length)} countries from fastest to slowest. The oldest copy we hold, from ${E.day(inT.firstDate!)}, showed ${E.d(inT.first!, 'w')}. The lowest reading so far was ${E.d(inT.min, 'w')} on ${E.day(inT.minDate)}.` },
      { q: 'Is a study permit faster when requested from inside Canada?', a: `Not by much at the moment. The line for a study permit requested inside Canada reads ${K.fmtTime(inside.t, 'en')} on ${E.day(inside.date)}, against a middle value of ${E.n(medianW)} weeks for the countries abroad. That line was ${E.d(caT.first!, 'w')} on ${E.day(caT.firstDate!)} and ${E.d(caT.min, 'w')} on ${E.day(caT.minDate)}, so it has moved a lot.` },
      { q: 'Why does the study permit time jump before the fall intake?', a: 'Most students apply in spring and summer for a September start, so offices decide far more files in those months. Because IRCC publishes a past time, the figure climbs once that wave of files is being decided, then slowly comes back down. Applying early in the season puts your file ahead of the peak.' },
      { q: 'Does the study permit time include the letter of acceptance or the provincial attestation?', a: 'No. The clock starts only when IRCC receives a complete application, so the time spent getting a letter of acceptance from the school, and the provincial or territorial attestation letter where one is required, comes before it. Biometrics also sit outside the published time.' },
    ],
    body: (h) => `
<h2>Study permit times for the main countries of filing</h2>
<p>The table shows the countries that send the most students to Canada, with the figure IRCC published on ${h.day(D)}, the oldest copy in our archive and the lowest reading kept. The archive for this file has ${h.n(NREAD)} dated readings: one from ${h.day(K.firstReading('country'))}, one from ${h.day(K.HIST.readings.country[1].ircc)}, then a run of copies from ${h.day(K.HIST.readings.country[2].ircc)}. Nothing was preserved between those dates, so the table cannot say what happened during the gap and does not try to.</p>
${h.table(['Country', 'Published time', 'Oldest copy kept', 'Lowest reading'], rows(h), `Study permit requested from outside Canada, IRCC figure of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>Two patterns stand out. India went from ${h.d(inT.first!, 'w')} in ${h.my(inT.firstDate!)} to ${h.d(inT.min, 'w')} on ${h.day(inT.minDate)}, and is back at ${h.d(inT.last, 'w')} today. China climbed from ${h.d(cnT.min, 'w')} on ${h.day(cnT.minDate)} to ${h.d(cnT.last, 'w')} now. Nigeria, at ${h.t(t('NG'))}, is among the slower large senders. The rise since July across several countries matches the season: summer applications for a September start are being decided now.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'study', c: 'VN', m: 'none' }, t: 'Your study permit: estimated decision date' })}
<h2>Applying from inside Canada</h2>
<p>Some people can request a study permit without leaving the country: a visitor admitted to a program, a family member of a worker or student, or someone whose permit is being changed to a new level of study. IRCC publishes that case on a line coded Canada in the same file. It reads ${h.t(inside.t)} on ${h.day(inside.date)}.</p>
${h.hist('c:study:CA', { max: 10, unit: 'w' })}
<p>The swings on this line are larger than on most country lines: ${h.d(caT.first!, 'w')} in the first copy, ${h.d(caT.min, 'w')} a few months later, ${h.d(caT.last, 'w')} now. Extending a permit you already hold is a different request with its own weekly queue, covered on the ${h.a('study-permit-extension', 'study permit extension page')}.</p>
<h2>What happens before the clock starts</h2>
<p>The published time covers only the part IRCC controls. Before it, a student needs a letter of acceptance from a designated learning institution and, for most programs, an attestation letter from the province or territory. After submitting, IRCC sends a biometrics instruction letter; the appointment at a visa application centre can take days or weeks depending on the city. A medical exam may also be required depending on where you lived and the length of the program. None of these steps is in the published figure, which is why two students who apply the same day can get decisions weeks apart.</p>
<h2>Using the figure to plan a start date</h2>
<p>Take the date you expect to submit a complete application, add the time for your country, then add a margin for biometrics and one in five files that take longer than the published time. If the result lands after the start of your program, talk to the school early about a deferral rather than waiting on IRCC. After graduation, the work permit most graduates request from inside Canada falls under the line described on the ${h.a('pgwp', 'post-graduation work permit page')}. How the figures are collected and dated is set out on the ${h.a('method', 'method page')}.</p>
<h2>When the country in the list is not your passport</h2>
<p>The country IRCC uses is the one you apply from. An Indian citizen studying in the United Arab Emirates who applies from there is counted under the line for the United Arab Emirates, at ${h.t(t('AE'))}, not under India. Students who already live outside their home country should pick the country of legal residence in the tool, or the estimate will be off by the gap between the two lines.</p>
`,
  },
  fr: {
    slug: 'delai-permis-etudes',
    nav: 'Permis d’études', card: 'Semaines par pays, demande au Canada, archive depuis 2024',
    title: 'Délai du permis d’études par pays, relevé IRCC 2026',
    description: 'Délai du permis d’études en 2026 selon le pays de dépôt, ligne des permis demandés au Canada et relevés datés d’IRCC conservés depuis mai 2024, sans arrondi.',
    h1: 'Délai du permis d’études, selon le pays de dépôt',
    intro: `Le ${F.day(D)}, IRCC affichait des délais de ${K.fmtTime(rng.lo[1], 'fr')} à ${K.fmtTime(rng.hi[1], 'fr')} pour le permis d’études, sur ${F.n(rng.n)} pays chiffrés.`,
    resume: `Un permis d’études demandé hors du Canada prend aujourd’hui ${K.fmtTime(t('MA'), 'fr')} depuis le Maroc, ${K.fmtTime(t('DZ'), 'fr')} depuis l’Algérie, ${K.fmtTime(t('CM'), 'fr')} depuis le Cameroun, ${K.fmtTime(t('TN'), 'fr')} depuis la Tunisie et ${K.fmtTime(t('FR'), 'fr')} depuis la France, selon les chiffres publiés par IRCC le ${F.day(D)}. Sur les ${F.n(all.length)} pays qui ont un délai, celui du milieu est à ${F.n(medianW)} semaines ; ${F.n(upTo4)} sont à quatre semaines ou moins et ${F.n(over12)} dépassent douze semaines. Le plus rapide est ${K.countryName(rng.lo[0], 'fr')}, à ${K.fmtTime(rng.lo[1], 'fr')} ; le plus lent est ${K.countryName(rng.hi[0], 'fr')}, à ${K.fmtTime(rng.hi[1], 'fr')}. Un permis demandé depuis le Canada, par exemple par un visiteur admis dans un établissement, suit une ligne distincte, à ${K.fmtTime(inside.t, 'fr')}. Chaque chiffre est le temps qu’il a fallu à IRCC pour 80 % des dossiers tranchés récemment, compté dès la réception d’une demande complète, biométrie exclue. L’outil ajoute ce délai à votre date de dépôt et montre nos relevés depuis le ${F.day(K.firstReading('country'))}.`,
    faqs: [
      { q: 'Quel est le délai du permis d’études depuis le Maroc en ce moment ?', a: `Le chiffre d’IRCC du ${F.day(D)} est de ${K.fmtTime(t('MA'), 'fr')} pour un permis d’études déposé depuis le Maroc. La plus ancienne copie de notre archive, du ${F.day(K.fullTrend(ser('MA'))!.firstDate!)}, indiquait ${F.d(K.fullTrend(ser('MA'))!.first!, 'w')}. Ajoutez le temps de la biométrie et d’un éventuel examen médical, qui ne sont pas compris.` },
      { q: 'Le permis d’études va-t-il plus vite s’il est demandé au Canada ?', a: `Pas beaucoup en ce moment. La ligne du permis d’études demandé au Canada indique ${K.fmtTime(inside.t, 'fr')} au ${F.day(inside.date)}, contre ${F.n(medianW)} semaines pour le pays du milieu à l’étranger. Elle était à ${F.d(caT.first!, 'w')} le ${F.day(caT.firstDate!)} et à ${F.d(caT.min, 'w')} le ${F.day(caT.minDate)} : elle bouge beaucoup.` },
      { q: 'Pourquoi le délai du permis d’études grimpe-t-il avant la rentrée ?', a: 'La plupart des étudiants déposent au printemps et en été pour une rentrée en septembre. Les bureaux tranchent alors bien plus de dossiers, et comme IRCC publie un délai passé, le chiffre monte au moment où cette vague est traitée, puis redescend lentement. Déposer tôt dans la saison place le dossier avant le pic.' },
      { q: 'Le délai du permis d’études comprend-il le CAQ pour le Québec ?', a: 'Non. Pour étudier au Québec, il faut d’abord obtenir le certificat d’acceptation du Québec délivré par le ministère québécois de l’Immigration ; ce temps précède la demande à IRCC. Le délai publié ne démarre qu’à la réception d’une demande complète, CAQ joint, et ne compte pas la biométrie.' },
    ],
    body: (h) => `
<h2>Délais des pays francophones et des grands pays de dépôt</h2>
<p>Le tableau reprend les pays qui envoient le plus d’étudiants au Canada, avec le chiffre publié par IRCC le ${h.day(D)}, la plus ancienne copie de notre archive et le relevé le plus bas. L’archive de ce fichier compte ${h.n(NREAD)} relevés datés : un du ${h.day(K.firstReading('country'))}, un du ${h.day(K.HIST.readings.country[1].ircc)}, puis une suite de copies à partir du ${h.day(K.HIST.readings.country[2].ircc)}. Rien n’a été conservé entre ces dates : le tableau ne dit donc rien de ce qui s’est passé dans cet intervalle.</p>
${h.table(['Pays', 'Délai publié', 'Plus ancienne copie', 'Relevé le plus bas'], rows(h), `Permis d’études demandé hors du Canada, chiffre d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>Pour les candidats francophones, l’écart entre pays voisins est net : la France est à ${h.t(t('FR'))}, la Tunisie à ${h.t(t('TN'))}, l’Algérie à ${h.t(t('DZ'))}, le Maroc à ${h.t(t('MA'))} et le Cameroun à ${h.t(t('CM'))}. Ailleurs, l’Inde est passée de ${h.d(inT.first!, 'w')} en ${h.my(inT.firstDate!)} à ${h.d(inT.min, 'w')} le ${h.day(inT.minDate)}, avant de remonter à ${h.d(inT.last, 'w')}. La hausse observée depuis juillet dans plusieurs pays correspond à la saison des demandes pour septembre.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'study', c: 'CM', m: 'none' }, t: 'Votre permis d’études : date de décision estimée' })}
<h2>La demande faite depuis le Canada</h2>
<p>Certaines personnes peuvent demander un permis d’études sans quitter le pays : un visiteur admis dans un programme, un membre de la famille d’un travailleur ou d’un étudiant, ou un étudiant qui change de niveau d’études. IRCC publie ce cas sur une ligne codée Canada dans le même fichier. Elle indique ${h.t(inside.t)} au ${h.day(inside.date)}.</p>
${h.hist('c:study:CA', { max: 10, unit: 'w' })}
<p>Les écarts sont plus forts que sur la plupart des lignes de pays : ${h.d(caT.first!, 'w')} dans la première copie, ${h.d(caT.min, 'w')} quelques mois plus tard, ${h.d(caT.last, 'w')} aujourd’hui. Prolonger un permis que l’on détient déjà est une autre demande, avec sa propre file hebdomadaire, traitée sur la ${h.a('study-permit-extension', 'page de la prolongation du permis d’études')}.</p>
<h2>Les étapes avant le compteur d’IRCC</h2>
<p>Le délai publié ne couvre que la part d’IRCC. Avant, il faut une lettre d’acceptation d’un établissement désigné et, pour la plupart des programmes, une lettre d’attestation de la province ou du territoire. Au Québec, cette attestation prend la forme du certificat d’acceptation du Québec, demandé au gouvernement québécois avant le dépôt fédéral. Après l’envoi, IRCC adresse une lettre de biométrie ; le rendez-vous au centre de réception des demandes de visa peut prendre plusieurs jours, voire des semaines, selon la ville. Un examen médical peut aussi être exigé selon le pays de résidence et la durée du programme.</p>
<h2>Caler sa rentrée sur le chiffre publié</h2>
<p>Partez de la date où la demande complète partira, ajoutez le délai de votre pays, puis une marge pour la biométrie et pour la demande sur cinq qui dépasse le délai publié. Si la date obtenue tombe après le début des cours, voyez tôt avec l’établissement la possibilité d’un report. Après les études, le permis de travail que la plupart des diplômés demandent au Canada relève de la ligne décrite sur la ${h.a('pgwp', 'page du permis de travail postdiplôme')}. La façon dont les chiffres sont relevés et datés est expliquée sur la ${h.a('method', 'page de méthode')}.</p>
<h2>Résider ailleurs que dans son pays de nationalité</h2>
<p>Le pays retenu par IRCC est celui depuis lequel vous déposez. Un Camerounais qui réside légalement en France et dépose depuis la France relève de la ligne française, à ${h.t(t('FR'))}, et non de celle du Cameroun. Choisissez dans l’outil le pays de résidence légale, sinon l’estimation sera fausse de tout l’écart entre les deux lignes.</p>
`,
  },
});
