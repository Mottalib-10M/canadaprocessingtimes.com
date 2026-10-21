import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tm, tr, rankText, median, lines, ser } from './_pays';

/* Algérie : un visa de visiteur stable, un permis de travail qui s'allonge depuis l'été 2026. */
const C = 'DZ';
const D = K.L.dates.country;
const E = K.en, F = K.fr;
const vi = tr('visitor', C)!, sv = tr('super-visa', C)!, st = tr('study', C)!, wk = tr('work', C)!;
const ft = (g: 'visitor' | 'super-visa' | 'study' | 'work' | 'child', l: 'en' | 'fr') => K.fmtTime(tm(g, C), l);
const wk26 = K.points(ser('work', C)).filter((p) => p.date >= '2026-01-01');
const wkLow26 = wk26.reduce((a, p) => (p.v < a.v ? p : a), wk26[0]);
const vi26 = K.points(ser('visitor', C)).filter((p) => p.date >= '2026-01-01');
const viLo = Math.min(...vi26.map((p) => p.v)), viHi = Math.max(...vi26.map((p) => p.v));

export default defineGuide({
  id: 'algeria', group: 'countries', order: 111, country: C,
  tool: 'delai', toolArg: { g: 'work', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['work-permit', 'visitor-visa', 'study-permit', 'quebec-skilled-worker', 'morocco', 'tunisia'],
  sources: ['ptimes-country', 'work-permit', 'visit', 'biometrics', 'wayback'],
  en: {
    slug: 'processing-times-algeria',
    nav: 'Algeria', card: 'Steady visitor visa, lengthening work permit line from Algeria',
    title: 'Work Permit and Visitor Visa Times from Algeria, 2026',
    description: 'Canadian work permit, visitor visa, study permit and super visa processing times for applicants in Algeria in 2026, with each dated IRCC reading since 2024.',
    h1: 'Processing times for applications filed from Algeria',
    intro: `IRCC’s file of ${E.day(D)} gives ${ft('work', 'en')} for a work permit from Algeria, up from ${E.d(wkLow26.v, 'w')} on ${E.day(wkLow26.date)}.`,
    resume: `From Algeria, IRCC’s country file of ${E.day(D)} reads ${ft('visitor', 'en')} for a visitor visa, ${ft('study', 'en')} for a study permit, ${ft('work', 'en')} for a work permit and ${ft('super-visa', 'en')} for a super visa. Two lines tell different stories. The visitor visa has hardly moved: every reading of 2026 sits between ${E.d(viLo)} and ${E.d(viHi)}, and our oldest copy, dated ${E.day(vi.firstDate!)}, already showed ${E.d(vi.first!)}. The work permit has lengthened instead, from ${E.d(wkLow26.v, 'w')} in the reading of ${E.day(wkLow26.date)} to ${E.d(wk.last, 'w')} now, which leaves Algeria ${rankText('work', C, 'en')} countries with a figure. These are past times: the delay within which IRCC finished 80% of recent applications from Algeria, counted from receipt of a complete application and without the time needed for biometrics. Dependent children have no published time for Algeria. The tool above adds the time of your line to the day IRCC received your application.`,
    faqs: [
      { q: 'How long is the Canadian work permit processing time from Algeria?', a: `${ft('work', 'en')} in IRCC’s file of ${E.day(D)}, which ranks Algeria ${rankText('work', C, 'en')} countries. The line was ${E.d(wkLow26.v, 'w')} on ${E.day(wkLow26.date)}. An employer-specific permit usually needs a Labour Market Impact Assessment first, and that step, handled by Employment and Social Development Canada, is not part of IRCC’s time.` },
      { q: 'Has the visitor visa from Algeria become faster since 2024?', a: `Not by much, because it was already short. The oldest copy we keep, dated ${E.day(vi.firstDate!)}, showed ${E.d(vi.first!)}; the latest figure is ${ft('visitor', 'en')}. The archive has a gap between that copy and the next one, so the path in between is unknown, but no 2026 reading has gone above ${E.d(viHi)}.` },
      { q: 'Do Algerian students need anything before the study permit?', a: 'A letter of acceptance from a designated learning institution and, for most students, a provincial or territorial attestation letter. Students going to Quebec also need a Quebec acceptance certificate (CAQ) issued by Quebec before applying to IRCC. Those steps come before the published study permit time starts.' },
    ],
    body: (h) => `
<h2>Every line from Algeria</h2>
${lines(h, C, ['work', 'visitor', 'study', 'super-visa', 'child'])}
<h2>A work permit line that has grown</h2>
<p>The work permit is the line that changed in 2026. It went from ${h.d(wkLow26.v, 'w')} on ${h.day(wkLow26.date)} to ${h.d(wk.last, 'w')} at the update of ${h.day(D)}. The middle value among countries is ${h.d(median('work'), 'w')}, so an applicant in Algeria now waits longer than most. Since the figure is a past time, it reflects files decided in recent weeks; a rise that has lasted several readings suggests a queue that will take a while to clear.</p>
${h.hist(ser('work', C), { max: 10, unit: 'w' })}
${h.mini('delai', { p: ['m'], d: { g: 'work', c: C, m: 'none' }, t: 'Work permit from Algeria: your date' })}
<p>For a permit tied to a job offer, the published time starts only once the employer has its Labour Market Impact Assessment, or an exemption number, and you have sent the complete application. Open work permits for spouses of students or workers in Canada follow the same country line when they are requested from Algeria.</p>
<h2>The visitor visa holds steady</h2>
<p>At ${h.t(tm('visitor', C))}, the visitor visa from Algeria ranks ${rankText('visitor', C, 'en')} countries. Readings in 2026 have stayed between ${h.d(viLo)} and ${h.d(viHi)}. For a family visit, the time that varies most is often not IRCC’s but the wait for a biometrics appointment and the gathering of an invitation letter, proof of funds and travel history.</p>
<h2>Studies and the super visa</h2>
<p>A study permit takes ${h.t(tm('study', C))}, ${rankText('study', C, 'en')} countries; the line read ${h.d(st.first!, 'w')} in the copy of ${h.day(st.firstDate!)}. Students bound for Quebec apply to Quebec first for a CAQ, then to IRCC, so the total wait is the sum of both. The ${h.a('super-visa', 'super visa')}, which lets parents and grandparents stay up to five years at a time, takes ${h.t(tm('super-visa', C))} from Algeria after a reading of ${h.d(sv.first!)} on ${h.day(sv.firstDate!)}.</p>
<h2>When you are past the time</h2>
<p>Enter the month IRCC received your application in the tool. If the decision date it shows is already behind you, the result gives the number of days past the published time. One application in five takes longer than that time, so being a few days past it is not a sign of refusal. Past a few weeks, check your account for a request you may have missed, such as a document or a medical exam, then use IRCC’s web form for applications outside the normal processing time. The ${h.a('beyond-processing-time', 'page on delays beyond the published time')} lists those steps one by one, and none of them requires paying anyone.</p>
<h2>Where the figures come from</h2>
<p>Every number on this page comes from IRCC’s country file, read at each update. Readings before our first direct one come from copies kept by the Internet Archive, each listed with its date in the tables above. Where there is no copy, there is no point, and the page says nothing about that period.</p>
`,
  },
  fr: {
    slug: 'delais-algerie',
    nav: 'Algérie', card: 'Visa de visiteur stable, permis de travail qui s’allonge depuis l’Algérie',
    title: 'Délai permis de travail et visa depuis l’Algérie, 2026',
    description: 'Délais canadiens du permis de travail, du visa de visiteur, du permis d’études et du super visa pour une demande déposée en Algérie en 2026, relevés IRCC datés.',
    h1: 'Délais des demandes déposées depuis l’Algérie',
    intro: `Le fichier d’IRCC du ${F.day(D)} donne ${ft('work', 'fr')} pour un permis de travail depuis l’Algérie, contre ${F.d(wkLow26.v, 'w')} le ${F.day(wkLow26.date)}.`,
    resume: `Depuis l’Algérie, le fichier par pays d’IRCC du ${F.day(D)} indique ${ft('visitor', 'fr')} pour un visa de visiteur, ${ft('study', 'fr')} pour un permis d’études, ${ft('work', 'fr')} pour un permis de travail et ${ft('super-visa', 'fr')} pour un super visa. Deux lignes racontent des histoires opposées. Le visa de visiteur n’a presque pas bougé : chaque relevé de 2026 se situe entre ${F.d(viLo)} et ${F.d(viHi)}, et notre plus ancienne copie, datée du ${F.day(vi.firstDate!)}, indiquait déjà ${F.d(vi.first!)}. Le permis de travail s’est au contraire allongé, de ${F.d(wkLow26.v, 'w')} au relevé du ${F.day(wkLow26.date)} à ${F.d(wk.last, 'w')} aujourd’hui, ce qui place l’Algérie au ${rankText('work', C, 'fr')} pays chiffrés. Ce sont des délais passés : le temps dans lequel IRCC a terminé 80 % des demandes récentes venues d’Algérie, compté à partir de la réception d’une demande complète, sans le temps de la biométrie. Les enfants à charge n’ont pas de délai publié pour l’Algérie. L’outil ci-dessus ajoute le délai de votre ligne au jour où IRCC a reçu votre demande.`,
    faqs: [
      { q: 'Quel est le délai du permis de travail canadien depuis l’Algérie ?', a: `${ft('work', 'fr')} dans le fichier d’IRCC du ${F.day(D)}, soit le ${rankText('work', C, 'fr')} pays. La ligne était à ${F.d(wkLow26.v, 'w')} le ${F.day(wkLow26.date)}. Un permis lié à un employeur exige en général d’abord une étude d’impact sur le marché du travail, obtenue par l’employeur auprès d’Emploi et Développement social Canada : cette étape n’entre pas dans le délai d’IRCC.` },
      { q: 'Le visa de visiteur depuis l’Algérie est-il plus rapide qu’en 2024 ?', a: `Pas beaucoup, car il était déjà court. Notre plus ancienne copie, datée du ${F.day(vi.firstDate!)}, indiquait ${F.d(vi.first!)} ; le dernier chiffre est de ${ft('visitor', 'fr')}. L’archive a un trou entre cette copie et la suivante, donc le chemin entre les deux est inconnu, mais aucun relevé de 2026 n’a dépassé ${F.d(viHi)}.` },
      { q: 'Que faut-il à un étudiant algérien avant le permis d’études ?', a: 'Une lettre d’acceptation d’un établissement d’enseignement désigné et, pour la plupart des étudiants, une lettre d’attestation de la province ou du territoire. Pour le Québec, il faut aussi le certificat d’acceptation du Québec (CAQ), délivré par le Québec avant la demande à IRCC. Ces étapes précèdent le délai publié du permis d’études.' },
    ],
    body: (h) => `
<h2>Toutes les lignes depuis l’Algérie</h2>
${lines(h, C, ['work', 'visitor', 'study', 'super-visa', 'child'])}
<h2>Un permis de travail qui s’est allongé</h2>
<p>Le permis de travail est la ligne qui a changé en 2026. Elle est passée de ${h.d(wkLow26.v, 'w')} le ${h.day(wkLow26.date)} à ${h.d(wk.last, 'w')} à la mise à jour du ${h.day(D)}. La valeur médiane des pays est de ${h.d(median('work'), 'w')} : un demandeur en Algérie attend désormais plus longtemps que la plupart. Comme il s’agit d’un délai passé, il reflète les dossiers tranchés ces dernières semaines ; une hausse qui dure plusieurs relevés laisse penser qu’une file mettra du temps à se résorber.</p>
${h.hist(ser('work', C), { max: 10, unit: 'w' })}
${h.mini('delai', { p: ['m'], d: { g: 'work', c: C, m: 'none' }, t: 'Permis de travail depuis l’Algérie : votre date' })}
<p>Pour un permis lié à une offre d’emploi, le délai publié ne commence qu’une fois que l’employeur a son étude d’impact sur le marché du travail, ou un numéro de dispense, et que vous avez envoyé la demande complète. Les permis ouverts des conjoints d’étudiants ou de travailleurs au Canada suivent la même ligne quand ils sont demandés depuis l’Algérie.</p>
<h2>Le visa de visiteur tient bon</h2>
<p>À ${h.t(tm('visitor', C))}, le visa de visiteur depuis l’Algérie se classe au ${rankText('visitor', C, 'fr')} pays. Les relevés de 2026 sont restés entre ${h.d(viLo)} et ${h.d(viHi)}. Pour une visite familiale, ce qui varie le plus n’est souvent pas le délai d’IRCC, mais l’attente du rendez-vous de biométrie et la préparation de la lettre d’invitation, de la preuve de fonds et de l’historique de voyage.</p>
<h2>Études et super visa</h2>
<p>Un permis d’études prend ${h.t(tm('study', C))}, ${rankText('study', C, 'fr')} pays ; la ligne indiquait ${h.d(st.first!, 'w')} dans la copie du ${h.day(st.firstDate!)}. Les étudiants qui vont au Québec demandent d’abord le CAQ au Québec, puis le permis à IRCC : l’attente totale additionne les deux. Le ${h.a('super-visa', 'super visa')}, qui permet aux parents et grands-parents de rester jusqu’à cinq ans d’affilée, prend ${h.t(tm('super-visa', C))} depuis l’Algérie, après ${h.d(sv.first!)} au relevé du ${h.day(sv.firstDate!)}.</p>
<h2>Quand le délai est dépassé</h2>
<p>Indiquez dans l’outil le mois où IRCC a reçu votre demande. Si la date de décision affichée est déjà passée, le résultat donne le nombre de jours au-delà du délai publié. Une demande sur cinq prend plus longtemps que ce délai : quelques jours de plus ne sont pas un signe de refus. Au-delà de quelques semaines, vérifiez d’abord dans votre compte qu’aucune demande ne vous a échappé, comme un document ou un examen médical, puis utilisez le formulaire Web d’IRCC prévu pour les demandes hors des délais normaux. La ${h.a('beyond-processing-time', 'page sur les demandes qui dépassent le délai')} détaille ces démarches une à une, et aucune n’oblige à payer qui que ce soit.</p>
<p>Si vous résidez légalement dans un autre pays, en France ou aux Émirats arabes unis par exemple, la ligne qui compte est celle de ce pays et non celle de l’Algérie : comparez-les dans l’outil avant de déposer.</p>
<h2>D’où viennent les chiffres</h2>
<p>Chaque nombre de cette page vient du fichier par pays d’IRCC, relu à chaque mise à jour. Les relevés antérieurs à notre première lecture directe viennent des copies conservées par l’Internet Archive, chacune listée avec sa date dans les tableaux ci-dessus. Là où il n’y a pas de copie, il n’y a pas de point, et la page ne dit rien de cette période.</p>
`,
  },
});
