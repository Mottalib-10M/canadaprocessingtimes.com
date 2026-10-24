import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : données ouvertes d'IRCC (Operational Processing, titulaires de permis du Programme de mobilité
 * internationale) et normes de service (Inventaire des services du GC), OGL-Canada 2.0, calculés au build. Aucun jeu
 * ouvert ne sépare les prolongations : elles sont comptées dans la résidence temporaire reçue, finalisée et approuvée.
 * Le délai publié par IRCC sur canada.ca n'est pas repris : le simulateur prend celui que le lecteur lit dans l'outil. */
const E = K.en, F = K.fr;
const rin = K.ops12('trIn'), fin = K.ops12('trFin'), ok = K.ops12('trOk');
const ap = K.approval12(), net = K.net12();
const ins = K.stdOf('work-inside')!;
const bo = K.imp12('bowp'), sw = K.imp12('spouseWorker'), imp = K.imp12('all');
const YEARS = ['2023', '2024', '2025'];
const yr = (y: string) => { const r = K.fullYear('trIn', 'ALL', y), f = K.fullYear('trFin', 'ALL', y), o = K.fullYear('trOk', 'ALL', y); return { r, f, o, rate: K.pctOf(o, f) }; };
const r23 = yr('2023'), r24 = yr('2024'), r25 = yr('2025');
const dirEn = (x: number | null) => (x == null ? 'about level' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');
if (!(r24.rate! < r23.rate!) || !(r25.rate! > r24.rate!) || !(ap.rate! > ap.prevRate!)) throw new Error('work-permit-extension : le texte suppose une part approuvée en creux en 2024 puis en reprise');
if (!(bo.change! > 0) || ins.cur.perf! >= 80 || !(ins.cur.perf! > ins.prev!.perf!) || !(net.net! < 0)) throw new Error('work-permit-extension : le texte suppose plus de permis transitoires et la norme au Canada manquée');

function rows(h: Helpers) {
  return YEARS.map((y) => { const x = yr(y); return [y, h.n(x.r), h.n(x.f), h.n(x.o), h.pct(x.rate)]; });
}

export default defineGuide({
  id: 'work-permit-extension', group: 'work', order: 32,
  tool: 'delai', toolArg: { g: 'work-ext', only: 'work-ext,work-inside,study-ext' },
  related: ['work-permit', 'pgwp', 'study-permit-extension', 'beyond-processing-time', 'cec', 'history'],
  sources: ['ptimes', 'od-std', 'open-data', 'od-work', 'extend-work', 'check-status', 'ogl'],
  en: {
    slug: 'work-permit-extension-processing-time',
    nav: 'Work permit extension', card: 'Decision date from IRCC’s estimate, working while you wait, approval by year',
    title: 'Work Permit Extension Processing Time and Date, 2026',
    description: 'Turn the work permit extension time IRCC shows you into a decision date, keep working while you wait, and see how IRCC decided in-Canada files up to 2026.',
    h1: 'Work permit extension: your decision date from IRCC’s estimate',
    intro: `IRCC approved ${E.pct(ap.rate)} of the temporary residence files it finalized from ${E.w12()}, extensions included, against ${E.pct(ap.prevRate)} a year earlier.`,
    resume: `For a work permit extension, IRCC’s “Check processing times” tool gives one figure in days: its estimate of how long a new application filed today should take. Copy it into the calculator above with the day you submitted your application online, and you get an estimated decision date. The rest of this page comes from Government of Canada open data under the Open Government Licence of Canada. No open dataset counts extensions separately; they are part of the temporary residence applications IRCC received, finalized and approved. From ${E.w12()}, IRCC finalized ${E.n(fin.last)} of those files and approved ${E.n(ok.last)}, or ${E.pct(ap.rate)}, up from ${E.pct(ap.prevRate)} the year before. The service standard for a work permit requested inside Canada, with a new or the same employer, is ${K.fmtStd(ins.cur, 'en')} for 80% of applications; IRCC met it for ${E.pct(ins.cur.perf)} of them in ${K.fmtFy(ins.fy, 'en')}.`,
    faqs: [
      { q: 'Can I keep working while my work permit extension is processed?', a: 'Yes, if you applied before your permit expired and you stay in Canada. You keep working under the same conditions, with the same employer if your permit is employer-specific, until IRCC decides. This is maintained status. If you leave Canada, you can return as a visitor but cannot work until the new permit is approved.' },
      { q: 'Is there a service standard for work permit extensions?', a: `Not a separate one. The Government of Canada service inventory, published as open data, gives ${K.fmtStd(ins.cur, 'en')} for work permits requested inside Canada, met for ${E.pct(ins.cur.perf)} of ${E.n(ins.cur.total)} applications in ${K.fmtFy(ins.fy, 'en')}, against a target of 80%. For an extension, the figure to use is the estimate on IRCC’s own tool.` },
      { q: 'What is a bridging open work permit?', a: `It lets a worker who has applied for permanent residence keep working while that application is processed, once the current permit is about to expire. Over ${E.w12(K.IMPD.months)}, ${E.n(bo.last)} took effect, ${dirEn(bo.change)} ${E.pa(bo.change)} on the year before, according to IRCC’s open data on work permit holders.` },
    ],
    body: (h) => `
<h2>From IRCC’s estimate to a date</h2>
<p>IRCC’s ${h.src('ptimes', '“Check processing times” tool')} gives a forward estimate for work permit extensions, in days, based on the files already in the queue. It is not a guarantee and it moves from week to week. This site does not copy that figure. Read it on IRCC’s tool, enter it in the calculator, and add the day you submitted your application. The calculator gives the estimated decision date and the days left, or the days you are already past.</p>
<p>The same online form covers several requests: more time with the same employer, a change of employer, or a change of conditions such as a new occupation or location. Each needs its own supporting documents, often a new job offer number from the employer or a new labour market impact assessment, and a missing document is the most common reason a file sits longer than the estimate.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'work-ext' }, t: 'Your extension: estimated decision date' })}
<h2>Working while you wait</h2>
<p>Apply ${h.src('extend-work', 'before your work permit expires')}, ideally 30 days or more ahead. If you do, you keep maintained status and can keep working under your current conditions until IRCC decides, however long that takes. An employer-specific permit still ties you to the same employer and job. The ${h.src('check-status', 'application status tracker')} shows any request for biometrics or a document; answering it quickly is the one thing that shortens your own wait.</p>
<p>If you have already applied for permanent residence, the extension may not be the right application: a ${h.src('od-work', 'bridging open work permit')} keeps you working while the permanent residence file is processed. ${h.n(bo.last)} of them took effect over the latest twelve months, ${dirEn(bo.change)} ${h.pa(bo.change)}. Spouses of skilled workers, who usually extend their open permit along with the worker’s, are another large group: ${h.n(sw.last)} of their permits took effect, among ${h.n(imp.last)} International Mobility Program permits in all.</p>
<h2>How IRCC decided temporary residence files</h2>
<p>IRCC’s ${h.src('open-data', 'operational processing data')} does not count extensions on their own. They are inside the temporary residence applications it received, finalized and approved. The approval share dropped from ${h.pct(r23.rate)} of finalized files in 2023 to ${h.pct(r24.rate)} in 2024, then recovered: ${h.pct(r25.rate)} in 2025 and ${h.pct(ap.rate)} over the latest twelve months. Finalized files include refusals and withdrawals, so the share moves with both, across visitor visas, study and work permits alike.</p>
${h.table(['Year', 'Received', 'Finalized', 'Approved', 'Share approved'], rows(h), 'Temporary residence applications, all countries, extensions included, by calendar year. Source: IRCC open data, Operational Processing; figures rounded to 5.', ['l', 'r', 'r', 'r', 'r'])}
<p>Over the latest twelve months, IRCC received ${h.n(rin.last)} temporary residence applications, ${dirEn(rin.change)} ${h.pa(rin.change)} on a year, and finalized ${h.n(fin.last)}. The balance of ${h.n(net.net)} between files opened and closed shows whether the queue grew or shrank: negative, it shrank.</p>
<h2>The in-Canada standard</h2>
<p>The Government of Canada service inventory, published as ${h.src('od-std', 'open data')}, has no line for extensions alone. The work permit requested inside Canada, with a new or the same employer, which covers most extensions, has a standard of ${K.fmtStd(ins.cur, 'en')} for 80% of applications. In ${K.fmtFy(ins.fy, 'en')}, IRCC met it for ${h.n(ins.cur.met)} of ${h.n(ins.cur.total)} applications, ${h.pct(ins.cur.perf)}, up from ${h.pct(ins.prev?.perf)} in ${K.fmtFy(ins.pfy!, 'en')}, but still short of the target. A file past the estimate is therefore common; the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} say what to do. To see how IRCC’s volumes moved over time, the ${h.a('history', 'processing volumes history')} goes back to 2023.</p>
`,
  },
  fr: {
    slug: 'delai-prolongation-permis-de-travail',
    nav: 'Prolongation du permis de travail', card: 'Date de décision à partir de l’estimation d’IRCC, travail pendant l’attente, approbation',
    title: 'Délai de prolongation du permis de travail en 2026',
    description: 'Transformez le délai de prolongation du permis de travail affiché par IRCC en date de décision, travaillez pendant l’attente et voyez les décisions 2026.',
    h1: 'Prolongation du permis de travail : votre date de décision',
    intro: `IRCC a approuvé ${F.pct(ap.rate)} des dossiers de résidence temporaire finalisés de ${F.w12()}, prolongations comprises, contre ${F.pct(ap.prevRate)} un an plus tôt.`,
    resume: `Pour une prolongation du permis de travail, l’outil « Vérifier les délais de traitement » d’IRCC donne un seul chiffre en jours : son estimation du temps que devrait prendre une demande déposée aujourd’hui. Recopiez-le dans le calculateur ci-dessus avec le jour d’envoi de votre demande en ligne : vous obtenez une date de décision estimée. Le reste de la page vient des données ouvertes du gouvernement du Canada, sous la Licence du gouvernement ouvert du Canada. Aucun jeu ouvert ne compte les prolongations à part : elles font partie des demandes de résidence temporaire reçues, finalisées et approuvées par IRCC. De ${F.w12()}, IRCC a finalisé ${F.n(fin.last)} de ces dossiers et en a approuvé ${F.n(ok.last)}, soit ${F.pct(ap.rate)}, contre ${F.pct(ap.prevRate)} l’année d’avant. La norme de service du permis de travail demandé au Canada, chez un nouvel employeur ou le même, est de ${K.fmtStd(ins.cur, 'fr')} pour 80 % des demandes ; IRCC l’a tenue pour ${F.pct(ins.cur.perf)} d’entre elles en ${K.fmtFy(ins.fy, 'fr')}.`,
    faqs: [
      { q: 'Puis-je continuer à travailler pendant le traitement de ma prolongation ?', a: 'Oui, si vous avez fait la demande avant l’expiration du permis et que vous restez au Canada. Vous continuez à travailler aux mêmes conditions, chez le même employeur si votre permis est lié à un employeur, jusqu’à la décision d’IRCC : c’est le statut maintenu. Si vous quittez le Canada, vous pouvez revenir comme visiteur mais sans travailler avant l’approbation du nouveau permis.' },
      { q: 'Existe-t-il une norme de service pour la prolongation du permis de travail ?', a: `Pas de norme distincte. L’inventaire des services du gouvernement du Canada, publié en données ouvertes, fixe ${K.fmtStd(ins.cur, 'fr')} pour les permis de travail demandés au Canada, tenue pour ${F.pct(ins.cur.perf)} des ${F.n(ins.cur.total)} demandes en ${K.fmtFy(ins.fy, 'fr')}, pour une cible de 80 %. Pour une prolongation, le chiffre à retenir est l’estimation de l’outil d’IRCC.` },
      { q: 'Qu’est-ce qu’un permis de travail ouvert transitoire ?', a: `Il permet à un travailleur qui a demandé la résidence permanente de continuer à travailler pendant le traitement de cette demande, quand son permis actuel arrive à échéance. De ${F.w12(K.IMPD.months)}, ${F.n(bo.last)} sont entrés en vigueur, ${dirFr(bo.change)} de ${F.pa(bo.change)} sur un an, d’après les données ouvertes d’IRCC sur les titulaires de permis de travail.` },
    ],
    body: (h) => `
<h2>De l’estimation d’IRCC à une date</h2>
<p>L’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC donne pour la prolongation du permis de travail une estimation prospective, en jours, fondée sur les dossiers déjà dans la file. Ce n’est pas un engagement et le chiffre bouge d’une semaine à l’autre. Ce site ne le recopie pas. Lisez-le dans l’outil d’IRCC, saisissez-le dans le calculateur et indiquez le jour d’envoi de la demande. Le calculateur donne la date de décision estimée et les jours restants, ou ceux déjà dépassés.</p>
${h.mini('delai', { p: ['n', 'm', 'd'], d: { g: 'work-ext' }, t: 'Votre prolongation : date de décision estimée' })}
<h2>Travailler pendant l’attente</h2>
<p>Déposez ${h.src('extend-work', 'avant l’expiration du permis de travail')}, idéalement 30 jours avant ou plus. Dans ce cas, vous gardez le statut maintenu et pouvez continuer à travailler aux conditions actuelles jusqu’à la décision d’IRCC, quel que soit le temps qu’elle prend. Un permis lié à un employeur vous attache toujours au même employeur et au même poste. L’${h.src('check-status', 'outil de suivi des demandes')} affiche toute demande de biométrie ou de document ; y répondre vite est la seule chose qui raccourcit votre propre attente.</p>
<p>Si vous avez déjà demandé la résidence permanente, la prolongation n’est peut-être pas la bonne demande : un ${h.src('od-work', 'permis de travail ouvert transitoire')} vous permet de travailler pendant le traitement du dossier de résidence permanente. ${h.n(bo.last)} sont entrés en vigueur sur les douze derniers mois, ${dirFr(bo.change)} de ${h.pa(bo.change)}. Les conjoints de travailleurs qualifiés, qui prolongent en général leur permis ouvert en même temps que le travailleur, forment un autre grand groupe : ${h.n(sw.last)} de leurs permis sont entrés en vigueur, sur ${h.n(imp.last)} permis du Programme de mobilité internationale au total.</p>
<h2>Comment IRCC a tranché les dossiers de résidence temporaire</h2>
<p>Les ${h.src('open-data', 'données de traitement opérationnel')} d’IRCC ne comptent pas les prolongations à part. Elles sont comprises dans les demandes de résidence temporaire reçues, finalisées et approuvées. La part approuvée est passée de ${h.pct(r23.rate)} des dossiers finalisés en 2023 à ${h.pct(r24.rate)} en 2024, puis s’est redressée : ${h.pct(r25.rate)} en 2025 et ${h.pct(ap.rate)} sur les douze derniers mois. Les dossiers finalisés comprennent les refus et les retraits : la part bouge avec les deux, pour les visas de visiteur comme pour les permis d’études et de travail.</p>
${h.table(['Année', 'Reçues', 'Finalisées', 'Approuvées', 'Part approuvée'], rows(h), 'Demandes de résidence temporaire, tous pays, prolongations comprises, par année civile. Source : IRCC, données ouvertes, Traitement opérationnel ; chiffres arrondis à 5.', ['l', 'r', 'r', 'r', 'r'])}
<p>Sur les douze derniers mois, IRCC a reçu ${h.n(rin.last)} demandes de résidence temporaire, ${dirFr(rin.change)} de ${h.pa(rin.change)} sur un an, et en a finalisé ${h.n(fin.last)}. Le solde de ${h.n(net.net)} entre dossiers ouverts et fermés dit si la file s’est allongée ou raccourcie : négatif, elle a raccourci.</p>
<h2>La norme des demandes faites au Canada</h2>
<p>L’inventaire des services du gouvernement du Canada, publié en ${h.src('od-std', 'données ouvertes')}, n’a pas de ligne pour les seules prolongations. Le permis de travail demandé au Canada, chez un nouvel employeur ou le même, ce qui couvre la plupart des prolongations, a une norme de ${K.fmtStd(ins.cur, 'fr')} pour 80 % des demandes. En ${K.fmtFy(ins.fy, 'fr')}, IRCC l’a tenue pour ${h.n(ins.cur.met)} demandes sur ${h.n(ins.cur.total)}, soit ${h.pct(ins.cur.perf)}, contre ${h.pct(ins.prev?.perf)} en ${K.fmtFy(ins.pfy!, 'fr')}, mais toujours en dessous de la cible. Un dossier au-delà de l’estimation est donc fréquent ; les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} disent quoi faire. Pour voir l’évolution des volumes d’IRCC, l’${h.a('history', 'historique des volumes de traitement')} remonte à 2023.</p>
`,
  },
});
