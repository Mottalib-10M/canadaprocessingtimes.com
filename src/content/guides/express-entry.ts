import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Les trois programmes d'Entrée express après l'invitation : fichier prospectif d'IRCC (flpt), relevés depuis octobre 2025. */
const IDS = ['cec', 'fsw', 'pnp-ee'] as const;
const r = (p: string) => K.readingOf(p);
const tr = (p: string) => K.fullTrend(r(p).series)!;
const D = K.L.dates.flpt;
const since = `${Number(K.READ.slice(0, 4)) - 1}${K.READ.slice(4)}`;
const all12 = K.eeStats(K.ROUNDS, 'all', 0, since);
const cec12 = K.eeStats(K.ROUNDS, 'cec', 0, since);
const pnp12 = K.eeStats(K.ROUNDS, 'pnp', 0, since);
const waitSum = IDS.reduce((a, p) => a + (r(p).waiting ?? 0), 0);
const sv = r('startup-visa');
const base = r('pnp-base');
const lastRound = K.ROUNDS[0];
const E = K.en, F = K.fr;
const PAGE: Record<string, string> = { cec: 'cec', fsw: 'fsw', 'pnp-ee': 'pnp' };

/** Les trois délais, relevé par relevé, côte à côte (seuls les relevés où les trois sont chiffrés). */
function sideBySide(h: Helpers) {
  const pts = IDS.map((p) => new Map(K.points(r(p).series).map((x) => [x.date, x.v])));
  const dates = [...pts[0].keys()].filter((d) => pts.every((m) => m.has(d))).reverse();
  return dates.map((d) => [h.day(d), ...pts.map((m) => h.d(m.get(d)!, 'm'))]);
}
function overview(h: Helpers) {
  return IDS.map((p) => {
    const t = tr(p);
    return [h.a(PAGE[p], K.progName(p, h.lang)), h.t(r(p).t), h.n(r(p).waiting ?? 0), `${h.d(t.min, 'm')} · ${h.d(t.max, 'm')}`];
  });
}

export default defineGuide({
  id: 'express-entry', group: 'pr', order: 40,
  tool: 'delai', toolArg: { g: 'cec', only: 'cec,fsw,pnp-ee' },
  related: ['cec', 'fsw', 'pnp', 'express-entry-draws', 'quebec-skilled-worker', 'pr-card'],
  sources: ['ptimes-flpt', 'express-entry', 'ee-rounds', 'ptimes', 'wayback'],
  en: {
    slug: 'express-entry-processing-time',
    nav: 'Express Entry', card: 'CEC, FSW and PNP after the invitation, side by side',
    title: 'Express Entry Processing Time After an ITA, 2026 Figures',
    description: 'Express Entry processing time in 2026 after an invitation: CEC, FSW and provincial nominee times from IRCC, the people waiting and the trend since October 2025.',
    h1: 'Express Entry processing time after the invitation',
    intro: `IRCC’s forward-looking figures of ${E.day(D)}: ${K.fmtTime(r('cec').t, 'en')} for the Canadian Experience Class, ${K.fmtTime(r('fsw').t, 'en')} for Federal Skilled Workers and ${K.fmtTime(r('pnp-ee').t, 'en')} for provincial nominees.`,
    resume: `Once you have received an invitation to apply and sent a complete permanent residence application, IRCC currently expects ${K.fmtTime(r('cec').t, 'en')} for the Canadian Experience Class, ${K.fmtTime(r('fsw').t, 'en')} for the Federal Skilled Worker Program and ${K.fmtTime(r('pnp-ee').t, 'en')} for a provincial nominee who came through Express Entry, according to the file it updated on ${E.day(D)}. These are forward-looking times: IRCC’s estimate for an application received today, built from the files already in line. About ${E.n(waitSum)} applications were waiting across the three lines on that date, ${E.n(r('cec').waiting ?? 0)} of them under the Canadian Experience Class. The clock does not start with your profile or your score: a profile in the pool has no processing time, and the count begins on the day IRCC receives the full application after the invitation. Over the twelve months to ${E.day(K.READ)}, IRCC held ${E.n(all12.n)} rounds and sent ${E.n(all12.total)} invitations. The tool above adds the time to your filing date and, if you filed in the past three years, reads IRCC’s own queue for that month.`,
    faqs: [
      { q: 'Does the Express Entry processing time start when I create my profile?', a: 'No. A profile in the pool is not an application and has no processing time. The count starts only after an invitation, on the day IRCC receives your complete permanent residence application. Time spent in the pool waiting for a round depends on your score and on which categories IRCC invites, which this site does not predict.' },
      { q: 'Which Express Entry program is the fastest after the invitation in 2026?', a: `On ${E.day(D)}, IRCC listed ${K.fmtTime(r('cec').t, 'en')} for the Canadian Experience Class, ${K.fmtTime(r('fsw').t, 'en')} for Federal Skilled Workers and ${K.fmtTime(r('pnp-ee').t, 'en')} for provincial nominees through Express Entry. The gaps are small and have changed places more than once since October 2025, so the program you qualify for matters more than this ranking.` },
      { q: 'How many Express Entry applications are waiting for a decision?', a: `IRCC’s file of ${E.day(D)} counts about ${E.n(r('cec').waiting ?? 0)} Canadian Experience Class applications, ${E.n(r('fsw').waiting ?? 0)} Federal Skilled Worker applications and ${E.n(r('pnp-ee').waiting ?? 0)} provincial nominee applications made through Express Entry still in line. The counts are rounded by IRCC and include files received in recent months that are not late.` },
      { q: 'Is the Express Entry time the same whatever my country?', a: 'Yes for the published figure: the forward-looking time for permanent residence is a single number per program, not a figure by country. Individual files still differ. Police certificates that take long to obtain, a medical exam to redo or a request for more documents can add weeks that the published time does not show.' },
    ],
    body: (h) => `
<h2>Three programs, one line each</h2>
<p>Express Entry is the system that manages candidates for three federal economic programs. After a round of invitations, each invited candidate files a permanent residence application under one of them, and IRCC publishes a separate forward-looking time for each. The table gives the figure of ${h.day(D)}, how many applications IRCC counts in that line and the lowest and highest values in our dated copies since ${h.day(K.firstReading('flpt'))}.</p>
${h.table(['Program', 'Time for a file received now', 'Applications waiting', 'Low · high since October 2025'], overview(h), `Express Entry programs, IRCC forward-looking file of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>The three numbers are close today. That closeness can change: across the readings below, the Canadian Experience Class moved between ${h.d(tr('cec').min, 'm')} and ${h.d(tr('cec').max, 'm')}, the Federal Skilled Worker line between ${h.d(tr('fsw').min, 'm')} and ${h.d(tr('fsw').max, 'm')}. IRCC rounds these times to the month, so a change of one month can mean a few days of real movement. The way the figure is built is explained once on the ${h.a('method', 'method page')}.</p>
<h2>Reading by reading since October 2025</h2>
<p>Our dated series of forward-looking times for permanent residence starts with the copy of IRCC’s file dated ${h.day(K.firstReading('flpt'))}; nothing older is shown, and no month is filled in by guesswork. Each line below is a dated reading; the copies cited for each are listed on the ${h.a('history', 'archive page')}.</p>
${h.table(['IRCC date', 'Canadian Experience Class', 'Federal Skilled Worker', 'Provincial nominee (Express Entry)'], sideBySide(h), 'Forward-looking times read on each update, newest first.', ['l', 'r', 'r', 'r'])}
${h.mini('delai', { p: ['g', 'm'], d: { g: 'fsw', m: 'none' }, t: 'Your Express Entry application: expected decision' })}
<h2>Before the clock starts</h2>
<p>Three waits come before the published time applies, and none of them is counted in it. The first is the time in the pool, from the day your profile is accepted to the round that invites you. It depends on your score and on the categories IRCC chooses, and it can be zero or several years. The second is the time to gather documents after the invitation: IRCC gives you 60 days to submit the complete application. The third, for provincial nominees only, is the province’s own nomination step, handled by the province before Express Entry is involved.</p>
<p>In the twelve months to ${h.day(K.READ)}, IRCC held ${h.n(cec12.n)} rounds reserved to the Canadian Experience Class and ${h.n(pnp12.n)} reserved to provincial nominees, out of ${h.n(all12.n)} rounds in all. The most recent round in our copy of IRCC’s file is number ${lastRound.n}, held on ${h.day(lastRound.date)} with ${h.n(lastRound.size)} invitations. The round by round list, with cut-off scores by category, is on the ${h.a('express-entry-draws', 'Express Entry draws page')}. Past rounds describe what happened; they do not say where the next cut-off will land.</p>
<h2>What the queue says about recent files</h2>
<p>Besides the headline time, IRCC publishes for each program a queue by month of filing: how many months it still expects for files received that month and how many applications sit ahead of them. A file received in the last month of the queue is the one the headline time describes. Older months are often marked as past the expected time, which means IRCC no longer counts a remaining delay for them, not that they are lost. If you filed in that zone, the ${h.a('beyond-processing-time', 'steps for a file past the processing time')} apply. The program pages for the ${h.a('cec', 'Canadian Experience Class')} and the ${h.a('fsw', 'Federal Skilled Worker Program')} show the full queue month by month.</p>
<h2>What the published time leaves out</h2>
<p>The figure ends with a decision on the permanent residence application. It does not cover the confirmation of permanent residence that follows, the landing interview or the mailing of the first ${h.a('pr-card', 'PR card')}. It also stops while IRCC waits for you: a request for an updated police certificate or a new medical exam pauses the file until you answer. Applicants abroad who need a visa to travel also wait for the passport request and the counterfoil, which takes its own time at the visa office.</p>
<h2>Routes outside Express Entry</h2>
<p>Some economic programs never pass through Express Entry and have far longer lines. The paper stream of the ${h.a('pnp', 'Provincial Nominee Program')} currently shows ${h.t(base.t)} with about ${h.n(base.waiting ?? 0)} applications waiting. Quebec selects its own skilled workers before IRCC handles the permanent residence step, covered on the ${h.a('quebec-skilled-worker', 'Quebec skilled worker page')}. The Start-up Visa line is published as ${h.t(sv.t)}, the longest economic figure in the file.</p>
`,
  },
  fr: {
    slug: 'delai-entree-express',
    nav: 'Entrée express', card: 'CEC, TQF et candidats des provinces après l’invitation',
    title: 'Délai de l’Entrée express après l’invitation, chiffres 2026',
    description: 'Délai de l’Entrée express en 2026 après l’invitation : expérience canadienne, travailleurs qualifiés du fédéral et candidats des provinces, tendance d’IRCC.',
    h1: 'Délai de l’Entrée express après l’invitation',
    intro: `Chiffres prospectifs d’IRCC du ${F.day(D)} : ${K.fmtTime(r('cec').t, 'fr')} pour l’expérience canadienne, ${K.fmtTime(r('fsw').t, 'fr')} pour les travailleurs qualifiés du fédéral et ${K.fmtTime(r('pnp-ee').t, 'fr')} pour les candidats des provinces.`,
    resume: `Une fois l’invitation reçue et la demande de résidence permanente complète envoyée, IRCC prévoit aujourd’hui ${K.fmtTime(r('cec').t, 'fr')} pour la catégorie de l’expérience canadienne, ${K.fmtTime(r('fsw').t, 'fr')} pour le Programme des travailleurs qualifiés du fédéral et ${K.fmtTime(r('pnp-ee').t, 'fr')} pour un candidat d’une province passé par l’Entrée express, d’après le fichier mis à jour le ${F.day(D)}. Ce sont des délais prospectifs : l’estimation d’IRCC pour une demande reçue aujourd’hui, établie à partir des dossiers déjà en file. Environ ${F.n(waitSum)} demandes attendaient dans ces trois files à cette date, dont ${F.n(r('cec').waiting ?? 0)} dans l’expérience canadienne. Le profil et le score ne déclenchent aucun délai : un profil dans le bassin n’a pas de délai de traitement, et le compte commence le jour où IRCC reçoit la demande complète faite après l’invitation. Sur les douze mois au ${F.day(K.READ)}, IRCC a tenu ${F.n(all12.n)} rondes et envoyé ${F.n(all12.total)} invitations. L’outil ci-dessus ajoute le délai à votre date de dépôt et, si vous avez déposé dans les trois dernières années, lit la file d’IRCC pour ce mois.`,
    faqs: [
      { q: 'Le délai de l’Entrée express commence-t-il à la création du profil ?', a: 'Non. Un profil dans le bassin n’est pas une demande et n’a aucun délai de traitement. Le compte ne démarre qu’après l’invitation, le jour où IRCC reçoit la demande de résidence permanente complète. Le temps passé dans le bassin dépend du score et des catégories invitées par IRCC, ce que ce site ne prédit pas.' },
      { q: 'Quel programme de l’Entrée express est le plus rapide après l’invitation en 2026 ?', a: `Le ${F.day(D)}, IRCC indiquait ${K.fmtTime(r('cec').t, 'fr')} pour l’expérience canadienne, ${K.fmtTime(r('fsw').t, 'fr')} pour les travailleurs qualifiés du fédéral et ${K.fmtTime(r('pnp-ee').t, 'fr')} pour les candidats des provinces passés par l’Entrée express. Les écarts sont faibles et l’ordre a changé plus d’une fois depuis octobre 2025 : le programme auquel vous êtes admissible compte plus que ce classement.` },
      { q: 'Combien de demandes de l’Entrée express attendent une décision ?', a: `Le fichier d’IRCC du ${F.day(D)} compte environ ${F.n(r('cec').waiting ?? 0)} demandes dans l’expérience canadienne, ${F.n(r('fsw').waiting ?? 0)} chez les travailleurs qualifiés du fédéral et ${F.n(r('pnp-ee').waiting ?? 0)} chez les candidats des provinces passés par l’Entrée express. Ces nombres sont arrondis par IRCC et comprennent les dossiers des derniers mois, qui ne sont pas en retard.` },
      { q: 'Le délai de l’Entrée express dépend-il du pays de résidence ?', a: 'Pas pour le chiffre publié : le délai prospectif de la résidence permanente est un seul nombre par programme, sans détail par pays. Les dossiers restent différents entre eux. Un certificat de police long à obtenir, un examen médical à refaire ou une demande de documents peuvent ajouter des semaines que le délai publié ne montre pas.' },
    ],
    body: (h) => `
<h2>Trois programmes, une file chacun</h2>
<p>L’Entrée express est le système qui gère les candidats de trois programmes économiques fédéraux. Après une ronde d’invitations, chaque candidat invité dépose une demande de résidence permanente dans l’un d’eux, et IRCC publie un délai prospectif distinct pour chacun. Le tableau donne le chiffre du ${h.day(D)}, le nombre de demandes qu’IRCC compte dans la file, puis la valeur la plus basse et la plus haute de nos copies datées depuis le ${h.day(K.firstReading('flpt'))}.</p>
${h.table(['Programme', 'Délai pour une demande reçue aujourd’hui', 'Demandes en attente', 'Bas · haut depuis octobre 2025'], overview(h), `Programmes de l’Entrée express, fichier prospectif d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>Les trois chiffres sont proches aujourd’hui. Cette proximité peut changer : d’un relevé à l’autre, l’expérience canadienne a varié entre ${h.d(tr('cec').min, 'm')} et ${h.d(tr('cec').max, 'm')}, les travailleurs qualifiés du fédéral entre ${h.d(tr('fsw').min, 'm')} et ${h.d(tr('fsw').max, 'm')}. IRCC arrondit ces délais au mois : un mois de plus peut traduire quelques jours de mouvement réel. La construction du chiffre est expliquée une fois pour toutes sur la ${h.a('method', 'page de méthode')}.</p>
<h2>Relevé par relevé depuis octobre 2025</h2>
<p>Notre série datée des délais prospectifs de la résidence permanente part de la copie du fichier d’IRCC du ${h.day(K.firstReading('flpt'))} ; rien de plus ancien n’est montré, et aucun mois n’est complété au jugé. Chaque ligne est un relevé daté ; les copies citées sont listées sur la ${h.a('history', 'page des archives')}.</p>
${h.table(['Date IRCC', 'Expérience canadienne', 'Travailleurs qualifiés du fédéral', 'Candidat d’une province (Entrée express)'], sideBySide(h), 'Délais prospectifs lus à chaque mise à jour, du plus récent au plus ancien.', ['l', 'r', 'r', 'r'])}
${h.mini('delai', { p: ['g', 'm'], d: { g: 'fsw', m: 'none' }, t: 'Votre demande d’Entrée express : décision attendue' })}
<h2>Avant que le compteur démarre</h2>
<p>Trois attentes précèdent le délai publié, et aucune n’y est comptée. La première est le temps passé dans le bassin, de l’acceptation du profil à la ronde qui vous invite : il dépend du score et des catégories choisies par IRCC, et peut aller de zéro à plusieurs années. La deuxième est le temps de réunir les documents après l’invitation : IRCC laisse 60 jours pour envoyer la demande complète. La troisième, pour les candidats des provinces seulement, est l’étape de désignation, traitée par la province avant que l’Entrée express n’intervienne.</p>
<p>Sur les douze mois au ${h.day(K.READ)}, IRCC a tenu ${h.n(cec12.n)} rondes réservées à l’expérience canadienne et ${h.n(pnp12.n)} réservées aux candidats des provinces, sur ${h.n(all12.n)} rondes au total. La plus récente de notre copie du fichier d’IRCC porte le numéro ${lastRound.n} : elle a eu lieu le ${h.day(lastRound.date)}, avec ${h.n(lastRound.size)} invitations. La liste ronde par ronde, avec les scores minimaux par catégorie, se trouve sur la ${h.a('express-entry-draws', 'page des rondes de l’Entrée express')}. Les rondes passées décrivent ce qui s’est produit ; elles ne disent pas où tombera le prochain score minimal.</p>
<h2>Ce que dit la file sur les dossiers récents</h2>
<p>En plus du délai principal, IRCC publie pour chaque programme une file par mois de dépôt : le nombre de mois qu’il prévoit encore pour les dossiers reçus ce mois-là et le nombre de demandes devant eux. Un dossier reçu le dernier mois de la file est celui que décrit le délai principal. Les mois plus anciens portent souvent la mention « délai prévu dépassé » : IRCC ne leur compte plus de temps restant, ce qui ne veut pas dire que le dossier est perdu. Si vous avez déposé dans cette zone, les ${h.a('beyond-processing-time', 'démarches pour un dossier qui dépasse le délai')} s’appliquent. Les pages de l’${h.a('cec', 'expérience canadienne')} et des ${h.a('fsw', 'travailleurs qualifiés du fédéral')} montrent la file complète, mois par mois.</p>
<h2>Ce que le délai publié laisse de côté</h2>
<p>Le chiffre s’arrête à la décision sur la demande de résidence permanente. Il ne couvre ni la confirmation de résidence permanente qui suit, ni l’entrevue d’établissement, ni l’envoi de la première ${h.a('pr-card', 'carte RP')}. Il s’interrompt aussi quand IRCC attend une réponse : un certificat de police à mettre à jour ou un nouvel examen médical suspend le dossier jusqu’à votre envoi. Les demandeurs à l’étranger qui ont besoin d’un visa pour voyager attendent en plus la demande de passeport et la vignette, qui prennent leur propre temps au bureau des visas.</p>
<h2>Les voies hors de l’Entrée express</h2>
<p>Certains programmes économiques ne passent jamais par l’Entrée express et ont des files beaucoup plus longues. Le volet de base du ${h.a('pnp', 'Programme des candidats des provinces')} affiche aujourd’hui ${h.t(base.t)}, avec environ ${h.n(base.waiting ?? 0)} demandes en attente. Le Québec choisit ses travailleurs qualifiés avant qu’IRCC ne traite l’étape de la résidence permanente, décrite sur la ${h.a('quebec-skilled-worker', 'page des travailleurs qualifiés du Québec')}. Le Visa pour démarrage d’entreprise est publié à ${h.t(sv.t)}, le délai économique le plus long du fichier.</p>
`,
  },
});
