import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tm, tr, unit, rankText, median, lines, ser } from './_pays';

/* Maroc : le visa de visiteur, passé d'une attente de plusieurs mois à quelques semaines, puis études et travail. */
const C = 'MA';
const D = K.L.dates.country;
const E = K.en, F = K.fr;
const vi = tr('visitor', C)!, sv = tr('super-visa', C)!, st = tr('study', C)!, wk = tr('work', C)!;
const R = K.HIST.readings.country;
const at = (s: string, d: string) => K.points(s).find((p) => p.date === d)?.v;
const vi25 = at(ser('visitor', C), R[1].ircc);
const ft = (g: 'visitor' | 'super-visa' | 'study' | 'work' | 'child', l: 'en' | 'fr') => K.fmtTime(tm(g, C), l);

export default defineGuide({
  id: 'morocco', group: 'countries', order: 110, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['visitor-visa', 'study-permit', 'super-visa', 'quebec-skilled-worker', 'algeria', 'tunisia'],
  sources: ['ptimes-country', 'visit', 'study-permit', 'biometrics', 'wayback'],
  en: {
    slug: 'processing-times-morocco',
    nav: 'Morocco', card: 'Visitor visa back to weeks, study and work lines from Morocco',
    title: 'Visitor Visa and Study Permit Times from Morocco, 2026',
    description: 'Canadian visitor visa, super visa, study permit and work permit processing times for applicants in Morocco in 2026, with every dated IRCC reading since 2024.',
    h1: 'Processing times for applications filed from Morocco',
    intro: `A visitor visa from Morocco takes ${ft('visitor', 'en')} in IRCC’s file of ${E.day(D)}; the oldest copy we keep showed ${E.d(vi.first!)}.`,
    resume: `From Morocco, IRCC’s country file of ${E.day(D)} gives ${ft('visitor', 'en')} for a visitor visa, ${ft('super-visa', 'en')} for a parent and grandparent super visa, ${ft('study', 'en')} for a study permit and ${ft('work', 'en')} for a work permit. The visitor line is the one that changed most: the copy of IRCC’s file dated ${E.day(vi.firstDate!)} showed ${E.d(vi.first!)}, the one dated ${E.day(R[1].ircc)} showed ${E.d(vi25 ?? vi.first!)}, and the figure has stayed between ${E.d(vi.min)} and ${E.d(K.points(ser('visitor', C)).filter((p) => p.date >= '2026-01-01').reduce((a, p) => Math.max(a, p.v), 0))} in every reading of 2026. The super visa is ${rankText('super-visa', C, 'en')} countries with a figure. The study permit is the weak spot, ${rankText('study', C, 'en')}, against a middle value of ${E.d(median('study'), 'w')}. All four are past times, the delay within which IRCC finished 80% of recent applications from Morocco, counted from receipt of a complete application and without the biometrics appointment.`,
    faqs: [
      { q: 'How long does a Canada study permit take from Morocco?', a: `IRCC’s figure of ${E.day(D)} is ${ft('study', 'en')}. It was ${E.d(st.first!, 'w')} in our oldest copy, dated ${E.day(st.firstDate!)}, and has moved between ${E.d(st.min, 'w')} and ${E.d(st.max, 'w')} since. Plan for the biometrics appointment on top, and count from the day IRCC received the complete application, not from the letter of acceptance.` },
      { q: 'Is the super visa faster than a visitor visa from Morocco?', a: `Right now the two are close: ${ft('super-visa', 'en')} for the super visa and ${ft('visitor', 'en')} for a visitor visa. That is unusual; in most countries the super visa takes far longer. The super visa needs proof of the host’s income and private medical insurance, so the time to gather documents often matters more than IRCC’s delay.` },
      { q: 'Which line applies to a Moroccan living in Spain or France?', a: 'The line of the country you apply from, normally where you legally reside. A Moroccan citizen who lives in Spain and applies from there falls under the figure for Spain. The tool lets you compare both lines before you decide where to file, if you have that choice.' },
    ],
    body: (h) => `
<h2>Five lines, one country</h2>
${lines(h, C, ['visitor', 'super-visa', 'study', 'work', 'child'])}
<p>The dependent child line has no published time for Morocco: IRCC marks it as not enough data, which happens when too few files were decided recently. In that case the site shows nothing rather than borrowing another country’s figure.</p>
<h2>The visitor visa: from months to weeks</h2>
<p>In the oldest copy of IRCC’s country file that we could find, dated ${h.day(vi.firstDate!)}, a visitor visa from Morocco took ${h.d(vi.first!)}. Families planning a summer visit then had to apply in winter. The next copy, dated ${h.day(R[1].ircc)}, already showed ${h.d(vi25 ?? vi.first!)}, and every reading of 2026 has been in a band of a few weeks. The latest figure, ${h.t(tm('visitor', C))}, puts Morocco ${rankText('visitor', C, 'en')} countries.</p>
${h.hist(ser('visitor', C), { max: 10 })}
<p>The gap between the copies of ${h.day(vi.firstDate!)} and ${h.day(R[1].ircc)} is wide, and the archive has no point in between: nothing is drawn across that gap. What can be said is that the level of 2024 is not the level of today.</p>
${h.mini('delai', { p: ['m'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visitor visa from Morocco: your date' })}
<h2>Study permits: slower than most</h2>
<p>For students, the picture is less comfortable. At ${h.t(tm('study', C))}, Morocco sits ${rankText('study', C, 'en')} countries with a study figure. The line has not fallen the way the visitor line did: it read ${h.d(st.first!, 'w')} on ${h.day(st.firstDate!)} and ${h.d(st.last, 'w')} now. Quebec-bound students also need a Quebec acceptance certificate (CAQ) before applying to IRCC, which comes on top of the federal time. A student who wants to start in September and applies in June is therefore cutting it close.</p>
<p>Once in Canada, an extension is processed by a separate office with its own weekly queue: see the ${h.a('study-permit-extension', 'study permit extension')} page.</p>
<h2>Work permits and super visas</h2>
<p>Work permits requested from Morocco take ${h.t(tm('work', C))}, ${rankText('work', C, 'en')} countries; the line has eased from ${h.d(wk.first!, 'w')} in the copy of ${h.day(wk.firstDate!)}. Employer-specific permits usually follow a Labour Market Impact Assessment that the employer obtains first, and that step is not in IRCC’s figure. The super visa, at ${h.t(tm('super-visa', C))}, is among the fastest anywhere, after reading ${h.d(sv.first!)} in the copy of ${h.day(sv.firstDate!)}.</p>
<h2>Giving biometrics</h2>
<p>Every visa and permit application from Morocco needs fingerprints and a photo, given at a visa application centre after IRCC sends the instruction letter. IRCC’s published time does not include the wait for that appointment, so the date the tool gives you moves back by the number of days between your application and your biometrics.</p>
<h2>Reading the result for a Moroccan file</h2>
<p>Choose the line, then the month IRCC received your application. If the date shown is still ahead, you are within the time that 80% of recent Moroccan files needed. If it is behind you, the result says by how many days, which is the point where a question through IRCC’s web form becomes reasonable. The table under the result compares Morocco with the main countries of filing on the same day, so a rise that hits every country can be told apart from one that concerns Moroccan files only.</p>
`,
  },
  fr: {
    slug: 'delais-maroc',
    nav: 'Maroc', card: 'Visa de visiteur revenu à quelques semaines, études et travail depuis le Maroc',
    title: 'Délai visa visiteur et permis d’études depuis le Maroc, 2026',
    description: 'Délais canadiens du visa de visiteur, du super visa et des permis d’études et de travail pour une demande déposée au Maroc en 2026, relevés IRCC datés.',
    h1: 'Délais des demandes déposées depuis le Maroc',
    intro: `Un visa de visiteur depuis le Maroc prend ${ft('visitor', 'fr')} dans le fichier d’IRCC du ${F.day(D)} ; la plus ancienne copie que nous gardons indiquait ${F.d(vi.first!)}.`,
    resume: `Depuis le Maroc, le fichier par pays d’IRCC du ${F.day(D)} donne ${ft('visitor', 'fr')} pour un visa de visiteur, ${ft('super-visa', 'fr')} pour le super visa des parents et grands-parents, ${ft('study', 'fr')} pour un permis d’études et ${ft('work', 'fr')} pour un permis de travail. C’est la ligne du visa de visiteur qui a le plus changé : la copie du fichier d’IRCC datée du ${F.day(vi.firstDate!)} indiquait ${F.d(vi.first!)}, celle du ${F.day(R[1].ircc)} ${F.d(vi25 ?? vi.first!)}, et chaque relevé de 2026 est resté entre ${F.d(vi.min)} et ${F.d(K.points(ser('visitor', C)).filter((p) => p.date >= '2026-01-01').reduce((a, p) => Math.max(a, p.v), 0))}. Le super visa est au ${rankText('super-visa', C, 'fr')} pays chiffrés. Le permis d’études est le point faible : ${rankText('study', C, 'fr')} pays, pour une valeur médiane de ${F.d(median('study'), 'w')}. Ce sont quatre délais passés, le temps dans lequel IRCC a terminé 80 % des demandes récentes venues du Maroc, compté à partir de la réception d’une demande complète et sans le rendez-vous de biométrie.`,
    faqs: [
      { q: 'Combien de temps faut-il pour un permis d’études depuis le Maroc ?', a: `Le chiffre d’IRCC du ${F.day(D)} est de ${ft('study', 'fr')}. Il était de ${F.d(st.first!, 'w')} dans notre plus ancienne copie, datée du ${F.day(st.firstDate!)}, et a varié entre ${F.d(st.min, 'w')} et ${F.d(st.max, 'w')} depuis. Prévoyez la biométrie en plus et, pour le Québec, le CAQ avant la demande fédérale. Le délai court à partir de la réception de la demande complète.` },
      { q: 'Le super visa est-il plus rapide qu’un visa de visiteur depuis le Maroc ?', a: `En ce moment les deux sont proches : ${ft('super-visa', 'fr')} pour le super visa et ${ft('visitor', 'fr')} pour un visa de visiteur. C’est rare ; dans la plupart des pays, le super visa prend bien plus longtemps. Il exige la preuve du revenu de l’hôte et une assurance médicale privée : réunir ces pièces prend souvent plus de temps que le traitement.` },
      { q: 'Quelle ligne s’applique à un Marocain qui vit en Espagne ou en France ?', a: 'Celle du pays d’où vous déposez, en général votre pays de résidence légale. Un citoyen marocain qui vit en France et dépose depuis la France relève du chiffre de la France. L’outil permet de comparer les deux lignes avant de choisir où déposer, si vous avez ce choix.' },
    ],
    body: (h) => `
<h2>Cinq lignes, un pays</h2>
${lines(h, C, ['visitor', 'super-visa', 'study', 'work', 'child'])}
<p>La ligne des enfants à charge n’a pas de délai publié pour le Maroc : IRCC la marque comme manquant de données, ce qui arrive quand trop peu de dossiers ont été tranchés récemment. Le site n’affiche alors rien plutôt que d’emprunter le chiffre d’un autre pays.</p>
<h2>Le visa de visiteur : des mois aux semaines</h2>
<p>Dans la plus ancienne copie du fichier par pays d’IRCC que nous avons trouvée, datée du ${h.day(vi.firstDate!)}, un visa de visiteur depuis le Maroc prenait ${h.d(vi.first!)}. Une famille qui prévoyait une visite l’été devait déposer en hiver. La copie suivante, datée du ${h.day(R[1].ircc)}, indiquait déjà ${h.d(vi25 ?? vi.first!)}, et chaque relevé de 2026 tient dans une fourchette de quelques semaines. Le dernier chiffre, ${h.t(tm('visitor', C))}, place le Maroc au ${rankText('visitor', C, 'fr')} pays.</p>
${h.hist(ser('visitor', C), { max: 10 })}
<p>L’écart entre les copies du ${h.day(vi.firstDate!)} et du ${h.day(R[1].ircc)} est grand, et l’archive n’a aucun point entre les deux : rien n’est tracé à travers ce trou. Ce que l’on peut dire, c’est que le niveau de 2024 n’est plus celui d’aujourd’hui.</p>
${h.mini('delai', { p: ['m'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visa de visiteur depuis le Maroc : votre date' })}
<h2>Permis d’études : plus lent que la plupart</h2>
<p>Pour les étudiants, le tableau est moins favorable. À ${h.t(tm('study', C))}, le Maroc se classe au ${rankText('study', C, 'fr')} pays qui ont un chiffre. La ligne n’a pas baissé comme celle du visa de visiteur : elle indiquait ${h.d(st.first!, 'w')} le ${h.day(st.firstDate!)} et ${h.d(st.last, 'w')} aujourd’hui. Pour étudier au Québec, il faut aussi le certificat d’acceptation du Québec (CAQ) avant la demande à IRCC, et ce délai s’ajoute au délai fédéral. Un étudiant qui vise une rentrée en septembre et dépose en juin prend donc un risque.</p>
<p>Une fois au Canada, une prolongation passe par un autre bureau, avec sa propre file hebdomadaire : voir la page de la ${h.a('study-permit-extension', 'prolongation du permis d’études')}.</p>
<h2>Permis de travail et super visa</h2>
<p>Un permis de travail demandé depuis le Maroc prend ${h.t(tm('work', C))}, ${rankText('work', C, 'fr')} pays ; la ligne s’est détendue depuis les ${h.d(wk.first!, 'w')} de la copie du ${h.day(wk.firstDate!)}. Un permis lié à un employeur suit en général une étude d’impact sur le marché du travail que l’employeur obtient d’abord, et cette étape n’est pas comprise dans le chiffre d’IRCC. Le super visa, à ${h.t(tm('super-visa', C))}, est parmi les plus rapides au monde, après ${h.d(sv.first!)} dans la copie du ${h.day(sv.firstDate!)}.</p>
<h2>La biométrie</h2>
<p>Toute demande de visa ou de permis faite depuis le Maroc exige empreintes et photo, données dans un centre de réception des demandes de visa après la lettre d’instruction d’IRCC. Le délai publié ne compte pas l’attente de ce rendez-vous : la date donnée par l’outil recule du nombre de jours entre votre demande et votre biométrie.</p>
<h2>Lire le résultat pour un dossier marocain</h2>
<p>Choisissez la ligne, puis le mois où IRCC a reçu votre demande. Si la date affichée est encore devant vous, vous êtes dans le temps qu’il a fallu à 80 % des dossiers marocains récents. Si elle est passée, le résultat dit de combien de jours : c’est le moment où une question par le formulaire Web d’IRCC devient raisonnable. Le tableau sous le résultat compare le Maroc aux principaux pays de dépôt le même jour, ce qui permet de distinguer une hausse générale d’une hausse propre aux dossiers marocains.</p>
`,
  },
});
