import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, rank, studyYear } from './_pays-en';

/* China: visitors (parents, tourism) lead, then students, then the permanent side.
 * Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship (of birth for new citizens). */
const C = 'CN';
const E = K.en;
const v1 = K.ops12('v1', C), fin = K.ops12('trFin', C), ok = K.approval12(C), all = K.approval12(), nt = K.net12(C);
const sp = K.ops12('spFin', C), copr = K.ops12('copr', C), prIn = K.ops12('prIn', C), cit = K.ops12('cit', C);
const rV = rank('v1', C), rFin = rank('trFin', C), rSp = rank('spFin', C);
const v23 = K.fullYear('v1', C, '2023')!, v24 = K.fullYear('v1', C, '2024')!, v25 = K.fullYear('v1', C, '2025')!;
const vx = K.fullExtremes('v1', C);
const s23 = studyYear(C, '2023')!, s24 = studyYear(C, '2024')!, s25 = studyYear(C, '2025')!;
const ee = K.eeCountry(K.EE_FULL, C);
const stdSv = K.stdOf('super-visa')!;
if (rV == null || rV > 3) throw new Error('chine : le texte suppose la Chine parmi les 3 premiers pays des visas de visiteur');
if (!(s25 >= 0.75 * s23 && s25 < s23)) throw new Error('chine : le texte suppose une baisse modérée des permis d’études');
if (!(ok.rate != null && all.rate != null && ok.rate > all.rate)) throw new Error('chine : le texte suppose une part approuvée au-dessus de la moyenne');

export default defineGuide({
  id: 'china', group: 'countries', order: 102, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['super-visa', 'visitor-visa', 'parents-grandparents', 'study-permit', 'work-permit', 'dependent-child'],
  sources: ['open-data', 'od-study', 'od-std', 'ptimes', 'visit', 'super-visa', 'ogl'],
  en: {
    slug: 'processing-times-china',
    nav: 'China', card: 'Visitor visas, super visas, students and residence from China',
    title: 'Visitor Visas and Permits for Chinese Citizens, 2026 Data',
    description: 'Chinese citizens rank near the top for Canadian visitor visas: 2026 counts of visas approved, study permits, permanent residence and approval share, IRCC data.',
    h1: 'Chinese citizens and Canada: visitors first',
    intro: `IRCC approved ${E.n(v1.last)} visitor visas for Chinese citizens from ${E.w12()}, the ${ord(rV)} highest of any country.`,
    resume: `Most Chinese citizens who deal with IRCC want to visit: parents joining a child in Vancouver or Toronto, tourists, business travellers. From ${E.w12()}, IRCC approved ${E.n(v1.last)} visitor visas for citizens of China, ${ord(rV)} among all countries, a change of ${E.ch(v1.change)} on the twelve months before. Calendar years give ${E.n(v23)} in 2023, ${E.n(v24)} in 2024 and ${E.n(v25)} in 2025. Over all temporary residence files, ${E.n(fin.last)} were finalized and ${E.pct(ok.rate)} approved, above the ${E.pct(all.rate)} seen for all countries. Study permits that took effect for Chinese citizens numbered ${E.n(s23)} in 2023 and ${E.n(s25)} in 2025, and IRCC issued ${E.n(copr.last)} permanent residence authorizations to them over the latest twelve months. To date your own application, take the time IRCC shows for the country you apply from and enter it in the calculator.`,
    faqs: [
      { q: 'How many visitor visas does Canada approve for Chinese citizens?', a: `IRCC approved ${E.n(v1.last)} visitor visas for citizens of China from ${E.w12()}, against ${E.n(v1.prev)} over the twelve months before. The busiest month since January 2023 was ${E.my(vx.hi![0])}, with ${E.n(vx.hi![1])}. The count covers visitor visas only, not the visas attached to a study or work permit.` },
      { q: 'Can Chinese parents stay longer than a visitor visa allows?', a: `The super visa is meant for parents and grandparents of Canadian citizens and permanent residents, and allows longer stays than a visitor visa. IRCC’s service standard for it is ${K.fmtStd(stdSv.cur, 'en')}, met for ${E.pct(stdSv.cur.perf)} of applications in ${K.fmtFy(stdSv.fy, 'en')}. Chinese applicants read the actual time on IRCC’s tool.` },
      { q: 'How many Chinese students start a study permit in Canada?', a: `IRCC’s open data counts ${E.n(s23)} study permits that took effect for Chinese citizens in 2023, ${E.n(s24)} in 2024 and ${E.n(s25)} in 2025. New study permit applications finalized over the latest twelve months came to ${E.n(sp.last)} (${E.ch(sp.change)}), ${ord(rSp)} among all countries of citizenship.` },
    ],
    body: (h) => `
<h2>Visitors lead</h2>
<p>For Chinese citizens, the visitor visa is the main door. IRCC approved ${h.n(v1.last)} of them from ${h.w12()}, ${dir(v1.change, 'more', 'fewer', 'about as many')} than the year before (${h.ch(v1.change)}). The monthly series below shows how far demand swings from one month to the next; the busiest month since January 2023 was ${h.my(vx.hi![0])} with ${h.n(vx.hi![1])} visas approved.</p>
${h.months(K.MONTHS, [['Visitor visas approved', K.full('v1', C)], ['Temporary files finalized', K.full('trFin', C)], ['Approved', K.full('trOk', C)]], { caption: 'Chinese citizens by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<p>Across every temporary residence file, from visitor visas to permit extensions, China ranks ${ord(rFin)} with ${h.n(fin.last)} files finalized. ${h.pct(ok.rate)} were approved, against ${h.pct(ok.prevRate)} a year earlier and ${h.pct(all.rate)} for all countries. Withdrawn files count among those finalized, so the rest is not only refusals.</p>
<p>Received minus finalized came to ${h.n(nt.net)} files over the same twelve months. ${nt.net != null && nt.net > 0 ? 'IRCC took in more Chinese files than it closed, which tends to lengthen the queue' : 'IRCC closed at least as many Chinese files as it took in, which tends to keep the queue from growing'}; whether that shows up in your wait depends on the office and the type of application, and only the time on IRCC’s tool tells you.</p>
<h2>Parents and grandparents</h2>
<p>Many Chinese visitors come to see a son or daughter already settled in Canada. The ${h.a('super-visa', 'super visa')} lets them stay longer on each entry; IRCC aims to decide it in ${K.fmtStd(stdSv.cur, 'en')}. Permanent sponsorship goes through the ${h.a('parents-grandparents', 'parents and grandparents program')}, which works by invitation. The mini calculator dates a super visa from the time IRCC shows for the country you apply from.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'super-visa', c: C, m: 'none' }, t: 'Super visa from China: estimated decision date' })}
<h2>Students</h2>
<p>Chinese students remain one of the large groups on Canadian campuses, though the trend has been gentle rather than steep: ${h.n(s23)} study permits took effect in 2023, ${h.n(s24)} in 2024 and ${h.n(s25)} in 2025. New study permit applications finalized reached ${h.n(sp.last)} over the latest twelve months. The ${h.a('study-permit', 'study permit page')} explains the attestation letter and the time IRCC displays.</p>
<h2>Which line of IRCC’s tool applies to you</h2>
<p>IRCC’s ${h.src('ptimes', 'processing times tool')} asks for the country you apply from, not your passport. A Chinese student finishing a degree in Toronto who applies to extend a permit applies from inside Canada and reads the inside Canada line; a parent in Shanghai who wants a visitor visa reads the line for China. The counts on this page work the other way: IRCC files them by citizenship, so the Chinese student in Toronto and the parent in Shanghai are both counted under China. Keep the two apart. Use this page to see the size and direction of each flow, and the tool for the time you enter in the calculator.</p>
<h2>Residence and citizenship</h2>
<p>IRCC received ${h.n(prIn.last)} permanent residence applications from Chinese citizens over the latest twelve months and issued ${h.n(copr.last)} authorizations (${h.ch(copr.change)}). Express Entry invited ${h.n(ee)} of them in ${K.EE_FULL}. ${h.n(cit.last)} people born in China became Canadian citizens. Express Entry draws are open to Chinese citizens living in China, Canada or elsewhere, and the invitation counts include all of them.</p>
`,
  },
});
