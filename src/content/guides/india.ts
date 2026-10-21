import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* India: every figure read from IRCC's country file and our dated archive at build time. */
const C = 'IN';
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
const st = K.fullTrend(SER.study)!;
const at = (s: string, d: string) => K.points(s).find((p) => p.date === d)?.v;
const st2025 = at(SER.study, R[1].ircc)!;
const inside = K.readingOf('study-inside');
const ins = K.fullTrend(inside.series)!;
const wk = K.fullTrend(SER.work)!, vi = K.fullTrend(SER.visitor)!, sv = K.fullTrend(SER['super-visa'])!, ch = K.fullTrend(SER.child)!;
const ext = K.readingOf('study-ext');
const move = (tr: { dir?: string }) => (tr.dir === 'up' ? 'up from' : tr.dir === 'down' ? 'down from' : 'close to');

function lines(h: Helpers) {
  return (['study', 'visitor', 'super-visa', 'work', 'child'] as const).map((g) => {
    const tr = K.fullTrend(SER[g]);
    return [h.a(K.PAGE_OF[g], K.progName(g, 'en')), h.t(t(g)), rank(g), tr?.firstDate ? `${h.d(tr.first!, unit(g))} (${h.day(tr.firstDate)})` : ''];
  });
}

export default defineGuide({
  id: 'india', group: 'countries', order: 100, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['study-permit', 'visitor-visa', 'super-visa', 'work-permit', 'dependent-child', 'study-permit-extension'],
  sources: ['ptimes-country', 'study-permit', 'biometrics', 'visit', 'wayback'],
  en: {
    slug: 'processing-times-india',
    nav: 'India', card: 'Study permit trend, visitor, work and family lines from India',
    title: 'Study Permit and Visa Processing Times from India, 2026',
    description: 'Canadian study permit, visitor visa, super visa, work permit and child sponsorship times for applicants in India in 2026, with each dated IRCC reading kept.',
    h1: 'Processing times for applications filed from India',
    intro: `IRCC’s country file of ${E.day(D)} puts a study permit from India at ${K.fmtTime(t('study'), 'en')}, against ${E.d(st.min, 'w')} at its lowest in our archive.`,
    resume: `A study permit requested from India currently takes ${K.fmtTime(t('study'), 'en')}, according to the country file IRCC published on ${E.day(D)}. That places India ${rank('study')} countries with a published study figure, where the middle value is ${E.d(mid('study'), 'w')}. The line has moved a lot since 2024: our oldest copy, dated ${E.day(st.firstDate!)}, showed ${E.d(st.first!, 'w')}, the copy of ${E.day(R[1].ircc)} still showed ${E.d(st2025, 'w')}, and the figure fell to ${E.d(st.min, 'w')} on ${E.day(st.minDate)} before climbing back. The other lines from India read ${K.fmtTime(t('visitor'), 'en')} for a visitor visa, ${K.fmtTime(t('super-visa'), 'en')} for a super visa, ${K.fmtTime(t('work'), 'en')} for a work permit and ${K.fmtTime(t('child'), 'en')} for sponsoring a dependent child. Each is a past time: how long IRCC took to finish 80% of recent files from India, counted from the day it received a complete application, biometrics excluded. The tool above turns any of these lines into an estimated decision date.`,
    faqs: [
      { q: 'Is the study permit time from India getting longer in 2026?', a: `Compared with its low point, yes. IRCC showed ${E.d(st.min, 'w')} on ${E.day(st.minDate)}, ${E.d(st.prev!, 'w')} on ${E.day(st.prevDate!)} and ${K.fmtTime(t('study'), 'en')} on ${E.day(D)}. That is still well below the ${E.d(st.first!, 'w')} of our ${E.day(st.firstDate!)} copy. A past time follows the files IRCC has just closed, so a rise means recent decisions took longer, not that your own file will.` },
      { q: 'How does child sponsorship from India compare with other countries?', a: `Dependent child sponsorship has a published figure for only ${E.n(known('child').length)} countries. India, at ${K.fmtTime(t('child'), 'en')}, is ${rank('child')}. Our oldest copy, dated ${E.day(ch.firstDate!)}, showed ${E.d(ch.first!, 'm')}. The time runs from the day IRCC receives the complete sponsorship and permanent residence package.` },
      { q: 'Does a work permit from India take longer than a study permit?', a: `On ${E.day(D)} it does: ${K.fmtTime(t('work'), 'en')} for a work permit against ${K.fmtTime(t('study'), 'en')} for a study permit. In our copy of ${E.day(wk.firstDate!)} the gap was wider, with ${E.d(wk.first!, 'w')} for work and ${E.d(st.first!, 'w')} for study. Both lines cover applications made from India, not from inside Canada.` },
    ],
    body: (h) => `
<h2>The study permit line, reading by reading</h2>
<p>This page puts the study permit first because its line from India has the clearest before and after in our archive. On ${h.day(D)} IRCC published ${h.t(t('study'))}, ${rank('study')} countries. The table below lists every dated reading our archive holds for this line, newest first, with the copy each one comes from.</p>
${h.hist(SER.study, { max: 12, unit: 'w' })}
<p>Read from the bottom up, the series tells a short story. In ${h.my(st.firstDate!)} the figure stood at ${h.d(st.first!, 'w')}, and in ${h.my(R[1].ircc)} at ${h.d(st2025, 'w')}. By ${h.day(R[2].ircc)} it had dropped to ${h.d(at(SER.study, R[2].ircc)!, 'w')}, and it still read ${h.d(at(SER.study, R[5].ircc)!, 'w')} on ${h.day(R[5].ircc)}. The latest figure, ${h.t(t('study'))}, is ${move(st)} the ${h.d(st.prev!, 'w')} of ${h.day(st.prevDate!)}. We do not know what happened between ${h.day(R[1].ircc)} and ${h.day(R[2].ircc)}: no copy of IRCC’s country file was archived in that stretch, so the table has no row there and we do not fill one in.</p>
<h2>From India or from inside Canada</h2>
<p>A student who is already in Canada, for example on a visitor record or with a work permit, can sometimes apply for a study permit from inside the country. That application uses a separate line, which IRCC lists under Canada in the same file. It currently reads ${h.t(inside.t)}, after ${h.d(ins.first!, 'w')} in our oldest copy. Once a student holds a permit, renewing it is an extension, a different request that IRCC times with a forward-looking queue; the latest figure is ${h.t(ext.t)} and the ${h.a('study-permit-extension', 'extension page')} explains how to read it.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'Your study permit from India: estimated decision date' })}
<h2>The other four lines from India</h2>
${h.table(['Application', 'Published time', 'Rank among countries', 'Oldest copy kept'], lines(h), `Applications filed from India, IRCC country file of ${h.day(D)}.`, ['l', 'r', 'l', 'r'])}
<p>The visitor visa sits at ${h.t(t('visitor'))}. It peaked at ${h.d(vi.max)} on ${h.day(vi.maxDate)} and was at ${h.d(vi.min)} on ${h.day(vi.minDate)}, which shows how far one line can swing within two years. The super visa for parents and grandparents reads ${h.t(t('super-visa'))}, ${move(sv)} ${h.d(sv.prev!)} on ${h.day(sv.prevDate!)}. Work permits requested from India take ${h.t(t('work'))}, a long way below the ${h.d(wk.first!, 'w')} of ${h.my(wk.firstDate!)}. Dependent child sponsorship from India is ${rank('child')}, at ${h.t(t('child'))}.</p>
<h2>What to check before you rely on a date</h2>
<p>The clock starts on the day IRCC receives a complete application, which for an online file is the submission date. Most applicants must also give fingerprints and a photo at a visa application centre, as described on IRCC’s ${h.src('biometrics', 'biometrics page')}; the published time does not count the wait for that appointment. Requests for more documents, a medical exam or a police certificate also pause the file. Each of these explains why a decision can come after the date shown in the tool without anything being wrong.</p>
<p>The country in the list is the place you apply from. An Indian citizen living in the United Arab Emirates or in the United Kingdom falls under that country’s figure, not India’s. The ${h.a('method', 'method page')} explains how we read and store each file.</p>
`,
  },
});
