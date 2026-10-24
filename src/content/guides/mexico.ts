import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, rank, studyYear } from './_pays-en';

/* Mexico: the visitor visa line that appears in the data (eTA before, visa after), then work and the rest.
 * Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship (of birth for new citizens). */
const C = 'MX';
const E = K.en;
const v1 = K.ops12('v1', C), fin = K.ops12('trFin', C), rin = K.ops12('trIn', C), ok = K.approval12(C), all = K.approval12();
const sp = K.ops12('spFin', C), prIn = K.ops12('prIn', C), copr = K.ops12('copr', C), cit = K.ops12('cit', C);
const vs = K.full('v1', C);
const iStart = vs.findIndex((x) => x != null && x >= 1000);
const vStart = K.MONTHS[iStart];
const v23 = K.fullYear('v1', C, '2023')!, v24 = K.fullYear('v1', C, '2024')!, v25 = K.fullYear('v1', C, '2025')!;
const f23 = K.fullYear('trFin', C, '2023')!, f24 = K.fullYear('trFin', C, '2024')!, f25 = K.fullYear('trFin', C, '2025')!;
const vx = K.fullExtremes('v1', C);
const rFin = rank('trFin', C), rV = rank('v1', C);
const s23 = studyYear(C, '2023')!, s25 = studyYear(C, '2025')!;
const ee = K.eeCountry(K.EE_FULL, C);
const stdV = K.stdOf('visitor')!, stdE = K.stdOf('eta')!;
if (!(iStart > 0 && v23 * 20 < v24)) throw new Error('mexique : le texte suppose presque aucun visa de visiteur avant 2024, puis un saut');
if (!(f24 > f23 && f25 < f24)) throw new Error('mexique : le texte suppose un pic des demandes finalisées en 2024');

export default defineGuide({
  id: 'mexico', group: 'countries', order: 107, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['visitor-visa', 'eta', 'work-permit', 'super-visa', 'study-permit', 'brazil'],
  sources: ['open-data', 'od-study', 'od-std', 'ptimes', 'visit', 'eta', 'ogl'],
  en: {
    slug: 'mexico-processing-times',
    nav: 'Mexico', card: 'Visitor visas or eTA, work permits and residence from Mexico',
    title: 'Visitor Visas and eTA for Mexican Citizens, 2026 Data',
    description: 'Mexican citizens now file Canadian visitor visas in large numbers: 2026 open data on visas approved, eTA context, work and study files, and permanent residence.',
    h1: 'Mexican citizens and Canada: the visitor visa line',
    intro: `IRCC approved ${E.n(v1.last)} visitor visas for Mexican citizens from ${E.w12()}, a line that barely existed in its data before ${E.my(vStart)}.`,
    resume: `The open data shows a clear break for Mexican travellers. In 2023 IRCC approved only ${E.n(v23)} visitor visas for citizens of Mexico, because most of them flew to Canada with an electronic travel authorization. From ${E.my(vStart)} the monthly count jumps into the thousands, after Canada brought back a visa requirement for many Mexican travellers: ${E.n(v24)} visas approved in 2024, ${E.n(v25)} in 2025 and ${E.n(v1.last)} from ${E.w12()}. Some travellers who meet IRCC’s conditions can still use an eTA. Across all temporary residence files, Mexico ranks ${ord(rFin)} among all countries of citizenship, with ${E.n(fin.last)} files finalized over the latest twelve months, ${E.pct(ok.rate)} of them approved, against ${E.pct(all.rate)} for all countries. These are counts, not waiting times: read the time IRCC shows for the country you apply from and the calculator dates it.`,
    faqs: [
      { q: 'Do Mexican citizens need a visa or an eTA for Canada?', a: `Most Mexican citizens now need a visitor visa. IRCC’s eTA page sets out the conditions under which some Mexican travellers flying to Canada can still use an electronic travel authorization. The open data shows the shift: ${E.n(v23)} visitor visas approved for Mexicans in 2023, then ${E.n(v24)} in 2024.` },
      { q: 'How many Canadian visitor visas did Mexicans get this year?', a: `IRCC approved ${E.n(v1.last)} visitor visas for Mexican citizens from ${E.w12()}, against ${E.n(v1.prev)} over the twelve months before (${E.ch(v1.change)}). The busiest month since January 2023 was ${E.my(vx.hi![0])}, with ${E.n(vx.hi![1])} visas approved. Counts are rounded to the nearest 5 and cover visitor visas only, not the visas issued with a study or work permit.` },
      { q: 'How many Mexicans became permanent residents of Canada?', a: `IRCC issued ${E.n(copr.last)} confirmations or visas of permanent residence to Mexican citizens over the latest twelve months, ${E.ch(copr.change)} on the year before. New permanent residence applications came to ${E.n(prIn.last)}, against ${E.n(prIn.prev)} a year earlier, counted in people and rounded to 5 by IRCC.` },
    ],
    body: (h) => `
<h2>From eTA to visitor visa</h2>
<p>Before ${h.my(vStart)}, a Mexican tourist bound for Canada usually needed only an electronic travel authorization, and IRCC’s visitor visa counts for Mexico stayed close to zero: ${h.n(v23)} for all of 2023. The monthly series changes in ${h.my(vStart)}, the first month with more than a thousand visas approved. The peak came in ${h.my(vx.hi![0])} with ${h.n(vx.hi![1])}. Since then the line has settled, with ${h.n(v1.last)} visas approved over the latest twelve months, ${dir(v1.change, 'more', 'fewer', 'about as many')} than the year before.</p>
<p>The ${h.a('eta', 'eTA page')} explains who can still travel with an electronic authorization, which IRCC limits to some Mexican travellers arriving by air. Everyone else applies for a ${h.a('visitor-visa', 'visitor visa')}, with biometrics. IRCC’s national service standard for a visitor visa from outside Canada is ${K.fmtStd(stdV.cur, 'en')}, met for ${h.pct(stdV.cur.perf)} of applications in ${K.fmtFy(stdV.fy, 'en')}; the time IRCC shows for Mexico on its ${h.src('ptimes', 'processing times tool')} is the one that counts for your file.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visitor visa from Mexico: estimated decision date' })}
${h.months(K.MONTHS, [['Visitor visas approved', K.full('v1', C)], ['Temporary files received', K.full('trIn', C)], ['Temporary files finalized', K.full('trFin', C)]], { caption: 'Mexican citizens by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<h2>A large temporary caseload</h2>
<p>The visa requirement also lifted the total. IRCC finalized ${h.n(f23)} temporary residence applications from Mexican citizens in 2023, ${h.n(f24)} in 2024 and ${h.n(f25)} in 2025. Over the latest twelve months it received ${h.n(rin.last)} and finalized ${h.n(fin.last)}, which ranks Mexico ${ord(rFin)} among all countries of citizenship for decisions and ${ord(rV)} for visitor visas. ${h.pct(ok.rate)} of the files finalized were approved, against ${h.pct(ok.prevRate)} a year earlier; withdrawn files count among the finalized ones.</p>
<p>Work permits, including those for seasonal farm jobs and employer-specific offers, sit in the same total; the ${h.a('work-permit', 'work permit page')} covers them. Students are fewer: ${h.n(s23)} study permits took effect for Mexican citizens in 2023 and ${h.n(s25)} in 2025, and new study permit applications finalized came to ${h.n(sp.last)} over the latest twelve months.</p>
<h2>Before you book a flight</h2>
<p>The jump in visitor visas changed how Mexican travellers plan. IRCC’s service standard for an eTA is ${K.fmtStd(stdE.cur, 'en')}, while a visa needs an online application, biometrics at a visa application centre and a decision by an IRCC office, so the planning horizon moves from days to the time IRCC shows on its tool. Enter that time in the calculator above with the date you expect IRCC to receive your complete file, including biometrics, and keep a margin before any fixed date such as a wedding, a conference or a school term. If you hold a valid visa from the United States, check the ${h.a('eta', 'eTA conditions')} first: they may still let you fly with an electronic authorization.</p>
<h2>Residence and citizenship</h2>
<p>IRCC issued ${h.n(copr.last)} permanent residence authorizations to Mexican citizens from ${h.w12()} and received ${h.n(prIn.last)} new applications, ${h.pa(prIn.change)} ${dir(prIn.change, 'more', 'fewer', 'about as many')} than the year before. Express Entry invited ${h.n(ee)} Mexicans in ${K.EE_FULL}, and ${h.n(cit.last)} people born in Mexico became Canadian citizens. A Mexican citizen living in the United States reads the line for the United States on IRCC’s tool; the counts here still place that person under Mexico.</p>
`,
  },
});
