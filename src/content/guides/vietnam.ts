import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, pts, rank, studyYear } from './_pays-en';

/* Vietnam: students hold up while the national total falls, the approval share rises, then the path to work and PR.
 * Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship (of birth for new citizens). */
const C = 'VN';
const E = K.en;
const fin = K.ops12('trFin', C), ok = K.approval12(C), all = K.approval12();
const v1 = K.ops12('v1', C), sp = K.ops12('spFin', C), prIn = K.ops12('prIn', C), copr = K.ops12('copr', C), cit = K.ops12('cit', C);
const rSp = rank('spFin', C);
const s23 = studyYear(C, '2023')!, s24 = studyYear(C, '2024')!, s25 = studyYear(C, '2025')!;
const w23 = K.yearSum(K.studySeries(), K.STD.months, '2023')!, w25 = K.yearSum(K.studySeries(), K.STD.months, '2025')!;
const keepVN = K.pctOf(s25, s23)!, keepAll = K.pctOf(w25, w23)!;
const up = pts(ok.rate, ok.prevRate);
const ee = K.eeCountry(K.EE_FULL, C);
const stdX = K.stdOf('study-inside')!;
if (!(keepVN >= 85 && keepVN - keepAll >= 20)) throw new Error('vietnam : le texte suppose des permis d’études vietnamiens presque stables, contre une forte baisse générale');
if (!(up != null && up >= 2)) throw new Error('vietnam : le texte suppose une part approuvée en hausse');

export default defineGuide({
  id: 'vietnam', group: 'countries', order: 104, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['study-permit', 'study-permit-extension', 'pgwp', 'visitor-visa', 'super-visa', 'work-permit'],
  sources: ['open-data', 'od-study', 'od-std', 'ptimes', 'study-permit', 'extend-study', 'ogl'],
  en: {
    slug: 'processing-times-vietnam',
    nav: 'Vietnam', card: 'Students who held steady, approvals, visitors and residence from Vietnam',
    title: 'Study Permits and Visas for Vietnamese Citizens, 2026 Data',
    description: 'Study permits for Vietnamese citizens held up while Canada’s total fell: 2026 open data on students, approval share, visitor visas and permanent residence.',
    h1: 'Vietnamese citizens and Canada: students who held steady',
    intro: `${E.n(s25)} study permits took effect for Vietnamese citizens in 2025, against ${E.n(s23)} in 2023, while the total for all countries fell much further.`,
    resume: `Canada cut the number of new international students sharply after 2023, yet Vietnamese students barely moved. IRCC’s open data counts ${E.n(s23)} study permits that took effect for citizens of Vietnam in 2023, ${E.n(s24)} in 2024 and ${E.n(s25)} in 2025, so 2025 kept ${E.pct(keepVN)} of the 2023 level; for every country together it kept only ${E.pct(keepAll)}. The approval share rose too: ${E.pct(ok.rate)} of the ${E.n(fin.last)} temporary residence files IRCC finalized for Vietnamese citizens from ${E.w12()} were approved, against ${E.pct(ok.prevRate)} a year earlier and ${E.pct(all.rate)} for all countries. Withdrawals count among finalized files, so the rest is not a refusal rate. Visitor visas approved reached ${E.n(v1.last)}, and ${E.n(cit.last)} people born in Vietnam became Canadian citizens. Your own wait is the time IRCC shows for the country you apply from; the calculator turns it into a date.`,
    faqs: [
      { q: 'Did the cap on international students reduce Vietnamese study permits?', a: `Much less than for most countries. ${E.n(s25)} study permits took effect for Vietnamese citizens in 2025, ${E.pct(keepVN)} of the ${E.n(s23)} counted in 2023. Across all countries, permits that took effect in 2025 were ${E.pct(keepAll)} of their 2023 level. The counts come from IRCC’s monthly file of study permit holders, by citizenship.` },
      { q: 'What share of Vietnamese visa and permit files does IRCC approve?', a: `From ${E.w12()}, ${E.pct(ok.rate)} of the temporary residence files IRCC finalized for Vietnamese citizens were approved, ${E.n(up, 1)} points more than over the twelve months before. The share covers visitor visas, permits and extensions together, and counts withdrawn files among those finalized.` },
      { q: 'How long does a study permit extension take for a Vietnamese student?', a: `IRCC sets a national service standard of ${K.fmtStd(stdX.cur, 'en')} for a study permit requested from inside Canada and met it for ${E.pct(stdX.cur.perf)} of applications in ${K.fmtFy(stdX.fy, 'en')}. The time that applies to you is the one IRCC’s tool shows for applications made inside Canada, whatever your citizenship.` },
    ],
    body: (h) => `
<h2>Students first</h2>
<p>Vietnam is a country where the study line tells most of the story. Study permits that took effect for Vietnamese citizens went from ${h.n(s23)} in 2023 to ${h.n(s24)} in 2024 and ${h.n(s25)} in 2025. Over the same years, permits for all countries together fell from ${h.n(w23)} to ${h.n(w25)}. Put differently, Vietnamese students kept ${h.pct(keepVN)} of their 2023 level when the national total kept ${h.pct(keepAll)}.</p>
<p>New study permit applications finalized by IRCC for Vietnamese citizens came to ${h.n(sp.last)} from ${h.w12()} (${h.ch(sp.change)}), ${ord(rSp)} among all countries of citizenship. The monthly table below sets study permit decisions next to every temporary file finalized for Vietnamese citizens, so you can see how much of IRCC’s Vietnamese caseload is about study in any given month.</p>
${h.months(K.MONTHS, [['Study permit applications finalized', K.full('spFin', C)], ['All temporary files finalized', K.full('trFin', C)], ['Approved', K.full('trOk', C)]], { caption: 'Vietnamese citizens by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<h2>What a steady count does not tell you</h2>
<p>A stable number of permits is a count of students who arrived, not a promise about the next intake. Each application still needs a provincial or territorial attestation letter in most cases, proof of funds and an acceptance from a designated learning institution, and IRCC decides each file on its own. The count also says nothing about the time: for a first permit filed from Vietnam, read the figure IRCC’s ${h.src('ptimes', 'processing times tool')} shows for Vietnam on the day you apply, and count from the date IRCC received the complete application. A Vietnamese student living in another country, for example finishing school in Australia or Singapore, reads the line for that country instead, while IRCC’s statistics still count the permit under Vietnam.</p>
<h2>After the first permit</h2>
<p>Once in Canada, a student files the next permits from inside the country: an ${h.a('study-permit-extension', 'extension of the study permit')} to finish a program, then a ${h.a('pgwp', 'post-graduation work permit')}. IRCC’s national service standard for a study permit requested inside Canada is ${K.fmtStd(stdX.cur, 'en')}, met for ${h.pct(stdX.cur.perf)} of applications in ${K.fmtFy(stdX.fy, 'en')}. For these files the line to read on IRCC’s ${h.src('ptimes', 'processing times tool')} is the one for applications made in Canada, not the Vietnam line.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'study-inside', c: C, m: 'none' }, t: 'Study permit extension: estimated decision date' })}
<h2>Approvals and visitors</h2>
<p>Across all temporary residence files, IRCC finalized ${h.n(fin.last)} for Vietnamese citizens over the latest twelve months, ${dir(fin.change, 'more', 'fewer', 'about as many')} than a year earlier (${h.ch(fin.change)}). ${h.pct(ok.rate)} were approved, up ${h.n(up, 1)} points from ${h.pct(ok.prevRate)}. Visitor visas approved stood at ${h.n(v1.last)} (${h.ch(v1.change)}); parents who come to see a student or a graduate for longer can look at the ${h.a('super-visa', 'super visa')}.</p>
<h2>Residence and citizenship</h2>
<p>IRCC received ${h.n(prIn.last)} permanent residence applications from Vietnamese citizens from ${h.w12()} and issued ${h.n(copr.last)} authorizations, ${dir(copr.change, 'more than', 'fewer than', 'about as many as')} the year before. Express Entry invited ${h.n(ee)} Vietnamese citizens in ${K.EE_FULL}. ${h.n(cit.last)} people born in Vietnam became Canadian citizens, ${h.ch(cit.change)} on the twelve months before; IRCC counts new citizens by country of birth.</p>
`,
  },
});
