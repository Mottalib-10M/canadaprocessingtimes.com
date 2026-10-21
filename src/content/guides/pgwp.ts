import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Permis de travail post-diplôme : IRCC ne publie aucune ligne à ce nom. La ligne qui s'applique à un permis
 * demandé au Canada est « permis de travail au Canada » (fichier par pays, code CA). Prolongations à côté. */
const IN_ = K.readingOf('work-inside');
const S = IN_.series;
const tr = K.fullTrend(S)!;
const pts = K.points(S);
const ext = K.readingOf('work-ext');
const past = K.altOf('work-ext')!;
const pastT = K.fullTrend(past.series)!;
const studyIn = K.readingOf('study-inside');
const out = K.readingOf('work', 'IN');
const D = K.L.dates.country;
const nRead = K.readingsCount('country');
const E = K.en, F = K.fr;
const wDays = K.daysOf(IN_.t)!;
const outDays = K.daysOf(out.t)!;

export default defineGuide({
  id: 'pgwp', group: 'work', order: 31,
  tool: 'delai', toolArg: { g: 'work-inside', only: 'work-inside,work-ext,study-ext,work' },
  related: ['work-permit', 'work-permit-extension', 'study-permit', 'study-permit-extension', 'cec', 'express-entry'],
  sources: ['pgwp', 'ptimes-country', 'ptimes-week', 'ptimes-noncountry', 'extend-work', 'ptimes'],
  en: {
    slug: 'pgwp-processing-time',
    nav: 'Post-graduation work permit', card: 'Which IRCC line applies, time and trend',
    title: 'PGWP Processing Time: the IRCC Line That Applies, 2026',
    description: 'PGWP processing time in 2026: IRCC publishes no line under that name, so we show the in-Canada work permit line, its history since 2024 and the extension lines.',
    h1: 'Post-graduation work permit: which processing time applies',
    intro: `IRCC’s processing times tool has no entry called PGWP. The line for a work permit requested from inside Canada reads ${K.fmtTime(IN_.t, 'en')} on ${E.day(D)}.`,
    resume: `There is no published processing time labelled “post-graduation work permit”. IRCC’s tool offers a line called “Work permit in Canada”, which is the one that applies to a first work permit requested from within the country, and on ${E.day(D)} it reads ${K.fmtTime(IN_.t, 'en')}. That line has moved a lot: ${E.d(tr.first!, 'w')} in the oldest copy we hold, dated ${E.day(tr.firstDate!)}, then a low of ${E.d(tr.min, 'w')} on ${E.day(tr.minDate)}, and a rise since. Two other lines matter for graduates who already hold a work permit: the weekly forward-looking time for work permit extensions, ${K.fmtTime(ext.t, 'en')} as of ${E.day(ext.date)}, and the past time for the same extensions, ${K.fmtTime(past.t, 'en')} as of ${E.day(past.date)}. None of these figures is a promise. They count from the day IRCC receives a complete application and exclude biometrics. The tool above lets you switch between the three lines and add the one you choose to your filing date.`,
    faqs: [
      { q: 'Does IRCC publish a PGWP processing time?', a: `Not under that name. The processing times tool and the files behind it have no line labelled post-graduation work permit. The line that covers a work permit requested from inside Canada is the one to use, ${K.fmtTime(IN_.t, 'en')} on ${E.day(D)}. If you apply for the PGWP from outside Canada, the work permit figure for your country of residence would apply instead.` },
      { q: 'Can I keep working while my PGWP application is processed?', a: 'IRCC sets out on its page about working after graduation when a graduate may work while the decision is pending. The conditions depend on when you applied, whether your study permit was still valid and the rules in force at that time, so read that page for your own dates rather than relying on a general answer.' },
      { q: 'Why did the PGWP line drop so far between 2024 and 2026?', a: `The in-Canada work permit line read ${E.d(tr.first!, 'w')} in the ${E.day(tr.firstDate!)} copy and ${E.d(pts[1].v, 'w')} in the ${E.day(pts[1].date)} copy. We have no archived copy between ${E.day(pts[1].date)} and ${E.day(pts[2].date)}, so we cannot say when the fall happened, only that the next readings were much lower.` },
      { q: 'Is a PGWP an extension of my study permit for processing purposes?', a: 'No. A post-graduation work permit is a new permit, not an extension of the study permit. The weekly extension queue applies to people who already hold a work permit and ask for more time on it. That is why this page treats the in-Canada work permit line as the reference for a first PGWP.' },
    ],
    body: (h) => `
<h2>The line IRCC actually publishes</h2>
<p>IRCC publishes its processing times as several data files. In the file by country, the work permit has one figure per country of residence plus one entry under the code for Canada, which the public tool displays as a work permit requested from inside Canada. That entry, ${h.t(IN_.t)} on ${h.day(D)}, is what a graduate applying online from inside the country should look at. Searching the tool for “PGWP” or “post-graduation” returns nothing, and we do not invent a separate figure.</p>
<p>For comparison, a work permit requested from India reads ${h.t(out.t)} on the same date, and a study permit requested from inside Canada reads ${h.t(studyIn.t)}. The in-Canada work permit line is ${wDays > outDays ? 'longer' : 'shorter'} than the India figure by about ${h.n(Math.round(Math.abs(wDays - outDays) / 7))} weeks, which is worth knowing for graduates who could in theory apply from either place.</p>
<h2>History of the in-Canada work permit line</h2>
${h.hist(S, { unit: 'w', max: 12 })}
<p>The archive behind this table is thin. The file by country exists in only ${h.n(nRead)} dated copies: ${h.day(pts[0].date)}, ${h.day(pts[1].date)}, and then a sequence that starts on ${h.day(pts[2].date)}. More than a year passes without any copy, so the table cannot show what happened in between. What it shows clearly is the scale of the change: from ${h.d(tr.first!, 'w')} to ${h.d(tr.min, 'w')}, and then a climb back to ${h.t(IN_.t)}, with a peak since July of ${h.d(Math.max(...pts.slice(2).map((p) => p.v)), 'w')}.</p>
<p>The recent climb matters more than the old figures for anyone applying this autumn. Graduations in spring and summer bring many applications at once, and a past-time measure reports them only as they are decided. A figure that has risen over several readings in a row tends to stay high for a while.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'work-inside', m: 'none' }, t: 'Your permit after graduation: estimated decision date' })}
<h2>When the extension lines apply instead</h2>
<p>Graduates who already hold a work permit, for example a spouse’s open permit or an earlier permit, and who ask to extend it fall under the extension figures. IRCC publishes two of them, measured differently:</p>
${h.table(['Line', 'Figure', 'IRCC date', 'Kind of measure'], [
  [h.a('work-permit-extension', 'Work permit extension, weekly queue'), h.t(ext.t), h.day(ext.date), 'Forward-looking'],
  ['Work permit extension, past time', h.t(past.t), h.day(past.date), '80% of recent decisions'],
  ['Work permit, inside Canada', h.t(IN_.t), h.day(D), '80% of recent decisions'],
], 'Lines that can apply to a graduate in Canada.', ['l', 'r', 'r', 'l'])}
<p>The past extension figure peaked at ${h.d(pastT.max)} on ${h.day(pastT.maxDate)}. The weekly queue, by contrast, has only been archived since ${h.day(K.firstReading('tr'))}, which makes it a short series of ${h.n(K.readingsCount('tr'))} readings: too few to call a trend.</p>
<h2>Practical points for graduates</h2>
<p>Apply before your study permit expires if you want to remain in Canada while waiting; IRCC’s page on ${h.src('pgwp', 'working after graduation')} lists the deadlines that count from the date your school confirms you completed your program, and the conditions for working during processing. Keep the confirmation of submission: the date on it is the date to enter in the tool. If IRCC asks for a document, such as a transcript or a passport scan, the file waits for your reply and the published time does not cover that pause.</p>
<p>Biometrics are a separate point. Many graduates gave fingerprints when they applied for their study permit, and IRCC reuses them while they remain valid; if yours have expired, the appointment comes on top of the published time. The same applies to a medical exam, when IRCC asks for one.</p>
<p>A PGWP is often the step before permanent residence through the ${h.a('cec', 'Canadian Experience Class')}. Work experience counts only once you are authorized to work, so the date of the permit decision has a direct effect on when you can reach the year of experience that the class requires.</p>
`,
  },
  fr: {
    slug: 'delai-permis-post-diplome',
    nav: 'Permis post-diplôme', card: 'La ligne d’IRCC qui s’applique, délai et tendance',
    title: 'Délai du permis post-diplôme (PTPD) : la bonne ligne, 2026',
    description: 'Délai 2026 du permis de travail post-diplôme : aucune ligne d’IRCC à ce nom ; voici celle du permis demandé au Canada, son historique et les prolongations.',
    h1: 'Permis de travail post-diplôme : quel délai s’applique',
    intro: `L’outil d’IRCC n’a aucune entrée appelée permis post-diplôme. La ligne du permis de travail demandé au Canada indique ${K.fmtTime(IN_.t, 'fr')} au ${F.day(D)}.`,
    resume: `Aucun délai publié ne porte le nom de permis de travail post-diplôme (PTPD). L’outil d’IRCC propose une ligne « permis de travail, demande au Canada », celle qui s’applique à un premier permis de travail demandé sur place, et elle indique ${K.fmtTime(IN_.t, 'fr')} au ${F.day(D)}. Cette ligne a beaucoup bougé : ${F.d(tr.first!, 'w')} dans la plus ancienne copie conservée, datée du ${F.day(tr.firstDate!)}, puis un creux à ${F.d(tr.min, 'w')} le ${F.day(tr.minDate)}, et une remontée depuis. Deux autres lignes concernent les diplômés qui ont déjà un permis de travail : le délai prospectif hebdomadaire des prolongations, ${K.fmtTime(ext.t, 'fr')} au ${F.day(ext.date)}, et le délai passé des mêmes prolongations, ${K.fmtTime(past.t, 'fr')} au ${F.day(past.date)}. Aucun de ces chiffres n’est une promesse : ils comptent depuis la réception d’une demande complète et excluent la biométrie. L’outil permet de passer d’une ligne à l’autre et d’ajouter celle qui vous concerne à votre date de dépôt.`,
    faqs: [
      { q: 'IRCC publie-t-il un délai pour le permis post-diplôme ?', a: `Pas sous ce nom. L’outil des délais et les fichiers qui l’alimentent n’ont aucune ligne intitulée permis de travail post-diplôme. La ligne à utiliser est celle du permis de travail demandé au Canada, ${K.fmtTime(IN_.t, 'fr')} au ${F.day(D)}. Si vous demandez ce permis depuis l’étranger, c’est le chiffre du permis de travail de votre pays de résidence qui s’applique.` },
      { q: 'Puis-je travailler pendant le traitement de mon permis post-diplôme ?', a: 'IRCC précise sur sa page consacrée au travail après les études dans quels cas un diplômé peut travailler pendant l’attente. Les conditions dépendent de la date de votre demande, de la validité de votre permis d’études à ce moment et des règles alors en vigueur : lisez cette page avec vos propres dates plutôt qu’une réponse générale.' },
      { q: 'Pourquoi le délai du permis post-diplôme a-t-il autant baissé entre 2024 et 2026 ?', a: `La ligne du permis de travail demandé au Canada indiquait ${F.d(tr.first!, 'w')} dans la copie du ${F.day(tr.firstDate!)} et ${F.d(pts[1].v, 'w')} dans celle du ${F.day(pts[1].date)}. Aucune copie archivée n’existe entre le ${F.day(pts[1].date)} et le ${F.day(pts[2].date)} : on ne peut pas dater la baisse, seulement constater que les relevés suivants sont bien plus bas.` },
      { q: 'Le permis post-diplôme est-il traité comme une prolongation du permis d’études ?', a: 'Non. Le permis de travail post-diplôme est un nouveau permis, pas la prolongation du permis d’études. La file hebdomadaire des prolongations vise les personnes qui ont déjà un permis de travail et demandent plus de temps. C’est pourquoi cette page prend la ligne du permis de travail demandé au Canada comme référence pour un premier permis post-diplôme.' },
    ],
    body: (h) => `
<h2>La ligne qu’IRCC publie vraiment</h2>
<p>IRCC publie ses délais dans plusieurs fichiers de données. Dans le fichier par pays, le permis de travail a un chiffre par pays de résidence, plus une entrée sous le code du Canada, que l’outil public affiche comme permis de travail demandé au Canada. C’est cette entrée, ${h.t(IN_.t)} au ${h.day(D)}, qu’un diplômé qui dépose en ligne depuis le Canada doit regarder. Chercher « PTPD » ou « post-diplôme » dans l’outil ne donne rien, et nous n’inventons pas de chiffre à part.</p>
<p>Pour comparer, un permis de travail demandé depuis l’Inde affiche ${h.t(out.t)} à la même date, et un permis d’études demandé au Canada ${h.t(studyIn.t)}. La ligne du permis de travail au Canada est ${wDays > outDays ? 'plus longue' : 'plus courte'} que le chiffre de l’Inde d’environ ${h.n(Math.round(Math.abs(wDays - outDays) / 7))} semaines, ce qui intéresse les diplômés qui pourraient en principe déposer d’un endroit ou de l’autre.</p>
<h2>Historique de la ligne du permis de travail au Canada</h2>
${h.hist(S, { unit: 'w', max: 12 })}
<p>L’archive derrière ce tableau est mince. Le fichier par pays n’existe qu’en ${h.n(nRead)} copies datées : ${h.day(pts[0].date)}, ${h.day(pts[1].date)}, puis une suite qui commence le ${h.day(pts[2].date)}. Plus d’un an passe sans aucune copie : le tableau ne peut pas montrer ce qui s’est passé entre-temps. Il montre en revanche l’ampleur du changement, de ${h.d(tr.first!, 'w')} à ${h.d(tr.min, 'w')}, puis une remontée jusqu’à ${h.t(IN_.t)}, avec un sommet depuis juillet de ${h.d(Math.max(...pts.slice(2).map((p) => p.v)), 'w')}.</p>
<p>Pour qui dépose cet automne, la remontée récente compte plus que les vieux chiffres. Les fins de programme du printemps et de l’été amènent beaucoup de demandes en même temps, et un délai passé ne les reflète qu’au moment où elles sont tranchées. Un chiffre qui a monté plusieurs relevés de suite reste en général haut quelque temps.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'work-inside', m: 'none' }, t: 'Votre permis après les études : date de décision estimée' })}
<h2>Quand les lignes de prolongation s’appliquent</h2>
<p>Les diplômés qui ont déjà un permis de travail, par exemple un permis ouvert d’époux ou un permis antérieur, et qui demandent à le prolonger relèvent des chiffres de prolongation. IRCC en publie deux, mesurés autrement :</p>
${h.table(['Ligne', 'Chiffre', 'Date IRCC', 'Type de mesure'], [
  [h.a('work-permit-extension', 'Prolongation du permis de travail, file hebdomadaire'), h.t(ext.t), h.day(ext.date), 'Prospectif'],
  ['Prolongation du permis de travail, délai passé', h.t(past.t), h.day(past.date), '80 % des décisions récentes'],
  ['Permis de travail, demande au Canada', h.t(IN_.t), h.day(D), '80 % des décisions récentes'],
], 'Lignes qui peuvent concerner un diplômé au Canada.', ['l', 'r', 'r', 'l'])}
<p>Le délai passé des prolongations a culminé à ${h.d(pastT.max)} le ${h.day(pastT.maxDate)}. La file hebdomadaire, elle, n’est archivée que depuis le ${h.day(K.firstReading('tr'))} : une série courte de ${h.n(K.readingsCount('tr'))} relevés, trop peu pour parler de tendance.</p>
<h2>Points pratiques pour les diplômés</h2>
<p>Déposez avant l’expiration de votre permis d’études si vous voulez rester au Canada pendant l’attente ; la page d’IRCC sur le ${h.src('pgwp', 'travail après les études')} donne les échéances, comptées à partir de la confirmation de fin de programme par l’établissement, et les conditions pour travailler pendant le traitement. Gardez la confirmation d’envoi : sa date est celle à indiquer dans l’outil. Si IRCC demande un document, comme un relevé de notes ou une copie du passeport, le dossier attend votre réponse et le délai publié ne couvre pas cette pause.</p>
<p>La biométrie est un point à part. Beaucoup de diplômés ont donné leurs empreintes pour leur permis d’études, et IRCC les réutilise tant qu’elles restent valides ; si les vôtres ont expiré, le rendez-vous s’ajoute au délai publié. Il en va de même d’un examen médical, quand IRCC en demande un.</p>
<p>Le permis post-diplôme précède souvent la résidence permanente par la ${h.a('cec', 'catégorie de l’expérience canadienne')}. L’expérience de travail ne compte qu’une fois l’autorisation de travailler obtenue : la date de décision du permis pèse donc directement sur le moment où vous atteignez l’année d’expérience exigée.</p>
`,
  },
});
