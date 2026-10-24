import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, pts, rank, studyYear } from './_pays-en';

/* Pakistan: a share of approvals well below the average, more files decided, visitors up, permanent residence
 * applications down. Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship. */
const C = 'PK';
const E = K.en;
const fin = K.ops12('trFin', C), rin = K.ops12('trIn', C), okN = K.ops12('trOk', C), ok = K.approval12(C), all = K.approval12();
const v1 = K.ops12('v1', C), sp = K.ops12('spFin', C), prIn = K.ops12('prIn', C), copr = K.ops12('copr', C), cit = K.ops12('cit', C);
const below = pts(all.rate, ok.rate);
const rFin = rank('trFin', C);
const s23 = studyYear(C, '2023')!, s24 = studyYear(C, '2024')!, s25 = studyYear(C, '2025')!;
const ee = K.eeCountry(K.EE_FULL, C);
const stdV = K.stdOf('visitor')!, stdS = K.stdOf('study')!;
const vx = K.fullExtremes('v1', C);
if (!(below != null && below >= 15)) throw new Error('pakistan : le texte suppose une part approuvée bien en dessous de la moyenne');
if (!(v1.change != null && v1.change > 0)) throw new Error('pakistan : le texte suppose plus de visas de visiteur qu’un an plus tôt');
if (!(s25 < s23)) throw new Error('pakistan : le texte suppose moins de permis d’études qu’en 2023');
if (!(prIn.change != null && prIn.change <= -30)) throw new Error('pakistan : le texte suppose une forte baisse des demandes de résidence permanente');

export default defineGuide({
  id: 'pakistan', group: 'countries', order: 103, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['visitor-visa', 'super-visa', 'study-permit', 'work-permit', 'dependent-child', 'beyond-processing-time'],
  sources: ['open-data', 'od-study', 'od-std', 'od-ee', 'ptimes', 'visit', 'ogl'],
  en: {
    slug: 'processing-times-pakistan',
    nav: 'Pakistan', card: 'Approval share, visitor visas and permanent residence from Pakistan',
    title: 'Applications From Pakistani Citizens to Canada, 2026 Data',
    description: 'Visa and permit files from Pakistani citizens in 2026: files finalized, the share approved, visitor visas, study permits and permanent residence, IRCC data.',
    h1: 'Pakistani citizens and Canada: a low approval share, a rising number of visitors',
    intro: `IRCC approved ${E.pct(ok.rate)} of the temporary residence files it finalized for Pakistani citizens from ${E.w12()}, against ${E.pct(all.rate)} for all countries.`,
    resume: `Pakistani citizens apply to Canada in large numbers but see a smaller share of approvals than most. From ${E.w12()}, IRCC finalized ${E.n(fin.last)} temporary residence applications from citizens of Pakistan, ${ord(rFin)} among all countries, a change of ${E.ch(fin.change)} on the twelve months before. ${E.pct(ok.rate)} of those files ended in an approval, ${E.n(below, 1)} points below the ${E.pct(all.rate)} recorded for every country together; a year earlier the Pakistani share was ${E.pct(ok.prevRate)}. Because withdrawn files are counted among the finalized ones, the remainder is not a refusal rate. Visitor visas approved for Pakistani citizens reached ${E.n(v1.last)} (${E.ch(v1.change)}), while new permanent residence applications fell to ${E.n(prIn.last)} from ${E.n(prIn.prev)}. These are counts by citizenship; the wait on your own file is the time IRCC shows for the country you apply from, which the calculator converts into a date.`,
    faqs: [
      { q: 'Why is the approval share for Pakistan lower than average?', a: `IRCC’s open data gives totals, not reasons. It shows that ${E.pct(ok.rate)} of temporary residence files finalized for Pakistani citizens from ${E.w12()} were approved, against ${E.pct(all.rate)} for all countries. The finalized count includes withdrawals, and each refusal letter states its own grounds, so a strong file is judged on its documents, not on this average.` },
      { q: 'How many visitor visas went to Pakistani citizens this year?', a: `IRCC approved ${E.n(v1.last)} visitor visas for Pakistani citizens over the latest twelve months, against ${E.n(v1.prev)} over the twelve before, a change of ${E.ch(v1.change)}. The highest month since January 2023 was ${E.my(vx.hi![0])} with ${E.n(vx.hi![1])}. The figure is rounded to the nearest 5 by IRCC.` },
      { q: 'Are Pakistani students still getting Canadian study permits?', a: `Yes, in smaller numbers than in 2023. IRCC’s open data counts ${E.n(s23)} study permits that took effect for Pakistani citizens in 2023, ${E.n(s24)} in 2024 and ${E.n(s25)} in 2025. New study permit applications finalized over the latest twelve months reached ${E.n(sp.last)}, ${E.ch(sp.change)} on the year before.` },
      { q: 'What can I do if my Pakistan visa application takes longer than shown?', a: `Check that the time you are comparing with is the one IRCC shows for the country you apply from, then count from the date IRCC received your complete file. If that time has passed, you can send a web form or ask for your notes. The page on applications beyond the processing time sets out these steps.` },
    ],
    body: (h) => `
<h2>Below the average share</h2>
<p>The most striking figure for Pakistan is the outcome of files. Of the ${h.n(fin.last)} temporary residence applications IRCC finalized for Pakistani citizens from ${h.w12()}, it approved ${h.n(okN.last)}, or ${h.pct(ok.rate)}. For all countries together the share was ${h.pct(all.rate)}. The gap is ${h.n(below, 1)} points, and it ${dir(pts(ok.rate, ok.prevRate), 'narrowed', 'widened', 'barely moved')} from the year before, when the Pakistani share stood at ${h.pct(ok.prevRate)}.</p>
<p>Two cautions apply. A finalized file is either approved, refused or withdrawn, so this page never calls the remainder a refusal rate. And the share is an average across very different requests, from a first visitor visa to a study permit extension filed in Canada. A well documented application is assessed on its own merits.</p>
${h.months(K.MONTHS, [['Received', K.full('trIn', C)], ['Finalized', K.full('trFin', C)], ['Approved', K.full('trOk', C)]], { caption: 'Temporary residence applications of Pakistani citizens by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<h2>More visitors approved</h2>
<p>Visitor visas move against the general mood: IRCC approved ${h.n(v1.last)} for Pakistani citizens over the latest twelve months, ${dir(v1.change)} ${h.pa(v1.change)}. Pakistani citizens also sent ${h.n(rin.last)} new temporary residence applications or extensions over the period. IRCC’s national service standard for a visitor visa requested from outside Canada is ${K.fmtStd(stdV.cur, 'en')}, met for ${h.pct(stdV.cur.perf)} of applications in ${K.fmtFy(stdV.fy, 'en')}. The time IRCC displays for the country you apply from on its ${h.src('ptimes', 'processing times tool')} is the figure to enter in the calculator below.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visitor visa from Pakistan: estimated decision date' })}
<p>Parents of Canadians who want to stay longer use the ${h.a('super-visa', 'super visa')}; children join through the ${h.a('dependent-child', 'dependent child sponsorship')}. If a file runs past the time IRCC showed when you applied, the ${h.a('beyond-processing-time', 'guide to late applications')} lists what you can do.</p>
<h2>Students</h2>
<p>Study permits that took effect for Pakistani citizens went from ${h.n(s23)} in 2023 to ${h.n(s24)} in 2024 and ${h.n(s25)} in 2025. IRCC’s national service standard for a new study permit from outside Canada is ${K.fmtStd(stdS.cur, 'en')}, met for ${h.pct(stdS.cur.perf)} of applications in ${K.fmtFy(stdS.fy, 'en')}. New study permit applications finalized for Pakistani citizens came to ${h.n(sp.last)} over the latest twelve months, ${h.ch(sp.change)} on the year before. The ${h.a('study-permit', 'study permit page')} explains the provincial attestation letter, the proof of funds IRCC expects and how to read the time it shows for the country you apply from; a student already in Canada who extends a permit reads the inside Canada line instead.</p>
<h2>Permanent residence: a sharp fall in new applications</h2>
<p>IRCC received ${h.n(prIn.last)} permanent residence applications from Pakistani citizens from ${h.w12()}, against ${h.n(prIn.prev)} the year before, a drop of ${h.pa(prIn.change)}. Authorizations issued, which reflect applications filed earlier, came to ${h.n(copr.last)} (${h.ch(copr.change)}). Express Entry invited ${h.n(ee)} Pakistani citizens in ${K.EE_FULL}, and ${h.n(cit.last)} people born in Pakistan became Canadian citizens over the latest twelve months.</p>
<p>Pakistani citizens who live in a third country, such as the United Arab Emirates, Saudi Arabia or the United Kingdom, apply from there: IRCC’s tool then shows the time for that country, while the counts above still file them under Pakistan.</p>
`,
  },
});
