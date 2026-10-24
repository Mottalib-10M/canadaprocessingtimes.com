import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { extremes } from '../../lib/engine/times';

/* Chiffres de la page : normes de service d'IRCC (Inventaire des services du GC) et données ouvertes d'IRCC
 * (Operational Processing, titulaires de permis d'études), OGL-Canada 2.0, calculés au build. Le délai publié par
 * IRCC sur canada.ca n'est pas repris : le simulateur prend celui que le lecteur lit dans l'outil d'IRCC. */
const E = K.en, F = K.fr;
const out = K.stdOf('study')!, ins = K.stdOf('study-inside')!;
const sp = K.ops12('spFin');
const eff = K.study12();
const top = K.COUNTRIES.map((c) => [c, K.ops12('spFin', c).last ?? 0] as const).sort((a, b) => b[1] - a[1]);
const top8 = top.slice(0, 8).map(([c]) => c);
const c1 = top[0][0], c2 = top[1][0], c3 = top[2][0];
const s1 = K.ops12('spFin', c1), s2 = K.ops12('spFin', c2);
const shareTop = K.pctOf(s1.last, sp.last);
const y = (yr: string) => K.yearSum(K.studySeries(), K.STD.months, yr);
const e23 = y('2023'), e24 = y('2024'), e25 = y('2025');
const effTop = K.COUNTRIES.map((c) => [c, K.study12(c).last ?? 0] as const).sort((a, b) => b[1] - a[1])[0][0];
const upEn = (x: number | null) => (x == null ? 'about level with' : x > 0 ? 'up' : 'down');
const upFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');
const hi = extremes(K.studySeries(), K.STD.months).hi!;
if (!hi[0].endsWith('-08') || out.cur.perf! < 80 || ins.cur.perf! < 80 || K.stdOf('work')!.cur.perf! >= 80) throw new Error('study-permit : le texte suppose les deux normes d’études tenues et celle du permis de travail manquée');
const MA = K.ops12('spFin', 'MA'), CM = K.ops12('spFin', 'CM'), FRc = K.ops12('spFin', 'FR');

function rows(h: Helpers) {
  return top8.map((c) => {
    const f = K.ops12('spFin', c), s = K.study12(c), a = K.approval12(c);
    return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.n(f.last), h.ch(f.change), h.n(s.last), h.pct(a.rate)];
  });
}

export default defineGuide({
  id: 'study-permit', group: 'study', order: 20,
  tool: 'delai', toolArg: { g: 'study', c: 'IN', only: 'study,study-inside,study-ext' },
  related: ['study-permit-extension', 'pgwp', 'work-permit', 'india', 'vietnam', 'nigeria'],
  sources: ['ptimes', 'od-std', 'open-data', 'od-study', 'study-permit', 'biometrics', 'ogl'],
  en: {
    slug: 'study-permit-processing-time',
    nav: 'Study permit', card: 'Decision date from IRCC’s time, 2 and 4 month standards, decisions by country',
    title: 'Study Permit Processing Time and Decision Date, 2026',
    description: 'Turn the study permit time IRCC shows you into a decision date, with IRCC’s 2026 service standards and the new study permit decisions made by country.',
    h1: 'Study permit: from IRCC’s processing time to your decision date',
    intro: `IRCC finalized ${E.n(sp.last)} new study permit applications from ${E.w12()}, ${E.ch(sp.change)} on the twelve months before.`,
    resume: `The processing time of a study permit is published by IRCC on its “Check processing times” tool, by country of filing for applications made from abroad and as a single line for those made inside Canada. Copy that figure into the calculator above with the day IRCC received your complete application, and you get an estimated decision date. The rest of this page comes from Government of Canada open data under the Open Government Licence of Canada. IRCC’s service standard is ${K.fmtStd(out.cur, 'en')} for a new study permit requested from outside Canada and ${K.fmtStd(ins.cur, 'en')} for one requested inside Canada, each for 80% of applications; in ${K.fmtFy(out.fy, 'en')}, IRCC met them for ${E.pct(out.cur.perf)} and ${E.pct(ins.cur.perf)} of applications. From ${E.w12()}, it finalized ${E.n(sp.last)} new study permit applications, ${E.n(s1.last)} of them for citizens of ${K.countryName(c1, 'en')}, and ${E.n(eff.last)} study permits took effect over the same months.`,
    faqs: [
      { q: 'Is IRCC meeting its two-month study permit standard?', a: `For most files, yes. In ${K.fmtFy(out.fy, 'en')}, IRCC processed ${E.n(out.cur.met)} of ${E.n(out.cur.total)} new study permit applications made from outside Canada within ${K.fmtStd(out.cur, 'en')}, or ${E.pct(out.cur.perf)}, against a target of 80%. The year before, the share was ${E.pct(out.prev?.perf)}. The figure comes from the service inventory the Government of Canada publishes as open data.` },
      { q: 'Does a study permit requested inside Canada take longer?', a: `IRCC’s own standard is longer: ${K.fmtStd(ins.cur, 'en')} instead of ${K.fmtStd(out.cur, 'en')}. It met that standard for ${E.pct(ins.cur.perf)} of ${E.n(ins.cur.total)} applications in ${K.fmtFy(ins.fy, 'en')}. For the time IRCC currently shows, pick the inside Canada line on its tool and copy the figure into the calculator.` },
      { q: 'Why did fewer study permit decisions come out this year?', a: `IRCC finalized ${E.n(sp.last)} new study permit applications over the latest twelve months, against ${E.n(sp.prev)} the year before. The open data does not give the reason, but the federal cap on study permits for most post-secondary students, in force since 2024, reduced the number of new applications reaching IRCC in the first place.` },
    ],
    body: (h) => `
<h2>From the time IRCC shows to a date</h2>
<p>IRCC publishes the current study permit processing time on its ${h.src('ptimes', '“Check processing times” tool')}. For an application made from outside Canada, it gives one figure per country of filing, usually in weeks; for an application made inside Canada, a single figure. This site does not copy those figures. Read the one that applies to you, enter it in the calculator with its unit, and add the month and day IRCC received your complete application. The calculator adds the time in that unit and says how much is left, or by how many days you are past it.</p>
<p>The figure on IRCC’s tool is a past time: the delay within which 80% of the study permit applications recently decided for that country were finished. The wait for biometrics and any request for documents, a medical exam or a letter of acceptance check come on top.</p>
${h.mini('delai', { p: ['n', 'u', 'm'], d: { g: 'study', m: 'none' }, t: 'Your study permit: estimated decision date' })}
<h2>Two service standards, two results</h2>
<p>IRCC sets a service standard for study permits and reports each year how many files met it, in the Government of Canada service inventory published as ${h.src('od-std', 'open data')}. From outside Canada, the standard is ${K.fmtStd(out.cur, 'en')} for 80% of new applications; in ${K.fmtFy(out.fy, 'en')}, ${h.n(out.cur.met)} of ${h.n(out.cur.total)} applications were processed within it, ${h.pct(out.cur.perf)}, against ${h.pct(out.prev?.perf)} in ${K.fmtFy(out.pfy!, 'en')}. Inside Canada, the standard is ${K.fmtStd(ins.cur, 'en')}, met for ${h.pct(ins.cur.perf)} of ${h.n(ins.cur.total)} applications. Both standards were met overall, which is not the case for every IRCC line: a visitor visa or a work permit from abroad falls well short of its own target.</p>
<p>A standard met for four files in five still leaves one in five beyond it. If your file is past the time you entered, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} explain what to check first.</p>
<h2>Where new study permit decisions go</h2>
<p>IRCC’s ${h.src('open-data', 'operational processing data')} counts, month by month and by country of citizenship, the new study permit applications it finalized, whatever the outcome. The table lists the eight countries with the most decisions over the latest twelve months, the number of study permits that took effect for their citizens, from the ${h.src('od-study', 'study permit holders dataset')}, and the share of all their temporary residence files that ended in an approval.</p>
${h.table(['Country of citizenship', 'New study permit applications finalized', 'Change on a year', 'Study permits that took effect', 'Temporary residence files approved'], rows(h), `${h.w12()}. Finalized means approved, refused or withdrawn. Sources: IRCC open data, Operational Processing and study permit holders; figures rounded to 5.`, ['l', 'r', 'r', 'r', 'r'])}
<p>${h.cn(c1)} leads with ${h.n(s1.last)} decisions, ${h.pct(shareTop)} of the total, ${upEn(s1.change)} ${h.pa(s1.change)} on a year. ${h.cn(c2)} follows with ${h.n(s2.last)} and ${h.cn(c3)} comes third. Among French-speaking countries, IRCC finalized ${h.n(FRc.last)} new applications for French citizens, ${h.n(MA.last)} for Moroccans and ${h.n(CM.last)} for Cameroonians. The approval share in the last column covers visitor visas and work permits too, so read it as a broad signal for the country, not as a study permit acceptance rate.</p>
<h2>Permits that actually start</h2>
<p>A decision is not a permit in hand. The study permit holders data counts the permits that took effect each month, including those issued inside Canada. Over the latest twelve months, ${h.n(eff.last)} study permits took effect, ${h.ch(eff.change)} on the year before; the most went to citizens of ${h.cn(effTop)}. By calendar year, the count was ${h.n(e23)} in 2023, ${h.n(e24)} in 2024 and ${h.n(e25)} in 2025. The monthly count follows the school calendar: the busiest month in the series was ${h.my(hi[0])}, with ${h.n(hi[1])} permits, just before the fall term.</p>
${h.months(K.STD.months, [['Study permits that took effect', K.studySeries()]], { caption: 'Study permits that took effect, all countries, by month, newest first. Source: IRCC open data, study permit holders; figures rounded to 5.' })}
<h2>Before you rely on the date</h2>
<p>Use the date IRCC received the complete application, which for an online file is the submission date. Biometrics are given at a visa application centre after the request, and the time on IRCC’s tool does not count that wait. A provincial attestation letter is required for most post-secondary programs: a missing letter sends the file back rather than slowing it. Once you hold a permit, renewing it is a ${h.a('study-permit-extension', 'study permit extension')}, and after graduation the next step is usually a ${h.a('pgwp', 'post-graduation work permit')}.</p>
`,
  },
  fr: {
    slug: 'delai-permis-etudes',
    nav: 'Permis d’études', card: 'Date de décision à partir du délai d’IRCC, normes de 2 et 4 mois, décisions par pays',
    title: 'Délai du permis d’études et date de décision en 2026',
    description: 'Transformez le délai du permis d’études affiché par IRCC en date de décision, avec les normes de service 2026 d’IRCC et les décisions rendues par pays.',
    h1: 'Permis d’études : du délai d’IRCC à votre date de décision',
    intro: `IRCC a finalisé ${F.n(sp.last)} nouvelles demandes de permis d’études de ${F.w12()}, soit ${F.ch(sp.change)} par rapport aux douze mois d’avant.`,
    resume: `Le délai de traitement du permis d’études est publié par IRCC dans son outil « Vérifier les délais de traitement », par pays de dépôt pour une demande faite à l’étranger et en une seule ligne pour une demande faite au Canada. Recopiez ce chiffre dans le calculateur ci-dessus avec le jour où IRCC a reçu votre demande complète : vous obtenez une date de décision estimée. Le reste de la page vient des données ouvertes du gouvernement du Canada, sous la Licence du gouvernement ouvert du Canada. La norme de service d’IRCC est de ${K.fmtStd(out.cur, 'fr')} pour un nouveau permis d’études demandé hors du Canada et de ${K.fmtStd(ins.cur, 'fr')} pour une demande faite au Canada, chaque fois pour 80 % des demandes ; en ${K.fmtFy(out.fy, 'fr')}, IRCC les a tenues pour ${F.pct(out.cur.perf)} et ${F.pct(ins.cur.perf)} des demandes. De ${F.w12()}, il a finalisé ${F.n(sp.last)} nouvelles demandes, dont ${F.n(FRc.last)} de citoyens français et ${F.n(MA.last)} de citoyens marocains, et ${F.n(eff.last)} permis d’études sont entrés en vigueur.`,
    faqs: [
      { q: 'IRCC respecte-t-il sa norme de deux mois pour le permis d’études ?', a: `Pour la plupart des dossiers, oui. En ${K.fmtFy(out.fy, 'fr')}, IRCC a traité ${F.n(out.cur.met)} des ${F.n(out.cur.total)} nouvelles demandes présentées à l’étranger en ${K.fmtStd(out.cur, 'fr')} ou moins, soit ${F.pct(out.cur.perf)}, pour une cible de 80 %. L’exercice précédent, la part était de ${F.pct(out.prev?.perf)}. Ce chiffre vient de l’inventaire des services publié en données ouvertes par le gouvernement du Canada.` },
      { q: 'Un permis d’études demandé au Canada prend-il plus de temps ?', a: `La norme d’IRCC est plus longue : ${K.fmtStd(ins.cur, 'fr')} au lieu de ${K.fmtStd(out.cur, 'fr')}. Elle a été tenue pour ${F.pct(ins.cur.perf)} des ${F.n(ins.cur.total)} demandes en ${K.fmtFy(ins.fy, 'fr')}. Pour le délai qu’IRCC affiche en ce moment, choisissez la ligne des demandes faites au Canada dans son outil et recopiez le chiffre dans le calculateur.` },
      { q: 'Pourquoi IRCC a-t-il rendu moins de décisions de permis d’études ?', a: `IRCC a finalisé ${F.n(sp.last)} nouvelles demandes de permis d’études sur les douze derniers mois, contre ${F.n(sp.prev)} un an plus tôt. Les données ouvertes ne donnent pas la raison, mais le plafond fédéral des permis d’études pour la plupart des étudiants du postsecondaire, en vigueur depuis 2024, a réduit le nombre de demandes qui arrivent chez IRCC.` },
    ],
    body: (h) => `
<h2>Du délai affiché par IRCC à une date</h2>
<p>IRCC publie le délai actuel du permis d’études dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. Pour une demande faite hors du Canada, il donne un chiffre par pays de dépôt, le plus souvent en semaines ; pour une demande faite au Canada, un seul chiffre. Ce site ne recopie pas ces chiffres. Lisez celui qui vous concerne, saisissez-le dans le calculateur avec son unité, puis indiquez le mois et le jour où IRCC a reçu votre demande complète. Le calculateur ajoute le délai dans cette unité et dit ce qui reste, ou de combien de jours vous le dépassez.</p>
<p>Le chiffre de l’outil d’IRCC est un délai passé : le temps dans lequel 80 % des demandes de permis d’études tranchées récemment pour ce pays ont été terminées. L’attente de la biométrie et toute demande de documents, d’examen médical ou de vérification de la lettre d’acceptation s’ajoutent.</p>
${h.mini('delai', { p: ['n', 'u', 'm'], d: { g: 'study', c: 'FR', m: 'none' }, t: 'Votre permis d’études : date de décision estimée' })}
<h2>Deux normes de service, deux résultats</h2>
<p>IRCC fixe une norme de service pour le permis d’études et publie chaque année le nombre de dossiers qui l’ont respectée, dans l’inventaire des services du gouvernement du Canada diffusé en ${h.src('od-std', 'données ouvertes')}. Depuis l’étranger, la norme est de ${K.fmtStd(out.cur, 'fr')} pour 80 % des nouvelles demandes ; en ${K.fmtFy(out.fy, 'fr')}, ${h.n(out.cur.met)} demandes sur ${h.n(out.cur.total)} ont été traitées dans ce délai, soit ${h.pct(out.cur.perf)}, contre ${h.pct(out.prev?.perf)} en ${K.fmtFy(out.pfy!, 'fr')}. Au Canada, la norme est de ${K.fmtStd(ins.cur, 'fr')}, tenue pour ${h.pct(ins.cur.perf)} des ${h.n(ins.cur.total)} demandes. Les deux normes ont été respectées dans l’ensemble, ce qui n’est pas le cas de toutes les lignes d’IRCC : le visa de visiteur ou le permis de travail demandé à l’étranger restent loin de leur propre cible.</p>
<p>Une norme tenue pour quatre dossiers sur cinq laisse quand même un dossier sur cinq au-delà. Si le vôtre dépasse le délai saisi, les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} disent quoi vérifier d’abord.</p>
<h2>Où vont les nouvelles décisions de permis d’études</h2>
<p>Les ${h.src('open-data', 'données de traitement opérationnel')} d’IRCC comptent, mois par mois et par pays de citoyenneté, les nouvelles demandes de permis d’études finalisées, quelle que soit l’issue. Le tableau reprend les huit pays qui ont reçu le plus de décisions sur les douze derniers mois, le nombre de permis d’études entrés en vigueur pour leurs citoyens, tiré du ${h.src('od-study', 'jeu des titulaires de permis d’études')}, et la part de tous leurs dossiers de résidence temporaire qui se sont conclus par une approbation.</p>
${h.table(['Pays de citoyenneté', 'Nouvelles demandes finalisées', 'Écart sur un an', 'Permis entrés en vigueur', 'Dossiers de résidence temporaire approuvés'], rows(h), `${h.w12()}. Finalisée veut dire approuvée, refusée ou retirée. Sources : IRCC, données ouvertes, Traitement opérationnel et titulaires de permis d’études ; chiffres arrondis à 5.`, ['l', 'r', 'r', 'r', 'r'])}
<p>${h.cn(c1)} arrive en tête avec ${h.n(s1.last)} décisions, ${h.pct(shareTop)} du total, ${upFr(s1.change)} de ${h.pa(s1.change)} sur un an. ${h.cn(c2)} suit avec ${h.n(s2.last)} et ${h.cn(c3)} se place troisième. Du côté francophone, IRCC a finalisé ${h.n(FRc.last)} nouvelles demandes de citoyens français, ${h.n(MA.last)} de Marocains et ${h.n(CM.last)} de Camerounais. La part approuvée de la dernière colonne couvre aussi les visas de visiteur et les permis de travail : c’est un signal général pour le pays, pas un taux d’acceptation des permis d’études.</p>
<h2>Les permis qui commencent vraiment</h2>
<p>Une décision n’est pas un permis en main. Les données des titulaires de permis d’études comptent les permis entrés en vigueur chaque mois, y compris ceux délivrés au Canada. Sur les douze derniers mois, ${h.n(eff.last)} permis d’études sont entrés en vigueur, soit ${h.ch(eff.change)} par rapport à l’année d’avant ; le plus grand nombre est allé à des citoyens de ${h.cn(effTop)}. Par année civile, on en compte ${h.n(e23)} en 2023, ${h.n(e24)} en 2024 et ${h.n(e25)} en 2025. Le profil mensuel suit le calendrier scolaire : le mois le plus chargé de la série a été ${h.my(hi[0])}, avec ${h.n(hi[1])} permis, juste avant la rentrée d’automne.</p>
${h.months(K.STD.months, [['Permis d’études entrés en vigueur', K.studySeries()]], { caption: 'Permis d’études entrés en vigueur, tous pays, par mois, du plus récent au plus ancien. Source : IRCC, données ouvertes, titulaires de permis d’études ; chiffres arrondis à 5.' })}
<h2>Avant de vous fier à la date</h2>
<p>Retenez la date à laquelle IRCC a reçu la demande complète, soit la date d’envoi pour un dossier en ligne. La biométrie se fait dans un centre de réception des demandes de visa après la demande, et le délai de l’outil d’IRCC ne compte pas cette attente. Une lettre d’attestation provinciale est exigée pour la plupart des programmes postsecondaires : sans elle, le dossier est renvoyé plutôt que ralenti. Une fois le permis obtenu, le renouveler relève de la ${h.a('study-permit-extension', 'prolongation du permis d’études')}, et après le diplôme l’étape suivante est souvent le ${h.a('pgwp', 'permis de travail postdiplôme')}.</p>
`,
  },
});
