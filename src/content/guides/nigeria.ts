import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, pts, rank, studyYear } from './_pays-en';

/* Nigeria: the approval share moved more than the volume, so the page opens on it, then visitors, students, PR.
 * Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship (of birth for new citizens). */
const C = 'NG';
const E = K.en;
const fin = K.ops12('trFin', C), rin = K.ops12('trIn', C), ok = K.approval12(C), all = K.approval12();
const v1 = K.ops12('v1', C), sp = K.ops12('spFin', C), prIn = K.ops12('prIn', C), copr = K.ops12('copr', C), cit = K.ops12('cit', C);
const gap = pts(ok.rate, ok.prevRate), okN = K.ops12('trOk', C);
const rFin = rank('trFin', C), rSp = rank('spFin', C);
const s23 = studyYear(C, '2023')!, s24 = studyYear(C, '2024')!, s25 = studyYear(C, '2025')!;
const ee = K.eeCountry(K.EE_FULL, C);
const eeRank = K.eeTop(K.EE_FULL, 30).findIndex(([c]) => c === C) + 1;
const stdV = K.stdOf('visitor')!;
if (!(gap != null && gap >= 5)) throw new Error('nigeria : le texte suppose une part approuvée en nette hausse sur un an');
if (rSp == null || rSp > 5) throw new Error('nigeria : le texte suppose le Nigeria parmi les 5 premiers pays des permis d’études');
if (!(fin.change != null && fin.change < 0)) throw new Error('nigeria : le texte suppose moins de demandes finalisées qu’un an plus tôt');

export default defineGuide({
  id: 'nigeria', group: 'countries', order: 105, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['visitor-visa', 'super-visa', 'study-permit', 'work-permit', 'dependent-child', 'cameroon'],
  sources: ['open-data', 'od-study', 'od-std', 'od-ee', 'ptimes', 'visit', 'ogl'],
  en: {
    slug: 'nigeria-processing-times',
    nav: 'Nigeria', card: 'Approval share, visitor visas, students and new residents from Nigeria',
    title: 'Approval Share for Nigerian Applicants to Canada, 2026',
    description: 'How many Canadian visa, study and work applications from Nigerian citizens IRCC finalized and approved in 2026, plus permanent residence and new citizens.',
    h1: 'Nigerian citizens and Canada: fewer files, more approvals',
    intro: `${E.pct(ok.rate)} of the temporary residence files IRCC finalized for Nigerian citizens from ${E.w12()} were approved, against ${E.pct(ok.prevRate)} a year earlier.`,
    resume: `The figure that moved most for Nigerian citizens is the share of files approved. From ${E.w12()}, IRCC finalized ${E.n(fin.last)} temporary residence applications from citizens of Nigeria, ${E.pa(fin.change)} fewer than over the twelve months before, and ${E.pct(ok.rate)} of them ended in an approval, up ${E.n(gap, 1)} points from ${E.pct(ok.prevRate)}. Across all countries the share was ${E.pct(all.rate)}. Finalized files include refusals and withdrawals, so the rest is not a refusal rate. Visitor visas approved for Nigerians came to ${E.n(v1.last)} (${E.ch(v1.change)}), while ${E.n(s25)} study permits took effect in 2025 after ${E.n(s23)} in 2023. On the permanent side, IRCC issued ${E.n(copr.last)} permanent residence authorizations and ${E.n(cit.last)} people born in Nigeria became Canadian citizens. For the wait on your own file, read the time IRCC shows for the country you apply from and date it with the calculator.`,
    faqs: [
      { q: 'Is IRCC approving more applications from Nigeria than before?', a: `Yes, in share. From ${E.w12()}, ${E.pct(ok.rate)} of temporary residence files finalized for Nigerian citizens were approved, against ${E.pct(ok.prevRate)} over the twelve months before. The number of files finalized fell at the same time, by ${E.pa(fin.change)}, and IRCC approved ${E.n(okN.last)} files against ${E.n(okN.prev)} a year earlier.` },
      { q: 'How many Nigerian students get a Canadian study permit?', a: `IRCC’s open data counts ${E.n(s23)} study permits that took effect for Nigerian citizens in 2023, ${E.n(s24)} in 2024 and ${E.n(s25)} in 2025. New study permit applications finalized over the latest twelve months reached ${E.n(sp.last)}, which ranks Nigeria ${ord(rSp)} among all countries of citizenship for that line.` },
      { q: 'How many Nigerians became Canadian permanent residents this year?', a: `From ${E.w12()}, IRCC issued ${E.n(copr.last)} confirmations or visas of permanent residence to Nigerian citizens, ${dir(copr.change, 'more', 'fewer', 'about as many')} than a year earlier (${E.ch(copr.change)}). It received ${E.n(prIn.last)} new permanent residence applications from them over the same period, counted in people.` },
    ],
    body: (h) => `
<h2>A higher share, a smaller line</h2>
<p>Nigeria ranks ${ord(rFin)} among all countries for temporary residence applications finalized by IRCC from ${h.w12()}: ${h.n(fin.last)} files, against ${h.n(fin.prev)} the year before. Nigerian citizens sent ${h.n(rin.last)} new applications or extensions over the same months. What changed most is the outcome. ${h.pct(ok.rate)} of the files finalized were approved, ${h.n(gap, 1)} points more than a year earlier, while the share for all countries stood at ${h.pct(all.rate)}.</p>
<p>A share of approvals is not a forecast for a single file. It mixes visitor visas, study and work permits, first applications and extensions, and counts withdrawn files with refused ones. Read it as the climate around Nigerian applications, then look at the line that matches yours in the profile above.</p>
<p>In numbers, IRCC approved ${h.n(okN.last)} temporary residence files for Nigerian citizens over the latest twelve months, against ${h.n(okN.prev)} over the twelve before (${h.ch(okN.change)}). With fewer files decided and a higher share approved, the two movements ${okN.change != null && Math.abs(okN.change) < 5 ? 'nearly cancel out' : okN.change != null && okN.change > 0 ? 'leave more approvals overall' : 'still leave fewer approvals overall'}. The table below lets you follow them month by month since January 2023.</p>
${h.months(K.MONTHS, [['Finalized', K.full('trFin', C)], ['Approved', K.full('trOk', C)], ['Visitor visas approved', K.full('v1', C)]], { caption: 'Nigerian citizens by month, newest first: temporary residence files finalized and approved, visitor visas approved. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<h2>Visiting family in Canada</h2>
<p>Many Nigerian citizens deal with IRCC for a visitor visa, to see relatives, attend a graduation or travel for business. ${h.n(v1.last)} were approved over the latest twelve months, ${dir(v1.change)} ${h.pa(v1.change)} on the year before. IRCC’s national service standard for a visitor visa requested from outside Canada is ${K.fmtStd(stdV.cur, 'en')}, met for ${h.pct(stdV.cur.perf)} of applications in ${K.fmtFy(stdV.fy, 'en')}; the time IRCC shows for Nigeria on its ${h.src('ptimes', 'processing times tool')} can differ widely from that target, so the calculator below starts from that figure, not from the standard.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Your visitor visa from Nigeria: estimated decision date' })}
<p>Parents and grandparents who want longer stays can look at the ${h.a('super-visa', 'super visa')}, designed for long family visits. Children of a Canadian or a permanent resident come through the ${h.a('dependent-child', 'dependent child sponsorship')}.</p>
<h2>Students</h2>
<p>Nigeria is one of the main sources of international students in Canada. IRCC finalized ${h.n(sp.last)} new study permit applications for Nigerian citizens over the latest twelve months (${h.ch(sp.change)}), ${ord(rSp)} among all countries. Permits that took effect went from ${h.n(s23)} in 2023 to ${h.n(s24)} in 2024 and ${h.n(s25)} in 2025. The ${h.a('study-permit', 'study permit page')} covers the provincial attestation letter and the documents IRCC asks for. A student already in Canada who renews a permit files from inside Canada and reads that line on IRCC’s tool, not the Nigeria line.</p>
<h2>Permanent residence and citizenship</h2>
<p>IRCC received ${h.n(prIn.last)} permanent residence applications from Nigerian citizens from ${h.w12()} (${h.ch(prIn.change)}) and issued ${h.n(copr.last)} authorizations. Express Entry invited ${h.n(ee)} Nigerian citizens in ${K.EE_FULL}${eeRank > 0 ? `, ${ord(eeRank)} among countries of citizenship` : ''}. ${h.n(cit.last)} people born in Nigeria took Canadian citizenship over the latest twelve months, ${h.ch(cit.change)} on the year before. Applicants living in Ghana, the United Kingdom or the United States read the time for that country on IRCC’s tool, since it follows residence, while every count on this page follows citizenship.</p>
`,
  },
});
