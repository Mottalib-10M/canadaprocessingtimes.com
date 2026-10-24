import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : normes de service d'IRCC (Inventaire des services du GC) et données ouvertes d'IRCC
 * (Operational Processing, titulaires de permis du Programme de mobilité internationale), OGL-Canada 2.0, calculés au
 * build. Le délai publié par IRCC sur canada.ca n'est pas repris : le simulateur prend celui que le lecteur lit dans
 * l'outil d'IRCC. */
const E = K.en, F = K.fr;
const out = K.stdOf('work')!, ins = K.stdOf('work-inside')!;
const KEYS = ['pgwp', 'spouseWorker', 'iec', 'bowp', 'ict', 'spouseStudent'] as const;
const imp = K.imp12('all');
const pg = K.imp12('pgwp'), sw = K.imp12('spouseWorker'), ss = K.imp12('spouseStudent'), ict = K.imp12('ict'), bo = K.imp12('bowp');
const pgShare = K.pctOf(pg.last, imp.last);
const ok = K.ops12('trOk'), ap = K.approval12();
const aIN = K.approval12('IN'), aPH = K.approval12('PH'), aFR = K.approval12('FR'), aMX = K.approval12('MX');
const dirEn = (x: number | null) => (x == null ? 'about level' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');
if (out.cur.perf! >= 80 || ins.cur.perf! >= 80) throw new Error('work-permit : le texte suppose les deux normes du permis de travail manquées');
if (!(ins.cur.perf! > ins.prev!.perf!)) throw new Error('work-permit : le texte suppose un progrès de la norme au Canada');
if (!(sw.change! > 0) || out.cur.perf! < 68 || ins.cur.perf! < 68) throw new Error('work-permit : le texte suppose une hausse des conjoints de travailleurs et environ un dossier sur quatre hors norme');
if (!(ss.change! < 0)) throw new Error('work-permit : le texte suppose une baisse des permis de conjoints d’étudiants');

function rows(h: Helpers, l: 'en' | 'fr') {
  return KEYS.map((k) => { const x = K.imp12(k); return [K.impName(k, l), h.n(x.last), h.n(x.prev), h.ch(x.change)]; });
}

export default defineGuide({
  id: 'work-permit', group: 'work', order: 30,
  tool: 'delai', toolArg: { g: 'work', c: 'IN', only: 'work,work-inside,work-ext,iec' },
  related: ['pgwp', 'work-permit-extension', 'iec', 'study-permit', 'india', 'philippines'],
  sources: ['ptimes', 'od-std', 'open-data', 'od-work', 'work-permit', 'biometrics', 'ogl'],
  en: {
    slug: 'work-permit-processing-time',
    nav: 'Work permit', card: 'Decision date from IRCC’s time, 2 and 4 month standards, permits by program',
    title: 'Work Permit Processing Time and Decision Date, 2026',
    description: 'Turn the work permit time IRCC shows you into a decision date, with IRCC’s 2026 service standards and the work permits that took effect, by program, in Canada.',
    h1: 'Work permit: from IRCC’s processing time to your decision date',
    intro: `${E.n(imp.last)} International Mobility Program work permits took effect from ${E.w12(K.IMPD.months)}, ${E.ch(imp.change)} on the year before.`,
    resume: `IRCC publishes the processing time of a work permit on its “Check processing times” tool, by country of filing for applications made from abroad and as a single figure for those made inside Canada. Copy that figure into the calculator above with the day IRCC received your complete application, and you get an estimated decision date. The rest of this page comes from Government of Canada open data under the Open Government Licence of Canada. IRCC’s service standard is ${K.fmtStd(out.cur, 'en')} for a work permit requested from outside Canada and ${K.fmtStd(ins.cur, 'en')} for one requested inside Canada, each for 80% of applications. In ${K.fmtFy(out.fy, 'en')}, IRCC met them for only ${E.pct(out.cur.perf)} and ${E.pct(ins.cur.perf)} of applications, so a file beyond the standard is common. Over ${E.w12(K.IMPD.months)}, ${E.n(imp.last)} work permits took effect under the International Mobility Program, ${E.n(pg.last)} of them post-graduation work permits.`,
    faqs: [
      { q: 'Is IRCC meeting its work permit service standard?', a: `No. In ${K.fmtFy(out.fy, 'en')}, IRCC processed ${E.pct(out.cur.perf)} of ${E.n(out.cur.total)} work permit applications made from outside Canada within ${K.fmtStd(out.cur, 'en')}, against a target of 80%. Inside Canada, it processed ${E.pct(ins.cur.perf)} of ${E.n(ins.cur.total)} applications within ${K.fmtStd(ins.cur, 'en')}, up from ${E.pct(ins.prev?.perf)} the year before. The figures come from the service inventory the Government of Canada publishes as open data.` },
      { q: 'Which work permit is issued most often?', a: `The post-graduation work permit. Over ${E.w12(K.IMPD.months)}, ${E.n(pg.last)} took effect, ${E.pct(pgShare)} of all International Mobility Program permits, ${dirEn(pg.change)} ${E.pa(pg.change)} on the year before. Open work permits for spouses of skilled workers came next with ${E.n(sw.last)}, ahead of International Experience Canada.` },
      { q: 'Does the time on IRCC’s tool include biometrics?', a: 'No. The time starts when IRCC has your complete application, biometrics included. If you still need to give your fingerprints and photo at a visa application centre, the wait for an appointment comes on top, and so does any later request for a medical exam or a document.' },
    ],
    body: (h) => `
<h2>From the time IRCC shows to a date</h2>
<p>IRCC publishes the current work permit processing time on its ${h.src('ptimes', '“Check processing times” tool')}. For an application made from outside Canada, it gives one figure per country of filing, usually in weeks; for one made inside Canada, a single figure, in days. This site does not copy those figures. Read the one that applies to you, enter it with its unit, and add the month and day IRCC received your complete application. The calculator adds the time and says how much is left, or by how many days you are past it.</p>
<p>The figure is a past time: the delay within which 80% of recently decided work permit applications were finished. It covers employer-specific and open permits alike, so a file that needs a labour market impact assessment checked, or an employer compliance review, can take longer than the line suggests.</p>
${h.mini('delai', { p: ['n', 'u', 'm'], d: { g: 'work', m: 'none' }, t: 'Your work permit: estimated decision date' })}
<h2>Two standards IRCC is missing</h2>
<p>IRCC sets a service standard for work permits and reports each year how many files met it, in the Government of Canada service inventory published as ${h.src('od-std', 'open data')}. From outside Canada, the standard is ${K.fmtStd(out.cur, 'en')} for 80% of applications; in ${K.fmtFy(out.fy, 'en')}, ${h.n(out.cur.met)} of ${h.n(out.cur.total)} applications met it, ${h.pct(out.cur.perf)}, against ${h.pct(out.prev?.perf)} in ${K.fmtFy(out.pfy!, 'en')}. Inside Canada, the standard is ${K.fmtStd(ins.cur, 'en')}, met for ${h.pct(ins.cur.perf)} of ${h.n(ins.cur.total)} applications, an improvement on ${h.pct(ins.prev?.perf)} the year before. Neither reaches the 80% target. Read the time IRCC shows as typical, not as a ceiling: roughly one file in four ran past the standard.</p>
<h2>Which permits take effect</h2>
<p>IRCC’s ${h.src('od-work', 'work permit holders data')} counts the International Mobility Program permits that took effect each month, by program. These are permits that do not need a labour market impact assessment, and they make up most work permits. Over the latest twelve months, ${h.n(imp.last)} took effect, ${h.ch(imp.change)} on the year before.</p>
${h.table(['Program', 'Permits that took effect, 12 months', 'Previous 12 months', 'Change'], rows(h, 'en'), `${h.w12(K.IMPD.months)}. Source: IRCC open data, International Mobility Program work permit holders; figures rounded to 5.`, ['l', 'r', 'r', 'r'])}
<p>Post-graduation work permits lead with ${h.n(pg.last)}, ${h.pct(pgShare)} of the total. Permits for spouses of skilled workers rose ${h.pa(sw.change)} to ${h.n(sw.last)}, while those for spouses of students fell ${h.pa(ss.change)} to ${h.n(ss.last)}, after IRCC narrowed that permit to spouses of master’s, doctoral and some professional students in 2024. Bridging open work permits, for workers waiting on permanent residence, reached ${h.n(bo.last)}, and intra-company transfers ${h.n(ict.last)}.</p>
<h2>Approval across temporary residence</h2>
<p>The ${h.src('open-data', 'operational processing data')} does not split work permit decisions from other temporary residence files. Across all of them, IRCC approved ${h.n(ok.last)} applications over the latest twelve months, ${h.pct(ap.rate)} of those it finalized, against ${h.pct(ap.prevRate)} the year before. The share varies by country of citizenship: ${h.pct(aIN.rate)} for ${h.a('india', 'India')}, ${h.pct(aPH.rate)} for ${h.a('philippines', 'the Philippines')}, ${h.pct(aMX.rate)} for ${h.a('mexico', 'Mexico')} and ${h.pct(aFR.rate)} for ${h.a('france', 'France')}. It mixes visitor visas, study and work permits, so read it as a country signal rather than a work permit acceptance rate.</p>
<h2>Before you rely on the date</h2>
<p>Use the date IRCC received the complete application. Biometrics, a medical exam for some jobs and countries, and any request for documents add time the figure does not include. If you already hold a permit and want to keep working, the right line is the ${h.a('work-permit-extension', 'work permit extension')}. Graduates should look at the ${h.a('pgwp', 'post-graduation work permit')}, and young people from partner countries at ${h.a('iec', 'International Experience Canada')}.</p>
`,
  },
  fr: {
    slug: 'delai-permis-de-travail',
    nav: 'Permis de travail', card: 'Date de décision à partir du délai d’IRCC, normes de 2 et 4 mois, permis par programme',
    title: 'Délai du permis de travail et date de décision en 2026',
    description: 'Transformez le délai du permis de travail affiché par IRCC en date de décision, avec les normes de service 2026 d’IRCC et les permis entrés en vigueur.',
    h1: 'Permis de travail : du délai d’IRCC à votre date de décision',
    intro: `${F.n(imp.last)} permis du Programme de mobilité internationale sont entrés en vigueur de ${F.w12(K.IMPD.months)}, soit ${F.ch(imp.change)} sur un an.`,
    resume: `IRCC publie le délai de traitement du permis de travail dans son outil « Vérifier les délais de traitement », par pays de dépôt pour une demande faite à l’étranger et en un seul chiffre pour une demande faite au Canada. Recopiez ce chiffre dans le calculateur ci-dessus avec le jour où IRCC a reçu votre demande complète : vous obtenez une date de décision estimée. Le reste de la page vient des données ouvertes du gouvernement du Canada, sous la Licence du gouvernement ouvert du Canada. La norme de service d’IRCC est de ${K.fmtStd(out.cur, 'fr')} pour un permis de travail demandé hors du Canada et de ${K.fmtStd(ins.cur, 'fr')} pour une demande faite au Canada, chaque fois pour 80 % des demandes. En ${K.fmtFy(out.fy, 'fr')}, IRCC ne les a tenues que pour ${F.pct(out.cur.perf)} et ${F.pct(ins.cur.perf)} des demandes : dépasser la norme est fréquent. De ${F.w12(K.IMPD.months)}, ${F.n(imp.last)} permis du Programme de mobilité internationale sont entrés en vigueur, dont ${F.n(pg.last)} permis de travail postdiplôme.`,
    faqs: [
      { q: 'IRCC respecte-t-il sa norme de service pour le permis de travail ?', a: `Non. En ${K.fmtFy(out.fy, 'fr')}, IRCC a traité ${F.pct(out.cur.perf)} des ${F.n(out.cur.total)} demandes présentées à l’étranger en ${K.fmtStd(out.cur, 'fr')} ou moins, pour une cible de 80 %. Au Canada, il a traité ${F.pct(ins.cur.perf)} des ${F.n(ins.cur.total)} demandes en ${K.fmtStd(ins.cur, 'fr')} ou moins, contre ${F.pct(ins.prev?.perf)} l’exercice d’avant. Ces chiffres viennent de l’inventaire des services publié en données ouvertes par le gouvernement du Canada.` },
      { q: 'Quel permis de travail est délivré le plus souvent ?', a: `Le permis de travail postdiplôme. De ${F.w12(K.IMPD.months)}, ${F.n(pg.last)} sont entrés en vigueur, soit ${F.pct(pgShare)} de tous les permis du Programme de mobilité internationale, ${dirFr(pg.change)} de ${F.pa(pg.change)} sur un an. Les permis ouverts des conjoints de travailleurs qualifiés suivent avec ${F.n(sw.last)}.` },
      { q: 'Le délai de l’outil d’IRCC comprend-il la biométrie ?', a: 'Non. Le délai court à partir du moment où IRCC a votre demande complète, biométrie comprise. S’il vous reste à donner vos empreintes et votre photo dans un centre de réception des demandes de visa, l’attente du rendez-vous s’ajoute, comme toute demande ultérieure d’examen médical ou de document.' },
    ],
    body: (h) => `
<h2>Du délai affiché par IRCC à une date</h2>
<p>IRCC publie le délai actuel du permis de travail dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. Pour une demande faite hors du Canada, il donne un chiffre par pays de dépôt, le plus souvent en semaines ; pour une demande faite au Canada, un seul chiffre, en jours. Ce site ne recopie pas ces chiffres. Lisez celui qui vous concerne, saisissez-le avec son unité, puis indiquez le mois et le jour où IRCC a reçu votre demande complète. Le calculateur ajoute le délai et dit ce qui reste, ou de combien de jours vous le dépassez.</p>
<p>Ce chiffre est un délai passé : le temps dans lequel 80 % des demandes de permis de travail tranchées récemment ont été terminées. Il mêle permis liés à un employeur et permis ouverts : un dossier qui exige la vérification d’une étude d’impact sur le marché du travail, ou un contrôle de l’employeur, peut prendre plus longtemps que ne le laisse croire la ligne.</p>
${h.mini('delai', { p: ['n', 'u', 'm'], d: { g: 'work', c: 'FR', m: 'none' }, t: 'Votre permis de travail : date de décision estimée' })}
<h2>Deux normes qu’IRCC ne tient pas</h2>
<p>IRCC fixe une norme de service pour le permis de travail et publie chaque année le nombre de dossiers qui l’ont respectée, dans l’inventaire des services du gouvernement du Canada diffusé en ${h.src('od-std', 'données ouvertes')}. Depuis l’étranger, la norme est de ${K.fmtStd(out.cur, 'fr')} pour 80 % des demandes ; en ${K.fmtFy(out.fy, 'fr')}, ${h.n(out.cur.met)} demandes sur ${h.n(out.cur.total)} l’ont respectée, soit ${h.pct(out.cur.perf)}, contre ${h.pct(out.prev?.perf)} en ${K.fmtFy(out.pfy!, 'fr')}. Au Canada, la norme est de ${K.fmtStd(ins.cur, 'fr')}, tenue pour ${h.pct(ins.cur.perf)} des ${h.n(ins.cur.total)} demandes, un progrès par rapport aux ${h.pct(ins.prev?.perf)} de l’exercice d’avant. Aucune n’atteint la cible de 80 %. Lisez le délai affiché comme un délai courant, pas comme un plafond : environ un dossier sur quatre a dépassé la norme.</p>
<h2>Les permis qui entrent en vigueur</h2>
<p>Les ${h.src('od-work', 'données des titulaires de permis de travail')} d’IRCC comptent les permis du Programme de mobilité internationale entrés en vigueur chaque mois, par programme. Ce sont les permis qui ne demandent pas d’étude d’impact sur le marché du travail, et ils forment la majorité des permis de travail. Sur les douze derniers mois, ${h.n(imp.last)} sont entrés en vigueur, soit ${h.ch(imp.change)} sur un an.</p>
${h.table(['Programme', 'Permis entrés en vigueur, 12 mois', '12 mois précédents', 'Écart'], rows(h, 'fr'), `${h.w12(K.IMPD.months)}. Source : IRCC, données ouvertes, titulaires de permis du Programme de mobilité internationale ; chiffres arrondis à 5.`, ['l', 'r', 'r', 'r'])}
<p>Les permis de travail postdiplôme arrivent en tête avec ${h.n(pg.last)}, soit ${h.pct(pgShare)} du total. Les permis des conjoints de travailleurs qualifiés progressent de ${h.pa(sw.change)} à ${h.n(sw.last)}, tandis que ceux des conjoints d’étudiants reculent de ${h.pa(ss.change)} à ${h.n(ss.last)}, depuis qu’IRCC a réservé ce permis en 2024 aux conjoints d’étudiants à la maîtrise, au doctorat et dans certains programmes professionnels. Les permis de travail ouverts transitoires, pour les travailleurs qui attendent leur résidence permanente, atteignent ${h.n(bo.last)}, et les mutations à l’intérieur d’une entreprise ${h.n(ict.last)}.</p>
<h2>L’approbation sur l’ensemble de la résidence temporaire</h2>
<p>Les ${h.src('open-data', 'données de traitement opérationnel')} ne séparent pas les décisions de permis de travail des autres dossiers de résidence temporaire. Sur l’ensemble, IRCC a approuvé ${h.n(ok.last)} demandes sur les douze derniers mois, soit ${h.pct(ap.rate)} des dossiers finalisés, contre ${h.pct(ap.prevRate)} l’année d’avant. La part varie selon le pays de citoyenneté : ${h.pct(aFR.rate)} pour la ${h.a('france', 'France')}, ${h.pct(aIN.rate)} pour l’${h.a('india', 'Inde')}, ${h.pct(aPH.rate)} pour les ${h.a('philippines', 'Philippines')} et ${h.pct(aMX.rate)} pour le ${h.a('mexico', 'Mexique')}. Elle mêle visas de visiteur, permis d’études et de travail : c’est un signal par pays, pas un taux d’acceptation des permis de travail.</p>
<h2>Avant de vous fier à la date</h2>
<p>Retenez la date à laquelle IRCC a reçu la demande complète. La biométrie, l’examen médical exigé pour certains emplois et certains pays, et toute demande de documents ajoutent un temps que le chiffre ne compte pas. Si vous avez déjà un permis et voulez continuer à travailler, la bonne ligne est la ${h.a('work-permit-extension', 'prolongation du permis de travail')}. Les diplômés regarderont le ${h.a('pgwp', 'permis de travail postdiplôme')}, et les jeunes des pays partenaires ${h.a('iec', 'Expérience internationale Canada')}.</p>
`,
  },
});
