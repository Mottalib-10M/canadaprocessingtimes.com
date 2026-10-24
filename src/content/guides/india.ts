import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, studyYear, partial } from './_pays-en';

/* India: scale first, then the fall in study permits. Every figure comes from IRCC open data (OGL-Canada 2.0),
 * by country of citizenship, computed at build time. */
const C = 'IN';
const E = K.en;
const fin = K.ops12('trFin', C), rin = K.ops12('trIn', C), ok = K.approval12(C), all = K.approval12();
const v1 = K.ops12('v1', C), sp = K.ops12('spFin', C), pr = K.ops12('prIn', C), copr = K.ops12('copr', C), cit = K.ops12('cit', C);
const finAll = K.ops12('trFin');
const shareAll = K.pctOf(fin.last, finAll.last);
const s23 = studyYear(C, '2023')!, s24 = studyYear(C, '2024')!, s25 = studyYear(C, '2025')!, s26 = studyYear(C, K.EE_CUR);
const m26 = partial(K.EE_CUR);
const stdS = K.stdOf('study')!;
const eeF = K.eeCountry(K.EE_FULL, C), eeTop = K.eeTop(K.EE_FULL);
const eeRank = eeTop.findIndex(([c]) => c === C) + 1;
if (K.rank12('trFin', C).rank !== 1) throw new Error('india : le texte suppose l’Inde au 1er rang des demandes finalisées');
if (K.rank12('v1', C).rank !== 1) throw new Error('india : le texte suppose l’Inde en tête des visas de visiteur');
if (!(s25 < s23)) throw new Error('india : le texte suppose une baisse des permis d’études depuis 2023');

export default defineGuide({
  id: 'india', group: 'countries', order: 100, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['study-permit', 'visitor-visa', 'super-visa', 'work-permit', 'dependent-child', 'study-permit-extension'],
  sources: ['open-data', 'od-study', 'od-std', 'od-ee', 'ptimes', 'study-permit', 'ogl'],
  en: {
    slug: 'processing-times-india',
    nav: 'India', card: 'The largest volumes, study permits since 2023, visitor visas',
    title: 'Visa and Permit Applications From India, 2026 Data',
    description: 'Indian citizens file more Canadian visa and permit applications than any other nation: 2026 volumes, approval share and study permits, from IRCC open data.',
    h1: 'Indian citizens and Canada: the largest line of applicants',
    intro: `IRCC finalized ${E.n(fin.last)} temporary residence applications from Indian citizens from ${E.w12()}, more than for any other country.`,
    resume: `Indian citizens are the largest group of applicants to Canada by a wide margin. From ${E.w12()}, IRCC finalized ${E.n(fin.last)} of their temporary residence applications, which covers visitor visas, visitor records, study and work permits and their extensions; that is ${E.pct(shareAll)} of all such files worldwide. ${E.pct(ok.rate)} of them ended in an approval, against ${E.pct(ok.prevRate)} over the twelve months before and ${E.pct(all.rate)} for all countries. The sharpest change is in study: ${E.n(s23)} study permits took effect for Indian citizens in 2023, ${E.n(s24)} in 2024 and ${E.n(s25)} in 2025. Visitor visas followed their own course, with ${E.n(v1.last)} approved over the latest twelve months (${E.ch(v1.change)}). These counts come from IRCC’s open data and say nothing about the processing time of your own file: for that, copy the time IRCC shows for the country you apply from and let the calculator date it.`,
    faqs: [
      { q: 'How many study permits does Canada give Indian students now?', a: `IRCC’s open data counts ${E.n(s25)} study permits that took effect for Indian citizens in 2025, after ${E.n(s23)} in 2023${s26 != null ? `, and ${E.n(s26)} from January to ${E.my(m26[m26.length - 1])}` : ''}. The count is of permits that started, by country of citizenship, so a student from India who applied from the United Arab Emirates is included.` },
      { q: 'What share of Indian applications does IRCC approve?', a: `From ${E.w12()}, ${E.pct(ok.rate)} of the temporary residence files IRCC finalized for Indian citizens were approved. IRCC counts refusals and withdrawals among the files finalized, so the remainder is not a refusal rate. The share was ${E.pct(ok.prevRate)} over the twelve months before.` },
      { q: 'How many Indian citizens were invited through Express Entry?', a: `IRCC’s open data on invited candidates counts ${E.n(eeF)} invitations to Indian citizens in ${K.EE_FULL}, ${eeRank === 1 ? 'the most of any country' : `the ${ord(eeRank)} highest`}. The figure covers every Express Entry program and comes from the yearly file IRCC updates each month; it does not tell you the score that would be needed in a future round.` },
    ],
    body: (h) => `
<h2>The largest line of applicants</h2>
<p>No other country comes close to India in IRCC’s open data. From ${h.w12()}, Indian citizens sent ${h.n(rin.last)} new temporary residence applications or extensions, and IRCC finalized ${h.n(fin.last)}, ${dir(fin.change, 'more', 'fewer', 'about as many')} than in the twelve months before (${h.ch(fin.change)}). Such volume shapes the wait of everyone filing from India: the offices handling these files decide hundreds of thousands of cases a year, and a small change in their intake shows up in the time IRCC displays for India on its ${h.src('ptimes', 'processing times tool')}.</p>
<p>The calculator above is a country profile built from those monthly files. It compares the latest twelve months with the twelve before for each indicator IRCC publishes by citizenship, from visitor visas to new citizens. It does not give a processing time. When you need one, read it on IRCC’s tool for the country you apply from, which for most readers of this page is India, and enter it in the ${h.a('study-permit', 'study permit')} or ${h.a('visitor-visa', 'visitor visa')} calculator.</p>
${h.months(K.MONTHS, [['Received', K.full('trIn', C)], ['Finalized', K.full('trFin', C)], ['Approved', K.full('trOk', C)]], { caption: 'Temporary residence applications of Indian citizens by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<h2>Study permits since 2023</h2>
<p>The study line explains most of the change. In 2023, ${h.n(s23)} study permits took effect for Indian citizens; in 2024 the figure fell to ${h.n(s24)} and in 2025 to ${h.n(s25)}. New study permit applications finalized by IRCC for Indian citizens follow the same path, with ${h.n(sp.last)} over the latest twelve months against ${h.n(sp.prev)} the year before. Fewer files reach IRCC because Canada now caps the number of new students and asks most of them for a provincial attestation letter.</p>
<p>For the time itself, IRCC sets a national service standard of ${K.fmtStd(stdS.cur, 'en')} for a new study permit requested from outside Canada, and met it for ${h.pct(stdS.cur.perf)} of applications in ${K.fmtFy(stdS.fy, 'en')}. The time IRCC shows for India on any given week can sit above or below that target; the mini calculator below dates it from your filing day.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'Your study permit from India: estimated decision date' })}
<h2>Visitors and families</h2>
<p>Visitor visas move on their own path. IRCC approved ${h.n(v1.last)} visitor visas for Indian citizens over the latest twelve months, ${h.ch(v1.change)} on the year before, the largest number for any country of citizenship. Visitor visa approvals are counted by IRCC separately from the visas attached to a study or work permit. Longer stays go through the ${h.a('super-visa', 'super visa')}, and children joining a parent through the ${h.a('dependent-child', 'dependent child sponsorship')}.</p>
<h2>Permanent residence and citizenship</h2>
<p>On the permanent side, IRCC received ${h.n(pr.last)} permanent residence applications from Indian citizens over the same twelve months and issued ${h.n(copr.last)} confirmations or visas of permanent residence. In ${K.EE_FULL}, Express Entry invited ${h.n(eeF)} Indian citizens to apply. And ${h.n(cit.last)} people born in India became Canadian citizens, ${dir(cit.change, 'more', 'fewer', 'about as many')} than a year earlier. These are counts of people, rounded to the nearest 5 by IRCC; a month with 1 to 4 people is shown as suppressed rather than as a number.</p>
`,
  },
});
