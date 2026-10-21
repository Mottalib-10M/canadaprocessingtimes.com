import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Iran : des délais parmi les plus longs du fichier, et leur évolution relevé par relevé. */
const C = 'IR';
const E = K.en;
const D = K.L.dates.country;
const t = (p: string, c = C) => K.readingOf(p, c).t;
const days = (p: string, c = C) => K.daysOf(t(p, c));
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
function rank(p: string, c = C) {
  const all = K.countriesOf(p).map((x) => K.daysOf(K.readingOf(p, x).t)).filter((x): x is number => x != null);
  const d = days(p, c);
  return { pos: d == null ? 0 : all.filter((x) => x < d).length + 1, n: all.length };
}
const place = (r: { pos: number; n: number }) => (r.pos === r.n ? `the longest of the ${E.n(r.n)} countries with a figure` : `${ord(r.pos)} of ${E.n(r.n)} countries, counted from the fastest`);
const S = { vis: `c:visitor-outside-canada:${C}`, sv: `c:supervisa:${C}`, st: `c:study:${C}`, wk: `c:work:${C}` };
const vis = K.fullTrend(S.vis)!, sv = K.fullTrend(S.sv)!, st = K.fullTrend(S.st)!, wk = K.fullTrend(S.wk)!;
const rV = rank('visitor'), rS = rank('super-visa'), rSt = rank('study'), rW = rank('work');
const visAtLow = vis.last === vis.min;
const ALT = ['AE', 'TR', 'DE', 'GB'].filter((c) => K.countriesOf('visitor').includes(c));
const childPub = K.daysOf(t('child')) != null;

function trendRows(h: Helpers) {
  const line = (name: string, tr: NonNullable<ReturnType<typeof K.fullTrend>>, u: string, cur: ReturnType<typeof t>) =>
    [name, h.t(cur), `${h.d(tr.max, u)} (${h.day(tr.maxDate)})`, `${h.d(tr.min, u)} (${h.day(tr.minDate)})`, `${h.d(tr.first!, u)} (${h.day(tr.firstDate!)})`];
  return [
    line(h.a('visitor-visa', 'Visitor visa'), vis, 'd', t('visitor')),
    line(h.a('super-visa', 'Super visa'), sv, 'd', t('super-visa')),
    line(h.a('study-permit', 'Study permit'), st, 'w', t('study')),
    line(h.a('work-permit', 'Work permit'), wk, 'w', t('work')),
  ];
}
function residenceRows(h: Helpers) {
  return [C, ...ALT].map((c) => [c === C ? `<strong>${h.cn(c)}</strong>` : h.cn(c), h.t(t('visitor', c)), h.t(t('study', c)), h.t(t('work', c))]);
}

export default defineGuide({
  id: 'iran', group: 'countries', order: 106, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['work-permit', 'study-permit', 'visitor-visa', 'super-visa', 'beyond-processing-time', 'history'],
  sources: ['ptimes-country', 'work-permit', 'study-permit', 'visit', 'super-visa', 'biometrics', 'wayback'],
  en: {
    slug: 'iran-processing-times',
    nav: 'Iran', card: 'Longest study and work times, trend reading by reading',
    title: 'Work and Study Permit Processing Times from Iran 2026',
    description: 'Processing times for applications filed from Iran in 2026: work and study permits at the bottom of IRCC’s list, visitor and super visas, every dated reading.',
    h1: 'Processing times for applications filed from Iran',
    intro: `On ${E.day(D)}, IRCC listed ${K.fmtTime(t('work'), 'en')} for a work permit and ${K.fmtTime(t('study'), 'en')} for a study permit applied for from Iran.`,
    resume: `Applications made from Iran carry some of the longest times in IRCC’s country file. On ${E.day(D)}, a work permit from Iran was listed at ${K.fmtTime(t('work'), 'en')}, ${place(rW)}, and a study permit at ${K.fmtTime(t('study'), 'en')}, ${place(rSt)}. A visitor visa took ${K.fmtTime(t('visitor'), 'en')}, ${place(rV)}, and a parent or grandparent super visa ${K.fmtTime(t('super-visa'), 'en')}, ${place(rS)}. ${childPub ? `A dependent child sponsorship is listed at ${K.fmtTime(t('child'), 'en')}.` : 'IRCC publishes no time for a dependent child sponsorship processed for Iran.'} These lines also move a lot. The work permit reached ${E.d(wk.max, 'w')} on ${E.day(wk.maxDate)}, and the visitor visa peaked at ${E.d(vis.max)} on ${E.day(vis.maxDate)} before falling to ${E.d(vis.last)}. Each figure is the time within which IRCC decided 80% of recent files from Iran, measured from receipt of a complete application, with biometrics on top. It looks backwards, so it describes recent files, not a date promised for yours.`,
    faqs: [
      { q: 'Why does a work permit from Iran take so long?', a: 'IRCC does not publish a reason for each country’s time. The figure only reports how long recent files took to reach a decision. Longer lines usually go with more files needing extra background checks, and with offices that handle a large backlog. A file that waits for security screening can stay open well beyond the published time without any request reaching the applicant.' },
      { q: 'Is the visitor visa from Iran getting faster in 2026?', a: `The visitor visa line for Iran was ${E.d(vis.max)} on ${E.day(vis.maxDate)}, its highest value in our archive, and ${K.fmtTime(t('visitor'), 'en')} on ${E.day(D)}. ${visAtLow ? 'That latest figure is also the lowest we have recorded.' : `The lowest we have recorded is ${E.d(vis.min)}, on ${E.day(vis.minDate)}.`} A fall over a few readings does not mean the next one will be lower.` },
      { q: 'Can an Iranian citizen living in Türkiye or the UAE use that country’s time?', a: `Yes, if they live there legally and apply from there. The line that counts is the country you apply from. On ${E.day(D)}, a visitor visa was listed at ${K.fmtTime(t('visitor', 'TR'), 'en')} from Türkiye and ${K.fmtTime(t('visitor', 'AE'), 'en')} from the United Arab Emirates. The officer still assesses the file on its own merits, so the shorter line is not a shortcut around checks.` },
    ],
    body: (h) => `
<h2>At the bottom of the list for permits</h2>
<p>Sort every country in IRCC’s file by its published time, and Iran comes ${rW.pos === rW.n ? 'last' : ord(rW.pos)} of ${h.n(rW.n)} for the work permit and ${rSt.pos === rSt.n ? 'last' : ord(rSt.pos)} of ${h.n(rSt.n)} for the study permit. The work permit figure, ${h.t(t('work'))}, ${(days('work') ?? 0) > 365 ? 'is longer than a full year' : 'is measured in months rather than weeks'}. For a student, the study permit time of ${h.t(t('study'))} means filing well ahead of the program start date, since a permit decided after the term begins can force a deferral.</p>
<p>The four lines IRCC publishes for Iran are summarised below, with the highest and lowest values in our archive and the oldest copy we hold. Older values come from copies of IRCC’s file kept by the Internet Archive; there are none between ${h.my(K.HIST.readings.country[1].ircc)} and ${h.my(K.HIST.readings.country[2].ircc)}, so the extremes are those of the readings we have, not of every week.</p>
${h.table(['Application', 'Published now', 'Highest kept', 'Lowest kept', 'Oldest copy'], trendRows(h), `Applications made from Iran, IRCC figure of ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>How much the work permit line moves</h2>
<p>From one weekly reading to the next, the Iran work permit time can jump by weeks. The oldest copy, dated ${h.day(wk.firstDate!)}, gave ${h.d(wk.first!, 'w')}; the low point we hold is ${h.d(wk.min, 'w')} on ${h.day(wk.minDate)}, and the high point ${h.d(wk.max, 'w')} on ${h.day(wk.maxDate)}. Swings of that size happen when a small number of very old files are closed at once: each of them pulls up the 80th percentile, even if new files are moving faster. Read the series as a band rather than a single value.</p>
${h.hist(S.wk, { max: 12, unit: 'w', caption: 'Work permit from Iran: dated readings, newest first. Date = update date published by IRCC.' })}
${h.mini('delai', { p: ['g', 'm'], d: { g: 'work', c: C, m: 'none' }, t: 'From Iran: your estimated decision date' })}
<h2>Visitor and super visas</h2>
<p>The visitor visa from Iran started at ${h.d(vis.first!)} in our oldest copy (${h.day(vis.firstDate!)}), peaked at ${h.d(vis.max)} on ${h.day(vis.maxDate)} and is now ${h.t(t('visitor'))}. ${visAtLow ? 'The current figure is the lowest in our archive.' : `The lowest in our archive is ${h.d(vis.min)}, on ${h.day(vis.minDate)}.`} The super visa, which lets parents and grandparents of Canadians stay up to five years per entry, is slower: ${h.t(t('super-visa'))}, with a high of ${h.d(sv.max)} on ${h.day(sv.maxDate)}. It ranks ${ord(rS.pos)} of ${h.n(rS.n)} countries with a figure.</p>
<h2>Applying from another country of residence</h2>
<p>Canada closed its embassy in Tehran in 2012, and applications from Iran are handled by IRCC offices outside the country. Many Iranian citizens live and work in other countries. When they apply from where they legally reside, the time that applies is that country’s line, not Iran’s. The table puts Iran next to a few countries with large Iranian communities. It is a comparison of published figures, not advice to move a file: IRCC can ask why you apply from a given country, and residence must be real.</p>
${h.table(['Country of filing', 'Visitor visa', 'Study permit', 'Work permit'], residenceRows(h), `IRCC figures of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<h2>Family sponsorship</h2>
<p>${childPub ? `For a dependent child, IRCC lists ${h.t(t('child'))} for Iran.` : `IRCC publishes no processing time for a ${h.a('dependent-child', 'dependent child sponsorship')} processed for Iran. The line exists in the file but carries no figure, so the tool cannot add a time to your filing date for that application.`} When your file is well past the published time, the steps on the ${h.a('beyond-processing-time', 'page about applications past the processing time')} apply. Every reading cited here is listed with its source on the ${h.a('history', 'history page')}.</p>
`,
  },
});
