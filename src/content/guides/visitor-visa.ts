import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Chiffres de la page : données ouvertes d'IRCC (Operational Processing, OGL-Canada 2.0), calculés au build.
 * Le délai de traitement lui-même n'est pas repris : la page renvoie à l'outil d'IRCC et le simulateur prend le
 * délai que le lecteur y lit. */
const E = K.en, F = K.fr;
const all = K.ops12('v1');
const ext = K.fullExtremes('v1');
const top = K.COUNTRIES.map((c) => [c, K.ops12('v1', c).last ?? 0] as const).sort((a, b) => b[1] - a[1]);
const top10 = top.slice(0, 10).map(([c]) => c);
const share = (c: string) => K.pctOf(K.ops12('v1', c).last, all.last);
const y23 = K.fullYear('v1', 'ALL', '2023')!, y24 = K.fullYear('v1', 'ALL', '2024')!, y25 = K.fullYear('v1', 'ALL', '2025')!;
const IN = K.ops12('v1', 'IN'), NG = K.ops12('v1', 'NG'), MA = K.ops12('v1', 'MA'), CM = K.ops12('v1', 'CM');
const aIN = K.approval12('IN'), aNG = K.approval12('NG'), aMA = K.approval12('MA'), aCM = K.approval12('CM'), aALL = K.approval12();
const st = K.stdOf('visitor')!, sv = K.stdOf('super-visa')!;
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');
if (top[0][0] !== 'IN') throw new Error('visitor-visa : le texte suppose l’Inde en tête des visas de visiteur');

function rows(h: Helpers) {
  return top10.map((c) => {
    const y = K.ops12('v1', c), a = K.approval12(c);
    return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.n(y.last), h.n(y.prev), h.ch(y.change), h.pct(a.rate)];
  });
}

export default defineGuide({
  id: 'visitor-visa', group: 'visit', order: 10,
  tool: 'delai', toolArg: { g: 'visitor', c: 'IN', only: 'visitor,visitor-inside,super-visa,visitor-record,eta' },
  related: ['super-visa', 'visitor-record', 'eta', 'india', 'nigeria', 'beyond-processing-time'],
  sources: ['ptimes', 'od-std', 'open-data', 'visit', 'biometrics', 'ogl'],
  en: {
    slug: 'visitor-visa-processing-time',
    nav: 'Visitor visa', card: 'Decision date from IRCC’s time, visas issued by country',
    title: 'Visitor Visa Processing Time and Decision Date, 2026',
    description: 'Turn the visitor visa time IRCC shows you into a decision date, and see how many visitor visas IRCC approved by country in 2026, from its own open data.',
    h1: 'Visitor visa: from IRCC’s processing time to your decision date',
    intro: `IRCC approved ${E.n(all.last)} visitor visas from ${E.w12()}, ${E.ch(all.change)} on the twelve months before.`,
    resume: `IRCC publishes the processing time of a visitor visa for each country of filing on its “Check processing times” tool, and that figure is the one to copy into the calculator above: add it to the day IRCC received your complete application and you get an estimated decision date, with the days already elapsed and those left. What this page adds comes from Government of Canada open data, published under the Open Government Licence of Canada. IRCC’s service standard for a new visitor visa requested from outside Canada is ${K.fmtStd(st.cur, 'en')} for 80% of applications; in ${K.fmtFy(st.fy, 'en')} it met that standard for ${E.pct(st.cur.perf)} of ${E.n(st.cur.total)} applications. From ${E.w12()}, IRCC approved ${E.n(all.last)} visitor visas (V-1 counterfoils), ${E.ch(all.change)} on the previous twelve months. Citizens of India received ${E.n(IN.last)} of them, ${E.pct(share('IN'))} of the total, ahead of ${K.countryName(top[1][0], 'en')} and ${K.countryName(top[2][0], 'en')}. Across all temporary residence files that IRCC finalized for Indian citizens over the same period, ${E.pct(aIN.rate)} ended in an approval, against ${E.pct(aALL.rate)} for all countries. Those volumes are not processing times, but they tell you how busy the line you are joining is.`,
    faqs: [
      { q: 'Where do I find the official visitor visa processing time?', a: 'On IRCC’s “Check processing times” page, where you choose the visitor visa, then the country you apply from. The figure shown there is the one to enter in the calculator on this page. This site does not copy IRCC’s table: it turns the time you read into a date and adds the volumes IRCC publishes as open data.' },
      { q: 'Why does the visitor visa time depend on the country I apply from?', a: 'Each figure reflects the files recently decided by the office that handles that country: how many arrive, how many need extra checks and how many staff work on them. A country with few applications can swing from one week to the next, because a handful of slow files is enough to move the share that IRCC uses for its published time.' },
      { q: 'How many visitor visas does IRCC approve each month?', a: `In IRCC’s open data, the monthly count of visitor visas approved ranged from ${E.n(ext.lo![1])} in ${E.my(ext.lo![0])} to ${E.n(ext.hi![1])} in ${E.my(ext.hi![0])} since January 2023. Over the latest twelve months the total is ${E.n(all.last)}. The count covers V-1 visas for tourism and family visits, not visas issued with a study or work permit.` },
      { q: 'My visitor visa is past the time I entered. What should I do?', a: 'Check first that the date you used is the day IRCC received your complete application, and that your biometrics were given. If you are clearly past the time IRCC shows, its web form lets you ask about an application outside the normal delay. Sending a second application does not move the first one up the line.' },
    ],
    body: (h) => `
<h2>Copy IRCC’s time, get your date</h2>
<p>The processing time of a visitor visa is published by IRCC on its ${h.src('ptimes', '“Check processing times” tool')}, one figure per country of filing. This site does not reproduce that table. Read the figure for your country there, then enter it in the calculator with its unit, and with the month and day IRCC received your application. The result adds the time to that date in IRCC’s own unit: days are added as days, months as calendar months. If the date is already behind you, the calculator says by how many days you are past the time you entered, which is the point where a follow-up becomes reasonable.</p>
<p>IRCC describes this figure as a past time: the delay within which it finished 80% of the visitor visa applications it decided recently for that country. It is not a forecast for your file, and one application in five took longer. It also leaves out the time needed to book and give biometrics, and any pause while IRCC waits for a document from you.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'visitor', m: 'none' }, t: 'Your visitor visa: estimated decision date' })}
<h2>IRCC’s own target, and how often it is met</h2>
<p>Besides the time on its tool, IRCC sets a service standard for each main type of application and reports every year how many files met it, in the Government of Canada service inventory published as ${h.src('od-std', 'open data')}. For a new visitor visa requested from outside Canada, the standard is ${K.fmtStd(st.cur, 'en')} for 80% of applications. In ${K.fmtFy(st.fy, 'en')}, ${h.n(st.cur.met)} of ${h.n(st.cur.total)} applications were processed within it, or ${h.pct(st.cur.perf)}, against ${h.pct(st.prev?.perf)} in ${K.fmtFy(st.pfy!, 'en')}. The super visa has a longer standard, ${K.fmtStd(sv.cur, 'en')}, which IRCC met for ${h.pct(sv.cur.perf)} of applications in ${K.fmtFy(sv.fy, 'en')}. When the time you read on IRCC’s tool is far above the standard, you are in good company: most visitor visa applicants are.</p>
<h2>Who receives Canada’s visitor visas</h2>
<p>IRCC’s open data counts every visitor visa it approves, month by month and by country of citizenship. The table below lists the ten countries whose citizens received the most visitor visas over the latest twelve months, with the twelve months before and the share of all temporary residence files for that country that ended in an approval. That share mixes visitor visas with study and work permits and their extensions, and IRCC counts withdrawn files among those finalized, so it is a broad signal, not a refusal rate for visitors.</p>
${h.table(['Country of citizenship', 'Visas approved, last 12 months', 'Previous 12 months', 'Change', 'Temporary residence files approved'], rows(h), `Visitor visas (V-1) approved by IRCC, ${h.w12()}, and the twelve months before. Source: IRCC, Operational Processing, open data; figures rounded to 5.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Nigeria shows how much these lines move: ${h.n(NG.last)} visitor visas over the latest twelve months, ${dirEn(NG.change)} ${h.pa(NG.change)} on the year before, while ${h.pct(aNG.rate)} of all temporary residence files of Nigerian citizens ended in an approval, against ${h.pct(aNG.prevRate)} a year earlier. Morocco received ${h.n(MA.last)} visitor visas and Cameroon ${h.n(CM.last)}. Calendar years tell the same story at the national level: ${h.n(y23)} visitor visas approved in 2023, ${h.n(y24)} in 2024 and ${h.n(y25)} in 2025.</p>
<h2>Why volumes matter for your wait</h2>
<p>A processing time is computed from files already decided. When many more applications arrive than IRCC finalizes, the files waiting pile up, and the published time tends to rise a few weeks later, once those files start being decided. IRCC’s open data lets you watch that from the outside: on the ${h.a('history', 'history page')}, applications received and finalized are shown month by month since January 2023. A line where both numbers stay close is more likely to keep a stable time than one where intake runs well ahead.</p>
<h2>Which country counts</h2>
<p>On IRCC’s tool, the country is the one you apply from, normally your country of residence. In the open data, it is your country of citizenship. A Nigerian citizen living legally in the United Arab Emirates who applies from there falls under the time for the United Arab Emirates, but is counted among Nigerian citizens in the volumes above. Keep both in mind when you compare.</p>
<h2>Reading your estimate</h2>
<p>Two situations change the reading. If IRCC asked for more documents or a medical exam, the file waits for your answer, and the time you copied does not cover that pause. If you applied on paper, the clock starts when the processing office logs your envelope, not when you posted it. Past the date, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} explain what to check and how to ask IRCC about your file.</p>
<h2>Other visit documents</h2>
<p>Parents and grandparents who want to stay up to five years at a time use the ${h.a('super-visa', 'super visa')}, which IRCC also times by country. Visitors already in Canada who want to stay longer apply for a ${h.a('visitor-record', 'visitor record')}. Travellers from visa-exempt countries need only an ${h.a('eta', 'eTA')}, which is usually approved within minutes.</p>
`,
  },
  fr: {
    slug: 'delai-visa-visiteur',
    nav: 'Visa de visiteur', card: 'Date de décision à partir du délai d’IRCC, visas par pays',
    title: 'Délai du visa de visiteur et date de décision en 2026',
    description: 'Transformez le délai du visa de visiteur affiché par IRCC en date de décision, et voyez combien de visas IRCC a approuvés par pays en 2026, données ouvertes.',
    h1: 'Visa de visiteur : du délai d’IRCC à votre date de décision',
    intro: `IRCC a approuvé ${F.n(all.last)} visas de visiteur de ${F.w12()}, soit ${F.ch(all.change)} par rapport aux douze mois d’avant.`,
    resume: `IRCC publie le délai de traitement du visa de visiteur pour chaque pays de dépôt dans son outil « Vérifier les délais de traitement », et c’est ce chiffre qu’il faut recopier dans le calculateur ci-dessus : ajouté au jour où IRCC a reçu votre demande complète, il donne une date de décision estimée, avec les jours déjà écoulés et ceux qui restent. Ce que la page ajoute vient des données ouvertes du gouvernement du Canada, publiées sous la Licence du gouvernement ouvert du Canada. La norme de service d’IRCC pour un nouveau visa de visiteur demandé hors du Canada est de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes ; en ${K.fmtFy(st.fy, 'fr')}, elle a été tenue pour ${F.pct(st.cur.perf)} des ${F.n(st.cur.total)} demandes. De ${F.w12()}, IRCC a approuvé ${F.n(all.last)} visas de visiteur (vignettes V-1), soit ${F.ch(all.change)} par rapport aux douze mois précédents. Les citoyens marocains en ont reçu ${F.n(MA.last)}, les Algériens ${F.n(K.ops12('v1', 'DZ').last)} et les Camerounais ${F.n(CM.last)}. Sur l’ensemble des dossiers de résidence temporaire finalisés pour des citoyens marocains pendant la même période, ${F.pct(aMA.rate)} se sont conclus par une approbation, contre ${F.pct(aALL.rate)} tous pays confondus. Ces volumes ne sont pas des délais, mais ils disent à quel point la file que vous rejoignez est chargée.`,
    faqs: [
      { q: 'Où trouver le délai officiel du visa de visiteur ?', a: 'Sur la page « Vérifier les délais de traitement » d’IRCC : choisissez le visa de visiteur, puis le pays depuis lequel vous déposez. Le chiffre affiché est celui à saisir dans le calculateur de cette page. Ce site ne recopie pas le tableau d’IRCC : il transforme le délai que vous lisez en date et ajoute les volumes publiés en données ouvertes.' },
      { q: 'Pourquoi le délai du visa change-t-il selon le pays de dépôt ?', a: 'Chaque chiffre reflète les dossiers tranchés récemment par le bureau qui traite ce pays : nombre de demandes reçues, vérifications supplémentaires, personnel affecté. Un pays qui dépose peu de demandes peut varier fortement d’une semaine à l’autre, car quelques dossiers lents suffisent à déplacer la part qu’IRCC retient pour son délai publié.' },
      { q: 'Combien de visas de visiteur IRCC approuve-t-il chaque mois ?', a: `Dans les données ouvertes d’IRCC, le nombre mensuel de visas de visiteur approuvés va de ${F.n(ext.lo![1])} en ${F.my(ext.lo![0])} à ${F.n(ext.hi![1])} en ${F.my(ext.hi![0])} depuis janvier 2023. Sur les douze derniers mois, le total atteint ${F.n(all.last)}. Le décompte couvre les visas V-1 de tourisme et de visite familiale, pas ceux délivrés avec un permis d’études ou de travail.` },
      { q: 'Mon visa dépasse le délai saisi : que faire ?', a: 'Vérifiez d’abord la date utilisée : c’est le jour où IRCC a reçu la demande complète, biométrie fournie. Si vous dépassez nettement le délai affiché par IRCC, son formulaire Web permet de poser une question sur une demande hors des délais normaux. Envoyer une seconde demande ne fait pas avancer la première.' },
    ],
    body: (h) => `
<h2>Recopiez le délai d’IRCC, obtenez votre date</h2>
<p>Le délai de traitement du visa de visiteur est publié par IRCC dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}, un chiffre par pays de dépôt. Ce site ne reproduit pas ce tableau. Lisez-y le chiffre de votre pays, puis saisissez-le dans le calculateur avec son unité, ainsi que le mois et le jour où IRCC a reçu votre demande. Le résultat ajoute le délai à cette date dans l’unité d’IRCC : des jours s’ajoutent en jours, des mois en mois de calendrier. Si la date est déjà passée, le calculateur dit de combien de jours vous dépassez le délai saisi, le moment où une relance devient raisonnable.</p>
<p>IRCC présente ce chiffre comme un délai passé : le temps dans lequel il a terminé 80 % des demandes de visa de visiteur tranchées récemment pour ce pays. Ce n’est pas une prévision pour votre dossier, et une demande sur cinq a pris plus longtemps. Il laisse aussi de côté le temps de prendre rendez-vous pour la biométrie, et toute pause pendant laquelle IRCC attend un document de votre part.</p>
${h.mini('delai', { p: ['n', 'm'], d: { g: 'visitor', c: 'MA', m: 'none' }, t: 'Votre visa de visiteur : date de décision estimée' })}
<h2>L’objectif d’IRCC, et à quelle fréquence il est tenu</h2>
<p>En plus du délai de son outil, IRCC fixe une norme de service pour chaque grand type de demande et publie chaque année le nombre de dossiers qui l’ont respectée, dans l’inventaire des services du gouvernement du Canada diffusé en ${h.src('od-std', 'données ouvertes')}. Pour un nouveau visa de visiteur demandé hors du Canada, la norme est de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes. En ${K.fmtFy(st.fy, 'fr')}, ${h.n(st.cur.met)} demandes sur ${h.n(st.cur.total)} ont été traitées dans ce délai, soit ${h.pct(st.cur.perf)}, contre ${h.pct(st.prev?.perf)} en ${K.fmtFy(st.pfy!, 'fr')}. Le super visa a une norme plus longue, ${K.fmtStd(sv.cur, 'fr')}, tenue pour ${h.pct(sv.cur.perf)} des demandes en ${K.fmtFy(sv.fy, 'fr')}. Si le délai lu dans l’outil d’IRCC dépasse de loin la norme, vous n’êtes pas une exception : c’est le cas de la plupart des demandeurs de visa de visiteur.</p>
<h2>Qui reçoit les visas de visiteur du Canada</h2>
<p>Les données ouvertes d’IRCC comptent chaque visa de visiteur approuvé, mois par mois et par pays de citoyenneté. Le tableau reprend les dix pays dont les citoyens ont reçu le plus de visas sur les douze derniers mois, avec les douze mois d’avant et la part des dossiers de résidence temporaire de ce pays qui se sont conclus par une approbation. Cette part mêle visas de visiteur, permis d’études et de travail et leurs prolongations, et IRCC compte les retraits parmi les dossiers finalisés : c’est un signal général, pas un taux de refus des visiteurs.</p>
${h.table(['Pays de citoyenneté', 'Visas approuvés, 12 derniers mois', '12 mois d’avant', 'Écart', 'Dossiers de résidence temporaire approuvés'], rows(h), `Visas de visiteur (V-1) approuvés par IRCC, ${h.w12()}, et les douze mois d’avant. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Le Cameroun montre à quel point ces lignes bougent : ${h.n(CM.last)} visas de visiteur sur les douze derniers mois, ${dirFr(CM.change)} de ${h.pa(CM.change)} sur un an, tandis que ${h.pct(aCM.rate)} des dossiers de résidence temporaire de citoyens camerounais se sont conclus par une approbation, contre ${h.pct(aCM.prevRate)} un an plus tôt. Le Maroc a reçu ${h.n(MA.last)} visas et le Nigeria ${h.n(NG.last)}. Les années civiles racontent la même histoire à l’échelle du pays : ${h.n(y23)} visas de visiteur approuvés en 2023, ${h.n(y24)} en 2024 et ${h.n(y25)} en 2025.</p>
<h2>Pourquoi les volumes comptent pour votre attente</h2>
<p>Un délai de traitement se calcule sur des dossiers déjà tranchés. Quand il arrive beaucoup plus de demandes qu’IRCC n’en finalise, les dossiers en attente s’accumulent et le délai publié tend à monter quelques semaines plus tard, lorsque ces dossiers commencent à recevoir une décision. Les données ouvertes d’IRCC permettent de suivre ce mouvement de l’extérieur : la ${h.a('history', 'page de l’historique')} montre, mois par mois depuis janvier 2023, les demandes reçues et finalisées. Une ligne où les deux nombres restent proches a plus de chances de garder un délai stable qu’une ligne où les arrivées prennent nettement les devants.</p>
<h2>Quel pays compte</h2>
<p>Dans l’outil d’IRCC, le pays est celui depuis lequel vous déposez, en général votre pays de résidence. Dans les données ouvertes, c’est votre pays de citoyenneté. Un citoyen camerounais qui réside légalement en France et dépose depuis la France relève du délai de la France, mais il est compté parmi les citoyens camerounais dans les volumes ci-dessus. Gardez les deux en tête pour comparer.</p>
<h2>Lire votre estimation</h2>
<p>Deux situations changent la lecture. Si IRCC a demandé des documents ou un examen médical, le dossier attend votre réponse et le délai recopié ne couvre pas cette pause. Pour une demande papier, le compteur part du jour où le bureau enregistre l’enveloppe, pas du jour de l’envoi. Une fois la date passée, les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} disent quoi vérifier et comment interroger IRCC sur votre dossier.</p>
<h2>Les autres documents de visite</h2>
<p>Les parents et grands-parents qui veulent rester jusqu’à cinq ans d’affilée demandent le ${h.a('super-visa', 'super visa')}, qu’IRCC chiffre aussi par pays. Les visiteurs déjà au Canada qui veulent rester plus longtemps demandent une ${h.a('visitor-record', 'fiche du visiteur')}. Les voyageurs dispensés de visa n’ont besoin que d’une ${h.a('eta', 'AVE')}, accordée le plus souvent en quelques minutes.</p>
`,
  },
});
