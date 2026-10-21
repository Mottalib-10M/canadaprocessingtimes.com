import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Philippines: every figure read from IRCC's country file and our dated archive at build time. */
const C = 'PH';
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
const move = (tr: { dir?: string }) => (tr.dir === 'up' ? 'up from' : tr.dir === 'down' ? 'down from' : 'close to');
const wk = K.fullTrend(SER.work)!, vi = K.fullTrend(SER.visitor)!, sv = K.fullTrend(SER['super-visa'])!, ch = K.fullTrend(SER.child)!, sd = K.fullTrend(SER.study)!;
const wIn = K.readingOf('work-inside'), wInT = K.fullTrend(wIn.series)!;
const wExt = K.readingOf('work-ext'), wExtAlt = K.altOf('work-ext')!;
const cg = K.readingOf('caregiver');
const others = ['HK', 'SG', 'AE'].filter((c) => K.daysOf(t('work', c)) != null);

function family(h: Helpers) {
  return (['visitor', 'super-visa', 'child', 'study'] as const).map((g) => {
    const tr = K.fullTrend(SER[g]);
    return [h.a(K.PAGE_OF[g], K.progName(g, 'en')), h.t(t(g)), rank(g), tr?.prev != null ? `${h.d(tr.prev, unit(g))} (${h.day(tr.prevDate!)})` : ''];
  });
}

export default defineGuide({
  id: 'philippines', group: 'countries', order: 101, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['work-permit', 'caregiver', 'work-permit-extension', 'pgwp', 'super-visa', 'dependent-child'],
  sources: ['ptimes-country', 'work-permit', 'caregivers', 'ptimes-flpt', 'biometrics', 'wayback'],
  en: {
    slug: 'processing-times-philippines',
    nav: 'Philippines', card: 'Work permits, caregivers and family lines from the Philippines',
    title: 'Work Permit and Visa Processing Times, Philippines 2026',
    description: 'Canadian work permit, caregiver, visitor visa, super visa and child sponsorship times for applicants in the Philippines in 2026, from the latest IRCC files.',
    h1: 'Processing times for applications filed from the Philippines',
    intro: `On ${E.day(D)} IRCC published ${K.fmtTime(t('work'), 'en')} for a work permit requested from the Philippines, ${move(wk)} ${E.d(wk.prev!, 'w')} at the reading before.`,
    resume: `A work permit requested from the Philippines currently takes ${K.fmtTime(t('work'), 'en')}, according to IRCC’s country file of ${E.day(D)}, which ranks the Philippines ${rank('work')} countries with a published work permit figure; the middle value across them is ${E.d(mid('work'), 'w')}. Our oldest dated copy, from ${E.day(wk.firstDate!)}, showed ${E.d(wk.first!, 'w')}, and the lowest point we hold is ${E.d(wk.min, 'w')} on ${E.day(wk.minDate)}. Caregivers who seek permanent residence fall under a separate line that IRCC does not split by country: for an application received today it expects ${K.fmtTime(cg.t, 'en')}, read on ${E.day(cg.date)}. From the Philippines, a visitor visa now takes ${K.fmtTime(t('visitor'), 'en')}, a super visa ${K.fmtTime(t('super-visa'), 'en')}, a study permit ${K.fmtTime(t('study'), 'en')} and dependent child sponsorship ${K.fmtTime(t('child'), 'en')}. Country figures are past times: the period within which IRCC finished 80% of recent files, counted from receipt of a complete application and without the biometrics appointment. The tool above adds any of them to your filing date.`,
    faqs: [
      { q: 'How long does a Canadian work permit take from the Philippines right now?', a: `IRCC’s figure of ${E.day(D)} is ${K.fmtTime(t('work'), 'en')}, ${move(wk)} ${E.d(wk.prev!, 'w')} on ${E.day(wk.prevDate!)}. It counts from the day IRCC receives the complete application. An employer’s labour market impact assessment, when the job needs one, is a separate step handled before the permit application and is not part of this time.` },
      { q: 'Is there a caregiver processing time specific to the Philippines?', a: `No. IRCC publishes one permanent residence line for caregivers for all countries. On ${E.day(cg.date)} it expected ${K.fmtTime(cg.t, 'en')} for an application received that day, with ${K.fmtAhead(cg.waiting ?? 0, 'en')} people waiting. A work permit requested from the Philippines follows the country line instead, currently ${K.fmtTime(t('work'), 'en')}.` },
      { q: 'Which is faster from the Philippines, a super visa or a visitor visa?', a: `The visitor visa, by a wide margin: ${K.fmtTime(t('visitor'), 'en')} against ${K.fmtTime(t('super-visa'), 'en')} for the super visa on ${E.day(D)}. The super visa asks for more, including proof of the host’s income and private medical insurance, and only ${E.n(known('super-visa').length)} countries have a published super visa figure at all.` },
    ],
    body: (h) => `
<h2>Work permits from the Philippines today</h2>
<p>This page leads with work permits, the line that covers Filipino workers hired by a Canadian employer; the study and family lines follow further down. IRCC’s line for a work permit requested from the Philippines stands at ${h.t(t('work'))} on ${h.day(D)}, ${rank('work')} countries that have a figure. Only ${h.n(known('work').length)} of the ${h.n(K.countriesOf('work').length)} countries in the file show a work permit time; for the others the file reads “no time published”, and IRCC gives no reason line by line.</p>
${h.hist(SER.work, { max: 12, unit: 'w' })}
<p>The two oldest rows are far apart: ${h.d(wk.first!, 'w')} in ${h.my(wk.firstDate!)} and ${h.d(at(SER.work, R[1].ircc)!, 'w')} in ${h.my(R[1].ircc)}. After that the archive is silent until ${h.day(R[2].ircc)}, because no public copy of the country file was saved in between. From ${h.day(R[2].ircc)} on, the copies come every few weeks and the line moves from ${h.d(at(SER.work, R[2].ircc)!, 'w')} to ${h.t(t('work'))}.</p>
<h2>Once the worker is in Canada</h2>
<p>A new permit requested from inside Canada, such as a change of employer, uses the line IRCC files under Canada: ${h.t(wIn.t)} now, against ${h.d(wInT.first!, 'w')} in our oldest copy. Renewing a permit before it expires is an extension. For extensions IRCC publishes a forward-looking queue by week of filing, which currently expects ${h.t(wExt.t)}, alongside a past time of ${h.t(wExtAlt.t)}. The ${h.a('work-permit-extension', 'extension page')} shows how to read the weekly queue, and the ${h.a('pgwp', 'post-graduation page')} covers graduates.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'work', c: C, m: 'none' }, t: 'Your work permit from the Philippines: estimated decision date' })}
<h2>Caregivers: a different line</h2>
<p>Caregivers often come to Canada first on a work permit and later apply for permanent residence. Those are two distinct requests with two distinct clocks. The work permit follows the Philippines country line above. The permanent residence application follows IRCC’s caregiver line in its forward-looking file, which is not split by country: ${h.t(cg.t)} for an application received on ${h.day(cg.date)}, with ${K.fmtAhead(cg.waiting ?? 0, 'en')} people waiting. The ${h.a('caregiver', 'caregiver page')} lists the queue month by month, and IRCC describes the programs on its ${h.src('caregivers', 'caregivers page')}.</p>
<h2>Family and visit lines from the Philippines</h2>
${h.table(['Application', 'Published time', 'Rank among countries', 'Reading before'], family(h), `Filed from the Philippines, IRCC country file of ${h.day(D)}.`, ['l', 'r', 'l', 'r'])}
<p>A parent coming to see a worker or a student usually starts with a visitor visa, at ${h.t(t('visitor'))}. The super visa, for stays of up to five years at a time, takes ${h.t(t('super-visa'))} from the Philippines; it read ${h.d(sv.first!)} in our ${h.my(sv.firstDate!)} copy${sv.maxDate === sv.firstDate ? ', the highest value we hold for it' : `, and the highest value we hold is ${h.d(sv.max)}, on ${h.day(sv.maxDate)}`}. Its lowest was ${h.d(sv.min)} on ${h.day(sv.minDate)}. Sponsoring a dependent child from the Philippines is ${rank('child')}, at ${h.t(t('child'))}.</p>
<h2>Filing from outside the Philippines</h2>
<p>Many Filipino workers apply while living elsewhere, and the figure that applies is the one for the country they file from. On ${h.day(D)}, a work permit took ${others.map((c) => `${h.t(t('work', c))} from ${c === 'HK' ? 'Hong Kong' : c === 'AE' ? `the ${h.cn(c)}` : h.cn(c)}`).join(', ').replace(/, ([^,]*)$/, ' and $1')}. A person legally resident in one of those places uses that line, not the Philippines one.</p>
<p>Two further points move a real date. Most applicants give fingerprints and a photo, as set out on IRCC’s ${h.src('biometrics', 'biometrics page')}, and the time to book that appointment is not in the published figure. A request for more documents also stops the clock until you answer. The ${h.a('method', 'method page')} describes how each reading is kept.</p>
`,
  },
});
