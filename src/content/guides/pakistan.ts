import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Pakistan: every figure read from IRCC's country file and our dated archive at build time. */
const C = 'PK';
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
const vi = K.fullTrend(SER.visitor)!, sv = K.fullTrend(SER['super-visa'])!, sd = K.fullTrend(SER.study)!, wk = K.fullTrend(SER.work)!;
const recent = K.points(SER.visitor).filter((p) => p.date >= R[2].ircc);
const top = recent.reduce((a, b) => (b.v > a.v ? b : a), recent[0]);
const v24 = at(SER.visitor, R[0].ircc), v25 = at(SER.visitor, R[1].ircc), vJul = at(SER.visitor, R[2].ircc)!;
const svRecent = K.points(SER['super-visa']).filter((p) => p.date >= R[2].ircc);
const svTop = svRecent.reduce((a, b) => (b.v > a.v ? b : a), svRecent[0]);
const chPts = K.points(SER.child);
const chNow = K.daysOf(t('child'));
const abroad = ['AE', 'SA', 'GB'].filter((c) => K.daysOf(t('visitor', c)) != null);
const pl = (c: string, h: Helpers) => (['AE', 'GB'].includes(c) ? `the ${h.cn(c)}` : h.cn(c));

function abroadRows(h: Helpers) {
  return [C, ...abroad].map((c) => [h.cn(c), h.t(t('visitor', c)), h.t(t('study', c)), h.t(t('work', c))]);
}

export default defineGuide({
  id: 'pakistan', group: 'countries', order: 103, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['visitor-visa', 'super-visa', 'study-permit', 'work-permit', 'dependent-child', 'beyond-processing-time'],
  sources: ['ptimes-country', 'visit', 'biometrics', 'check-status', 'wayback'],
  en: {
    slug: 'processing-times-pakistan',
    nav: 'Pakistan', card: 'Visitor visa trend, super visa, study and work lines from Pakistan',
    title: 'Visitor Visa and Permit Processing Times, Pakistan 2026',
    description: 'Canadian visitor visa, super visa, study and work permit times for applicants in Pakistan in 2026, with every dated IRCC reading since 2024 and its rank.',
    h1: 'Processing times for applications filed from Pakistan',
    intro: `A visitor visa from Pakistan reads ${K.fmtTime(t('visitor'), 'en')} in IRCC’s file of ${E.day(D)}; since ${E.day(R[2].ircc)} it has ranged from ${E.d(vJul)} to ${E.d(top.v)}.`,
    resume: `A Canadian visitor visa requested from Pakistan currently takes ${K.fmtTime(t('visitor'), 'en')}, according to the country file IRCC published on ${E.day(D)}. Among the ${E.n(known('visitor').length)} countries with a visitor figure, Pakistan is ${rank('visitor')}, and the middle value is ${E.d(mid('visitor'))}. The line has swung hard: ${E.d(v24!)} in our copy of ${E.day(R[0].ircc)}, ${E.d(v25!)} in the copy of ${E.day(R[1].ircc)}, ${E.d(vJul)} on ${E.day(R[2].ircc)}, then up to ${E.d(top.v)} on ${E.day(top.date)}. From Pakistan, a super visa now takes ${K.fmtTime(t('super-visa'), 'en')}, a study permit ${K.fmtTime(t('study'), 'en')} and a work permit ${K.fmtTime(t('work'), 'en')}; for dependent child sponsorship the file currently shows ${K.fmtTime(t('child'), 'en')}. Each figure is a past time, the period within which IRCC finished 80% of recent files from Pakistan, counted from receipt of a complete application and without biometrics. The tool above adds it to your filing date.`,
    faqs: [
      { q: 'Why did the visitor visa time from Pakistan jump in 2026?', a: `IRCC does not publish reasons. What the file shows is the result: ${E.d(vJul)} on ${E.day(R[2].ircc)} and ${E.d(top.v)} on ${E.day(top.date)}. A past time rises when the files IRCC closes in a given week took longer than before. The latest reading, ${K.fmtTime(t('visitor'), 'en')}, is the one the tool uses.` },
      { q: 'Is there a processing time for sponsoring a child from Pakistan?', a: `${chNow == null ? `Not at the moment. IRCC’s file of ${E.day(D)} shows ${K.fmtTime(t('child'), 'en')} for Pakistan on this line.` : `Yes: ${K.fmtTime(t('child'), 'en')} on ${E.day(D)}.`} ${chPts.length ? `Our archive holds ${E.n(chPts.length)} dated figures for it, the latest ${E.d(chPts[chPts.length - 1].v, 'm')} on ${E.day(chPts[chPts.length - 1].date)}.` : ''} A sponsorship can still be filed; the published figure only describes recent decisions.` },
      { q: 'Does a Pakistani citizen living abroad use the Pakistan time?', a: `No. The line follows the country you apply from. On ${E.day(D)} a visitor visa took ${abroad.map((c) => `${K.fmtTime(t('visitor', c), 'en')} from ${['AE', 'GB'].includes(c) ? 'the ' : ''}${K.countryName(c, 'en')}`).join(', ').replace(/, ([^,]*)$/, ' and $1')}, against ${K.fmtTime(t('visitor'), 'en')} from Pakistan. Legal residence in that country is what counts.` },
    ],
    body: (h) => `
<h2>A visitor line that will not sit still</h2>
<p>This page follows the visitor visa first, because its line from Pakistan has moved sharply in both directions in our archive. The table lists every dated reading we hold, newest first. Two rows come from 2024 and 2025; there is then a gap until ${h.day(R[2].ircc)}, because no public copy of the country file was saved in between, and we leave that period empty rather than guess.</p>
${h.hist(SER.visitor, { max: 12 })}
<p>The ${h.my(R[0].ircc)} copy showed ${h.d(v24!)}. Less than a year later, in ${h.my(R[1].ircc)}, the figure was ${h.d(v25!)}. When the archive picks up again in ${h.my(R[2].ircc)}, the time was ${h.d(vJul)}, and it reached ${h.d(top.v)} on ${h.day(top.date)}. ${(K.daysOf(t('visitor')) ?? 0) < top.v ? `Since then it has come back to ${h.t(t('visitor'))}, a difference of ${h.d(top.v - (K.daysOf(t('visitor')) ?? 0))} that moves an estimated decision date by the same amount.` : `It now reads ${h.t(t('visitor'))}.`} The lesson for anyone planning a trip is that a single figure from Pakistan can be off by weeks within a season, so it is worth checking the trend in the tool, not only the number.</p>
${h.mini('delai', { p: ['m', 'd'], d: { g: 'visitor', c: C, m: 'none' }, t: 'Visitor visa from Pakistan: when to expect a decision' })}
<h2>Where Pakistan ranks</h2>
<p>On ${h.day(D)} Pakistan is ${rank('visitor')} for a visitor visa. For a super visa it is ${rank('super-visa')}, at ${h.t(t('super-visa'))}; that line read ${h.d(svTop.v)} on ${h.day(svTop.date)} before falling back. For a study permit Pakistan is ${rank('study')}, at ${h.t(t('study'))}, and for a work permit ${rank('work')}, at ${h.t(t('work'))}. Both permit lines were far longer in our oldest copy: ${h.d(sd.first!, 'w')} for study and ${h.d(wk.first!, 'w')} for work in ${h.my(R[0].ircc)}.</p>
<h2>Dependent children: no current figure</h2>
<p>${chNow == null ? `For sponsoring a dependent child, IRCC’s file of ${h.day(D)} gives Pakistan no time: it reads “${h.t(t('child'))}”. IRCC does not explain why a line is blank, and the blank can be filled again at any weekly update.` : `Sponsoring a dependent child from Pakistan currently takes ${h.t(t('child'))}.`} ${chPts.length ? `Our archive does hold ${h.n(chPts.length)} older figures: ${chPts.map((p) => `${h.d(p.v, 'm')} on ${h.day(p.date)}`).join(' and ')}. They describe the past and should not be read as today’s time.` : ''} The ${h.a('dependent-child', 'dependent child page')} compares the countries that do have a figure.</p>
<h2>Applying from outside Pakistan</h2>
<p>A Pakistani citizen who lives legally in another country applies under that country’s line. The table compares Pakistan with three other places of filing, using the same IRCC file, so the difference between them is not a matter of date.</p>
${h.table(['Country of filing', 'Visitor visa', 'Study permit', 'Work permit'], abroadRows(h), `IRCC country file of ${h.day(D)}.`, ['l', 'r', 'r', 'r'])}
<p>Wherever you file, biometrics are separate from the published time, as IRCC explains on its ${h.src('biometrics', 'biometrics page')}. You can follow a file through IRCC’s ${h.src('check-status', 'status tools')}, and the ${h.a('beyond-processing-time', 'page on files past the published time')} lists the steps once the date has gone by. Our ${h.a('method', 'method page')} describes how the readings are kept.</p>
`,
  },
});
