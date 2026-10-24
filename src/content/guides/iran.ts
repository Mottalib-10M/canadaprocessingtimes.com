import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dir, ord, rank, studyYear } from './_pays-en';

/* Iran: more files received than finalized (a growing queue), decisions down by half, permanent residence up.
 * Every figure comes from IRCC open data (OGL-Canada 2.0), by country of citizenship (of birth for new citizens). */
const C = 'IR';
const E = K.en;
const rin = K.ops12('trIn', C), fin = K.ops12('trFin', C), ok = K.approval12(C), nt = K.net12(C);
const v1 = K.ops12('v1', C), sp = K.ops12('spFin', C), prIn = K.ops12('prIn', C), copr = K.ops12('copr', C), cit = K.ops12('cit', C);
const f23 = K.fullYear('trFin', C, '2023')!, f24 = K.fullYear('trFin', C, '2024')!, f25 = K.fullYear('trFin', C, '2025')!;
const s23 = studyYear(C, '2023')!, s25 = studyYear(C, '2025')!;
const ee = K.eeCountry(K.EE_FULL, C);
const rCopr = rank('copr', C);
const vx = K.fullExtremes('v1', C);
const stdW = K.stdOf('work')!;
if (!(nt.net != null && nt.net > 0)) throw new Error('iran : le texte suppose plus de demandes reçues que finalisées');
if (!(fin.change != null && fin.change <= -30)) throw new Error('iran : le texte suppose une forte baisse des demandes finalisées');
if (!(f25 < 0.75 * f24 && Math.abs(f24 - f23) < 0.1 * f23)) throw new Error('iran : le texte suppose deux années stables puis une chute en 2025');
if (!(rin.change != null && rin.change < 0 && rin.change > fin.change!)) throw new Error('iran : le texte suppose des demandes reçues en baisse, moins que les décisions');
if (!(copr.change != null && copr.change > 0)) throw new Error('iran : le texte suppose une hausse des résidences permanentes accordées');

export default defineGuide({
  id: 'iran', group: 'countries', order: 106, country: C,
  tool: 'pays', toolArg: { c: C },
  related: ['work-permit', 'study-permit', 'visitor-visa', 'super-visa', 'beyond-processing-time', 'history'],
  sources: ['open-data', 'od-study', 'od-std', 'od-ee', 'ptimes', 'work-permit', 'ogl'],
  en: {
    slug: 'iran-processing-times',
    nav: 'Iran', card: 'A growing queue of files, fewer decisions, more new residents from Iran',
    title: 'Iranian Applications to Canada and the Queue, 2026 Data',
    description: 'IRCC received more applications from Iranian citizens than it finalized in 2026: open data on the queue, approvals, study permits and permanent residence.',
    h1: 'Iranian citizens and Canada: more files in than out',
    intro: `From ${E.w12()}, IRCC received ${E.n(rin.last)} temporary residence applications from Iranian citizens and finalized ${E.n(fin.last)}.`,
    resume: `For Iranian citizens the key figure is the gap between files received and files decided. From ${E.w12()}, IRCC received ${E.n(rin.last)} temporary residence applications or extensions from citizens of Iran and finalized ${E.n(fin.last)}, so ${E.n(nt.net)} more files came in than went out. Decisions held at ${E.n(f23)} files finalized in 2023 and ${E.n(f24)} in 2024, then fell to ${E.n(f25)} in 2025. ${E.pct(ok.rate)} of the files finalized over the latest twelve months were approved, against ${E.pct(ok.prevRate)} the year before; withdrawals sit among the finalized files, so the rest is not a refusal rate. The permanent side moves the other way, with ${E.n(copr.last)} permanent residence authorizations issued to Iranian citizens (${E.ch(copr.change)}). An Iranian who applies while living in Türkiye, the United Arab Emirates or Armenia reads the time IRCC’s tool gives for that country; enter it in the calculator to get a date.`,
    faqs: [
      { q: 'Why do Iranian applications to Canada seem to pile up?', a: `IRCC’s open data does not give reasons, but it shows the arithmetic: from ${E.w12()}, IRCC received ${E.n(rin.last)} temporary residence applications from Iranian citizens and finalized ${E.n(fin.last)}. When more files arrive than are decided, the stock waiting grows, and the time IRCC shows tends to follow.` },
      { q: 'How many Iranians received Canadian permanent residence?', a: `IRCC issued ${E.n(copr.last)} confirmations or visas of permanent residence to Iranian citizens over the latest twelve months, against ${E.n(copr.prev)} the year before (${E.ch(copr.change)}). It received ${E.n(prIn.last)} new permanent residence applications from them in the same period, counted in people and rounded to 5.` },
      { q: 'Can Iranian citizens apply to Canada from Türkiye or the UAE?', a: `Yes. IRCC accepts applications online from anywhere you are legally present, and biometrics can be given at a visa application centre in another country. The time IRCC shows on its tool then depends on that country of residence, while its statistics still count you as an Iranian citizen.` },
    ],
    body: (h) => `
<h2>A queue that grows</h2>
<p>Received and finalized are the two flows that decide how long the line is. For Iranian citizens they have drifted apart. IRCC received ${h.n(rin.last)} temporary residence applications or extensions from them from ${h.w12()} and finalized ${h.n(fin.last)}, a fall of ${h.pa(fin.change)} on the twelve months before. The difference, ${h.n(nt.net)} files, is added to the stock still waiting. Calendar years show when the drop began: IRCC finalized ${h.n(f23)} Iranian files in 2023 and ${h.n(f24)} in 2024, then only ${h.n(f25)} in 2025. Received files fell too, by ${h.pa(rin.change)} over the latest twelve months, but less than decisions.</p>
<p>The monthly table makes the pattern visible. Read the first two columns side by side: each month where received exceeds finalized lengthens the queue for Iranian applicants.</p>
${h.months(K.MONTHS, [['Received', K.full('trIn', C)], ['Finalized', K.full('trFin', C)], ['Approved', K.full('trOk', C)]], { caption: 'Temporary residence applications of Iranian citizens by month, newest first. Source: IRCC, Operational Processing, open data (Open Government Licence of Canada); figures rounded to 5.' })}
<h2>Outcomes</h2>
<p>${h.pct(ok.rate)} of the files finalized for Iranian citizens over the latest twelve months were approved, ${dir(ok.rate != null && ok.prevRate != null ? ok.rate - ok.prevRate : null, 'up', 'down', 'about level')} from ${h.pct(ok.prevRate)}. Visitor visas approved came to ${h.n(v1.last)} (${h.ch(v1.change)}) and new study permit applications finalized to ${h.n(sp.last)} (${h.ch(sp.change)}). Study permits that took effect went from ${h.n(s23)} in 2023 to ${h.n(s25)} in 2025. Applications to work, usually tied to a job offer, follow the national service standard of ${K.fmtStd(stdW.cur, 'en')} for a ${h.a('work-permit', 'work permit')} requested from outside Canada, met for ${h.pct(stdW.cur.perf)} of files in ${K.fmtFy(stdW.fy, 'en')}.</p>
<p>The visitor visa series shows the scale of the change in a single line. Since January 2023, the month with the most visitor visas approved for Iranian citizens was ${h.my(vx.hi![0])}, with ${h.n(vx.hi![1])}; the month with the fewest was ${h.my(vx.lo![0])}, with ${h.n(vx.lo![1])}. A family planning a visit, a wedding or a graduation in Canada should therefore expect the time on IRCC’s tool, not a figure remembered from a few years ago, and build the trip around the date the calculator returns.</p>
${h.mini('delai', { p: ['g', 'n', 'm'], d: { g: 'work', c: C, m: 'none' }, t: 'Work permit for an Iranian citizen: estimated decision date' })}
<h2>The permanent side moves up</h2>
<p>Permanent residence follows a different path. IRCC issued ${h.n(copr.last)} authorizations to Iranian citizens from ${h.w12()}, ${h.ch(copr.change)} on the year before, which ranks Iran ${ord(rCopr)} among all countries of citizenship. New permanent residence applications came to ${h.n(prIn.last)} (${h.ch(prIn.change)}). Express Entry invited ${h.n(ee)} Iranian citizens in ${K.EE_FULL}, and ${h.n(cit.last)} people born in Iran became Canadian citizens, ${dir(cit.change, 'more', 'fewer', 'about as many')} than a year earlier.</p>
<h2>Applying from a third country</h2>
<p>Canada has no embassy in Iran, so Iranian applicants give their biometrics at a visa application centre abroad, and some apply while living in Türkiye, the United Arab Emirates or Armenia. IRCC’s ${h.src('ptimes', 'processing times tool')} gives the time for the country you apply from, so those applicants read the line for their country of residence. The counts on this page stay with citizenship. When a file waits longer than the time shown on the day it was submitted, the ${h.a('beyond-processing-time', 'guide to late applications')} explains the web form and the notes request.</p>
`,
  },
});
