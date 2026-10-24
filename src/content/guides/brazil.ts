import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, rank, studyYear } from './_pays-en';

/* Brazil: one of the few large countries where temporary files grow, visitors in the lead; students and PR after.
 * Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship (of birth for new citizens). */
const C = 'BR';
const E = K.en;
const fin = K.ops12('trFin', C), rin = K.ops12('trIn', C), finAll = K.ops12('trFin'), ok = K.approval12(C), all = K.approval12();
const v1 = K.ops12('v1', C), sp = K.ops12('spFin', C), prIn = K.ops12('prIn', C), copr = K.ops12('copr', C), cit = K.ops12('cit', C);
const rCit = rank('cit', C);
const s23 = studyYear(C, '2023')!, s24 = studyYear(C, '2024')!, s25 = studyYear(C, '2025')!;
const vx = K.fullExtremes('v1', C);
const ee = K.eeCountry(K.EE_FULL, C);
const stdS = K.stdOf('study')!;
if (!(fin.change != null && fin.change >= 10 && finAll.change != null && finAll.change < 0)) throw new Error('brésil : le texte suppose des demandes brésiliennes en hausse, contre une baisse générale');
if (!(rin.change != null && rin.change > 0)) throw new Error('brésil : le texte suppose plus de demandes reçues');
if (!(v1.change != null && v1.change >= 10 && v1.change > fin.change)) throw new Error('brésil : le texte suppose des visas de visiteur en nette hausse');
if (!(ok.rate != null && all.rate != null && ok.rate > all.rate)) throw new Error('brésil : le texte suppose une part approuvée au-dessus de la moyenne');
if (!(s25 < s23)) throw new Error('brésil : le texte suppose moins de permis d’études qu’en 2023');

export default defineGuide({
  id: 'brazil', group: 'countries', order: 108, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['study-permit', 'pgwp', 'visitor-visa', 'work-permit', 'eta', 'mexico'],
  sources: ['open-data', 'od-study', 'od-std', 'od-ee', 'ptimes', 'eta', 'ogl'],
  en: {
    slug: 'brazil-processing-times',
    nav: 'Brazil', card: 'Rising visitor visas, students and new residents from Brazil',
    title: 'Visa and Permit Applications From Brazil to Canada, 2026',
    description: 'Applications from Brazilian citizens to Canada grew in 2026 while the total fell: IRCC open data on visitor visas, approval share, study permits and residence.',
    h1: 'Brazilian citizens and Canada: a line that is growing',
    intro: `IRCC finalized ${E.n(fin.last)} temporary residence applications from Brazilian citizens from ${E.w12()}, ${E.ch(fin.change)} on the year before.`,
    resume: `Brazil goes against the general trend. From ${E.w12()}, IRCC finalized ${E.n(fin.last)} temporary residence applications from citizens of Brazil, a rise of ${E.pa(fin.change)} on the twelve months before, while the total for all countries changed by ${E.ch(finAll.change)}. Visitor visas lead the growth: ${E.n(v1.last)} were approved for Brazilians over the latest twelve months, against ${E.n(v1.prev)} a year earlier. ${E.pct(ok.rate)} of the files finalized were approved, above the ${E.pct(all.rate)} recorded for all countries; withdrawn files count among those finalized, so the rest is not a refusal rate. Students are fewer than in 2023, with ${E.n(s23)} study permits taking effect that year and ${E.n(s25)} in 2025. ${E.n(cit.last)} people born in Brazil became Canadian citizens. Brazilians who qualify can fly with an eTA instead of a visa. For any other file, take the time IRCC shows for the country you apply from and let the calculator give the date.`,
    faqs: [
      { q: 'Are more Brazilians applying to come to Canada?', a: `Yes. IRCC received ${E.n(rin.last)} temporary residence applications or extensions from Brazilian citizens from ${E.w12()}, against ${E.n(rin.prev)} over the twelve months before (${E.ch(rin.change)}). Files finalized rose by ${E.pa(fin.change)} over the same period, while the total for all countries went the other way.` },
      { q: 'Can Brazilian citizens visit Canada with an eTA?', a: `Some can. IRCC’s eTA page sets out the conditions under which Brazilian citizens flying to Canada can use an electronic travel authorization instead of a visitor visa. The others apply for a visa: IRCC approved ${E.n(v1.last)} visitor visas for Brazilians over the latest twelve months, ${E.ch(v1.change)} on the year before.` },
      { q: 'How many Brazilian students go to Canada?', a: `IRCC’s open data counts ${E.n(s23)} study permits that took effect for Brazilian citizens in 2023, ${E.n(s24)} in 2024 and ${E.n(s25)} in 2025. New study permit applications finalized over the latest twelve months came to ${E.n(sp.last)}, ${E.ch(sp.change)} on the twelve months before, counted by citizenship.` },
    ],
    body: (h) => `
<h2>Against the trend</h2>
<p>Across all countries, IRCC decided fewer temporary residence files over the latest twelve months than the year before. Brazilian files went up. IRCC received ${h.n(rin.last)} temporary residence applications or extensions from Brazilian citizens from ${h.w12()} (${h.ch(rin.change)}) and finalized ${h.n(fin.last)} (${h.ch(fin.change)}). For all countries together, files finalized changed by ${h.ch(finAll.change)}. The share approved for Brazilians was ${h.pct(ok.rate)}, against ${h.pct(ok.prevRate)} a year earlier and ${h.pct(all.rate)} for every country.</p>
${h.months(K.MONTHS, [['Visitor visas approved', K.full('v1', C)], ['Temporary files received', K.full('trIn', C)], ['Temporary files finalized', K.full('trFin', C)]], { caption: 'Brazilian citizens by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<p>More files is not automatically a longer wait. The time IRCC displays for Brazil depends on the office that handles the files, the type of application and the stock already waiting, and IRCC moves work between offices. What the open data does show is direction: when received files keep running ahead of decisions month after month, the stock grows; when decisions catch up, it shrinks. Over the latest twelve months IRCC ${rin.last != null && fin.last != null && fin.last >= rin.last ? `finalized ${h.n(fin.last - rin.last)} more Brazilian files than it received, so the stock did not grow` : `received ${h.n(rin.last! - fin.last!)} more Brazilian files than it finalized, so the stock grew`}. For your own file, read the time on IRCC’s tool the week you apply and date it with the calculator above.</p>
<h2>Visitors in the lead</h2>
<p>Visitor visas rise faster than the rest. IRCC approved ${h.n(v1.last)} of them for Brazilian citizens over the latest twelve months, ${dir(v1.change)} ${h.pa(v1.change)}. Since January 2023 the busiest month was ${h.my(vx.hi![0])}, with ${h.n(vx.hi![1])} visas approved, and the quietest ${h.my(vx.lo![0])}, with ${h.n(vx.lo![1])}. Travellers who meet IRCC’s conditions for an ${h.a('eta', 'electronic travel authorization')} skip the visa altogether and are not counted in this line. For the others, the ${h.a('visitor-visa', 'visitor visa page')} explains biometrics and the time IRCC shows for Brazil on its ${h.src('ptimes', 'processing times tool')}.</p>
<h2>Students and graduates</h2>
<p>Brazilian students follow the national trend more than the visitors do. Study permits that took effect for them went from ${h.n(s23)} in 2023 to ${h.n(s24)} in 2024 and ${h.n(s25)} in 2025, and new study permit applications finalized came to ${h.n(sp.last)} over the latest twelve months (${h.ch(sp.change)}). A graduate of an eligible program can then ask for a ${h.a('pgwp', 'post-graduation work permit')} from inside Canada. IRCC’s national service standard for a new study permit from outside Canada is ${K.fmtStd(stdS.cur, 'en')}, met for ${h.pct(stdS.cur.perf)} of applications in ${K.fmtFy(stdS.fy, 'en')}.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'Study permit from Brazil: estimated decision date' })}
<h2>Settling in Canada</h2>
<p>On the permanent side, IRCC received ${h.n(prIn.last)} permanent residence applications from Brazilian citizens over the latest twelve months and issued ${h.n(copr.last)} authorizations, ${dir(copr.change, 'more', 'fewer', 'about as many')} than a year earlier (${h.ch(copr.change)}). Express Entry invited ${h.n(ee)} Brazilian citizens in ${K.EE_FULL}. ${h.n(cit.last)} people born in Brazil became Canadian citizens, ${ord(rCit)} among countries of birth. A Brazilian living in Portugal or the United States reads the line for that country on IRCC’s tool, since it follows residence; the counts here follow citizenship. Someone who first came on a study or work permit and now applies for permanent residence files from inside Canada and reads the time IRCC’s tool gives for that program.</p>
`,
  },
});
