import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Programme d'immigration au Canada atlantique : délai prévu, file par mois de dépôt, relevés depuis octobre 2025. */
const P = 'aip';
const r = K.readingOf(P);
const q = r.queue ?? [];
const pts = K.points(r.series);
const tr = K.fullTrend(r.series)!;
const late = q.filter((x) => x[1] === 'late');
const open = q.filter((x): x is [string, number, number | null] => typeof x[1] === 'number');
const firstOpen = open[0], lastRow = open[open.length - 1];
/* Premier relevé après le sommet où le délai atteint sa valeur actuelle. */
const maxIdx = pts.findIndex((p) => p.v === tr.max);
const reached = pts.slice(maxIdx).find((p) => p.v === tr.last) ?? pts[pts.length - 1];
const pnpBase = K.readingOf('pnp-base');
const wt = K.fullTrend('w:aip')!;
const D = r.date;
const E = K.en, F = K.fr;
const mo = (n: number, l: Lang) => `${K.num(n, l)} ${K.unitWord(n, 'm', l)}`;
/* Un mois de dépôt par trimestre (mars, juin, septembre, décembre) : la file se lit d'un coup d'œil. */
const quarterly = open.filter((x) => ['03', '06', '09', '12'].includes(x[0].slice(5)));
const rows = (h: Helpers, l: Lang) => quarterly.map((x) => [h.my(`${x[0]}-15`), mo(x[1], l), K.fmtAhead(x[2], l), `${h.my(K.addMonths(D, x[1]))}`]);

export default defineGuide({
  id: 'atlantic', group: 'pr', order: 45,
  tool: 'delai', toolArg: { g: 'aip' },
  related: ['pnp', 'express-entry', 'work-permit', 'method', 'history', 'beyond-processing-time'],
  sources: ['ptimes-flpt', 'aip', 'check-status'],
  en: {
    slug: 'atlantic-immigration-program-processing-time',
    nav: 'Atlantic Immigration Program', card: 'Time after endorsement, drop since spring 2026',
    title: 'Atlantic Immigration Program Processing Time, PR Stage 2026',
    description: 'Atlantic Immigration Program permanent residence time in 2026: IRCC’s expected months after endorsement, the queue by month filed and the drop since the spring.',
    h1: 'Atlantic Immigration Program: permanent residence time',
    intro: `For a permanent residence application under the Atlantic Immigration Program, IRCC expected ${K.fmtTime(r.t, 'en')} on ${E.day(D)}, down from ${E.d(tr.max, 'm')} at the ${E.day(tr.maxDate)} reading.`,
    resume: `A permanent residence application under the Atlantic Immigration Program currently takes ${K.fmtTime(r.t, 'en')}, the forward-looking time IRCC published on ${E.day(D)} for a complete application received now. Our oldest copy of that figure, dated ${E.day(tr.firstDate ?? tr.lastDate)}, showed ${E.d(tr.first ?? tr.last, 'm')}; it climbed to ${E.d(tr.max, 'm')} on ${E.day(tr.maxDate)} and has been at ${E.d(tr.last, 'm')} since ${E.day(reached.date)}. IRCC counts ${K.fmtAhead(r.waiting ?? 0, 'en')} applications waiting. Its queue by month of filing says more for anyone already in line: ${E.n(late.length)} early filing months are marked past the expected time, an application from ${K.monthYear(`${firstOpen[0]}-15`, 'en')} has ${mo(firstOpen[1], 'en')} left, and one from ${K.monthYear(`${lastRow[0]}-15`, 'en')} has ${mo(lastRow[1], 'en')} left. The time starts when IRCC receives the complete application, after the province has endorsed your job offer; the work with the employer and the province comes first and is not included.`,
    faqs: [
      { q: 'Does the Atlantic Immigration Program time include the provincial endorsement?', a: `No. IRCC’s ${K.fmtTime(r.t, 'en')} starts when it receives your permanent residence application, which requires the endorsement certificate from New Brunswick, Nova Scotia, Prince Edward Island or Newfoundland and Labrador. Finding a designated employer and getting endorsed come before and depend on the employer and the province.` },
      { q: 'Why did the Atlantic Immigration Program time drop in 2026?', a: `Our copies show ${E.d(tr.max, 'm')} on ${E.day(tr.maxDate)} and ${E.d(tr.last, 'm')} from ${E.day(reached.date)}. IRCC does not explain its monthly changes. A lower forward-looking time usually reflects more decisions planned for the coming months compared with the files waiting, not a change in the rules.` },
      { q: 'Can I work while my Atlantic Immigration Program application is processed?', a: 'IRCC offers a temporary work permit to some Atlantic Immigration Program candidates who have an endorsement and need to start with the employer before permanent residence is granted. It is a separate application, with its own processing time; the conditions are set out on IRCC’s program page.' },
    ],
    body: (h) => `
<h2>What the ${h.t(r.t)} cover</h2>
<p>The Atlantic Immigration Program brings workers and international graduates to New Brunswick, Nova Scotia, Prince Edward Island and Newfoundland and Labrador. It is employer-driven: a designated employer offers the job, the province endorses the offer, and only then does the candidate file for permanent residence with IRCC. The figure on this page is the last of those three steps. It is IRCC’s estimate for an application that arrives complete today, a forward-looking time as described on the ${h.a('method', 'method page')}, and it does not start until the endorsement is in your file. The program rules are on ${h.src('aip', 'IRCC’s Atlantic Immigration Program page')}.</p>
<h2>The fall from the spring peak</h2>
<p>IRCC first published forward-looking times for permanent residence in this form in October 2025, so our series starts with the copy of ${h.day(tr.firstDate ?? tr.lastDate)}, at ${h.d(tr.first ?? tr.last, 'm')}. The highest reading came on ${h.day(tr.maxDate)}, at ${h.d(tr.max, 'm')}. By ${h.day(reached.date)} it had dropped to ${h.d(tr.last, 'm')}, and every copy since has shown the same figure. That is a fall of ${mo(Math.round((tr.max - tr.last) / (365.25 / 12)), 'en')} from the peak. Over the same copies, the number of applications waiting went from ${K.fmtAhead(wt.max, 'en')} at its highest, on ${h.day(wt.maxDate)}, to ${K.fmtAhead(wt.last, 'en')} on ${h.day(wt.lastDate)}.</p>
${h.hist(r.series, { max: 12, unit: 'm' })}
<p>Each row cites the copy it comes from, most of them saved by the Internet Archive; the ${h.a('history', 'history page')} explains how they were collected. A shorter headline helps new applicants first. People already waiting see the change through the queue table, where their own month of filing has its own number.</p>
<h2>The queue, quarter by quarter</h2>
<p>The same IRCC file lists, for each month of filing, how many months it expects are left and how many people are ahead. The table below keeps one month per quarter so the shape is easy to read; the last column adds the time left to the date of the file, which is the earliest month the queue points to, not a promised decision.</p>
${h.table(['Month filed', 'Time left', 'People ahead', 'Points to'], rows(h, 'en'), `Atlantic Immigration Program, queue published by IRCC on ${h.day(D)} (one filing month per quarter).`, ['l', 'r', 'r', 'r'])}
<p>Two things stand out. The ${h.n(late.length)} oldest filing months, from ${h.my(`${late[0]?.[0] ?? firstOpen[0]}-15`)}, are marked as past the expected time, so IRCC expected to be done with them. And the time left grows by about a month for each later month of filing, with the line ahead growing from ${K.fmtAhead(firstOpen[2], 'en')} to ${K.fmtAhead(lastRow[2], 'en')}. In other words, the queue is being worked from the front: every file waits for those filed before it.</p>
${h.mini('delai', { p: ['m'], d: { g: 'aip', m: lastRow[0] }, t: 'Your Atlantic Immigration Program file: where it stands' })}
<h2>Compared with a provincial nomination</h2>
<p>The Atlantic provinces also run their own ${h.a('pnp', 'provincial nominee streams')}. A nomination outside Express Entry, the paper or base stream, had a forward-looking time of ${h.t(pnpBase.t)} on ${h.day(pnpBase.date)}, against ${h.t(r.t)} for the Atlantic program. A nomination through ${h.a('express-entry', 'Express Entry')} is faster again. Which route fits depends on your job offer and eligibility, not on the time alone; the shorter line is useless if you do not qualify for it.</p>
<h2>While the file is in line</h2>
<p>Candidates who need to start work before permanent residence can ask for a temporary ${h.a('work-permit', 'work permit')} tied to the endorsed employer; that is a separate application with a separate time. Keep your contact details and passport current in your account, because a request for a new medical exam or police certificate stops the clock until you answer. You can follow each completed step through ${h.src('check-status', 'IRCC’s status tool')}. Once your filing month is marked past the expected time, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} apply.</p>
`,
  },
  fr: {
    slug: 'delai-programme-immigration-atlantique',
    nav: 'Programme d’immigration au Canada atlantique', card: 'Délai après la recommandation, baisse depuis le printemps 2026',
    title: 'Délai du Programme d’immigration au Canada atlantique 2026',
    description: 'Programme d’immigration au Canada atlantique en 2026 : mois prévus par IRCC après la recommandation, file par mois de dépôt et baisse depuis le printemps.',
    h1: 'Programme d’immigration au Canada atlantique : délai de résidence permanente',
    intro: `Pour une demande de résidence permanente du Programme d’immigration au Canada atlantique, IRCC prévoyait ${K.fmtTime(r.t, 'fr')} le ${F.day(D)}, contre ${F.d(tr.max, 'm')} au relevé du ${F.day(tr.maxDate)}.`,
    resume: `Une demande de résidence permanente au titre du Programme d’immigration au Canada atlantique prend en ce moment ${K.fmtTime(r.t, 'fr')}, soit le délai prévu publié par IRCC le ${F.day(D)} pour une demande complète reçue maintenant. Notre plus ancienne copie de ce chiffre, datée du ${F.day(tr.firstDate ?? tr.lastDate)}, indiquait ${F.d(tr.first ?? tr.last, 'm')} ; il est monté à ${F.d(tr.max, 'm')} le ${F.day(tr.maxDate)} et reste à ${F.d(tr.last, 'm')} depuis le ${F.day(reached.date)}. IRCC compte ${K.fmtAhead(r.waiting ?? 0, 'fr')} demandes en attente. Sa file par mois de dépôt en dit plus à ceux qui attendent déjà : ${F.n(late.length)} des premiers mois sont marqués comme ayant dépassé le délai prévu, une demande de ${K.monthYear(`${firstOpen[0]}-15`, 'fr')} a encore ${mo(firstOpen[1], 'fr')} devant elle et une demande de ${K.monthYear(`${lastRow[0]}-15`, 'fr')}, ${mo(lastRow[1], 'fr')}. Le délai part de la réception de la demande complète, après la recommandation de l’offre d’emploi par la province ; les démarches avec l’employeur et la province viennent avant et n’y sont pas comptées.`,
    faqs: [
      { q: 'Le délai du Programme d’immigration au Canada atlantique compte-t-il la recommandation de la province ?', a: `Non. Les ${K.fmtTime(r.t, 'fr')} d’IRCC partent de la réception de la demande de résidence permanente, qui exige le certificat de recommandation du Nouveau-Brunswick, de la Nouvelle-Écosse, de l’Île-du-Prince-Édouard ou de Terre-Neuve-et-Labrador. Trouver un employeur désigné et obtenir la recommandation se font avant.` },
      { q: 'Pourquoi le délai du Programme d’immigration au Canada atlantique a-t-il baissé en 2026 ?', a: `Nos copies montrent ${F.d(tr.max, 'm')} le ${F.day(tr.maxDate)} puis ${F.d(tr.last, 'm')} à partir du ${F.day(reached.date)}. IRCC n’explique pas ses variations mensuelles. Un délai prévu plus court reflète en général davantage de décisions planifiées pour les mois à venir par rapport aux dossiers en attente, pas un changement des règles.` },
      { q: 'Peut-on travailler pendant le traitement d’une demande du Programme d’immigration au Canada atlantique ?', a: 'IRCC offre un permis de travail temporaire à certains candidats recommandés qui doivent commencer chez l’employeur avant d’obtenir la résidence permanente. C’est une demande distincte, avec son propre délai de traitement ; les conditions sont décrites sur la page du programme d’IRCC.' },
    ],
    body: (h) => `
<h2>Ce que couvrent les ${h.t(r.t)}</h2>
<p>Le Programme d’immigration au Canada atlantique fait venir des travailleurs et des diplômés étrangers au Nouveau-Brunswick, en Nouvelle-Écosse, à l’Île-du-Prince-Édouard et à Terre-Neuve-et-Labrador. Tout part de l’employeur : un employeur désigné offre le poste, la province recommande l’offre, et le candidat dépose seulement ensuite sa demande de résidence permanente auprès d’IRCC. Le chiffre de cette page correspond à cette dernière étape. C’est l’estimation d’IRCC pour une demande complète qui arrive aujourd’hui, un délai prévu au sens de notre ${h.a('method', 'page de méthode')}, et il ne démarre pas avant que la recommandation soit au dossier. Les règles du programme sont sur la ${h.src('aip', 'page d’IRCC consacrée au programme')}.</p>
<h2>La baisse après le sommet du printemps</h2>
<p>IRCC publie les délais prévus de résidence permanente sous cette forme depuis octobre 2025 : notre série commence donc avec la copie du ${h.day(tr.firstDate ?? tr.lastDate)}, à ${h.d(tr.first ?? tr.last, 'm')}. Le relevé le plus haut date du ${h.day(tr.maxDate)}, à ${h.d(tr.max, 'm')}. Le ${h.day(reached.date)}, le chiffre était tombé à ${h.d(tr.last, 'm')}, et toutes les copies suivantes affichent la même valeur. C’est une baisse de ${mo(Math.round((tr.max - tr.last) / (365.25 / 12)), 'fr')} depuis le sommet. Sur les mêmes copies, le nombre de demandes en attente est passé de ${K.fmtAhead(wt.max, 'fr')} au plus haut, le ${h.day(wt.maxDate)}, à ${K.fmtAhead(wt.last, 'fr')} le ${h.day(wt.lastDate)}.</p>
${h.hist(r.series, { max: 12, unit: 'm' })}
<p>Chaque ligne cite la copie dont elle vient, le plus souvent conservée par l’Internet Archive ; la ${h.a('history', 'page de l’historique')} explique comment elles ont été réunies. Un chiffre principal plus court profite d’abord aux nouveaux dossiers. Ceux qui attendent déjà voient l’effet dans le tableau de file, où leur propre mois de dépôt a son chiffre.</p>
<h2>La file, trimestre par trimestre</h2>
<p>Le même fichier d’IRCC donne, pour chaque mois de dépôt, le nombre de mois encore prévus et le nombre de personnes devant. Le tableau ne garde qu’un mois par trimestre pour que la forme saute aux yeux ; la dernière colonne ajoute le temps restant à la date du fichier, soit le mois que vise la file, pas une décision promise.</p>
${h.table(['Mois de dépôt', 'Temps restant', 'Personnes devant', 'Vise'], rows(h, 'fr'), `Programme d’immigration au Canada atlantique, file publiée par IRCC le ${h.day(D)} (un mois de dépôt par trimestre).`, ['l', 'r', 'r', 'r'])}
<p>Deux constats. Les ${h.n(late.length)} plus anciens mois de dépôt, à partir de ${h.my(`${late[0]?.[0] ?? firstOpen[0]}-15`)}, sont marqués comme ayant dépassé le délai prévu : IRCC comptait en avoir fini avec eux. Et le temps restant augmente d’environ un mois pour chaque mois de dépôt plus récent, tandis que la file devant passe de ${K.fmtAhead(firstOpen[2], 'fr')} à ${K.fmtAhead(lastRow[2], 'fr')} personnes. La file se traite par l’avant : chaque dossier attend ceux qui ont été déposés avant lui.</p>
${h.mini('delai', { p: ['m'], d: { g: 'aip', m: lastRow[0] }, t: 'Votre dossier du programme atlantique : où il en est' })}
<h2>Comparé à une nomination provinciale</h2>
<p>Les provinces de l’Atlantique ont aussi leurs ${h.a('pnp', 'volets de candidats des provinces')}. Une nomination hors Entrée express, le volet de base sur papier, avait un délai prévu de ${h.t(pnpBase.t)} le ${h.day(pnpBase.date)}, contre ${h.t(r.t)} pour le programme atlantique. Une nomination par l’${h.a('express-entry', 'Entrée express')} va encore plus vite. Le bon choix dépend de votre offre d’emploi et de votre admissibilité, pas du délai seul : la file la plus courte ne sert à rien si vous n’y avez pas droit.</p>
<h2>Pendant que le dossier attend</h2>
<p>Le candidat qui doit commencer à travailler avant la résidence permanente peut demander un ${h.a('work-permit', 'permis de travail')} temporaire lié à l’employeur recommandé ; c’est une autre demande, avec un autre délai. Gardez vos coordonnées et votre passeport à jour dans votre compte, car une demande de nouvel examen médical ou de certificat de police arrête le compteur jusqu’à votre réponse. L’${h.src('check-status', 'outil de vérification de l’état d’IRCC')} montre chaque étape franchie. Quand votre mois de dépôt passe en « délai prévu dépassé », les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} s’appliquent.</p>
`,
  },
});
