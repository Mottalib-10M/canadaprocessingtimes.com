import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* AVE : norme de service d'IRCC et volume de demandes déclaré (Inventaire des services du GC, OGL-Canada 2.0).
 * IRCC ne publie pas de volume mensuel d'AVE en données ouvertes ; aucun délai de canada.ca n'est repris. */
const E = K.en, F = K.fr;
const st = K.stdOf('eta')!, vv = K.stdOf('visitor')!;
const late = st.cur.total != null && st.cur.met != null ? st.cur.total - st.cur.met : null;
const lateShare = st.cur.perf != null ? Math.round((100 - st.cur.perf) * 10) / 10 : null;
const same = st.prev?.perf != null && st.cur.perf != null && Math.abs(st.cur.perf - st.prev.perf) < 0.5;
const ratio = st.cur.total && vv.cur.total ? Math.round((st.cur.total / vv.cur.total) * 100) : null;
const v1 = K.ops12('v1');
const tgt = st.cur.target != null ? st.cur.target * 100 : null;
const bothAbove = tgt != null && (st.cur.perf ?? 0) >= tgt && (st.prev?.perf ?? 0) >= tgt;

export default defineGuide({
  id: 'eta', group: 'visit', order: 13,
  // n, u : exemple de saisie (quelques jours, le cas d'une AVE renvoyée à un examen manuel), à remplacer par le lecteur.
  tool: 'delai', toolArg: { g: 'eta', only: 'eta,visitor,visitor-inside', n: 3, u: 'd' },
  related: ['visitor-visa', 'visitor-record', 'super-visa', 'study-permit', 'beyond-processing-time'],
  sources: ['eta', 'ptimes', 'od-std', 'open-data', 'ogl'],
  en: {
    slug: 'eta-processing-time',
    nav: 'eTA', card: 'Electronic Travel Authorization: minutes, and when it takes longer',
    title: 'eTA Processing Time and Approval Within Minutes, 2026',
    description: 'eTA processing in 2026: IRCC’s five-minute target for an automated approval, how many applications met it, and what to do when yours takes days instead.',
    h1: 'eTA: minutes for most travellers, days for some',
    intro: `IRCC aims to approve most eTAs automatically within ${K.fmtStd(st.cur, 'en')}; in ${K.fmtFy(st.fy, 'en')}, ${E.pct(st.cur.perf)} of applications were.`,
    resume: `An Electronic Travel Authorization is what citizens of visa-exempt countries need to fly to or through a Canadian airport, and IRCC’s service standard is that most applicants get an automated approval within ${K.fmtStd(st.cur, 'en')}. In its report for ${K.fmtFy(st.fy, 'en')}, published in the Government of Canada service inventory as open data, IRCC counted ${E.n(st.cur.total)} eTA applications, of which ${E.n(st.cur.met)}, or ${E.pct(st.cur.perf)}, met that target. ${same ? 'The share was practically the same the year before' : `The share was ${E.pct(st.prev?.perf)} the year before`}. The other ${E.n(late)} applications, about ${E.pct(lateShare)} of the total, went to an officer, who may ask for documents before deciding; that is when an eTA takes days rather than minutes. For those cases, IRCC shows a time on its “Check processing times” tool: copy it into the calculator above, with the day you applied, to see when an answer could come.`,
    faqs: [
      { q: 'How many eTA applications are approved within minutes?', a: `IRCC’s service standard is an automated approval within ${K.fmtStd(st.cur, 'en')} for most applicants. In ${K.fmtFy(st.fy, 'en')}, ${E.n(st.cur.met)} of ${E.n(st.cur.total)} applications met it, which is ${E.pct(st.cur.perf)}. The figure comes from the service inventory the Government of Canada publishes as open data every year.` },
      { q: 'Why is my eTA not approved after a few minutes?', a: 'The automated check could not clear the application on its own, so an officer reviews it. IRCC may email a request for more information, such as a document or a medical exam. Check the email address used in the form, including the spam folder, and answer within the deadline given, because the file waits for you.' },
      { q: 'Do I need an eTA or a visitor visa?', a: 'It depends on your passport and on how you travel. Citizens of visa-exempt countries flying to Canada need an eTA; United States citizens need neither. Citizens of other countries need a visitor visa, which takes far longer and involves biometrics. IRCC’s eTA page has a questionnaire that gives the answer for your passport.' },
    ],
    body: (h) => `
<h2>Five minutes as a target</h2>
<p>IRCC publishes a service standard for the eTA: most applicants should get an automated approval within ${K.fmtStd(st.cur, 'en')}. The Government of Canada service inventory, released by the Treasury Board Secretariat as ${h.src('od-std', 'open data')}, reports each year how many applications met that standard. In ${K.fmtFy(st.fy, 'en')}, IRCC counted ${h.n(st.cur.total)} eTA applications and ${h.n(st.cur.met)} automated approvals within the target, or ${h.pct(st.cur.perf)}. In ${K.fmtFy(st.pfy!, 'en')} the share was ${h.pct(st.prev?.perf)}. ${bothAbove ? `Both years are above the ${h.pct(tgt)} of applications IRCC sets as the target for this standard.` : `IRCC sets the target for this standard at ${h.pct(tgt)} of applications.`}</p>
<p>Those totals also say something about scale. The eTA line handled about ${h.n(ratio)}% as many applications as the visitor visa line, which IRCC reported at ${h.n(vv.cur.total)} applications in the same year, yet almost all of them are decided by a system rather than an officer. That is why an eTA rarely appears in discussions of processing delays, and why the few that do get stuck feel so long.</p>
<h2>When it takes longer</h2>
<p>About ${h.n(late)} eTA applications in ${K.fmtFy(st.fy, 'en')} did not meet the five-minute target. Those files go to an officer. IRCC then emails the applicant, sometimes to ask for a document, a police certificate or a medical exam, sometimes only to say the review takes more time. The ${h.src('eta', 'eTA page')} on canada.ca explains how to answer. For an application under manual review, IRCC also shows a time on its ${h.src('ptimes', '“Check processing times” tool')}. Copy that figure into the calculator with the day you applied: the result is the date an answer could reasonably come, and how many days are left.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'eta', n: 3, u: 'd', m: K.READ.slice(0, 7) }, t: 'eTA under review: when could an answer come?' })}
<p>Most delays come from small mistakes rather than from the review itself. A passport number typed with the letter O instead of a zero, a wrong country of issue or an email address with a typo all produce an eTA that does not match the passport you board with, or a request IRCC cannot deliver. Before you apply again, read the confirmation email: it repeats the details you entered.</p>
<h2>Plan the trip around the risk</h2>
<p>Since a small share of applications needs days, apply as soon as the trip is booked, not at the airport. An eTA is valid for five years or until the passport expires, so a traveller with a new passport needs a new eTA. Students and workers from visa-exempt countries receive an eTA automatically with their first permit, which the ${h.a('study-permit', 'study permit page')} describes.</p>
<h2>eTA or visitor visa</h2>
<p>The eTA covers air travel for citizens of visa-exempt countries. Travellers from other countries apply for a ${h.a('visitor-visa', 'visitor visa')} instead, a much heavier process: biometrics at a visa application centre, a decision by an officer and a standard of ${K.fmtStd(vv.cur, 'en')} that IRCC met for ${h.pct(vv.cur.perf)} of applications in ${K.fmtFy(vv.fy, 'en')}. IRCC approved ${h.n(v1.last)} visitor visas from ${h.w12()}, according to its monthly open data. IRCC does not publish a monthly count of eTAs, so the service inventory above is the only open figure for this line.</p>
<h2>After arrival</h2>
<p>An eTA lets you board; the border officer decides how long you may stay, usually up to six months. To stay longer, apply for a ${h.a('visitor-record', 'visitor record')} before your status ends. If an answer on your eTA or any other application is past the time you entered, follow the ${h.a('beyond-processing-time', 'steps for an application past the processing time')}.</p>
`,
  },
  fr: {
    slug: 'delai-ave',
    nav: 'AVE', card: 'Autorisation de voyage électronique : minutes, et quand c’est plus long',
    title: 'Délai de l’AVE et approbation en quelques minutes, 2026',
    description: 'AVE en 2026 : la cible de cinq minutes d’IRCC pour une approbation automatique, le nombre de demandes qui l’ont atteinte et que faire si cela prend des jours.',
    h1: 'AVE : quelques minutes pour la plupart, quelques jours pour certains',
    intro: `IRCC vise une approbation automatique de la plupart des AVE en ${K.fmtStd(st.cur, 'fr')} ; en ${K.fmtFy(st.fy, 'fr')}, ${F.pct(st.cur.perf)} des demandes l’ont obtenue.`,
    resume: `L’autorisation de voyage électronique est le document dont les citoyens des pays dispensés de visa ont besoin pour prendre l’avion vers le Canada ou y transiter, et la norme de service d’IRCC veut que la plupart des demandeurs obtiennent une approbation automatique en ${K.fmtStd(st.cur, 'fr')}. Dans son bilan de ${K.fmtFy(st.fy, 'fr')}, publié dans l’inventaire des services du gouvernement du Canada en données ouvertes, IRCC a compté ${F.n(st.cur.total)} demandes d’AVE, dont ${F.n(st.cur.met)}, soit ${F.pct(st.cur.perf)}, ont respecté cette cible. ${same ? 'La part était pratiquement la même l’année précédente' : `La part était de ${F.pct(st.prev?.perf)} l’année précédente`}. Les ${F.n(late)} autres demandes, environ ${F.pct(lateShare)} du total, sont passées entre les mains d’un agent, qui peut demander des documents avant de décider : c’est là qu’une AVE prend des jours plutôt que des minutes. Pour ces cas, IRCC affiche un délai dans son outil « Vérifier les délais de traitement » : recopiez-le dans le calculateur ci-dessus, avec le jour de la demande, pour voir quand une réponse pourrait arriver.`,
    faqs: [
      { q: 'Combien de demandes d’AVE sont approuvées en quelques minutes ?', a: `La norme de service d’IRCC est une approbation automatique en ${K.fmtStd(st.cur, 'fr')} pour la plupart des demandeurs. En ${K.fmtFy(st.fy, 'fr')}, ${F.n(st.cur.met)} des ${F.n(st.cur.total)} demandes l’ont respectée, soit ${F.pct(st.cur.perf)}. Ce chiffre vient de l’inventaire des services que le gouvernement du Canada publie chaque année en données ouvertes.` },
      { q: 'Pourquoi mon AVE n’est-elle pas approuvée après quelques minutes ?', a: 'Le contrôle automatique n’a pas pu valider la demande seul : un agent l’examine. IRCC peut envoyer un courriel demandant un document ou un examen médical. Surveillez l’adresse indiquée dans le formulaire, dossier des indésirables compris, et répondez dans le délai fixé, car le dossier attend votre réponse.' },
      { q: 'Faut-il une AVE ou un visa de visiteur pour venir au Canada ?', a: 'Tout dépend du passeport et du moyen de transport. Les citoyens des pays dispensés de visa qui arrivent en avion ont besoin d’une AVE ; les citoyens des États-Unis n’ont besoin ni de l’une ni de l’autre. Les autres demandent un visa de visiteur, bien plus long, avec biométrie. La page AVE d’IRCC propose un questionnaire qui tranche selon votre passeport.' },
    ],
    body: (h) => `
<h2>Cinq minutes comme objectif</h2>
<p>IRCC publie une norme de service pour l’AVE : la plupart des demandeurs devraient obtenir une approbation automatique en ${K.fmtStd(st.cur, 'fr')}. L’inventaire des services du gouvernement du Canada, diffusé par le Secrétariat du Conseil du Trésor en ${h.src('od-std', 'données ouvertes')}, indique chaque année combien de demandes ont respecté cette norme. En ${K.fmtFy(st.fy, 'fr')}, IRCC a compté ${h.n(st.cur.total)} demandes d’AVE et ${h.n(st.cur.met)} approbations automatiques dans la cible, soit ${h.pct(st.cur.perf)}. En ${K.fmtFy(st.pfy!, 'fr')}, la part était de ${h.pct(st.prev?.perf)}. ${bothAbove ? `Les deux années dépassent les ${h.pct(tgt)} de demandes qu’IRCC fixe comme cible pour cette norme.` : `IRCC fixe la cible de cette norme à ${h.pct(tgt)} des demandes.`}</p>
<p>Ces totaux disent aussi quelque chose de l’échelle. La ligne des AVE a traité environ ${h.n(ratio)} % du nombre de demandes de la ligne des visas de visiteur, qu’IRCC chiffrait à ${h.n(vv.cur.total)} demandes la même année, et pourtant presque toutes sont tranchées par un système plutôt que par un agent. C’est pourquoi l’AVE apparaît rarement dans les débats sur les délais, et pourquoi les rares dossiers bloqués semblent si longs.</p>
<h2>Quand c’est plus long</h2>
<p>Environ ${h.n(late)} demandes d’AVE n’ont pas respecté la cible de cinq minutes en ${K.fmtFy(st.fy, 'fr')}. Ces dossiers passent à un agent. IRCC écrit alors au demandeur, parfois pour demander un document, un certificat de police ou un examen médical, parfois seulement pour dire que l’examen prend plus de temps. La ${h.src('eta', 'page AVE')} de canada.ca explique comment répondre. Pour une demande en examen manuel, IRCC affiche aussi un délai dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. Recopiez ce chiffre dans le calculateur avec le jour de la demande : le résultat est la date à laquelle une réponse peut raisonnablement arriver, et le nombre de jours qui restent.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'eta', n: 3, u: 'd', m: K.READ.slice(0, 7), c: 'FR' }, t: 'AVE en examen : quand la réponse peut-elle arriver ?' })}
<p>La plupart des retards viennent de petites erreurs plutôt que de l’examen lui-même. Un numéro de passeport tapé avec la lettre O au lieu d’un zéro, un mauvais pays de délivrance ou une adresse courriel mal orthographiée donnent une AVE qui ne correspond pas au passeport présenté à l’embarquement, ou une demande qu’IRCC ne peut pas joindre. Avant de refaire une demande, relisez le courriel de confirmation : il reprend les renseignements saisis.</p>
<h2>Prévoir le voyage en fonction du risque</h2>
<p>Comme une petite part des demandes prend des jours, faites la demande dès que le voyage est réservé, pas à l’aéroport. Une AVE vaut cinq ans ou jusqu’à l’expiration du passeport : un voyageur qui change de passeport a besoin d’une nouvelle AVE. Les étudiants et travailleurs des pays dispensés de visa reçoivent automatiquement une AVE avec leur premier permis, comme l’explique la ${h.a('study-permit', 'page du permis d’études')}.</p>
<h2>AVE ou visa de visiteur</h2>
<p>L’AVE couvre le voyage en avion des citoyens des pays dispensés de visa. Les voyageurs des autres pays demandent un ${h.a('visitor-visa', 'visa de visiteur')}, une démarche bien plus lourde : biométrie dans un centre de réception des demandes de visa, décision d’un agent et norme de ${K.fmtStd(vv.cur, 'fr')} qu’IRCC a tenue pour ${h.pct(vv.cur.perf)} des demandes en ${K.fmtFy(vv.fy, 'fr')}. IRCC a approuvé ${h.n(v1.last)} visas de visiteur de ${h.w12()}, selon ses données ouvertes mensuelles. IRCC ne publie pas de nombre mensuel d’AVE : l’inventaire des services est le seul chiffre ouvert pour cette ligne.</p>
<h2>Après l’arrivée</h2>
<p>L’AVE permet d’embarquer ; l’agent des services frontaliers décide de la durée du séjour, en général jusqu’à six mois. Pour rester plus longtemps, demandez une ${h.a('visitor-record', 'fiche du visiteur')} avant la fin de votre statut. Si la réponse à votre AVE ou à une autre demande dépasse le délai saisi, suivez les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')}.</p>
`,
  },
});
