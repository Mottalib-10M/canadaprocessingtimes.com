import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { extremes } from '../../lib/engine/times';

/* Chiffres de la page : données ouvertes d'IRCC (titulaires de permis du Programme de mobilité internationale, titulaires
 * de permis d'études) et normes de service (Inventaire des services du GC), OGL-Canada 2.0, calculés au build. Aucune
 * norme propre au permis postdiplôme : la page cite celle du permis de travail demandé au Canada. Le délai publié par
 * IRCC sur canada.ca n'est pas repris : le simulateur prend celui que le lecteur lit dans l'outil d'IRCC. */
const E = K.en, F = K.fr;
const pg = K.imp12('pgwp'), imp = K.imp12('all');
const share = K.pctOf(pg.last, imp.last);
const ser = K.impSeries('pgwp');
const hi = extremes(ser, K.IMPD.months).hi!;
const y = (yr: string) => K.yearSum(ser, K.IMPD.months, yr);
const p23 = y('2023'), p24 = y('2024'), p25 = y('2025');
const ins = K.stdOf('work-inside')!;
const eff = K.study12();
const ratio = K.pctOf(pg.last, eff.last);
const dirEn = (x: number | null) => (x == null ? 'about level' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');
if (!(pg.change! > 80 && pg.change! < 110) || !hi[0].startsWith('2026')) throw new Error('pgwp : le texte suppose un bond des permis postdiplôme en 2026');
if (ins.cur.perf! >= 80) throw new Error('pgwp : le texte suppose la norme du permis de travail au Canada manquée');

export default defineGuide({
  id: 'pgwp', group: 'work', order: 31,
  tool: 'delai', toolArg: { g: 'work-inside', only: 'work-inside,work-ext,study-ext,work' },
  related: ['work-permit', 'work-permit-extension', 'study-permit', 'study-permit-extension', 'cec', 'express-entry'],
  sources: ['ptimes', 'od-std', 'od-work', 'od-study', 'pgwp', 'check-status', 'ogl'],
  en: {
    slug: 'pgwp-processing-time',
    nav: 'Post-graduation work permit', card: 'Decision date from IRCC’s time, PGWPs issued each month, in-Canada standard',
    title: 'PGWP Processing Time and Your Decision Date in 2026',
    description: 'Turn the post-graduation work permit time IRCC shows you into a decision date, and see how many PGWPs took effect each month in 2026, from IRCC open data.',
    h1: 'Post-graduation work permit: your PGWP decision date',
    intro: `${E.n(pg.last)} post-graduation work permits took effect from ${E.w12(K.IMPD.months)}, ${E.ch(pg.change)} on the twelve months before.`,
    resume: `IRCC shows the processing time of a post-graduation work permit on its “Check processing times” tool, under work permits requested inside Canada, and that is the figure to copy into the calculator above with the day you submitted your application: you get an estimated decision date. The rest of this page comes from Government of Canada open data under the Open Government Licence of Canada. Over ${E.w12(K.IMPD.months)}, ${E.n(pg.last)} post-graduation work permits took effect, ${E.pct(share)} of all International Mobility Program permits and nearly twice the year before. The busiest month was ${E.my(hi[0])}, with ${E.n(hi[1])}. IRCC has no service standard of its own for this permit; the one for work permits requested inside Canada is ${K.fmtStd(ins.cur, 'en')} for 80% of applications, met for ${E.pct(ins.cur.perf)} of them in ${K.fmtFy(ins.fy, 'en')}.`,
    faqs: [
      { q: 'Can I work while my PGWP application is processed?', a: 'Yes, if you applied before your study permit expired and you meet the conditions for working off campus. You can then work full time until IRCC decides. If your study permit expired first, you must restore your status as a student before you can work.' },
      { q: 'How many post-graduation work permits does IRCC issue?', a: `Over ${E.w12(K.IMPD.months)}, ${E.n(pg.last)} took effect, against ${E.n(pg.prev)} the twelve months before. By calendar year, the count was ${E.n(p23)} in 2023, ${E.n(p24)} in 2024 and ${E.n(p25)} in 2025, according to IRCC’s open data on International Mobility Program work permit holders.` },
      { q: 'Is there a service standard for the PGWP?', a: `Not a separate one. The Government of Canada service inventory, published as open data, gives ${K.fmtStd(ins.cur, 'en')} for work permits requested inside Canada, the line that covers the PGWP. IRCC met it for ${E.pct(ins.cur.perf)} of ${E.n(ins.cur.total)} applications in ${K.fmtFy(ins.fy, 'en')}, against ${E.pct(ins.prev?.perf)} the year before.` },
    ],
    body: (h) => `
<h2>From the time IRCC shows to a date</h2>
<p>A post-graduation work permit is almost always requested from inside Canada, online, after your school confirms you completed the program. IRCC’s ${h.src('ptimes', '“Check processing times” tool')} lists it under work permits requested inside Canada, with a figure in days. This site does not copy that figure. Read it on IRCC’s tool, enter it in the calculator, and add the day you submitted the application. The calculator gives the estimated decision date and the days left or already past.</p>
<p>You have 180 days after your school confirms you completed your program to apply, provided you held a valid study permit at some point during those 180 days. The decision date does not change that deadline: apply as soon as your final transcript or completion letter is available. A permit is issued once in a lifetime, and its length follows the length of your program, so a short program gives a short permit.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'work-inside' }, t: 'Your PGWP: estimated decision date' })}
<h2>Your status while you wait</h2>
<p>If your study permit was still valid on the day you applied, you keep your status while IRCC decides and, if you were eligible to work off campus, you can work full time. The ${h.src('check-status', 'application status tracker')} shows whether IRCC has asked for biometrics or a document. Leaving Canada while you wait ends the right to work until the permit is issued. The ${h.src('pgwp', 'eligibility rules')} also changed in 2024, with field of study and language requirements for many programs: check them before you file.</p>
<h2>PGWPs that took effect, month by month</h2>
<p>IRCC’s ${h.src('od-work', 'work permit holders data')} counts the post-graduation work permits that took effect each month. Over the latest twelve months, ${h.n(pg.last)} did, ${dirEn(pg.change)} ${h.pa(pg.change)} on the year before, and ${h.pct(share)} of all International Mobility Program permits. The busiest month in the series was ${h.my(hi[0])}, with ${h.n(hi[1])} permits. The open data shows the jump but not its cause: it can reflect a larger cohort finishing studies, a faster pace of decisions, or both. By calendar year, the count was ${h.n(p23)} in 2023, ${h.n(p24)} in 2024 and ${h.n(p25)} in 2025.</p>
${h.months(K.IMPD.months, [['Post-graduation work permits', ser]], { max: 24, caption: 'Post-graduation work permits that took effect, by month, newest first. Source: IRCC open data, International Mobility Program work permit holders; figures rounded to 5.' })}
<h2>From student to graduate</h2>
<p>The pipeline starts with study permits. Over the same twelve months, ${h.n(eff.last)} study permits took effect, from the ${h.src('od-study', 'study permit holders dataset')}, so post-graduation work permits issued were equal to ${h.pct(ratio)} of the study permits that started. The two counts do not cover the same people, since a PGWP comes years after a study permit, but the gap shows how much of the current flow is graduates of the larger cohorts admitted before the 2024 cap.</p>
<h2>The in-Canada work permit standard</h2>
<p>The Government of Canada service inventory, published as ${h.src('od-std', 'open data')}, has no line for the PGWP alone. It covers it in the work permit requested inside Canada: ${K.fmtStd(ins.cur, 'en')} for 80% of applications. In ${K.fmtFy(ins.fy, 'en')}, IRCC met it for ${h.n(ins.cur.met)} of ${h.n(ins.cur.total)} applications, ${h.pct(ins.cur.perf)}, against ${h.pct(ins.prev?.perf)} the year before. That is short of the 80% target, so a file that runs past the time on IRCC’s tool is not unusual. If yours does, see the ${h.a('beyond-processing-time', 'steps for an application past the processing time')}. Once you hold the permit, a year of skilled work can lead to the ${h.a('cec', 'Canadian Experience Class')} through ${h.a('express-entry', 'Express Entry')}.</p>
`,
  },
  fr: {
    slug: 'delai-permis-post-diplome',
    nav: 'Permis post-diplôme', card: 'Date de décision à partir du délai d’IRCC, permis délivrés chaque mois, norme au Canada',
    title: 'Délai du permis de travail postdiplôme (PTPD) en 2026',
    description: 'Transformez le délai du permis de travail postdiplôme affiché par IRCC en date de décision et voyez combien de PTPD entrent en vigueur chaque mois en 2026.',
    h1: 'Permis de travail postdiplôme : votre date de décision',
    intro: `${F.n(pg.last)} permis de travail postdiplôme sont entrés en vigueur de ${F.w12(K.IMPD.months)}, soit ${F.ch(pg.change)} par rapport aux douze mois d’avant.`,
    resume: `IRCC affiche le délai de traitement du permis de travail postdiplôme dans son outil « Vérifier les délais de traitement », parmi les permis de travail demandés au Canada : c’est ce chiffre qu’il faut recopier dans le calculateur ci-dessus avec le jour d’envoi de la demande pour obtenir une date de décision estimée. Le reste de la page vient des données ouvertes du gouvernement du Canada, sous la Licence du gouvernement ouvert du Canada. De ${F.w12(K.IMPD.months)}, ${F.n(pg.last)} permis de travail postdiplôme sont entrés en vigueur, soit ${F.pct(share)} de tous les permis du Programme de mobilité internationale et presque deux fois plus qu’un an plus tôt. Le mois le plus chargé a été ${F.my(hi[0])}, avec ${F.n(hi[1])} permis. IRCC n’a pas de norme de service propre à ce permis ; celle du permis de travail demandé au Canada est de ${K.fmtStd(ins.cur, 'fr')} pour 80 % des demandes, tenue pour ${F.pct(ins.cur.perf)} d’entre elles en ${K.fmtFy(ins.fy, 'fr')}.`,
    faqs: [
      { q: 'Puis-je travailler pendant le traitement de ma demande de PTPD ?', a: 'Oui, si vous avez fait la demande avant l’expiration de votre permis d’études et que vous remplissiez les conditions pour travailler hors campus. Vous pouvez alors travailler à temps plein jusqu’à la décision d’IRCC. Si votre permis d’études a expiré avant, il faut d’abord rétablir votre statut d’étudiant pour pouvoir travailler.' },
      { q: 'Combien de permis de travail postdiplôme IRCC délivre-t-il ?', a: `De ${F.w12(K.IMPD.months)}, ${F.n(pg.last)} sont entrés en vigueur, contre ${F.n(pg.prev)} les douze mois d’avant. Par année civile, on en compte ${F.n(p23)} en 2023, ${F.n(p24)} en 2024 et ${F.n(p25)} en 2025, d’après les données ouvertes d’IRCC sur les titulaires de permis du Programme de mobilité internationale.` },
      { q: 'Existe-t-il une norme de service pour le PTPD ?', a: `Pas de norme distincte. L’inventaire des services du gouvernement du Canada, publié en données ouvertes, fixe ${K.fmtStd(ins.cur, 'fr')} pour les permis de travail demandés au Canada, la ligne qui couvre le PTPD. IRCC l’a tenue pour ${F.pct(ins.cur.perf)} des ${F.n(ins.cur.total)} demandes en ${K.fmtFy(ins.fy, 'fr')}, contre ${F.pct(ins.prev?.perf)} l’exercice d’avant.` },
    ],
    body: (h) => `
<h2>Du délai affiché par IRCC à une date</h2>
<p>Le permis de travail postdiplôme se demande presque toujours depuis le Canada, en ligne, une fois que l’établissement a confirmé la fin du programme. L’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC le range parmi les permis de travail demandés au Canada, avec un chiffre en jours. Ce site ne recopie pas ce chiffre. Lisez-le dans l’outil d’IRCC, saisissez-le dans le calculateur et indiquez le jour d’envoi de la demande. Le calculateur donne la date de décision estimée et les jours restants ou déjà dépassés.</p>
<p>Vous avez 180 jours après la confirmation de fin de programme pour faire la demande, à condition d’avoir eu un permis d’études valide à un moment de ces 180 jours. La date de décision ne change rien à ce délai : déposez dès que le relevé de notes final ou la lettre de fin d’études est disponible.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'work-inside' }, t: 'Votre PTPD : date de décision estimée' })}
<h2>Votre statut pendant l’attente</h2>
<p>Si votre permis d’études était encore valide le jour de la demande, vous gardez votre statut pendant la décision d’IRCC et, si vous pouviez travailler hors campus, vous pouvez travailler à temps plein. L’${h.src('check-status', 'outil de suivi des demandes')} indique si IRCC a demandé la biométrie ou un document. Quitter le Canada pendant l’attente met fin au droit de travailler jusqu’à la délivrance du permis. Les ${h.src('pgwp', 'conditions d’admissibilité')} ont aussi changé en 2024, avec des exigences de domaine d’études et de langue pour de nombreux programmes : vérifiez-les avant de déposer.</p>
<h2>Les PTPD entrés en vigueur, mois par mois</h2>
<p>Les ${h.src('od-work', 'données des titulaires de permis de travail')} d’IRCC comptent les permis de travail postdiplôme entrés en vigueur chaque mois. Sur les douze derniers mois, ${h.n(pg.last)} l’ont été, ${dirFr(pg.change)} de ${h.pa(pg.change)} sur un an, soit ${h.pct(share)} de tous les permis du Programme de mobilité internationale. Le mois le plus chargé de la série a été ${h.my(hi[0])}, avec ${h.n(hi[1])} permis. Les données ouvertes montrent le bond, pas sa cause : une cohorte plus nombreuse qui termine ses études, un rythme de décision plus rapide, ou les deux. Par année civile, on en compte ${h.n(p23)} en 2023, ${h.n(p24)} en 2024 et ${h.n(p25)} en 2025.</p>
${h.months(K.IMPD.months, [['Permis de travail postdiplôme', ser]], { max: 24, caption: 'Permis de travail postdiplôme entrés en vigueur, par mois, du plus récent au plus ancien. Source : IRCC, données ouvertes, titulaires de permis du Programme de mobilité internationale ; chiffres arrondis à 5.' })}
<h2>De l’étudiant au diplômé</h2>
<p>Tout part des permis d’études. Sur les mêmes douze mois, ${h.n(eff.last)} permis d’études sont entrés en vigueur d’après le ${h.src('od-study', 'jeu des titulaires de permis d’études')} : les permis postdiplôme délivrés représentent donc ${h.pct(ratio)} des permis d’études qui ont commencé. Les deux chiffres ne visent pas les mêmes personnes, puisqu’un PTPD vient des années après un permis d’études, mais l’écart montre la part du flux actuel qui vient des grandes cohortes admises avant le plafond de 2024.</p>
<h2>La norme du permis de travail demandé au Canada</h2>
<p>L’inventaire des services du gouvernement du Canada, publié en ${h.src('od-std', 'données ouvertes')}, n’a pas de ligne pour le seul PTPD. Il le compte dans le permis de travail demandé au Canada : ${K.fmtStd(ins.cur, 'fr')} pour 80 % des demandes. En ${K.fmtFy(ins.fy, 'fr')}, IRCC l’a tenue pour ${h.n(ins.cur.met)} demandes sur ${h.n(ins.cur.total)}, soit ${h.pct(ins.cur.perf)}, contre ${h.pct(ins.prev?.perf)} l’exercice d’avant. C’est en dessous de la cible de 80 % : un dossier qui dépasse le délai de l’outil d’IRCC n’a rien d’exceptionnel. Dans ce cas, voyez les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')}. Une fois le permis obtenu, un an de travail qualifié peut ouvrir la ${h.a('cec', 'catégorie de l’expérience canadienne')} par ${h.a('express-entry', 'Entrée express')}.</p>
`,
  },
});
