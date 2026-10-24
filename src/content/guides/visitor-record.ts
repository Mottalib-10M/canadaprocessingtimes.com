import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Fiche du visiteur : IRCC ne publie pas de série propre à la fiche du visiteur en données ouvertes. La page donne le
 * contexte de l'ensemble des dossiers de résidence temporaire (Operational Processing, OGL-Canada 2.0) et renvoie à
 * l'outil d'IRCC pour le délai, que le simulateur prend tel que le lecteur le lit. */
const E = K.en, F = K.fr;
const rin = K.ops12('trIn'), fin = K.ops12('trFin'), ok = K.ops12('trOk');
const a = K.approval12(), nt = K.net12();
const grew = (nt.net ?? 0) > 0;
const rows12 = K.MAJOR.map((c) => ({ c, n: K.net12(c), a: K.approval12(c) })).filter((x) => x.n.fin);
const byRate = [...rows12].sort((x, y) => (y.a.rate ?? 0) - (x.a.rate ?? 0));
const hi = byRate[0], lo = byRate[byRate.length - 1];
const backlog = rows12.filter((x) => (x.n.net ?? 0) > 0).length;
const si = K.stdOf('study-inside')!, wi = K.stdOf('work-inside')!;
const ext = K.fullExtremes('trIn');
if (!hi || !lo || hi.c === lo.c) throw new Error('visitor-record : le texte suppose plusieurs pays comparables');

function table(h: Helpers, l: 'en' | 'fr') {
  return rows12.map((x) => [K.COUNTRY_PAGE[x.c] ? h.a(K.COUNTRY_PAGE[x.c], h.cn(x.c)) : h.cn(x.c), h.n(x.n.rin), h.n(x.n.fin), x.n.net == null ? h.n(null) : `${x.n.net > 0 ? '+' : x.n.net < 0 ? '-' : ''}${h.n(Math.abs(x.n.net))}`, h.pct(x.a.rate)]).concat([[l === 'fr' ? '<strong>Tous les pays</strong>' : '<strong>All countries</strong>', h.n(nt.rin), h.n(nt.fin), nt.net == null ? h.n(null) : `${nt.net > 0 ? '+' : nt.net < 0 ? '-' : ''}${h.n(Math.abs(nt.net))}`, h.pct(a.rate)]]);
}

export default defineGuide({
  id: 'visitor-record', group: 'visit', order: 12,
  tool: 'delai', toolArg: { g: 'visitor-record', only: 'visitor-record,visitor-inside,study-ext,work-ext' },
  related: ['visitor-visa', 'super-visa', 'study-permit-extension', 'work-permit-extension', 'beyond-processing-time', 'history'],
  sources: ['extend-stay', 'ptimes', 'account', 'open-data', 'ogl'],
  en: {
    slug: 'visitor-record-processing-time',
    nav: 'Visitor record', card: 'Extending a visit: your date, and the temporary residence workload',
    title: 'Visitor Record Processing Time to Extend a Stay, 2026',
    description: 'Extending a visit to Canada in 2026: turn IRCC’s visitor record time into a date, stay legally while you wait, and see the temporary residence workload.',
    h1: 'Visitor record: extending your stay while IRCC decides',
    intro: `IRCC received ${E.n(rin.last)} temporary residence applications from ${E.w12()} and finalized ${E.n(fin.last)}; visitor records are among them.`,
    resume: `A visitor record is the document IRCC issues when a visitor already in Canada asks to stay longer, and it is requested online from inside the country before the current status ends. IRCC shows its processing time on the “Check processing times” tool: copy it into the calculator above, with the day IRCC received your application, and you get an estimated decision date and the days left. IRCC does not publish a count of visitor record applications as open data, so this page gives the context it does publish under the Open Government Licence of Canada: all temporary residence files, which include visas, permits and extensions. From ${E.w12()}, IRCC received ${E.n(rin.last)} such applications, ${E.ch(rin.change)} on the year before, and finalized ${E.n(fin.last)}. ${grew ? `It received ${E.n(nt.net)} more than it finalized, so the stock of files waiting grew` : `It finalized ${E.n(nt.net == null ? null : -nt.net)} more than it received, so the stock of files waiting shrank`}. Of the files finalized, ${E.pct(a.rate)} ended in an approval, against ${E.pct(a.prevRate)} the year before.`,
    faqs: [
      { q: 'Can I stay in Canada while my visitor record is processed?', a: 'Yes, if IRCC received your application before your current status expired. You then keep your status under the same conditions until IRCC decides, which IRCC calls maintained status. Do not leave Canada if you want to keep it: re-entry does not restore it. If the application arrives after the expiry date, the rules for restoration apply instead.' },
      { q: 'When should I apply for a visitor record?', a: 'IRCC asks visitors to apply at least 30 days before their status ends, and the application must be received before that date. Applying earlier leaves room for a request for documents. The date that counts is the expiry date stamped in your passport or written on your last document, not six months from arrival when an officer set a different date.' },
      { q: 'Does IRCC publish how many visitor records it issues?', a: `No. Its monthly open data counts all temporary residence applications together: ${E.n(fin.last)} were finalized from ${E.w12()}, and ${E.n(ok.last)} were approved. Visitor records are inside those totals with visas, study and work permits and extensions, so the figures describe the workload of the whole line, not the visitor record queue alone.` },
    ],
    body: (h) => `
<h2>What a visitor record is</h2>
<p>A visitor who wants to stay in Canada beyond the date set at the border applies for a visitor record. It is not a visa: it does not let you return to Canada after a trip abroad, it only sets a new date by which you must leave. IRCC explains the conditions on its ${h.src('extend-stay', 'page on extending your stay')}, and the application is made in your ${h.src('account', 'IRCC secure account')}. The deadline is your current status, not the six months many visitors assume: an officer can grant less, and the date in your passport or on your last document is the one that counts.</p>
<p>IRCC shows a processing time for visitor records on its ${h.src('ptimes', '“Check processing times” tool')}. It does not depend on your country, because the application is made from inside Canada. Copy that time into the calculator with the day IRCC received your application. If you have not applied yet, leave the month on “not applied yet” to see when a decision could come for a file sent today.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'visitor-record', m: 'none' }, t: 'Your visitor record: estimated decision date' })}
<h2>Waiting legally</h2>
<p>An application received before your status expires keeps you in status, under the same conditions, until IRCC decides. That is why the date you send it matters more than the time IRCC takes: a file received one day after the expiry date is no longer an extension but a request to restore your status, with a different fee and no right to remain meanwhile. If IRCC refuses the visitor record, you must leave Canada. If the decision runs past the time you entered, the ${h.a('beyond-processing-time', 'steps for an application past the processing time')} apply.</p>
<h2>The temporary residence line in numbers</h2>
<p>IRCC publishes no visitor record series, but its ${h.src('open-data', 'monthly open data')} counts all temporary residence applications: visitor visas, visitor records, study and work permits and their extensions. From ${h.w12()}, IRCC received ${h.n(rin.last)} of them and finalized ${h.n(fin.last)}. ${grew ? `Receipts exceeded decisions by ${h.n(nt.net)}, so the stock of files waiting grew over the year.` : `Decisions exceeded receipts by ${h.n(nt.net == null ? null : -nt.net)}, so the stock of files waiting shrank over the year.`} Of the files finalized, ${h.pct(a.rate)} were approved. Since January 2023, the busiest month for new applications was ${h.my(ext.hi[0])}, with ${h.n(ext.hi[1])}, and the quietest ${h.my(ext.lo[0])}, with ${h.n(ext.lo[1])}.</p>
${h.months(K.MONTHS, [['Received', K.full('trIn')], ['Finalized', K.full('trFin')], ['Approved', K.full('trOk')]], { max: 12, caption: 'All temporary residence applications, by month, all countries. Source: IRCC, Operational Processing, open data; figures rounded to 5.' })}
<p>These totals mix files from abroad and from inside Canada, so they say how busy IRCC’s temporary residence teams are, not how long a visitor record takes. For applications made in Canada, IRCC publishes service standards only for study and work permits: ${K.fmtStd(si.cur, 'en')} for a study permit, met for ${h.pct(si.cur.perf)} of applications in ${K.fmtFy(si.fy, 'en')}, and ${K.fmtStd(wi.cur, 'en')} for a work permit, met for ${h.pct(wi.cur.perf)}. There is no published standard for the visitor record itself.</p>
<h2>By country of citizenship</h2>
<p>The table compares the main countries of citizenship on the same twelve months. A positive balance means IRCC received more temporary residence files from those citizens than it finalized; it is the case for ${h.n(backlog)} of the ${h.n(rows12.length)} countries shown. The approval share ranges from ${h.pct(hi.a.rate)} (${h.cn(hi.c)}) to ${h.pct(lo.a.rate)} (${h.cn(lo.c)}), across all temporary residence files rather than visitor records alone.</p>
${h.table(['Country of citizenship', 'Received, 12 months', 'Finalized, 12 months', 'Received minus finalized', 'Share approved'], table(h, 'en'), `Temporary residence applications, ${h.w12()}. Source: IRCC, Operational Processing, open data; figures rounded to 5.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Students and workers</h2>
<p>A student or worker who wants to stay longer applies to extend the permit, not for a visitor record; the timing logic is the same and is covered on the ${h.a('study-permit-extension', 'study permit extension')} and ${h.a('work-permit-extension', 'work permit extension')} pages. Parents and grandparents who plan long stays from the start can look at the ${h.a('super-visa', 'super visa')}, which allows up to five years per entry.</p>
`,
  },
  fr: {
    slug: 'delai-fiche-du-visiteur',
    nav: 'Fiche du visiteur', card: 'Prolonger un séjour : votre date, et la charge de la résidence temporaire',
    title: 'Délai de la fiche du visiteur pour prolonger un séjour, 2026',
    description: 'Prolonger un séjour au Canada en 2026 : transformer le délai de la fiche du visiteur en date, rester en règle en attendant, charge de la résidence temporaire.',
    h1: 'Fiche du visiteur : prolonger le séjour pendant qu’IRCC décide',
    intro: `IRCC a reçu ${F.n(rin.last)} demandes de résidence temporaire de ${F.w12()} et en a finalisé ${F.n(fin.last)} ; les fiches du visiteur en font partie.`,
    resume: `La fiche du visiteur est le document qu’IRCC délivre quand un visiteur déjà au Canada demande à rester plus longtemps ; elle se demande en ligne depuis le Canada, avant la fin du statut en cours. IRCC affiche son délai dans l’outil « Vérifier les délais de traitement » : recopiez-le dans le calculateur ci-dessus, avec le jour où IRCC a reçu la demande, pour obtenir une date de décision estimée et les jours qui restent. IRCC ne publie pas le nombre de demandes de fiche du visiteur en données ouvertes ; cette page donne donc le contexte qu’il publie sous la Licence du gouvernement ouvert du Canada : l’ensemble des dossiers de résidence temporaire, visas, permis et prolongations compris. De ${F.w12()}, IRCC a reçu ${F.n(rin.last)} demandes de ce type, ${F.ch(rin.change)} sur l’année précédente, et en a finalisé ${F.n(fin.last)}. ${grew ? `Il en a reçu ${F.n(nt.net)} de plus qu’il n’en a finalisé : le stock en attente a grossi` : `Il en a finalisé ${F.n(nt.net == null ? null : -nt.net)} de plus qu’il n’en a reçu : le stock en attente a diminué`}. Parmi les dossiers finalisés, ${F.pct(a.rate)} se sont conclus par une approbation, contre ${F.pct(a.prevRate)} l’année précédente.`,
    faqs: [
      { q: 'Peut-on rester au Canada pendant le traitement de la fiche du visiteur ?', a: 'Oui, si IRCC a reçu la demande avant l’expiration du statut en cours. Vous gardez alors votre statut, aux mêmes conditions, jusqu’à la décision : IRCC parle de statut maintenu. Ne quittez pas le Canada si vous voulez le conserver, car une nouvelle entrée ne le rétablit pas. Une demande reçue après l’expiration relève du rétablissement de statut.' },
      { q: 'Quand demander une fiche du visiteur ?', a: 'IRCC demande de présenter la demande au moins 30 jours avant la fin du statut, et elle doit être reçue avant cette date. S’y prendre plus tôt laisse de la marge en cas de demande de documents. La date qui compte est celle inscrite dans le passeport ou sur le dernier document, pas six mois après l’arrivée quand l’agent a fixé une autre date.' },
      { q: 'IRCC publie-t-il le nombre de fiches du visiteur délivrées ?', a: `Non. Ses données ouvertes mensuelles comptent ensemble toutes les demandes de résidence temporaire : ${F.n(fin.last)} ont été finalisées de ${F.w12()}, et ${F.n(ok.last)} approuvées. Les fiches du visiteur sont dans ces totaux avec les visas, les permis d’études et de travail et les prolongations : les chiffres décrivent la charge de toute la ligne, pas la seule file des fiches.` },
    ],
    body: (h) => `
<h2>Ce qu’est la fiche du visiteur</h2>
<p>Un visiteur qui veut rester au Canada au-delà de la date fixée à la frontière demande une fiche du visiteur. Ce n’est pas un visa : elle ne permet pas de revenir au Canada après un voyage à l’étranger, elle fixe seulement une nouvelle date de départ. IRCC détaille les conditions sur sa ${h.src('extend-stay', 'page sur la prolongation du séjour')}, et la demande se fait dans votre ${h.src('account', 'compte sécurisé d’IRCC')}. L’échéance est celle du statut en cours, pas les six mois que beaucoup de visiteurs supposent : un agent peut accorder moins, et c’est la date du passeport ou du dernier document qui compte.</p>
<p>IRCC affiche un délai pour la fiche du visiteur dans son ${h.src('ptimes', 'outil « Vérifier les délais de traitement »')}. Il ne dépend pas du pays, puisque la demande est faite depuis le Canada. Recopiez ce délai dans le calculateur avec le jour où IRCC a reçu la demande. Si vous n’avez pas encore déposé, laissez le mois sur « pas encore déposée » pour voir quand une décision pourrait arriver pour un dossier envoyé aujourd’hui.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'visitor-record', m: 'none', c: 'FR' }, t: 'Votre fiche du visiteur : date de décision estimée' })}
<h2>Attendre en règle</h2>
<p>Une demande reçue avant l’expiration du statut vous maintient dans ce statut, aux mêmes conditions, jusqu’à la décision. C’est pourquoi la date d’envoi compte davantage que le délai d’IRCC : un dossier reçu le lendemain de l’expiration n’est plus une prolongation mais une demande de rétablissement de statut, avec d’autres frais et sans droit de rester entre-temps. Si IRCC refuse la fiche du visiteur, il faut quitter le Canada. Si la décision dépasse le délai saisi, les ${h.a('beyond-processing-time', 'démarches pour une demande qui dépasse le délai')} s’appliquent.</p>
<h2>La ligne de la résidence temporaire en chiffres</h2>
<p>IRCC ne publie pas de série pour la fiche du visiteur, mais ses ${h.src('open-data', 'données ouvertes mensuelles')} comptent toutes les demandes de résidence temporaire : visas de visiteur, fiches du visiteur, permis d’études et de travail et leurs prolongations. De ${h.w12()}, IRCC en a reçu ${h.n(rin.last)} et finalisé ${h.n(fin.last)}. ${grew ? `Les réceptions ont dépassé les décisions de ${h.n(nt.net)} : le stock en attente a grossi sur l’année.` : `Les décisions ont dépassé les réceptions de ${h.n(nt.net == null ? null : -nt.net)} : le stock en attente a diminué sur l’année.`} Parmi les dossiers finalisés, ${h.pct(a.rate)} ont été approuvés. Depuis janvier 2023, le mois le plus chargé en nouvelles demandes a été ${h.my(ext.hi[0])}, avec ${h.n(ext.hi[1])}, et le plus calme ${h.my(ext.lo[0])}, avec ${h.n(ext.lo[1])}.</p>
${h.months(K.MONTHS, [['Reçues', K.full('trIn')], ['Finalisées', K.full('trFin')], ['Approuvées', K.full('trOk')]], { max: 12, caption: 'Ensemble des demandes de résidence temporaire, par mois, tous pays. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.' })}
<p>Ces totaux mêlent les dossiers venus de l’étranger et ceux déposés au Canada : ils disent à quel point les équipes de la résidence temporaire sont chargées, pas combien de temps prend une fiche du visiteur. Pour les demandes faites au Canada, IRCC ne publie de normes de service que pour les permis d’études et de travail : ${K.fmtStd(si.cur, 'fr')} pour un permis d’études, tenue pour ${h.pct(si.cur.perf)} des demandes en ${K.fmtFy(si.fy, 'fr')}, et ${K.fmtStd(wi.cur, 'fr')} pour un permis de travail, tenue pour ${h.pct(wi.cur.perf)}. Il n’existe pas de norme publiée pour la fiche du visiteur elle-même.</p>
<h2>Par pays de citoyenneté</h2>
<p>Le tableau compare les principaux pays de citoyenneté sur les mêmes douze mois. Un solde positif signifie qu’IRCC a reçu plus de dossiers de résidence temporaire de ces citoyens qu’il n’en a finalisé ; c’est le cas pour ${h.n(backlog)} des ${h.n(rows12.length)} pays présentés. La part approuvée va de ${h.pct(hi.a.rate)} (${h.cn(hi.c)}) à ${h.pct(lo.a.rate)} (${h.cn(lo.c)}), sur l’ensemble des dossiers de résidence temporaire et non sur les seules fiches du visiteur.</p>
${h.table(['Pays de citoyenneté', 'Reçues, 12 mois', 'Finalisées, 12 mois', 'Reçues moins finalisées', 'Part approuvée'], table(h, 'fr'), `Demandes de résidence temporaire, ${h.w12()}. Source : IRCC, Traitement opérationnel, données ouvertes ; chiffres arrondis à 5.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Étudiants et travailleurs</h2>
<p>Un étudiant ou un travailleur qui veut rester plus longtemps demande la prolongation de son permis, pas une fiche du visiteur ; la logique des dates est la même et elle est traitée sur les pages ${h.a('study-permit-extension', 'prolongation du permis d’études')} et ${h.a('work-permit-extension', 'prolongation du permis de travail')}. Les parents et grands-parents qui prévoient d’emblée un long séjour peuvent regarder le ${h.a('super-visa', 'super visa')}, qui permet jusqu’à cinq ans par entrée.</p>
`,
  },
});
