import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Catégorie de l'expérience canadienne : norme de service (Inventaire des services du GC), invitations
 * (Entrée express, candidats invités) et admissions mensuelles (Permanent Residents, Monthly IRCC Updates),
 * données ouvertes sous la Licence du gouvernement ouvert du Canada. Le délai de l'outil d'IRCC est saisi par le lecteur. */
const E = K.en, F = K.fr;
const M = K.PRD.months;
const ser = K.prSeries('cec');
const st = K.stdOf('cec')!;
const c12 = K.pr12('cec'), all12 = K.pr12('all');
const shareAll = K.pctOf(c12.last, all12.last);
const yr = (y: string) => K.yearSum(ser, M, y) ?? 0;
const full = K.EE_FULL, cur = K.EE_CUR, prevFull = String(Number(full) - 1);
const inv = (y: string) => K.eeYear(y, 'cec');
const invCh = K.pctOf(inv(full) - inv(prevFull), inv(prevFull));
const invShare = K.pctOf(inv(full), K.eeYear(full));
const invShareCur = K.pctOf(inv(cur), K.eeYear(cur));
const perfCh = st.prev?.perf != null && st.cur.perf != null ? Math.round((st.cur.perf - st.prev.perf) * 10) / 10 : null;
const perMonth = Math.round((c12.last ?? 0) / 12);
const admYears = [prevFull, full].filter((y) => M.some((m) => m.startsWith(y)));
const dirEn = (x: number | null) => (x == null ? 'unchanged' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');
const ptsEn = (x: number | null) => (x == null ? '' : `${E.n(Math.abs(x), 1)} points`);
const midShare = K.pctOf(K.eeBands(full, 'cec').slice(K.EED.bandOrder.indexOf('451-500'), K.EED.bandOrder.indexOf('601-700')).reduce((a, x) => a + x, 0), inv(full));
// Le texte dit « six mois », « première source d'invitations » et « la plupart entre 451 et 600 » : vrai tant que ces gardes passent.
if (st.cur.n !== 6 || st.cur.u !== 'm') throw new Error('cec : la norme n’est plus de six mois, revoir titre et texte');
if (['fsw', 'pnp'].some((k) => K.eeYear(full, k) > inv(full))) throw new Error('cec : l’expérience canadienne n’est plus la première source d’invitations');
if ((midShare ?? 0) <= 50) throw new Error('cec : la majorité des invitations n’est plus entre 451 et 600');
const ptsFr = (x: number | null) => (x == null ? '' : `${F.n(Math.abs(x), 1)} points`);

const chEn = (x: number | null) => (x == null ? 'unchanged' : Math.abs(x) < 0.5 ? 'stable' : `${x > 0 ? 'up' : 'down'} ${K.en.pa(x)}`);
const chFr = (x: number | null) => (x == null ? 'stable' : Math.abs(x) < 0.5 ? 'stable' : `${x > 0 ? 'en hausse' : 'en baisse'} de ${K.fr.pa(x)}`);

export default defineGuide({
  id: 'cec', group: 'pr', order: 41,
  tool: 'delai', toolArg: { g: 'cec' },
  related: ['express-entry', 'fsw', 'pnp', 'express-entry-draws', 'work-permit-extension', 'beyond-processing-time'],
  sources: ['ptimes', 'od-std', 'od-pr', 'od-ee', 'express-entry', 'ogl'],
  en: {
    slug: 'canadian-experience-class-processing-time',
    nav: 'Canadian Experience Class', card: 'CEC decision date, six-month standard, invitations and admissions',
    title: 'CEC Processing Time in 2026: Standard and Admissions',
    description: 'CEC permanent residence in 2026: IRCC’s six-month standard and how often it is met, invitations, monthly admissions and your decision date from IRCC’s time.',
    h1: 'Canadian Experience Class: standard, admissions and your decision date',
    intro: `IRCC aims to decide 80% of Canadian Experience Class applications within ${K.fmtStd(st.cur, 'en')}; in ${K.fmtFy(st.fy, 'en')} it did so for ${E.pct(st.cur.perf)} of them.`,
    resume: `The Canadian Experience Class is the Express Entry program for people who already have skilled work experience in Canada. After the invitation, IRCC shows the time it expects for a CEC application on its “Check processing times” tool; copy it into the calculator above with the day IRCC received your application to get an estimated decision date. IRCC’s published service standard for this program is ${K.fmtStd(st.cur, 'en')} for 80% of applications. In ${K.fmtFy(st.fy, 'en')} it met that standard for ${E.pct(st.cur.perf)} of ${E.n(st.cur.total)} applications, ${perfCh == null ? 'with no earlier year to compare' : `${dirEn(perfCh)} ${ptsEn(perfCh)} on ${K.fmtFy(st.pfy!, 'en')}`}. IRCC invited ${E.n(inv(full))} CEC candidates in ${full}, ${E.pct(invShare)} of all Express Entry invitations, and ${E.n(inv(cur))} so far in ${cur}. From ${E.w12(M)}, ${E.n(c12.last)} people were admitted as permanent residents under the CEC, ${chEn(c12.change)} on the previous twelve months, or about ${E.n(perMonth)} a month.`,
    faqs: [
      { q: 'Is the Canadian Experience Class faster than the Federal Skilled Worker Program?', a: `Both share IRCC’s service standard of ${K.fmtStd(st.cur, 'en')} for 80% of applications. The difference shows in how often the standard is met and in the time IRCC displays on its tool for each program at a given moment. Compare the two times on IRCC’s tool the day you check, rather than relying on a general rule.` },
      { q: 'Can I keep working in Canada while my CEC application is processed?', a: 'Often yes, if your work permit is still valid or you applied to extend it before it expired, which keeps your status while IRCC decides. Some applicants with a pending permanent residence application can also ask for a bridging open work permit. Check the conditions on IRCC’s pages before your permit ends.' },
      { q: 'Why do CEC admissions not match the number of CEC invitations?', a: 'Invitations count principal applicants on the day they are invited, while admissions count every person who becomes a permanent resident, including spouses and children, in the month it happens. Months or more separate the two, some invited candidates never apply, and some applications are refused, so the two counts rarely line up within a year.' },
      { q: 'Does the CEC processing time include the wait for an invitation?', a: 'No. The time on IRCC’s tool and the service standard start on the day IRCC receives your complete permanent residence application, which you can only submit after an invitation. Time spent in the Express Entry pool before that is not counted, and neither is time you take to answer a request from IRCC.' },
    ],
    body: (h) => `
<h2>Your Canadian Experience Class decision date</h2>
<p>For the Canadian Experience Class, the wait that IRCC measures begins when it receives your complete application for permanent residence, sent through your online account after an invitation to apply. IRCC shows the time it currently expects for that stage on its ${h.src('ptimes', 'Check processing times tool')}. That figure moves as files are decided and new ones arrive, so check it when you use the calculator rather than relying on an old screenshot. Enter it below with its unit and your filing date: the result is a date, not a promise, and it does not count days lost to a missing document.</p>
${h.mini('delai', { p: ['n', 'u', 'm'], d: { g: 'cec', u: 'm' }, t: 'Your CEC application: estimated decision date' })}
<h2>How often IRCC meets the CEC standard</h2>
<p>IRCC’s service standard for the Canadian Experience Class is ${K.fmtStd(st.cur, 'en')} for 80% of complete electronic applications, published every year in the Government of Canada service inventory as ${h.src('od-std', 'open data')}. In ${K.fmtFy(st.fy, 'en')}, ${h.n(st.cur.met)} of ${h.n(st.cur.total)} applications were processed within it, or ${h.pct(st.cur.perf)}. ${st.prev ? `The year before, ${K.fmtFy(st.pfy!, 'en')}, the rate was ${h.pct(st.prev.perf)} of ${h.n(st.prev.total)} applications.` : ''} ${st.cur.perf != null && st.cur.perf >= 80 ? 'The 80% target was reached.' : 'The 80% target was not reached.'} If the time on IRCC’s tool is well above ${K.fmtStd(st.cur, 'en')}, the current year is likely to end below the target; if it is close, most applicants will hear back near the standard.</p>
<h2>Invitations under the CEC</h2>
<p>The Canadian Experience Class is the largest source of Express Entry invitations in IRCC’s ${h.src('od-ee', 'open data on invited candidates')}. In ${full}, IRCC invited ${h.n(inv(full))} CEC candidates, ${invCh != null && invCh < 0 ? `${h.pa(invCh)} fewer than` : `${h.pa(invCh)} more than`} in ${prevFull}, and that program took ${h.pct(invShare)} of all invitations. In ${cur} so far, the count stands at ${h.n(inv(cur))}, a share of ${h.pct(invShareCur)}. In ${full}, ${h.pct(midShare)} of CEC invitations went to scores between 451 and 600 points; the ${h.a('express-entry-draws', 'invitations by score band')} page shows the exact spread and lets you place your own score.</p>
<h2>Admissions, month by month</h2>
<p>When an application is approved and the person confirms permanent residence, IRCC counts an admission in its ${h.src('od-pr', 'permanent residents open data')}. From ${h.w12(M)}, ${h.n(c12.last)} people were admitted under the CEC, ${h.lang === 'fr' ? chFr(c12.change) : chEn(c12.change)} on the twelve months before, which is ${h.pct(shareAll)} of all new permanent residents over the same months. ${admYears.map((y) => `In ${y}, the total was ${h.n(yr(y))}.`).join(' ')} The table shows the most recent months, newest first.</p>
${h.months(M, [['Canadian Experience Class', ser]], { max: 12, caption: 'Permanent residents admitted under the Canadian Experience Class, by month, newest first. Source: IRCC, Permanent Residents, Monthly IRCC Updates, open data; figures rounded.' })}
<p>Admissions are a measure of output, not of waiting time: a month with many admissions can follow a large round of invitations months earlier. They do help to read the trend, since a fall in admissions while invitations rise usually means files are piling up before decisions.</p>
<h2>Keeping status while you wait</h2>
<p>Most CEC applicants are in Canada on a work permit, often a post-graduation work permit, and the qualifying experience must have been gained while authorized to work. Keep pay slips, contracts and a reference letter listing duties and hours for each job: IRCC compares them with the occupation you claimed, and a mismatch is a common reason for refusal. If your permit nears its end before a decision, the ${h.a('work-permit-extension', 'work permit extension')} page explains how to apply in time to keep your status. Once the calculator’s date has passed, the steps on the ${h.a('beyond-processing-time', 'application past the processing time')} page help you check your file and decide whether to contact IRCC.</p>
`,
  },
  fr: {
    slug: 'delai-experience-canadienne',
    nav: 'Expérience canadienne', card: 'Date de décision, norme de six mois, invitations et admissions de l’expérience canadienne',
    title: 'Délai de l’expérience canadienne 2026 : norme, admissions',
    description: 'Expérience canadienne en 2026 : norme de six mois d’IRCC et taux de respect, invitations, admissions mensuelles et date de décision selon le délai d’IRCC.',
    h1: 'Expérience canadienne : norme, admissions et votre date de décision',
    intro: `IRCC vise une décision dans les ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes de la catégorie de l’expérience canadienne ; en ${K.fmtFy(st.fy, 'fr')}, il y est parvenu pour ${F.pct(st.cur.perf)} d’entre elles.`,
    resume: `La catégorie de l’expérience canadienne est le programme de l’Entrée express destiné aux personnes qui ont déjà une expérience de travail qualifié au Canada. Après l’invitation, IRCC affiche dans son outil « Vérifier les délais de traitement » le délai qu’il prévoit pour une demande de cette catégorie ; recopiez-le dans le calculateur ci-dessus avec le jour où IRCC a reçu votre demande pour obtenir une date de décision estimée. La norme de service publiée par IRCC pour ce programme est de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes. En ${K.fmtFy(st.fy, 'fr')}, elle a été tenue pour ${F.pct(st.cur.perf)} des ${F.n(st.cur.total)} demandes, ${perfCh == null ? 'sans année antérieure pour comparer' : `${dirFr(perfCh)} de ${ptsFr(perfCh)} par rapport à ${K.fmtFy(st.pfy!, 'fr')}`}. IRCC a invité ${F.n(inv(full))} candidats de l’expérience canadienne en ${full}, soit ${F.pct(invShare)} des invitations de l’Entrée express, et ${F.n(inv(cur))} depuis le début de ${cur}. De ${F.w12(M)}, ${F.n(c12.last)} personnes ont été admises comme résidents permanents dans cette catégorie, ${chFr(c12.change)} sur les douze mois d’avant, soit environ ${F.n(perMonth)} par mois.`,
    faqs: [
      { q: 'L’expérience canadienne est-elle plus rapide que les travailleurs qualifiés du fédéral ?', a: `Les deux programmes ont la même norme de service d’IRCC, ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes. L’écart se voit dans la fréquence à laquelle la norme est tenue et dans le délai affiché par l’outil d’IRCC pour chaque programme à un moment donné. Comparez les deux délais dans l’outil d’IRCC le jour où vous vérifiez, plutôt que de vous fier à une règle générale.` },
      { q: 'Puis-je continuer à travailler au Canada pendant l’examen de ma demande d’expérience canadienne ?', a: 'Souvent oui, si votre permis de travail est encore valide ou si vous avez demandé sa prolongation avant son expiration, ce qui maintient votre statut pendant la décision. Certains demandeurs dont la demande de résidence permanente est en cours peuvent aussi demander un permis de travail ouvert transitoire. Vérifiez les conditions sur les pages d’IRCC avant la fin du permis.' },
      { q: 'Pourquoi les admissions de l’expérience canadienne ne correspondent-elles pas aux invitations ?', a: 'Les invitations comptent les demandeurs principaux le jour où ils sont invités, alors que les admissions comptent chaque personne qui devient résident permanent, époux et enfants compris, le mois où cela se produit. Des mois séparent les deux, certains invités ne déposent jamais de demande et certaines demandes sont refusées : les deux nombres concordent rarement sur une année.' },
      { q: 'Le délai de l’expérience canadienne inclut-il l’attente d’une invitation ?', a: 'Non. Le délai de l’outil d’IRCC et la norme de service partent du jour où IRCC reçoit votre demande complète de résidence permanente, que vous ne pouvez envoyer qu’après une invitation. Le temps passé avant dans le bassin de l’Entrée express n’est pas compté, pas plus que le temps pris pour répondre à une demande d’IRCC.' },
    ],
    body: (h) => `
<h2>Votre date de décision pour l’expérience canadienne</h2>
<p>Pour la catégorie de l’expérience canadienne, l’attente mesurée par IRCC commence quand il reçoit votre demande complète de résidence permanente, envoyée depuis votre compte en ligne après une invitation à présenter une demande. IRCC affiche le délai qu’il prévoit actuellement pour cette étape dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. Ce chiffre bouge au fil des décisions et des nouveaux dossiers : consultez-le au moment d’utiliser le calculateur plutôt que de vous fier à une ancienne capture. Saisissez-le ci-dessous avec son unité et votre date de dépôt : le résultat est une date, pas une promesse, et il ne compte pas les jours perdus pour un document manquant.</p>
${h.mini('delai', { p: ['n', 'u', 'm'], d: { g: 'cec', u: 'm' }, t: 'Votre demande d’expérience canadienne : date de décision estimée' })}
<h2>À quelle fréquence IRCC tient la norme</h2>
<p>La norme de service d’IRCC pour l’expérience canadienne est de ${K.fmtStd(st.cur, 'fr')} pour 80 % des demandes électroniques complètes ; elle est publiée chaque année dans l’inventaire des services du gouvernement du Canada, en ${h.src('od-std', 'données ouvertes')}. En ${K.fmtFy(st.fy, 'fr')}, ${h.n(st.cur.met)} des ${h.n(st.cur.total)} demandes ont été traitées dans ce délai, soit ${h.pct(st.cur.perf)}. ${st.prev ? `L’exercice précédent, ${K.fmtFy(st.pfy!, 'fr')}, le taux était de ${h.pct(st.prev.perf)} sur ${h.n(st.prev.total)} demandes.` : ''} ${st.cur.perf != null && st.cur.perf >= 80 ? 'La cible de 80 % a été atteinte.' : 'La cible de 80 % n’a pas été atteinte.'} Si le délai de l’outil d’IRCC dépasse nettement ${K.fmtStd(st.cur, 'fr')}, l’exercice en cours risque de finir sous la cible ; s’il en est proche, la plupart des demandeurs auront une réponse autour de la norme.</p>
<h2>Les invitations de l’expérience canadienne</h2>
<p>L’expérience canadienne est la première source d’invitations de l’Entrée express dans les ${h.src('od-ee', 'données ouvertes sur les candidats invités')}. En ${full}, IRCC a invité ${h.n(inv(full))} candidats de cette catégorie, ${invCh != null && invCh < 0 ? `soit ${h.pa(invCh)} de moins` : `soit ${h.pa(invCh)} de plus`} qu’en ${prevFull}, et elle a reçu ${h.pct(invShare)} de toutes les invitations. En ${cur} jusqu’ici, le compte est de ${h.n(inv(cur))}, soit une part de ${h.pct(invShareCur)}. En ${full}, ${h.pct(midShare)} des invitations de l’expérience canadienne sont allées à des scores entre 451 et 600 points ; la page des ${h.a('express-entry-draws', 'invitations par tranche de score')} donne la répartition exacte et situe votre propre score.</p>
<h2>Les admissions, mois par mois</h2>
<p>Quand une demande est acceptée et que la personne confirme sa résidence permanente, IRCC compte une admission dans ses ${h.src('od-pr', 'données ouvertes sur les résidents permanents')}. De ${h.w12(M)}, ${h.n(c12.last)} personnes ont été admises au titre de l’expérience canadienne, ${h.lang === 'fr' ? chFr(c12.change) : chEn(c12.change)} sur les douze mois d’avant, soit ${h.pct(shareAll)} de tous les nouveaux résidents permanents de la période. ${admYears.map((y) => `En ${y}, le total était de ${h.n(yr(y))}.`).join(' ')} Le tableau montre les mois les plus récents, du plus récent au plus ancien.</p>
${h.months(M, [['Expérience canadienne', ser]], { max: 12, caption: 'Résidents permanents admis dans la catégorie de l’expérience canadienne, par mois, du plus récent au plus ancien. Source : IRCC, Résidents permanents, mises à jour mensuelles, données ouvertes ; chiffres arrondis.' })}
<p>Les admissions mesurent la production, pas l’attente : un mois riche en admissions peut suivre une grosse ronde d’invitations plusieurs mois plus tôt. Elles aident pourtant à lire la tendance : des admissions en baisse alors que les invitations montent signalent en général des dossiers qui s’accumulent avant décision.</p>
<h2>Garder son statut pendant l’attente</h2>
<p>La plupart des demandeurs de l’expérience canadienne sont au Canada avec un permis de travail. Si le permis arrive à échéance avant la décision, la page sur la ${h.a('work-permit-extension', 'prolongation du permis de travail')} explique comment demander à temps pour garder votre statut. Une fois la date du calculateur passée, la page sur la ${h.a('beyond-processing-time', 'demande qui dépasse le délai')} aide à vérifier le dossier et à décider s’il faut écrire à IRCC.</p>
`,
  },
});
