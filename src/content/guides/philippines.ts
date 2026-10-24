import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, rank, studyYear } from './_pays-en';

/* Philippines: the permanent side first (PR authorizations, new citizens, caregivers), then temporary files.
 * Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship (of birth for new citizens). */
const C = 'PH';
const E = K.en;
const copr = K.ops12('copr', C), prIn = K.ops12('prIn', C), cit = K.ops12('cit', C);
const fin = K.ops12('trFin', C), ok = K.approval12(C), nt = K.net12(C);
const v1 = K.ops12('v1', C), sp = K.study12(C);
const care = K.pr12('caregiver');
const rCopr = rank('copr', C), rCit = rank('cit', C), rFin = rank('trFin', C);
const c23 = K.fullYear('copr', C, '2023')!, c24 = K.fullYear('copr', C, '2024')!, c25 = K.fullYear('copr', C, '2025')!;
const s23 = studyYear(C, '2023')!, s25 = studyYear(C, '2025')!;
const ee = K.eeCountry(K.EE_FULL, C);
const stdW = K.stdOf('work-inside')!;
if (rCopr == null || rCopr > 5) throw new Error('philippines : le texte suppose les Philippines parmi les 5 premiers pays de la résidence permanente');

export default defineGuide({
  id: 'philippines', group: 'countries', order: 101, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['work-permit', 'caregiver', 'work-permit-extension', 'pgwp', 'super-visa', 'dependent-child'],
  sources: ['open-data', 'od-pr', 'od-std', 'od-study', 'ptimes', 'caregivers', 'ogl'],
  en: {
    slug: 'processing-times-philippines',
    nav: 'Philippines', card: 'Permanent residence, new citizens and caregivers from the Philippines',
    title: 'Permanent Residence and Permits for Filipinos, 2026 Data',
    description: 'Filipinos rank near the top for Canadian permanent residence and new citizens: 2026 volumes, temporary files and caregiver admissions, from IRCC open data.',
    h1: 'Filipino citizens and Canada: a line that ends in permanent residence',
    intro: `IRCC issued ${E.n(copr.last)} permanent residence authorizations to Filipino citizens from ${E.w12()}, the ${ord(rCopr)} highest of any country.`,
    resume: `For Filipino citizens, the Canadian story leans toward settling for good. From ${E.w12()}, IRCC issued ${E.n(copr.last)} confirmations or visas of permanent residence to citizens of the Philippines, which places the country ${ord(rCopr)} among all countries of citizenship, and ${E.n(cit.last)} people born in the Philippines became Canadian citizens, ${ord(rCit)} by country of birth. Calendar years show the scale: ${E.n(c23)} permanent residence authorizations in 2023, ${E.n(c24)} in 2024 and ${E.n(c25)} in 2025. On the temporary side, IRCC finalized ${E.n(fin.last)} applications from Filipino citizens over the same twelve months, and ${E.pct(ok.rate)} ended in an approval. Caregivers, a pathway long used by Filipino workers, accounted for ${E.n(care.last)} new permanent residents across all nationalities. None of these counts is a processing time: copy the figure IRCC shows for your application and the calculator turns it into a date.`,
    faqs: [
      { q: 'How many Filipinos become permanent residents of Canada each year?', a: `IRCC’s open data counts the authorizations and visas of permanent residence it issues by citizenship: ${E.n(c23)} for citizens of the Philippines in 2023, ${E.n(c24)} in 2024 and ${E.n(c25)} in 2025. The count includes every program, from Express Entry and provincial nominees to family sponsorship and caregivers, and is rounded to the nearest 5.` },
      { q: 'Are fewer Filipinos applying for permanent residence now?', a: `IRCC received ${E.n(prIn.last)} permanent residence applications from Filipino citizens from ${E.w12()}, against ${E.n(prIn.prev)} over the twelve months before, a change of ${E.ch(prIn.change)}. Applications received are counted in people, so a family of four filing together counts as four.` },
      { q: 'How many people born in the Philippines became Canadian citizens?', a: `From ${E.w12()}, ${E.n(cit.last)} people born in the Philippines became Canadian citizens, ${dir(cit.change, 'more', 'fewer', 'about as many')} than in the twelve months before (${E.ch(cit.change)}). IRCC counts new citizens by country of birth, not by former citizenship, and publishes the figure every month.` },
    ],
    body: (h) => `
<h2>Settling, not only visiting</h2>
<p>Many countries appear in IRCC’s data mostly through visitors and students. The Philippines stands out on the permanent side: over the latest twelve months it ranks ${ord(rCopr)} for permanent residence authorizations, ${ord(rCit)} for new Canadian citizens by country of birth, and ${ord(rFin)} for temporary residence applications finalized. Behind those ranks is a long chain of work permits, family sponsorship and caregiver programs that turns temporary stays into permanent ones.</p>
<p>The monthly series below follows the two ends of that chain for Filipino citizens: permanent residence applications received by IRCC, and the authorizations it issued. A gap between them is normal, since an authorization comes months after the application; the useful signal is the direction of each line over a year.</p>
${h.months(K.MONTHS, [['PR applications received', K.full('prIn', C)], ['PR authorizations issued', K.full('copr', C)], ['New citizens (born in the Philippines)', K.full('cit', C)]], { caption: 'Citizens of the Philippines by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<h2>Caregivers and the family line</h2>
<p>Home child care and home support workers have long been one of the main routes to permanent residence for Filipino workers. IRCC’s open data does not cross caregivers with citizenship in its monthly admissions file, so the figure here covers every nationality: ${h.n(care.last)} caregivers became permanent residents over the latest twelve months, ${h.ch(care.change)} on the year before. The ${h.a('caregiver', 'caregiver page')} explains the programs and how the time IRCC shows for them is counted.</p>
<p>Family members follow. A spouse or child of a new permanent resident can be included in the application or sponsored later, and parents who want long visits before any sponsorship can apply for a ${h.a('super-visa', 'super visa')}. Permanent residence applications received from Filipino citizens stood at ${h.n(prIn.last)} over the latest twelve months, ${dir(prIn.change)} ${h.pa(prIn.change)} on the year before.</p>
<h2>Temporary files: work first</h2>
<p>Of the ${h.n(fin.last)} temporary residence applications IRCC finalized for Filipino citizens from ${h.w12()}, ${h.pct(ok.rate)} were approved, against ${h.pct(ok.prevRate)} a year earlier. ${nt.net != null && nt.net < 0 ? `IRCC closed ${h.n(-nt.net)} more Filipino files than it received over those months, so the backlog for this nationality shrank rather than grew.` : `IRCC received ${h.n(nt.net)} more Filipino files than it closed over those months, so the backlog for this nationality grew.`} Work permits, extensions and visitor records make up much of this line; IRCC’s national service standard for a work permit requested inside Canada is ${K.fmtStd(stdW.cur, 'en')}, met for ${h.pct(stdW.cur.perf)} of applications in ${K.fmtFy(stdW.fy, 'en')}.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'work-inside', c: C, m: 'none' }, t: 'Your work permit: estimated decision date' })}
<p>Students are a smaller group: ${h.n(s23)} study permits took effect for Filipino citizens in 2023 and ${h.n(s25)} in 2025. Visitor visas approved reached ${h.n(v1.last)} over the latest twelve months. In ${K.EE_FULL}, Express Entry invited ${h.n(ee)} Filipino citizens.</p>
<p>The ${h.a('pgwp', 'post-graduation work permit')} and ${h.a('work-permit-extension', 'work permit extensions')} are the usual next steps for Filipino graduates and workers already in Canada, and both are filed from inside Canada.</p>
<h2>Where the time comes from</h2>
<p>IRCC’s ${h.src('ptimes', 'processing times tool')} gives a time for the country you apply from. A Filipino caregiver already working in Canada applies from inside Canada, so the Philippines line does not apply; a relative visiting from Manila uses it. The open data above, by contrast, always counts people by citizenship. Pick the right line on IRCC’s tool, copy the time, and the calculator gives the date.</p>
`,
  },
});
