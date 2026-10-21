import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Vietnam: every figure read from IRCC's country file and our dated archive at build time. */
const C = 'VN';
const D = K.L.dates.country;
const E = K.en;
const R = K.HIST.readings.country;
const SER: Record<string, string> = { visitor: `c:visitor-outside-canada:${C}`, 'super-visa': `c:supervisa:${C}`, study: `c:study:${C}`, work: `c:work:${C}`, child: `c:child_dependent:${C}` };
const t = (g: string, c = C) => K.readingOf(g, c).t;
const unit = (g: string) => { const x = t(g); return x && 'u' in x ? x.u : 'd'; };
const known = (g: string) => K.countriesOf(g).map((x) => K.daysOf(t(g, x))).filter((v): v is number => v != null).sort((a, b) => a - b);
function rank(g: string): string {
  const all = known(g), mine = K.daysOf(t(g));
  if (mine == null) return 'not ranked';
  const pos = all.filter((v) => v < mine).length + 1, tie = all.filter((v) => v === mine).length > 1;
  const o = pos % 100 >= 11 && pos % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[pos % 10] ?? 'th';
  return `${tie ? 'tied ' : 'the '}${pos === 1 ? '' : `${pos}${o} `}fastest of ${E.n(all.length)}`;
}
const mid = (g: string) => { const a = known(g); return a[Math.floor(a.length / 2)]; };
const at = (s: string, d: string) => K.points(s).find((p) => p.date === d)?.v;
const sd = K.fullTrend(SER.study)!, vi = K.fullTrend(SER.visitor)!, sv = K.fullTrend(SER['super-visa'])!, wk = K.fullTrend(SER.work)!;
const s24 = at(SER.study, R[0].ircc), s25 = at(SER.study, R[1].ircc), sJul = at(SER.study, R[2].ircc)!;
const later = K.points(SER.study).filter((p) => p.date >= R[2].ircc);
const lo = Math.min(...later.map((p) => p.v)), hi = Math.max(...later.map((p) => p.v));
const ext = K.readingOf('study-ext'), extAlt = K.altOf('study-ext')!;
const grad = K.readingOf('work-inside'), inStudy = K.readingOf('study-inside');
const chPts = K.points(SER.child);
const region = ['VN', 'TH', 'KH', 'PH', 'ID', 'MY'].filter((c) => K.daysOf(t('study', c)) != null);
const regSorted = [...region].sort((a, b) => (K.daysOf(t('study', a)) ?? 0) - (K.daysOf(t('study', b)) ?? 0));
const below = known('study').filter((v) => v > (K.daysOf(t('study')) ?? 0)).length;

function regionRows(h: Helpers) {
  return region.map((c) => [c === C ? `<strong>${h.cn(c)}</strong>` : h.cn(c), h.t(t('study', c)), (() => { const p = K.points(`c:study:${c}`)[0]; return p ? `${h.d(p.v, 'w')} (${h.day(p.date)})` : ''; })()]);
}

export default defineGuide({
  id: 'vietnam', group: 'countries', order: 104, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['study-permit', 'study-permit-extension', 'pgwp', 'visitor-visa', 'super-visa', 'work-permit'],
  sources: ['ptimes-country', 'study-permit', 'extend-study', 'pgwp', 'biometrics', 'wayback'],
  en: {
    slug: 'processing-times-vietnam',
    nav: 'Vietnam', card: 'Study permit from Vietnam, then extension and work after graduation',
    title: 'Study Permit Processing Time from Vietnam, Canada 2026',
    description: 'Canadian study permit time for students in Vietnam in 2026, with the dated IRCC history, the visitor, super visa and work lines, and what follows after arrival.',
    h1: 'Processing times for applications filed from Vietnam',
    intro: `IRCC’s country file of ${E.day(D)} shows ${K.fmtTime(t('study'), 'en')} for a study permit from Vietnam, below the middle value of ${E.d(mid('study'), 'w')} across countries.`,
    resume: `A study permit requested from Vietnam currently takes ${K.fmtTime(t('study'), 'en')}, according to IRCC’s country file of ${E.day(D)}. That makes Vietnam ${rank('study')} countries with a published study figure, and ${E.n(below)} of them are slower. Our oldest copies tell a different story: ${E.d(s24!, 'w')} on ${E.day(R[0].ircc)} and ${E.d(s25!, 'w')} on ${E.day(R[1].ircc)}. Since ${E.day(R[2].ircc)} the line has stayed between ${E.d(lo, 'w')} and ${E.d(hi, 'w')}. The other lines from Vietnam read ${K.fmtTime(t('visitor'), 'en')} for a visitor visa, ${K.fmtTime(t('super-visa'), 'en')} for a super visa and ${K.fmtTime(t('work'), 'en')} for a work permit; dependent child sponsorship from Vietnam shows ${K.fmtTime(t('child'), 'en')}. Country figures are past times: the period within which IRCC finished 80% of recent files, counted from receipt of a complete application, with biometrics on top. Once in Canada, a student’s extension and post-graduation work permit run on other lines, covered below.`,
    faqs: [
      { q: 'How long does a Canadian study permit take from Vietnam in 2026?', a: `IRCC’s figure of ${E.day(D)} is ${K.fmtTime(t('study'), 'en')} for an application made from Vietnam. Count it from the day IRCC received the complete application, then allow for the biometrics appointment, which is not included. In our oldest copy, dated ${E.day(R[0].ircc)}, the same line read ${E.d(s24!, 'w')}.` },
      { q: 'Has the study permit time from Vietnam really dropped since 2025?', a: `In the copies we hold, yes: ${E.d(s25!, 'w')} on ${E.day(R[1].ircc)} and ${E.d(sJul, 'w')} on ${E.day(R[2].ircc)}. No copy of the country file was archived between those two dates, so we cannot date the fall more precisely. IRCC does not publish the reasons behind a change.` },
      { q: 'How long is a post-graduation work permit for a student from Vietnam?', a: `Once the student is in Canada, nationality no longer sets the time. A work permit requested from inside Canada follows IRCC’s line for Canada, ${K.fmtTime(grad.t, 'en')} on ${E.day(grad.date)}, whatever the passport. IRCC’s tool has no line labelled for graduates alone, so this inside-Canada figure is the closest published one.` },
    ],
    body: (h) => `
<h2>The study permit from Vietnam, copy by copy</h2>
<p>This page is built around students. A study permit application needs, among other documents, a letter of acceptance from a designated learning institution, as listed on IRCC’s ${h.src('study-permit', 'study permit page')}; the clock only starts once the complete file is received. The study permit line from Vietnam currently reads ${h.t(t('study'))}, which places it ${rank('study')} countries. Every dated figure we hold for it is listed below, with the copy it comes from.</p>
${h.hist(SER.study, { max: 12, unit: 'w' })}
<p>The archive is uneven. It holds one copy from ${h.my(R[0].ircc)}, one from ${h.my(R[1].ircc)}, and then nothing until ${h.day(R[2].ircc)}; from that date, copies follow every few weeks. The older two show ${h.d(s24!, 'w')} and ${h.d(s25!, 'w')}. The newer ones never go above ${h.d(hi, 'w')}. The drop happened somewhere in the gap, and we do not invent a date for it.</p>
<h2>Vietnam next to its neighbours</h2>
${h.table(['Country of filing', 'Study permit now', 'Oldest copy kept'], regionRows(h), `Study permit from outside Canada, IRCC country file of ${h.day(D)}.`, ['l', 'r', 'r'])}
<p>The comparison helps a student who lives in one country and holds another passport: the figure follows the country of residence where the application is made. A Vietnamese student already living in Thailand or Malaysia, for instance, files under that country’s line. In this group, ${h.cn(regSorted[0])} is the quickest at ${h.t(t('study', regSorted[0]))} and ${h.cn(regSorted[regSorted.length - 1])} the slowest at ${h.t(t('study', regSorted[regSorted.length - 1]))}.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'study', c: C, m: 'none' }, t: 'Study permit from Vietnam: estimated decision date' })}
<h2>After arrival: three other clocks</h2>
<p>A first permit is only the start. A student who needs more time to finish a program applies for an extension from inside Canada. IRCC times extensions with a weekly forward-looking queue, which expects ${h.t(ext.t)} for a request filed on ${h.day(ext.date)}, and publishes a separate past time of ${h.t(extAlt.t)}; the ${h.a('study-permit-extension', 'extension page')} explains both. A change of school level or a new permit asked from inside Canada uses the Canada line of the study file, ${h.t(inStudy.t)} now. After graduation, the work permit requested from inside Canada currently reads ${h.t(grad.t)}, as set out on the ${h.a('pgwp', 'post-graduation work permit page')} and on IRCC’s ${h.src('pgwp', 'page on working after graduation')}.</p>
<h2>Visit and work lines from Vietnam</h2>
<p>Parents who want to attend a graduation would normally apply for a visitor visa, at ${h.t(t('visitor'))} from Vietnam; it read ${h.d(vi.first!)} in our oldest copy. For longer family stays, the super visa from Vietnam is ${rank('super-visa')} countries with a figure, at ${h.t(t('super-visa'))}. A work permit requested from Vietnam takes ${h.t(t('work'))}, against ${h.d(wk.first!, 'w')} in ${h.my(wk.firstDate!)}.</p>
<p>${chPts.length ? `For sponsoring a dependent child, the file now shows ${h.t(t('child'))} for Vietnam; our archive holds ${h.n(chPts.length)} older figures.` : `For sponsoring a dependent child, IRCC’s file shows ${h.t(t('child'))} for Vietnam, and none of the copies in our archive has ever carried a figure for it.`} A sponsorship can still be filed; the ${h.a('dependent-child', 'dependent child page')} lists the countries that do have a time.</p>
<p>Biometrics apply to most of these requests and are not counted in the published time, as IRCC’s ${h.src('biometrics', 'biometrics page')} explains. The ${h.a('method', 'method page')} sets out how we date each reading.</p>
`,
  },
});
