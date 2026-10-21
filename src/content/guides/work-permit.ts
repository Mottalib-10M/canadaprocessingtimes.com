import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Permis de travail demandé hors du Canada : relevé par pays, rang, historique complet. */
const P = 'work';
const rng = K.rangeOf(P)!;
const all = K.countriesOf(P).map((c) => [c, K.daysOf(K.readingOf(P, c).t)] as const).filter((x): x is readonly [string, number] => x[1] != null).sort((a, b) => a[1] - b[1]);
const median = all[Math.floor(all.length / 2)][1];
const upTo4w = all.filter((x) => x[1] <= 28).length;
const over12w = all.filter((x) => x[1] > 84).length;
const t = (c: string) => K.readingOf(P, c).t;
const rank = (c: string) => all.findIndex((x) => x[0] === c) + 1;
const ser = (c: string) => `c:work:${c}`;
const tr = (c: string) => K.fullTrend(ser(c))!;
const inT = tr('IN'), ph = tr('PH'), pk = tr('PK'), cn = tr('CN');
const inside = K.readingOf('work-inside');
const D = K.L.dates.country;
const majC = K.MAJOR.filter((c) => all.some((x) => x[0] === c) && tr(c).first != null);
const majN = majC.length, lower = majC.filter((c) => tr(c).last < tr(c).first!).length;
const nRead = K.readingsCount('country');
const E = K.en, F = K.fr;

function major(h: Helpers) {
  const codes = K.MAJOR.filter((c) => all.some((x) => x[0] === c));
  return codes.map((c) => {
    const x = tr(c);
    return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.t(t(c)), `${rank(c)} / ${all.length}`, x.firstDate ? `${h.d(x.first!, 'w')} (${h.day(x.firstDate)})` : ''];
  });
}
const ends = (h: Helpers) => [...all.slice(0, 5), ...all.slice(-5)].map((x) => [h.cn(x[0]), h.t(t(x[0])), `${rank(x[0])} / ${all.length}`]);

export default defineGuide({
  id: 'work-permit', group: 'work', order: 30,
  tool: 'delai', toolArg: { g: 'work', c: 'IN', only: 'work,work-inside,work-ext,iec' },
  related: ['pgwp', 'work-permit-extension', 'iec', 'study-permit', 'india', 'philippines'],
  sources: ['ptimes-country', 'work-permit', 'biometrics', 'ptimes', 'wayback'],
  en: {
    slug: 'work-permit-processing-time',
    nav: 'Work permit', card: 'Time by country, rank, change since 2024',
    title: 'Work Permit Processing Time by Country, Canada 2026',
    description: 'Work permit processing time in 2026 for applications made outside Canada: the figure IRCC publishes for each country, its rank and how it moved since 2024.',
    h1: 'Work permit processing time from outside Canada',
    intro: `On ${E.day(D)}, IRCC’s figures for a work permit requested from abroad went from ${K.fmtTime(rng.lo[1], 'en')} to ${K.fmtTime(rng.hi[1], 'en')}, across ${E.n(rng.n)} countries.`,
    resume: `A work permit requested from outside Canada currently takes ${K.fmtTime(t('IN'), 'en')} from India, ${K.fmtTime(t('PH'), 'en')} from the Philippines, ${K.fmtTime(t('CN'), 'en')} from China, ${K.fmtTime(t('NG'), 'en')} from Nigeria and ${K.fmtTime(t('MX'), 'en')} from Mexico, according to the country file IRCC dated ${E.day(D)}. IRCC gives a figure for ${E.n(all.length)} countries; the middle one is ${E.d(median, 'w')}, ${E.n(upTo4w)} countries are at four weeks or less and ${E.n(over12w)} are above twelve weeks. The longest line is ${K.countryName(rng.hi[0], 'en')} at ${K.fmtTime(rng.hi[1], 'en')}. These are past times: the delay within which IRCC finished 80% of the work permit files it recently decided for that country, counted from receipt of a complete application, without the biometrics appointment and without any labour market impact assessment your employer needed beforehand. The same permit requested from inside Canada is published as a single line, now ${K.fmtTime(inside.t, 'en')}. The tool above adds the time to your filing date.`,
    faqs: [
      { q: 'Which countries have the shortest work permit processing time in 2026?', a: `In IRCC’s file of ${E.day(D)}, the shortest work permit times from outside Canada are ${K.countryName(all[0][0], 'en')} (${K.fmtTime(t(all[0][0]), 'en')}), ${K.countryName(all[1][0], 'en')} (${K.fmtTime(t(all[1][0]), 'en')}) and ${K.countryName(all[2][0], 'en')} (${K.fmtTime(t(all[2][0]), 'en')}). The country that counts is the one you apply from, so moving your file to another office is not an option unless you legally live there.` },
      { q: 'Does the work permit processing time include the LMIA?', a: 'No. When a job needs a labour market impact assessment, the employer obtains it from Employment and Social Development Canada before you apply. That step has its own delay. IRCC’s work permit figure starts only when IRCC receives your complete permit application, with the assessment number or the job offer number already in it.' },
      { q: 'Why did my work permit estimate change between two weeks?', a: `IRCC refreshes the country file regularly and each figure looks back at recently decided files. A few slow cases are enough to move it. For India, the line was ${E.d(inT.prev!, 'w')} on ${E.day(inT.prevDate!)} and is ${K.fmtTime(t('IN'), 'en')} on ${E.day(D)}. Watch the trend over several readings rather than one change.` },
      { q: 'Is the work permit figure the same for open and employer-specific permits?', a: 'The country file we read carries one work permit line per country for applications made from outside Canada; it does not publish a separate figure for open and employer-specific permits. Programs with their own line, such as International Experience Canada, are listed separately and have their own page on this site.' },
    ],
    body: (h) => `
<h2>Main countries of filing, with rank</h2>
<p>The rank places each country among the ${h.n(all.length)} that have a figure on ${h.day(D)}, from the shortest (1) to the longest. The last column is the oldest figure kept in our archive for that country, so you can see how far the line has travelled.</p>
${h.table(['Country', 'Published time', 'Rank', 'Oldest copy kept'], major(h), `Work permit requested from outside Canada, IRCC figure of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>Most large filing countries sit close to the middle value of ${h.d(median, 'w')}. Bangladesh and Iran are the exceptions at the slow end, with ${h.t(t('BD'))} and ${h.t(t('IR'))}. Mexico is among the fastest at ${h.t(t('MX'))}, rank ${rank('MX')} of ${h.n(all.length)}, and the United Kingdom reads ${h.t(t('GB'))}.</p>
<h2>Since 2024: a line that has shortened</h2>
<p>Of the ${h.n(majN)} large filing countries in the table, ${h.n(lower)} are lower now than in the oldest copy we hold. India went from ${h.d(inT.first!, 'w')} on ${h.day(inT.firstDate!)} to ${h.d(inT.min, 'w')} on ${h.day(inT.minDate)}, and stands at ${h.t(t('IN'))}. The Philippines fell from ${h.d(ph.first!, 'w')} to ${h.d(ph.min, 'w')} (${h.day(ph.minDate)}) before rising again to ${h.t(t('PH'))}. Pakistan shows the largest drop: ${h.d(pk.first!, 'w')} in the ${h.day(pk.firstDate!)} copy, ${h.t(t('PK'))} today. China moved the other way during 2025, peaking at ${h.d(cn.max, 'w')} on ${h.day(cn.maxDate)}, and now reads ${h.t(t('CN'))}.</p>
${h.hist(ser('IN'), { unit: 'w', max: 12 })}
<p>Read these older points with care. The country file has only ${h.n(nRead)} dated copies: one from ${h.day(K.firstReading('country'))}, one from ${h.day(K.points(ser('IN'))[1].date)}, then a run from ${h.day(K.points(ser('IN'))[2].date)}. Nothing was archived in between, so a peak or a dip during that gap is simply not visible. We leave the gap empty rather than draw a line across it.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'work', c: 'PH', m: 'none' }, t: 'Your work permit from abroad: estimated decision date' })}
<h2>The two ends of the list</h2>
${h.table(['Country', 'Published time', 'Rank'], ends(h), `Five shortest and five longest work permit times from outside Canada, ${h.day(D)}.`, ['l', 'r', 'r'])}
<p>A very short time often comes from a small number of files, many of them simple. A very long one can reflect a backlog at one visa office or extra security screening. Neither end tells you much about an individual case, but a country at the slow end is a reason to apply as early as your job offer allows.</p>
<h2>What the clock leaves out</h2>
<p>Three delays come on top of the published figure. The first is the employer side: an assessment from Employment and Social Development Canada, or the job offer submitted through the employer portal for exempt jobs, must exist before you file. The second is biometrics: the appointment at a visa application centre is not counted, and IRCC explains on its ${h.src('biometrics', 'biometrics page')} who must give them. The third is any request IRCC sends you, such as a medical exam for some jobs and countries; the file waits for your reply.</p>
<p>Once the permit is approved, the document itself is issued at the port of entry when you arrive. The approval letter you receive first is not the permit. Details of each permit type are on IRCC’s ${h.src('work-permit', 'work permit page')}; how this site reads and dates every figure is described on the ${h.a('method', 'method page')}.</p>
<h2>Already in Canada?</h2>
<p>A first permit requested from inside Canada is not on this country list: IRCC publishes it as one line for everyone, now ${h.t(inside.t)}. Graduates applying after their studies will find that line, and why no figure is labelled for their permit, on the ${h.a('pgwp', 'post-graduation work permit page')}. Workers who already hold a permit and want more time should read the ${h.a('work-permit-extension', 'work permit extension page')}, which follows IRCC’s weekly queue. Young people from partner countries go through ${h.a('iec', 'International Experience Canada')}, which has its own time.</p>
`,
  },
  fr: {
    slug: 'delai-permis-de-travail',
    nav: 'Permis de travail', card: 'Délai par pays, rang, évolution depuis 2024',
    title: 'Délai du permis de travail par pays, relevé IRCC 2026',
    description: 'Délai 2026 du permis de travail demandé hors du Canada : chiffre publié par IRCC pour chaque pays, rang parmi tous les pays et son évolution depuis 2024.',
    h1: 'Délai du permis de travail demandé de l’étranger',
    intro: `Le ${F.day(D)}, les délais publiés par IRCC pour un permis de travail demandé de l’étranger allaient de ${K.fmtTime(rng.lo[1], 'fr')} à ${K.fmtTime(rng.hi[1], 'fr')}, sur ${F.n(rng.n)} pays.`,
    resume: `Un permis de travail demandé hors du Canada prend aujourd’hui ${K.fmtTime(t('MA'), 'fr')} depuis le Maroc, ${K.fmtTime(t('DZ'), 'fr')} depuis l’Algérie, ${K.fmtTime(t('TN'), 'fr')} depuis la Tunisie, ${K.fmtTime(t('CM'), 'fr')} depuis le Cameroun et ${K.fmtTime(t('FR'), 'fr')} depuis la France, selon le fichier par pays daté du ${F.day(D)}. IRCC publie un chiffre pour ${F.n(all.length)} pays : la valeur du milieu est de ${F.d(median, 'w')}, ${F.n(upTo4w)} pays sont à quatre semaines ou moins et ${F.n(over12w)} dépassent douze semaines. La file la plus longue est celle de ${K.countryName(rng.hi[0], 'fr')}, à ${K.fmtTime(rng.hi[1], 'fr')}. Il s’agit de délais passés : le temps dans lequel IRCC a terminé 80 % des dossiers récemment tranchés pour ce pays, compté depuis la réception d’une demande complète, sans le rendez-vous de biométrie ni l’étude d’impact sur le marché du travail obtenue avant par l’employeur. Demandé au Canada, le même permis relève d’une seule ligne, aujourd’hui ${K.fmtTime(inside.t, 'fr')}. L’outil ajoute ce délai à votre date de dépôt.`,
    faqs: [
      { q: 'Quels pays ont le délai de permis de travail le plus court en 2026 ?', a: `Dans le fichier d’IRCC du ${F.day(D)}, les délais les plus courts pour un permis de travail demandé de l’étranger sont ceux de ${K.countryName(all[0][0], 'fr')} (${K.fmtTime(t(all[0][0]), 'fr')}), de ${K.countryName(all[1][0], 'fr')} (${K.fmtTime(t(all[1][0]), 'fr')}) et de ${K.countryName(all[2][0], 'fr')} (${K.fmtTime(t(all[2][0]), 'fr')}). Le pays retenu est celui d’où vous déposez : on ne choisit pas son bureau sans y résider légalement.` },
      { q: 'Le délai du permis de travail comprend-il l’EIMT ?', a: 'Non. Quand l’emploi exige une étude d’impact sur le marché du travail, l’employeur l’obtient d’Emploi et Développement social Canada avant votre demande, avec son propre délai. Le chiffre d’IRCC pour le permis ne démarre qu’à la réception de votre demande complète, qui contient déjà le numéro de l’étude ou de l’offre d’emploi.' },
      { q: 'Pourquoi mon estimation de permis de travail a-t-elle changé en une semaine ?', a: `IRCC met le fichier par pays à jour régulièrement et chaque chiffre regarde les dossiers tranchés récemment ; quelques dossiers lents suffisent à le déplacer. Pour le Maroc, la ligne était de ${F.d(tr('MA').prev!, 'w')} le ${F.day(tr('MA').prevDate!)} et elle est de ${K.fmtTime(t('MA'), 'fr')} le ${F.day(D)}. Regardez la tendance sur plusieurs relevés.` },
      { q: 'Le permis de travail ouvert et le permis lié à un employeur ont-ils le même délai ?', a: 'Le fichier par pays que nous lisons ne donne qu’une ligne de permis de travail par pays pour les demandes faites hors du Canada ; il ne sépare pas le permis ouvert du permis lié à un employeur. Les programmes qui ont leur propre ligne, comme Expérience internationale Canada, sont publiés à part et ont leur page sur ce site.' },
    ],
    body: (h) => `
<h2>Les principaux pays de dépôt et leur rang</h2>
<p>Le rang situe chaque pays parmi les ${h.n(all.length)} qui ont un chiffre le ${h.day(D)}, du plus court (1) au plus long. La dernière colonne donne le plus ancien chiffre conservé dans notre archive pour ce pays : on voit le chemin parcouru.</p>
${h.table(['Pays', 'Délai publié', 'Rang', 'Plus ancienne copie'], major(h), `Permis de travail demandé hors du Canada, chiffre d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>Le Maghreb se partage : la Tunisie est parmi les pays rapides avec ${h.t(t('TN'))}, le Maroc est à ${h.t(t('MA'))} et l’Algérie à ${h.t(t('DZ'))}, pour une valeur du milieu de ${h.d(median, 'w')} tous pays confondus. La France, à ${h.t(t('FR'))}, fait partie des pays les plus rapides, alors que le Cameroun est à ${h.t(t('CM'))}. Le Bangladesh et l’Iran ferment la liste des grands pays avec ${h.t(t('BD'))} et ${h.t(t('IR'))}.</p>
<h2>Depuis 2024 : une file qui a raccourci</h2>
<p>Sur les ${h.n(majN)} grands pays de dépôt du tableau, ${h.n(lower)} sont plus bas que dans notre plus ancienne copie. Le Maroc est passé de ${h.d(tr('MA').first!, 'w')} le ${h.day(tr('MA').firstDate!)} à ${h.t(t('MA'))}. L’Algérie partait de ${h.d(tr('DZ').first!, 'w')} et le Cameroun de ${h.d(tr('CM').first!, 'w')}. L’Inde, premier pays de dépôt, est descendue de ${h.d(inT.first!, 'w')} à ${h.d(inT.min, 'w')} (${h.day(inT.minDate)}) avant de remonter à ${h.t(t('IN'))}.</p>
${h.hist(ser('MA'), { unit: 'w', max: 12 })}
<p>Ces points anciens se lisent avec prudence. Le fichier par pays ne compte que ${h.n(nRead)} copies datées : une du ${h.day(K.firstReading('country'))}, une du ${h.day(K.points(ser('MA'))[1].date)}, puis une série à partir du ${h.day(K.points(ser('MA'))[2].date)}. Rien n’a été archivé entre les deux, si bien qu’un pic ou un creux pendant ce trou n’est tout simplement pas visible. Nous laissons le trou vide plutôt que de tracer une ligne par-dessus.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'work', c: 'MA', m: 'none' }, t: 'Votre permis de travail demandé de l’étranger : date de décision estimée' })}
<h2>Les deux bouts de la liste</h2>
${h.table(['Pays', 'Délai publié', 'Rang'], ends(h), `Les cinq délais les plus courts et les cinq plus longs, permis de travail hors du Canada, ${h.day(D)}.`, ['l', 'r', 'r'])}
<p>Un délai très court vient souvent d’un petit nombre de dossiers, en grande partie simples. Un délai très long peut traduire un retard dans un bureau des visas ou des contrôles de sécurité plus poussés. Aucun des deux bouts ne dit grand-chose d’un dossier en particulier, mais un pays lent est une raison de déposer dès que l’offre d’emploi le permet.</p>
<h2>Ce que le compteur laisse de côté</h2>
<p>Trois attentes s’ajoutent au chiffre publié. D’abord le côté employeur : l’étude d’impact d’Emploi et Développement social Canada, ou l’offre d’emploi déposée sur le portail des employeurs pour un emploi dispensé, doit exister avant votre demande. Ensuite la biométrie : le rendez-vous au centre de réception des demandes de visa n’est pas compté, et IRCC précise sur sa ${h.src('biometrics', 'page sur la biométrie')} qui doit la fournir. Enfin toute demande d’IRCC, par exemple un examen médical pour certains emplois et certains pays : le dossier attend votre réponse.</p>
<p>Une fois la demande approuvée, le permis lui-même est remis au point d’entrée à votre arrivée ; la lettre reçue d’abord n’est pas le permis. Les types de permis sont décrits sur la ${h.src('work-permit', 'page d’IRCC sur le permis de travail')} ; la façon dont ce site lit et date chaque chiffre est expliquée sur la ${h.a('method', 'page de méthode')}.</p>
<h2>Déjà au Canada ?</h2>
<p>Un premier permis demandé au Canada ne figure pas dans cette liste par pays : IRCC le publie en une seule ligne, aujourd’hui ${h.t(inside.t)}. Les diplômés qui demandent un permis après leurs études trouveront cette ligne, et la raison pour laquelle aucun chiffre ne porte le nom de leur permis, sur la ${h.a('pgwp', 'page du permis post-diplôme')}. Les travailleurs qui ont déjà un permis et veulent plus de temps liront la ${h.a('work-permit-extension', 'page de la prolongation du permis de travail')}, qui suit la file hebdomadaire d’IRCC. Les jeunes des pays partenaires passent par ${h.a('iec', 'Expérience internationale Canada')}, qui a son propre délai.</p>
`,
  },
});
