import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Citoyenneté : norme de service d'IRCC (Inventaire des services du GC) et nouveaux citoyens par mois et par pays de
 * naissance (Operational Processing), données ouvertes OGL-Canada 2.0. Le délai lui-même se lit dans l'outil d'IRCC. */
const E = K.en, F = K.fr;
const st = K.stdOf('citizenship')!;
if (st.cur.target !== 0.8 || !st.prev) throw new Error('citizenship : la norme n’est plus de 80 % ou l’exercice précédent manque, relire le texte');
const c12 = K.ops12('cit');
const ext = K.fullExtremes('cit');
const LASTM = K.MONTHS[K.MONTHS.length - 1];
const CUR = LASTM.slice(0, 4), PREV = String(Number(CUR) - 1), PREV2 = String(Number(CUR) - 2);
const y1 = K.fullYear('cit', 'ALL', PREV2)!, y2 = K.fullYear('cit', 'ALL', PREV)!, ycur = K.fullYear('cit', 'ALL', CUR)!;
const FIRSTM = K.monthsOfYear(CUR)[0];
const top = K.COUNTRIES.map((c) => [c, K.ops12('cit', c).last ?? 0] as const).sort((a, b) => b[1] - a[1]);
if (top[0][0] !== 'IN' || top[1][0] !== 'PH' || top[2][0] !== 'NG') throw new Error('citizenship : le trio Inde, Philippines, Nigeria a changé, réécrire le paragraphe des pays de naissance');
const share = (c: string) => K.pctOf(K.ops12('cit', c).last, c12.last);
const R = K.CIT_RULE;
const dir = (x: number | null, l: 'en' | 'fr') => (x == null ? '' : l === 'en' ? (x < 0 ? `down ${E.pa(x)}` : `up ${E.pa(x)}`) : (x < 0 ? `en baisse de ${F.pa(x)}` : `en hausse de ${F.pa(x)}`));
const gainEn = st.prev && st.cur.perf != null && st.prev.perf != null ? (st.cur.perf > st.prev.perf ? 'up from' : 'down from') : 'against';
const gainFr = st.prev && st.cur.perf != null && st.prev.perf != null ? (st.cur.perf > st.prev.perf ? 'en progrès par rapport à' : 'en recul par rapport à') : 'contre';

function rows(h: Helpers) {
  return top.slice(0, 10).map(([c]) => { const y = K.ops12('cit', c); return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.n(y.last), h.n(y.prev), h.ch(y.change)]; });
}

export default defineGuide({
  id: 'citizenship', group: 'cit', order: 60,
  tool: 'delai', toolArg: { g: 'citizenship', m: 'none', only: 'citizenship,cit-proof,cit-search' },
  related: ['citizenship-calculator', 'pr-card', 'beyond-processing-time', 'history', 'express-entry'],
  sources: ['ptimes', 'od-std', 'open-data', 'citizenship-eligibility', 'citizenship-proof', 'check-status', 'ogl'],
  en: {
    slug: 'citizenship-processing-time',
    nav: 'Citizenship', card: 'Oath date from IRCC’s time, standard met, new citizens by month',
    title: 'Citizenship Application Processing Time and Oath, 2026',
    description: 'Estimate your Canadian citizenship oath date from the time IRCC shows, and see how often IRCC met its 2026 service standard and how many people became citizens.',
    h1: 'Canadian citizenship: from IRCC’s time to your oath date',
    intro: `${E.n(c12.last)} people became Canadian citizens from ${E.w12()}, ${dir(c12.change, 'en')} on the twelve months before.`,
    resume: `IRCC shows the processing time of a citizenship grant on its “Check processing times” tool, and that figure is the one to enter in the calculator above with the day IRCC received your application: the result is an estimated date for the end of the process, which for a grant means the oath. Government of Canada open data adds two things IRCC’s tool does not keep. The first is IRCC’s service standard: ${K.fmtStd(st.cur, 'en')} for 80% of routine adult and minor grant applications. In ${K.fmtFy(st.fy, 'en')}, ${E.pct(st.cur.perf)} of ${E.n(st.cur.total)} applications were processed within it, ${gainEn} ${E.pct(st.prev?.perf)} in ${K.fmtFy(st.pfy!, 'en')}. The second is the number of new citizens: ${E.n(c12.last)} from ${E.w12()}, of whom ${E.n(top[0][1])} were born in India. Before any of this, an adult needs ${E.n(R.required)} days of physical presence in the five years before applying, which the presence calculator counts.`,
    faqs: [
      { q: 'What is IRCC’s service standard for a citizenship grant?', a: `IRCC aims to process routine grant applications for adults and minors within ${K.fmtStd(st.cur, 'en')}, for 80% of applications. In ${K.fmtFy(st.fy, 'en')} it reached ${E.pct(st.cur.perf)} of ${E.n(st.cur.total)} applications, according to the Government of Canada service inventory published as open data. The standard is a target, not a promise for your own file.` },
      { q: 'Does the citizenship processing time include the oath ceremony?', a: 'For a grant, the time IRCC shows runs from the day it receives the complete application to the oath, so the ceremony is the end point. It does not include the time you spend gathering days of presence before applying, nor delays caused by a missed test, an interview or a request for documents.' },
      { q: 'How many people become Canadian citizens each month?', a: `In IRCC’s open data, monthly counts of new citizens ranged from ${E.n(ext.lo![1])} in ${E.my(ext.lo![0])} to ${E.n(ext.hi![1])} in ${E.my(ext.hi![0])} since ${E.my(K.MONTHS[0])}. The total was ${E.n(y1)} in ${PREV2} and ${E.n(y2)} in ${PREV}. Counts follow ceremonies, so a month with few ceremonies shows a dip without any change in processing.` },
      { q: 'Is proof of citizenship the same application as a grant?', a: 'No. A grant is for a permanent resident who becomes a citizen. Proof of citizenship, the certificate, is for someone who is already Canadian, for example a person born abroad to a Canadian parent. IRCC shows a separate time for each, and the calculator lets you pick either line before you enter the time.' },
    ],
    body: (h) => `
<h2>Copy IRCC’s time, get an oath estimate</h2>
<p>IRCC publishes the time for a citizenship grant on its ${h.src('ptimes', '“Check processing times” tool')}. It is a forward-looking figure: IRCC’s projection for an application it receives today, built from the files already waiting, the staff working on them and the applications it expects. This site does not copy that figure. Read it there, enter it in the calculator with its unit, then add the month and day IRCC received your complete application. The calculator adds the time in calendar months and tells you how much of it has already gone by, or by how many days your file is past it.</p>
<p>The same calculator covers two other lines that IRCC times separately: proof of citizenship, the certificate requested by someone who is already Canadian, and a search of citizenship records. Pick the line first, then enter the time IRCC shows for it.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'citizenship', m: 'none' }, t: 'Your citizenship application: estimated oath date' })}
<h2>The standard IRCC sets itself</h2>
<p>IRCC also commits to a service standard for routine grant applications under subsections 5(1) and 5(2) of the Citizenship Act: ${K.fmtStd(st.cur, 'en')}, for 80% of files. Each year the department reports how many applications met it in the Government of Canada service inventory, published as ${h.src('od-std', 'open data')}. In ${K.fmtFy(st.fy, 'en')}, ${h.n(st.cur.met)} of ${h.n(st.cur.total)} applications were processed within the standard, or ${h.pct(st.cur.perf)}. In ${K.fmtFy(st.pfy!, 'en')}, the share was ${h.pct(st.prev?.perf)} of ${h.n(st.prev?.total)} applications. Routine means a file without complications. An application that needs extra steps, such as a hearing with a citizenship official or further checks on residence, can take longer than the standard.</p>
<h2>New citizens, month by month</h2>
<p>IRCC’s open data counts new citizens each month by country of birth. Over the latest twelve months, ${h.n(c12.last)} people took the oath, against ${h.n(c12.prev)} over the twelve months before. Calendar years show the trend: ${h.n(y1)} new citizens in ${PREV2}, ${h.n(y2)} in ${PREV}, and ${h.n(ycur)} from ${h.my(FIRSTM)} to ${h.my(LASTM)}. Because the count follows ceremonies, it dips in months with fewer ceremonies, such as the holiday season, without telling you anything about the applications still waiting.</p>
${h.months(K.MONTHS, [['New citizens', K.full('cit')]], { caption: 'New Canadian citizens by month, newest first. Source: IRCC, Operational Processing, open data; figures rounded to 5.' })}
<h2>Where new citizens were born</h2>
<p>The table ranks countries of birth by the number of new citizens over the latest twelve months. India comes first with ${h.n(top[0][1])} people, ${h.pct(share(top[0][0]))} of the total, followed by the Philippines with ${h.n(top[1][1])} and Nigeria with ${h.n(top[2][1])}. The country of birth is not necessarily the country of citizenship before naturalization, and it has no effect on the processing time: grants are handled in Canada, for all applicants alike.</p>
${h.table(['Country of birth', 'New citizens, last 12 months', 'Previous 12 months', 'Change'], rows(h), `New Canadian citizens by country of birth, ${h.w12()}, and the twelve months before. Source: IRCC, Operational Processing, open data.`, ['l', 'r', 'r', 'r'])}
<h2>Before applying: the presence rule</h2>
<p>An adult can apply after ${h.n(R.required)} days of physical presence in Canada during the five years before the application. Days spent in Canada as a temporary resident or protected person before permanent residence count for half a day each, up to ${h.n(R.tempCap)} days. The ${h.a('citizenship-calculator', 'presence calculator')} applies that rule to your own days and gives the first date you could apply if you stay in Canada. IRCC’s ${h.src('citizenship-eligibility', 'eligibility page')} lists the other conditions: tax filing, language for adults under 55 and the knowledge test.</p>
<h2>When your file runs long</h2>
<p>Track the file in your account or with IRCC’s ${h.src('check-status', 'status tool')}. If the date in the calculator is behind you, check that you used the day IRCC received the complete application, then see the ${h.a('beyond-processing-time', 'steps for an application past the processing time')}. A missed test or ceremony invitation, a change of address IRCC did not receive or a travel history that needs checking are the usual causes. The permanent resident card stays valid proof of status while you wait; its own steps are on the ${h.a('pr-card', 'PR card page')}.</p>
`,
  },
  fr: {
    slug: 'delai-citoyennete',
    nav: 'Citoyenneté', card: 'Date du serment à partir du délai d’IRCC, norme tenue, nouveaux citoyens',
    title: 'Délai de la demande de citoyenneté et serment en 2026',
    description: 'Estimez la date de votre serment de citoyenneté à partir du délai affiché par IRCC, et voyez la norme de service tenue et les nouveaux citoyens en 2026.',
    h1: 'Citoyenneté canadienne : du délai d’IRCC à la date du serment',
    intro: `${F.n(c12.last)} personnes sont devenues citoyennes canadiennes de ${F.w12()}, ${dir(c12.change, 'fr')} par rapport aux douze mois d’avant.`,
    resume: `IRCC affiche le délai d’une demande d’attribution de la citoyenneté dans son outil « Vérifier les délais de traitement », et c’est ce chiffre qu’il faut saisir dans le calculateur ci-dessus avec le jour où IRCC a reçu votre demande : le résultat est une date estimée pour la fin du processus, c’est-à-dire le serment. Les données ouvertes du gouvernement du Canada ajoutent deux éléments que l’outil d’IRCC ne garde pas. Le premier est la norme de service d’IRCC : ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes ordinaires d’attribution pour adultes et mineurs. En ${K.fmtFy(st.fy, 'fr')}, ${F.pct(st.cur.perf)} des ${F.n(st.cur.total)} demandes ont été traitées dans ce délai, ${gainFr} ${F.pct(st.prev?.perf)} en ${K.fmtFy(st.pfy!, 'fr')}. Le second est le nombre de nouveaux citoyens : ${F.n(c12.last)} de ${F.w12()}, dont ${F.n(K.ops12('cit', 'FR').last)} nés en France et ${F.n(K.ops12('cit', 'MA').last)} nés au Maroc. Avant tout cela, un adulte doit réunir ${F.n(R.required)} jours de présence effective dans les cinq ans qui précèdent la demande, ce que compte le calculateur de présence.`,
    faqs: [
      { q: 'Quelle est la norme de service d’IRCC pour l’attribution de la citoyenneté ?', a: `IRCC vise à traiter les demandes ordinaires d’attribution pour adultes et mineurs en ${K.fmtStd(st.cur, 'fr')}, pour 80 % des demandes. En ${K.fmtFy(st.fy, 'fr')}, il y est parvenu pour ${F.pct(st.cur.perf)} des ${F.n(st.cur.total)} demandes, d’après l’inventaire des services du gouvernement du Canada publié en données ouvertes. La norme est un objectif, pas une promesse pour votre dossier.` },
      { q: 'Le délai de citoyenneté comprend-il la cérémonie du serment ?', a: 'Pour une attribution, le délai affiché par IRCC court de la réception de la demande complète jusqu’au serment : la cérémonie en est le point d’arrivée. Il ne comprend ni le temps passé à réunir les jours de présence avant la demande, ni les retards dus à un examen manqué, une entrevue ou une demande de documents.' },
      { q: 'Combien de personnes deviennent citoyennes canadiennes chaque mois ?', a: `Dans les données ouvertes d’IRCC, le nombre mensuel de nouveaux citoyens va de ${F.n(ext.lo![1])} en ${F.my(ext.lo![0])} à ${F.n(ext.hi![1])} en ${F.my(ext.hi![0])} depuis ${F.my(K.MONTHS[0])}. Le total était de ${F.n(y1)} en ${PREV2} et de ${F.n(y2)} en ${PREV}. Les chiffres suivent les cérémonies : un mois avec peu de cérémonies baisse sans que le traitement change.` },
      { q: 'La preuve de citoyenneté est-elle la même demande qu’une attribution ?', a: 'Non. L’attribution concerne un résident permanent qui devient citoyen. La preuve de citoyenneté, le certificat, concerne une personne déjà canadienne, par exemple née à l’étranger d’un parent canadien. IRCC affiche un délai distinct pour chacune, et le calculateur permet de choisir la bonne ligne avant de saisir le délai.' },
    ],
    body: (h) => `
<h2>Recopiez le délai d’IRCC, obtenez une date de serment</h2>
<p>IRCC publie le délai d’une demande d’attribution de la citoyenneté dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. C’est un délai prospectif : la projection d’IRCC pour une demande reçue aujourd’hui, établie à partir des dossiers en attente, du personnel qui les traite et des demandes attendues. Ce site ne recopie pas ce chiffre. Lisez-le chez IRCC, saisissez-le dans le calculateur avec son unité, puis indiquez le mois et le jour où IRCC a reçu votre demande complète. Le calculateur ajoute le délai en mois de calendrier et vous dit quelle part en est déjà écoulée, ou de combien de jours votre dossier le dépasse.</p>
<p>Le même calculateur couvre deux autres lignes qu’IRCC chiffre à part : la preuve de citoyenneté, le certificat demandé par une personne déjà canadienne, et la recherche dans les registres de citoyenneté. Choisissez d’abord la ligne, puis saisissez le délai qu’IRCC affiche pour elle.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'citizenship', c: 'MA', m: 'none' }, t: 'Votre demande de citoyenneté : date de serment estimée' })}
<h2>La norme qu’IRCC se fixe</h2>
<p>IRCC s’engage aussi sur une norme de service pour les demandes ordinaires d’attribution présentées au titre des paragraphes 5(1) et 5(2) de la Loi sur la citoyenneté : ${K.fmtStd(st.cur, 'fr')}, pour 80 % des dossiers. Chaque année, le ministère publie le nombre de demandes qui l’ont respectée dans l’inventaire des services du gouvernement du Canada, diffusé en ${h.src('od-std', 'données ouvertes')}. En ${K.fmtFy(st.fy, 'fr')}, ${h.n(st.cur.met)} demandes sur ${h.n(st.cur.total)} ont été traitées dans la norme, soit ${h.pct(st.cur.perf)}. En ${K.fmtFy(st.pfy!, 'fr')}, la part était de ${h.pct(st.prev?.perf)} sur ${h.n(st.prev?.total)} demandes. Ordinaire signifie sans complication. Un dossier qui exige des étapes en plus, comme une audience devant un agent de la citoyenneté ou des vérifications de résidence, peut dépasser la norme.</p>
<h2>Les nouveaux citoyens, mois par mois</h2>
<p>Les données ouvertes d’IRCC comptent chaque mois les nouveaux citoyens selon leur pays de naissance. Sur les douze derniers mois, ${h.n(c12.last)} personnes ont prêté serment, contre ${h.n(c12.prev)} sur les douze mois précédents. Les années civiles montrent la tendance : ${h.n(y1)} nouveaux citoyens en ${PREV2}, ${h.n(y2)} en ${PREV}, et ${h.n(ycur)} de ${h.my(FIRSTM)} à ${h.my(LASTM)}. Comme le décompte suit les cérémonies, il baisse les mois où elles sont moins nombreuses, comme pendant les fêtes, sans rien dire des demandes encore en attente.</p>
${h.months(K.MONTHS, [['Nouveaux citoyens', K.full('cit')]], { caption: 'Nouveaux citoyens canadiens par mois, du plus récent au plus ancien. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.' })}
<h2>Où sont nés les nouveaux citoyens</h2>
<p>Le tableau classe les pays de naissance selon le nombre de nouveaux citoyens sur les douze derniers mois. L’Inde arrive en tête avec ${h.n(top[0][1])} personnes, soit ${h.pct(share(top[0][0]))} du total, devant les Philippines (${h.n(top[1][1])}) et le Nigéria (${h.n(top[2][1])}). Le pays de naissance n’est pas forcément le pays de citoyenneté avant la naturalisation, et il ne change rien au délai : les attributions sont traitées au Canada, de la même façon pour tous. La France compte ${h.n(K.ops12('cit', 'FR').last)} nouveaux citoyens sur la période, le Maroc ${h.n(K.ops12('cit', 'MA').last)} et l’Algérie ${h.n(K.ops12('cit', 'DZ').last)}.</p>
${h.table(['Pays de naissance', 'Nouveaux citoyens, 12 derniers mois', '12 mois d’avant', 'Écart'], rows(h), `Nouveaux citoyens canadiens par pays de naissance, ${h.w12()}, et les douze mois d’avant. Source : IRCC, Traitement opérationnel, données ouvertes.`, ['l', 'r', 'r', 'r'])}
<h2>Avant de déposer : la règle de présence</h2>
<p>Un adulte peut déposer sa demande après ${h.n(R.required)} jours de présence effective au Canada dans les cinq ans qui la précèdent. Les jours passés au Canada comme résident temporaire ou personne protégée avant la résidence permanente comptent pour une demi-journée chacun, ${h.n(R.tempCap)} jours au plus. Le ${h.a('citizenship-calculator', 'calculateur de présence')} applique cette règle à vos propres jours et donne la première date possible si vous restez au Canada. La ${h.src('citizenship-eligibility', 'page d’admissibilité')} d’IRCC liste les autres conditions : déclarations de revenus, langue pour les adultes de moins de 55 ans et examen de connaissances.</p>
<h2>Quand le dossier s’allonge</h2>
<p>Suivez le dossier dans votre compte ou avec l’${h.src('check-status', 'outil de suivi d’IRCC')}. Si la date du calculateur est passée, vérifiez d’abord que vous avez utilisé le jour de réception de la demande complète, puis consultez les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')}. Un examen ou une convocation manqués, un changement d’adresse non reçu par IRCC ou un historique de voyages à vérifier sont les causes habituelles. La carte de résident permanent reste une preuve valable de statut pendant l’attente ; ses propres démarches sont sur la ${h.a('pr-card', 'page de la carte RP')}.</p>
`,
  },
});
