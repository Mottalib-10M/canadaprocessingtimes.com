import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { extremes } from '../../lib/engine/times';

/* Chiffres de la page : données ouvertes d'IRCC (titulaires de permis du Programme de mobilité internationale,
 * Operational Processing), OGL-Canada 2.0, calculés au build. Aucune norme de service publiée pour EIC : la page n'en
 * cite pas (la norme du permis de travail ne vise pas EIC). Le délai publié par IRCC sur canada.ca n'est pas repris :
 * le simulateur prend celui que le lecteur lit dans l'outil d'IRCC. */
const E = K.en, F = K.fr;
const iec = K.imp12('iec'), imp = K.imp12('all');
const share = K.pctOf(iec.last, imp.last);
const ser = K.impSeries('iec');
const ex = extremes(ser, K.IMPD.months);
const y = (yr: string) => K.yearSum(ser, K.IMPD.months, yr);
const i23 = y('2023'), i24 = y('2024'), i25 = y('2025');
const fr = K.ops12('trFin', 'FR'), aFR = K.approval12('FR'), aALL = K.approval12();
const dirEn = (x: number | null) => (x == null ? 'about level' : x > 0 ? 'up' : 'down');
const dirFr = (x: number | null) => (x == null ? 'stable' : x > 0 ? 'en hausse' : 'en baisse');
if (K.stdOf('iec')) throw new Error('iec : une norme de service EIC existe désormais, la citer');
if (!(aFR.rate! > aALL.rate!)) throw new Error('iec : le texte suppose une part approuvée plus haute pour la France');
const loM = ex.lo![0].slice(5), hiM = ex.hi![0].slice(5);
if (loM !== '12' || !['04', '05', '06'].includes(hiM)) throw new Error('iec : le texte suppose un creux en décembre et un pic au printemps');

export default defineGuide({
  id: 'iec', group: 'work', order: 33,
  tool: 'delai', toolArg: { g: 'iec', only: 'iec,work,work-inside,work-ext' },
  related: ['work-permit', 'work-permit-extension', 'pgwp', 'france'],
  sources: ['ptimes', 'od-work', 'open-data', 'iec', 'biometrics', 'check-status', 'ogl'],
  en: {
    slug: 'iec-working-holiday-processing-time',
    nav: 'IEC (working holiday)', card: 'Decision date from IRCC’s time, IEC permits each month, the seasonal peak',
    title: 'IEC Working Holiday Processing Time and Date in 2026',
    description: 'Turn the IEC working holiday time IRCC shows you into a decision date, and see how many IEC work permits took effect each month in 2026, from IRCC open data.',
    h1: 'IEC working holiday: from IRCC’s time to your decision date',
    intro: `${E.n(iec.last)} International Experience Canada work permits took effect from ${E.w12(K.IMPD.months)}, ${E.ch(iec.change)} on the twelve months before.`,
    resume: `International Experience Canada covers the working holiday, young professionals and international co-op streams. After you receive an invitation and accept it, IRCC’s “Check processing times” tool shows a time for the work permit application, and that is the figure to copy into the calculator above with the day you submitted it: you get an estimated decision date for the port of entry letter. The rest of this page comes from Government of Canada open data under the Open Government Licence of Canada. Over ${E.w12(K.IMPD.months)}, ${E.n(iec.last)} IEC work permits took effect, ${E.pct(share)} of all International Mobility Program permits, ${dirEn(iec.change)} ${E.pa(iec.change)} on the year before. IRCC publishes no service standard for IEC in the Government of Canada service inventory, so the time on its tool is the only benchmark.`,
    faqs: [
      { q: 'How long do I have to apply after an IEC invitation?', a: 'You have 10 days to accept the invitation to apply, then 20 days to submit the work permit application with your documents, police certificates and fees. The processing time on IRCC’s tool starts once that application is complete, biometrics included.' },
      { q: 'How many IEC permits take effect each year?', a: `According to IRCC’s open data on International Mobility Program work permit holders, ${E.n(i23)} IEC permits took effect in 2023, ${E.n(i24)} in 2024 and ${E.n(i25)} in 2025. Over the latest twelve months the count was ${E.n(iec.last)}, most of them in spring and early summer, when holders arrive for seasonal jobs.` },
      { q: 'Is there an IRCC service standard for IEC?', a: 'No. The Government of Canada service inventory, published as open data, lists standards for work permits requested from outside and inside Canada, but not for International Experience Canada. Use the time on IRCC’s tool as your estimate, and add the wait for biometrics if you have not given them yet.' },
    ],
    body: (h) => `
<h2>From the time IRCC shows to a date</h2>
<p>IEC works in two stages. You enter a pool and wait for an invitation, which can take weeks or never come in a given season: no processing time covers that wait. Once invited, you accept and submit a work permit application, and from then on IRCC’s ${h.src('ptimes', '“Check processing times” tool')} gives a time for IEC. This site does not copy that figure. Read it on IRCC’s tool, enter it in the calculator with its unit, and add the day you submitted the application. The calculator gives the estimated date of the port of entry letter, which you show at the border to receive the permit itself.</p>
<p>The date the letter arrives is not the date you can start working. You still have to travel to Canada, present the letter, proof of funds and health insurance covering your whole stay, and receive the permit from a border officer. Count the time to plan your flight and to find accommodation after the decision date the calculator gives.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'iec' }, t: 'Your IEC permit: estimated decision date' })}
<h2>IEC permits month by month</h2>
<p>IRCC’s ${h.src('od-work', 'work permit holders data')} counts the IEC permits that took effect each month, that is, the month the holder arrived and the permit was issued. Over the latest twelve months, ${h.n(iec.last)} did, ${dirEn(iec.change)} ${h.pa(iec.change)} on the year before, and ${h.pct(share)} of all International Mobility Program permits. By calendar year, the count was ${h.n(i23)} in 2023, ${h.n(i24)} in 2024 and ${h.n(i25)} in 2025.</p>
<p>The series is seasonal. The busiest month was ${h.my(ex.hi![0])}, with ${h.n(ex.hi![1])} permits, as holders arrive for the spring and summer jobs; the quietest was ${h.my(ex.lo![0])}, with ${h.n(ex.lo![1])}. A port of entry letter is valid for a year, so many holders apply early and travel in spring.</p>
${h.months(K.IMPD.months, [['IEC work permits', ser]], { max: 24, caption: 'International Experience Canada work permits that took effect, by month, newest first. Source: IRCC open data, International Mobility Program work permit holders; figures rounded to 5.' })}
<h2>No service standard for IEC</h2>
<p>IRCC sets service standards for work permits requested from outside and inside Canada, but the Government of Canada service inventory has no line for International Experience Canada. The work permit standards do not apply to IEC, so this page does not quote them. The time on IRCC’s tool is the only figure IRCC gives for IEC. If your application runs past it, the ${h.src('check-status', 'application status tracker')} shows whether IRCC is waiting for biometrics, a medical exam or a police certificate.</p>
<h2>French citizens and IEC</h2>
<p>France is one of the largest IEC partner countries. The ${h.src('open-data', 'operational processing data')} does not isolate IEC by country, but across all temporary residence files, IRCC finalized ${h.n(fr.last)} applications for French citizens over the latest twelve months and approved ${h.pct(aFR.rate)} of them, against ${h.pct(aALL.rate)} for all countries. See the ${h.a('france', 'page for French citizens')} for their other files.</p>
<h2>Before you rely on the date</h2>
<p>Give your ${h.src('biometrics', 'biometrics')} as soon as IRCC asks: you have 30 days, and the time on its tool does not count that step. Police certificates from every country where you lived six months or more are a frequent cause of delay. The permit is issued at the border, with the conditions of your ${h.src('iec', 'IEC category')}. To stay longer, you will need another permit, such as an ${h.a('work-permit', 'employer-specific work permit')}, or a ${h.a('work-permit-extension', 'work permit extension')} where your category allows it.</p>
`,
  },
  fr: {
    slug: 'delai-eic-pvt',
    nav: 'EIC (PVT)', card: 'Date de décision à partir du délai d’IRCC, permis EIC chaque mois, pic saisonnier',
    title: 'Délai EIC et PVT Canada : votre date de décision en 2026',
    description: 'Transformez le délai EIC (PVT) affiché par IRCC en date de décision et voyez combien de permis Expérience internationale Canada entrent en vigueur en 2026.',
    h1: 'EIC et PVT : du délai d’IRCC à votre date de décision',
    intro: `${F.n(iec.last)} permis Expérience internationale Canada sont entrés en vigueur de ${F.w12(K.IMPD.months)}, soit ${F.ch(iec.change)} par rapport aux douze mois d’avant.`,
    resume: `Expérience internationale Canada regroupe le programme vacances-travail (PVT), le volet jeunes professionnels et le stage coop international. Après avoir reçu et accepté une invitation, l’outil « Vérifier les délais de traitement » d’IRCC affiche un délai pour la demande de permis de travail : c’est ce chiffre qu’il faut recopier dans le calculateur ci-dessus avec le jour d’envoi pour obtenir une date de décision estimée de la lettre d’introduction. Le reste de la page vient des données ouvertes du gouvernement du Canada, sous la Licence du gouvernement ouvert du Canada. De ${F.w12(K.IMPD.months)}, ${F.n(iec.last)} permis EIC sont entrés en vigueur, soit ${F.pct(share)} de tous les permis du Programme de mobilité internationale, ${dirFr(iec.change)} de ${F.pa(iec.change)} sur un an. IRCC ne publie aucune norme de service pour EIC dans l’inventaire des services du gouvernement du Canada : le délai de son outil est le seul repère.`,
    faqs: [
      { q: 'De combien de temps dispose-t-on après une invitation EIC ?', a: 'Vous avez 10 jours pour accepter l’invitation à présenter une demande, puis 20 jours pour envoyer la demande de permis de travail avec les documents et les frais. Le délai de l’outil d’IRCC court à partir du moment où cette demande est complète, biométrie comprise.' },
      { q: 'Combien de permis EIC entrent en vigueur chaque année ?', a: `D’après les données ouvertes d’IRCC sur les titulaires de permis du Programme de mobilité internationale, ${F.n(i23)} permis EIC sont entrés en vigueur en 2023, ${F.n(i24)} en 2024 et ${F.n(i25)} en 2025. Sur les douze derniers mois, on en compte ${F.n(iec.last)}.` },
      { q: 'IRCC a-t-il une norme de service pour EIC ?', a: 'Non. L’inventaire des services du gouvernement du Canada, publié en données ouvertes, fixe des normes pour les permis de travail demandés hors du Canada et au Canada, mais pas pour Expérience internationale Canada. Retenez le délai de l’outil d’IRCC comme estimation.' },
    ],
    body: (h) => `
<h2>Du délai affiché par IRCC à une date</h2>
<p>EIC se déroule en deux temps. Vous entrez dans un bassin et attendez une invitation, qui peut prendre des semaines ou ne jamais venir dans une saison donnée : aucun délai de traitement ne couvre cette attente. Une fois invité, vous acceptez et envoyez une demande de permis de travail ; à partir de là, l’${h.src('ptimes', 'outil « Vérifier les délais de traitement »')} d’IRCC donne un délai pour EIC. Ce site ne recopie pas ce chiffre. Lisez-le dans l’outil d’IRCC, saisissez-le avec son unité et indiquez le jour d’envoi de la demande. Le calculateur donne la date estimée de la lettre d’introduction, à présenter à la frontière pour recevoir le permis lui-même.</p>
${h.mini('delai', { p: ['n', 'u', 'm', 'd'], d: { g: 'iec' }, t: 'Votre permis EIC : date de décision estimée' })}
<h2>Les permis EIC mois par mois</h2>
<p>Les ${h.src('od-work', 'données des titulaires de permis de travail')} d’IRCC comptent les permis EIC entrés en vigueur chaque mois, c’est-à-dire le mois où le titulaire est arrivé et où le permis a été délivré. Sur les douze derniers mois, ${h.n(iec.last)} l’ont été, ${dirFr(iec.change)} de ${h.pa(iec.change)} sur un an, soit ${h.pct(share)} de tous les permis du Programme de mobilité internationale. Par année civile, on en compte ${h.n(i23)} en 2023, ${h.n(i24)} en 2024 et ${h.n(i25)} en 2025.</p>
<p>La série est saisonnière. Le mois le plus chargé a été ${h.my(ex.hi![0])}, avec ${h.n(ex.hi![1])} permis, quand les titulaires arrivent pour les emplois du printemps et de l’été ; le plus calme a été ${h.my(ex.lo![0])}, avec ${h.n(ex.lo![1])}. La lettre d’introduction est valable un an : beaucoup déposent tôt et partent au printemps.</p>
${h.months(K.IMPD.months, [['Permis EIC', ser]], { max: 24, caption: 'Permis Expérience internationale Canada entrés en vigueur, par mois, du plus récent au plus ancien. Source : IRCC, données ouvertes, titulaires de permis du Programme de mobilité internationale ; chiffres arrondis à 5.' })}
<h2>Pas de norme de service pour EIC</h2>
<p>IRCC fixe des normes de service pour les permis de travail demandés hors du Canada et au Canada, mais l’inventaire des services du gouvernement du Canada n’a pas de ligne pour Expérience internationale Canada. Les normes du permis de travail ne s’appliquent pas à EIC, et cette page ne les cite donc pas. Le délai de l’outil d’IRCC est le seul chiffre qu’IRCC donne pour EIC. Si votre demande le dépasse, l’${h.src('check-status', 'outil de suivi des demandes')} indique si IRCC attend la biométrie, un examen médical ou un certificat de police.</p>
<h2>Les Français et EIC</h2>
<p>La France est l’un des plus grands pays partenaires d’EIC. Les ${h.src('open-data', 'données de traitement opérationnel')} n’isolent pas EIC par pays, mais pour l’ensemble de la résidence temporaire, IRCC a finalisé ${h.n(fr.last)} demandes de citoyens français sur les douze derniers mois et en a approuvé ${h.pct(aFR.rate)}, contre ${h.pct(aALL.rate)} pour tous les pays. La ${h.a('france', 'page des citoyens français')} détaille leurs autres dossiers.</p>
<h2>Avant de vous fier à la date</h2>
<p>Donnez votre ${h.src('biometrics', 'biométrie')} dès qu’IRCC la demande : vous avez 30 jours, et le délai de son outil ne compte pas cette étape. Les certificats de police de chaque pays où vous avez vécu six mois ou plus sont une cause fréquente de retard. Le permis est délivré à la frontière, aux conditions de votre ${h.src('iec', 'catégorie EIC')}. Pour rester plus longtemps, il faudra un autre permis, comme un ${h.a('work-permit', 'permis de travail lié à un employeur')}, ou une ${h.a('work-permit-extension', 'prolongation du permis de travail')} si votre catégorie le permet.</p>
`,
  },
});
