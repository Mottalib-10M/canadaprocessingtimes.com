import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Lang } from '../../lib/format';

/* Enfant à charge : ligne du fichier par pays (délai passé), publiée pour peu de pays. Les autres pays n'ont
   « pas de délai publié » ; certains en avaient un dans d'anciennes copies (on le dit, sans le prolonger). */
const P = 'child';
const D = K.L.dates.country;
const ser = (c: string) => `c:child_dependent:${c}`;
const t = (c: string) => K.readingOf(P, c).t;
const withT = K.countriesOf(P).filter((c) => K.isTime(t(c))).sort((a, b) => (K.daysOf(t(a)) ?? 0) - (K.daysOf(t(b)) ?? 0));
const noneNow = K.countriesOf(P).filter((c) => !K.isTime(t(c)));
const lost = noneNow.filter((c) => K.points(ser(c)).length > 0);
const lo = withT[0], hi = withT[withT.length - 1];
const caT = K.L.country.child_dependent?.CA;
const ADOPT = K.L.country.child_adopted ?? {};
const adoptT = Object.keys(ADOPT).filter((c) => c !== 'CA' && K.isTime(ADOPT[c]));
const firstC = K.firstReading('country')!;
const READS = K.HIST.readings.country.map((r) => r.ircc);
const nIn = K.fullTrend(ser('IN'))!, nNg = K.fullTrend(ser('NG'))!, nHt = K.fullTrend(ser('HT'))!, nCm = K.fullTrend(ser('CM'))!;
const tl = (c: string, l: Lang) => K.fmtTime(t(c), l);
const names = (cs: string[], l: Lang) => { const n = cs.map((c) => K.countryName(c, l)); return n.length < 2 ? n.join('') : `${n.slice(0, -1).join(', ')} ${l === 'fr' ? 'et' : 'and'} ${n[n.length - 1]}`; };
const fastest = withT.filter((c) => K.daysOf(t(c)) === K.daysOf(t(lo)));
const tail = withT.slice(-2);
const ratio = Math.round((K.daysOf(t(hi)) ?? 0) / (K.daysOf(t(lo)) ?? 1));
const frNone = ['MA', 'DZ', 'TN', 'FR'].filter((c) => noneNow.includes(c));

function rows(h: Helpers) {
  return withT.map((c) => { const tr = K.fullTrend(ser(c)); return [K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.t(t(c)), tr?.prev != null ? h.d(tr.prev, 'm') : '', tr?.firstDate ? `${h.d(tr.first!, 'm')} (${h.day(tr.firstDate)})` : '', tr ? `${h.d(tr.max, 'm')} (${h.day(tr.maxDate)})` : '']; });
}

export default defineGuide({
  id: 'dependent-child', group: 'family', order: 52,
  tool: 'delai', toolArg: { g: 'child', c: 'IN' },
  related: ['spousal-sponsorship', 'parents-grandparents', 'nigeria', 'india', 'haiti', 'beyond-processing-time'],
  sources: ['ptimes-country', 'spouse', 'ptimes', 'wayback'],
  en: {
    slug: 'dependent-child-sponsorship-processing-time',
    nav: 'Dependent child', card: 'Time by country where IRCC publishes one, trend since 2024',
    title: 'Dependent Child Sponsorship Processing Time by Country 2026',
    description: 'Dependent child sponsorship processing time in 2026 for each country where IRCC publishes one, with the previous reading, the oldest copy and the peak figure.',
    h1: 'Dependent child sponsorship: the time country by country',
    intro: `IRCC publishes a time for ${K.num(withT.length, 'en')} countries only; on ${K.en.day(D)} it ranged from ${tl(lo, 'en')} (${K.countryName(lo, 'en')}) to ${tl(hi, 'en')} (${K.countryName(hi, 'en')}).`,
    resume: `Sponsoring a dependent child for permanent residence currently takes ${tl('IN', 'en')} for a child living in India, ${tl('PH', 'en')} in the Philippines, ${tl('NG', 'en')} in Nigeria and ${tl('HT', 'en')} in Haiti, according to the times IRCC published on ${K.en.day(D)}. Unlike most permanent residence lines, this one is a past time, set by country: how long IRCC took to finish 80% of the recent applications from that country. IRCC gives a figure for ${K.num(withT.length, 'en')} countries; for the ${K.num(noneNow.length, 'en')} others its file says no time is published, usually because too few child applications were decided there recently. The spread is wide: the slowest line, ${K.countryName(hi, 'en')}, is about ${K.num(ratio, 'en')} times the fastest. The figure covers a child sponsored on their own. A child included in a parent’s or a spouse’s application follows that application instead. The tool above adds the published time to the date IRCC received your file and shows how the line for your country has moved since our first copy, dated ${K.en.day(firstC)}.`,
    faqs: [
      { q: 'How long does it take to sponsor a dependent child from Nigeria?', a: `IRCC’s figure of ${K.en.day(D)} is ${tl('NG', 'en')} for a child living in Nigeria. The oldest copy in our archive, dated ${K.en.day(nNg.firstDate!)}, showed ${K.fmtDays(nNg.first!, 'm', 'en')}, and the lowest reading since was ${K.fmtDays(nNg.min, 'm', 'en')} on ${K.en.day(nNg.minDate)}. Count from the day IRCC received the complete application.` },
      { q: 'Why is there no dependent child time for my country?', a: `IRCC marks ${K.num(noneNow.length, 'en')} countries as having no published time for this line. It does so when it decided too few child applications from that country to compute a reliable figure. A missing figure does not mean applications are refused or frozen; your file is still processed. The ${K.num(withT.length, 'en')} published countries give an idea of the usual range.` },
      { q: 'Is a dependent child faster when included in a spouse’s sponsorship?', a: 'A child listed in the same application as a sponsored spouse or partner is processed with that application, under the spousal time rather than this line. Sponsoring the child separately makes sense mainly when the other parent is not being sponsored, or when the child was not declared earlier. The age and dependency rules are the same in both cases.' },
    ],
    body: (h) => `
<h2>The ${h.n(withT.length)} countries with a published time</h2>
<p>The table lists every country for which IRCC published a dependent child time on ${h.day(D)}, from the shortest to the longest, with the reading before it, the oldest copy in our archive and the highest figure we recorded. Our country archive starts on ${h.day(firstC)} and has ${h.n(READS.length)} dated readings; there is no copy between ${h.day(READS[1])} and ${h.day(READS[2])}, and no value is filled in for that gap.</p>
${h.table(['Country', 'Time now', 'Previous reading', 'Oldest copy kept', 'Highest'], rows(h), `Dependent child sponsorship, IRCC figure of ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The fastest line, ${h.t(t(lo))}, is shared by ${names(fastest, 'en')}. India stood at ${h.d(nIn.first!, 'm')} in the oldest copy, reached a low of ${h.d(nIn.min, 'm')} on ${h.day(nIn.minDate)} and is at ${h.d(nIn.last, 'm')} now. At the other end, Cameroon went from ${h.d(nCm.first!, 'm')} to ${h.d(nCm.last, 'm')}, and Haiti stands at ${h.t(t('HT'))}, its highest level in our archive being ${h.d(nHt.max, 'm')}.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'child', c: 'NG', m: 'none' }, t: 'Your child’s file: estimated decision date' })}
<h2>When the figure disappears</h2>
<p>For most countries IRCC’s file carries a “no time published” mark instead of a number. Some of those countries had a figure in older copies: ${names(lost, 'en')}. We show those old points on the history page with their dates, but we do not extend them to today. A line that went silent may reappear at a quite different level once IRCC has decided enough files again.</p>
<p>If your country has no figure, the tool cannot add a time to your filing date. The range of the published countries, ${h.t(t(lo))} to ${h.t(t(hi))}, is the best available guide. Keep your own dated record of each step, from the acknowledgement of receipt to the medical request, so that you can show where the file stands if you contact IRCC later.</p>
<h2>India over time</h2>
<p>India has one of the fastest lines today, and its readings show how much a single country can move in two years. Every dated reading is listed below with the copy it was taken from.</p>
${h.hist(ser('IN'), { max: 12, unit: 'm' })}
<h2>What the time covers</h2>
<p>A dependent child is, in general, under 22 and not a spouse or common-law partner; an older child can qualify if they have depended on the parent since before 22 because of a physical or mental condition. The published time runs from the day IRCC receives a complete application to the final decision. It does not include the wait for a medical exam, a DNA test if IRCC asks for one, or the issue of a passport. The country that counts is the one where the child lives when the application is made.</p>
<p>IRCC’s country file also holds a line labelled Canada, at ${h.t(caT)} on ${h.day(D)}; the tool does not offer it as a country of filing, as the file does not say which cases it covers. Adopted children follow a separate line, published for a handful of places only: ${names(adoptT, 'en')}.</p>
<p>A child sponsored together with a spouse or partner is part of the ${h.a('spousal-sponsorship', 'spousal sponsorship')} file. Parents and grandparents have their own ${h.a('parents-grandparents', 'program')}. When your file is clearly beyond the published time, the ${h.a('beyond-processing-time', 'steps for a late application')} explain how to ask IRCC about it. IRCC sets out the eligibility rules on its ${h.src('spouse', 'page on sponsoring a spouse, partner or children')}.</p>
`,
  },
  fr: {
    slug: 'delai-parrainage-enfant-a-charge',
    nav: 'Enfant à charge', card: 'Délai par pays là où IRCC en publie un, tendance depuis 2024',
    title: 'Délai du parrainage d’un enfant à charge par pays 2026',
    description: 'Délai du parrainage d’un enfant à charge en 2026 dans les pays où IRCC en publie un : relevé précédent, plus ancienne copie gardée et chiffre le plus haut.',
    h1: 'Parrainer un enfant à charge : le délai pays par pays',
    intro: `IRCC ne publie un délai que pour ${K.num(withT.length, 'fr')} pays ; au ${K.fr.day(D)}, il allait de ${tl(lo, 'fr')} à ${tl(hi, 'fr')} (${K.countryName(hi, 'fr')}).`,
    resume: `Parrainer un enfant à charge pour la résidence permanente prend aujourd’hui ${tl('HT', 'fr')} pour un enfant qui vit en Haïti, ${tl('CM', 'fr')} au Cameroun, ${tl('NG', 'fr')} au Nigeria et ${tl('IN', 'fr')} en Inde, selon les délais publiés par IRCC le ${K.fr.day(D)}. Contrairement à la plupart des lignes de résidence permanente, il s’agit d’un délai passé, fixé par pays : le temps qu’il a fallu à IRCC pour terminer 80 % des demandes récentes de ce pays. IRCC donne un chiffre pour ${K.num(withT.length, 'fr')} pays ; pour les ${K.num(noneNow.length, 'fr')} autres, son fichier indique qu’aucun délai n’est publié, le plus souvent faute d’un nombre suffisant de décisions récentes. Parmi les pays de dépôt francophones, c’est le cas de ces pays : ${names(frNone, 'fr')}. Le chiffre vaut pour un enfant parrainé seul ; un enfant inscrit dans la demande d’un parent ou d’un conjoint suit cette demande. L’outil ci-dessus ajoute le délai publié à la date de réception et montre l’évolution de la ligne de votre pays depuis notre première copie, datée du ${K.fr.day(firstC)}.`,
    faqs: [
      { q: 'Combien de temps faut-il pour parrainer un enfant qui vit en Haïti ?', a: `Le chiffre d’IRCC du ${K.fr.day(D)} est de ${tl('HT', 'fr')}, l’un des plus longs des ${K.num(withT.length, 'fr')} pays publiés. La plus ancienne copie de notre archive, du ${K.fr.day(nHt.firstDate!)}, indiquait ${K.fmtDays(nHt.first!, 'm', 'fr')}. Le délai court à partir de la réception de la demande complète ; l’examen médical et les documents demandés ensuite s’ajoutent.` },
      { q: 'Pourquoi IRCC ne publie-t-il aucun délai d’enfant à charge pour certains pays ?', a: `IRCC n’affiche pas de chiffre quand il a tranché trop peu de demandes d’enfants d’un pays pour calculer un délai fiable. C’est le cas de ${K.num(noneNow.length, 'fr')} pays au dernier relevé. L’absence de chiffre ne veut pas dire que les dossiers sont bloqués : ils sont traités normalement, sans délai de référence publié.` },
      { q: 'Vaut-il mieux inclure l’enfant dans le parrainage du conjoint ?', a: 'Un enfant inscrit dans la même demande qu’un époux ou conjoint parrainé est traité avec ce dossier, selon le délai du parrainage de l’époux. Le parrainer à part se justifie surtout quand l’autre parent n’est pas parrainé ou que l’enfant n’avait pas été déclaré. Les règles d’âge et de dépendance sont les mêmes dans les deux cas.' },
    ],
    body: (h) => `
<h2>Les ${h.n(withT.length)} pays qui ont un délai publié</h2>
<p>Le tableau reprend chaque pays pour lequel IRCC publiait un délai d’enfant à charge le ${h.day(D)}, du plus court au plus long, avec le relevé précédent, la plus ancienne copie de notre archive et le chiffre le plus haut enregistré. Notre archive par pays commence le ${h.day(firstC)} et compte ${h.n(READS.length)} relevés datés ; il n’existe aucune copie entre le ${h.day(READS[1])} et le ${h.day(READS[2])}, et aucune valeur n’est inventée pour combler ce trou.</p>
${h.table(['Pays', 'Délai actuel', 'Relevé précédent', 'Plus ancienne copie', 'Plus haut'], rows(h), `Parrainage d’un enfant à charge, chiffre d’IRCC du ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>${names(tail, 'fr')} ferment la liste. Haïti est à ${h.t(t('HT'))}, après un sommet de ${h.d(nHt.max, 'm')} le ${h.day(nHt.maxDate)}. Le Cameroun est passé de ${h.d(nCm.first!, 'm')} dans la plus ancienne copie à ${h.d(nCm.last, 'm')} aujourd’hui. À l’autre bout, le délai le plus court, ${h.t(t(lo))}, vaut pour ${names(fastest, 'fr')}.</p>
${h.mini('delai', { p: ['c', 'm'], d: { g: 'child', c: 'HT', m: 'none' }, t: 'Le dossier de votre enfant : date de décision estimée' })}
<h2>Quand le chiffre disparaît</h2>
<p>Pour la grande majorité des pays, le fichier d’IRCC porte la mention « pas de délai publié » au lieu d’un nombre. Certains de ces pays avaient un chiffre dans d’anciennes copies : ${names(lost, 'fr')}. Ces anciens points figurent avec leur date sur la page de l’historique, mais nous ne les prolongeons pas jusqu’à aujourd’hui : une ligne qui s’est tue peut revenir à un tout autre niveau.</p>
<p>Si votre pays n’a pas de chiffre, l’outil ne peut pas ajouter de délai à votre date de dépôt. L’écart des pays publiés, de ${h.t(t(lo))} à ${h.t(t(hi))}, reste le meilleur repère disponible. Gardez une trace datée de chaque étape, de l’accusé de réception à la demande d’examen médical : elle vous servira à situer le dossier si vous écrivez plus tard à IRCC. Comparez aussi votre date de dépôt au chiffre d’un pays voisin publié, en gardant en tête que chaque bureau a son propre rythme et que l’écart peut être grand d’un pays à l’autre.</p>
<h2>Haïti, relevé par relevé</h2>
<p>La ligne d’Haïti montre à quel point un seul pays peut varier. Chaque relevé daté est listé ci-dessous avec la copie d’où il vient.</p>
${h.hist(ser('HT'), { max: 12, unit: 'm' })}
<h2>Ce que couvre le délai</h2>
<p>Un enfant à charge a en général moins de 22 ans et n’est ni marié ni en union de fait ; un enfant plus âgé peut être admissible s’il dépend de son parent depuis avant ses 22 ans en raison d’un état physique ou mental. Le délai va de la réception d’une demande complète à la décision. Il ne comprend pas l’attente de l’examen médical, d’un test d’ADN si IRCC en demande un, ni la délivrance d’un passeport. Le pays qui compte est celui où l’enfant vit au moment de la demande.</p>
<p>Le fichier par pays d’IRCC contient aussi une ligne intitulée Canada, à ${h.t(caT)} le ${h.day(D)} ; l’outil ne la propose pas, car le fichier ne précise pas quels dossiers elle couvre. Les enfants adoptés suivent une ligne distincte, publiée pour quelques pays seulement : ${names(adoptT, 'fr')}.</p>
<p>Un enfant parrainé avec son parent fait partie du dossier de ${h.a('spousal-sponsorship', 'parrainage de l’époux')}. Les parents et grands-parents ont leur propre ${h.a('parents-grandparents', 'programme')}. Quand votre dossier dépasse nettement le délai publié, voyez les ${h.a('beyond-processing-time', 'démarches pour une demande en retard')}. Les règles d’admissibilité sont sur la ${h.src('spouse', 'page d’IRCC sur le parrainage d’un époux, d’un conjoint ou d’enfants')}.</p>
`,
  },
});
