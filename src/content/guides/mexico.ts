import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Mexique : délais courts pour visiter, étudier et travailler ; le super visa est l'exception, en forte baisse depuis 2025. */
const C = 'MX';
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
const S = { vis: `c:visitor-outside-canada:${C}`, sv: `c:supervisa:${C}`, st: `c:study:${C}`, wk: `c:work:${C}`, ch: `c:child_dependent:${C}` };
const vis = K.fullTrend(S.vis)!, sv = K.fullTrend(S.sv)!, st = K.fullTrend(S.st)!, wk = K.fullTrend(S.wk)!;
const chPts = K.points(S.ch);
const childPub = days('child') != null;
const rV = rank('visitor'), rS = rank('super-visa'), rSt = rank('study'), rW = rank('work');
const LATAM = ['CO', 'PE', 'CL', 'GT', 'BR', 'US'].filter((c) => K.countriesOf('visitor').includes(c));

function latam(h: Helpers) {
  return [C, ...LATAM].map((c) => [
    c === C ? `<strong>${h.cn(c)}</strong>` : K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c),
    h.t(t('visitor', c)), h.t(t('study', c)), h.t(t('work', c)), h.t(t('super-visa', c)),
  ]);
}

export default defineGuide({
  id: 'mexico', group: 'countries', order: 107, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['visitor-visa', 'eta', 'work-permit', 'super-visa', 'study-permit', 'brazil'],
  sources: ['ptimes-country', 'visit', 'eta', 'work-permit', 'study-permit', 'super-visa', 'wayback'],
  en: {
    slug: 'mexico-processing-times',
    nav: 'Mexico', card: 'Short visa and permit times, super visa drop, eTA rule',
    title: 'Visitor Visa and Work Permit Times from Mexico 2026',
    description: 'Processing times for applications made from Mexico in 2026: visitor visa, study and work permits among the fastest, the super visa line and the eTA option.',
    h1: 'Processing times for applications made from Mexico',
    intro: `IRCC’s file of ${E.day(D)} lists ${K.fmtTime(t('visitor'), 'en')} for a visitor visa from Mexico, ${K.fmtTime(t('study'), 'en')} for a study permit and ${K.fmtTime(t('work'), 'en')} for a work permit.`,
    resume: `Applications made from Mexico are among the quickest in IRCC’s country file. On ${E.day(D)}, a visitor visa took ${K.fmtTime(t('visitor'), 'en')}, ${ord(rV.pos)} of ${E.n(rV.n)} countries counted from the fastest. A study permit took ${K.fmtTime(t('study'), 'en')}, ${ord(rSt.pos)} of ${E.n(rSt.n)}, and a work permit ${K.fmtTime(t('work'), 'en')}, ${ord(rW.pos)} of ${E.n(rW.n)}. The exception is the parent and grandparent super visa at ${K.fmtTime(t('super-visa'), 'en')}, though that line has come down sharply from ${E.d(sv.first!)} in our copy dated ${E.day(sv.firstDate!)}. ${childPub ? `A dependent child sponsorship is listed at ${K.fmtTime(t('child'), 'en')}.` : `IRCC currently publishes no time for a dependent child sponsorship processed for Mexico, although our ${E.my(chPts[0].date)} copy gave ${E.d(chPts[0].v, 'm')}.`} These are past times: IRCC reports how long it took to decide 80% of recent files from Mexico, from receipt of a complete application, excluding biometrics. Many Mexican travellers do not need a visa at all and can use an eTA instead, as explained below.`,
    faqs: [
      { q: 'Do Mexicans need a visa or an eTA to visit Canada in 2026?', a: 'Since 29 February 2024, most Mexican citizens need a visitor visa. Those flying to Canada can apply for an eTA instead if they held a Canadian visa in the last ten years or hold a valid United States non-immigrant visa. Travellers who do not meet those conditions, or who arrive by land or sea, apply for a visitor visa.' },
      { q: 'How long does a work permit from Mexico take?', a: `IRCC listed ${K.fmtTime(t('work'), 'en')} for a work permit applied for from Mexico on ${E.day(D)}, ${ord(rW.pos)} of ${E.n(rW.n)} countries with a figure. Our oldest copy, dated ${E.day(wk.firstDate!)}, showed ${E.d(wk.first!, 'w')}. Most work permits need a job offer and, in many cases, a positive labour market impact assessment obtained by the employer first, which takes time of its own.` },
      { q: 'Why is the super visa from Mexico slower than a visitor visa?', a: `The super visa asks for more: an invitation from a child or grandchild in Canada who meets an income threshold, private medical insurance and an immigration medical exam. On ${E.day(D)} it was ${K.fmtTime(t('super-visa'), 'en')} from Mexico, against ${K.fmtTime(t('visitor'), 'en')} for a visitor visa. In ${E.my(sv.firstDate!)} it stood at ${E.d(sv.first!)}.` },
    ],
    body: (h) => `
<h2>Quick lines for visiting, studying and working</h2>
<p>Three of the five lines IRCC publishes for Mexico are short. The visitor visa, at ${h.t(t('visitor'))}, ranks ${ord(rV.pos)} of ${h.n(rV.n)} countries. The study permit, at ${h.t(t('study'))}, ranks ${ord(rSt.pos)} of ${h.n(rSt.n)}, and the work permit, at ${h.t(t('work'))}, ${ord(rW.pos)} of ${h.n(rW.n)}. For a student admitted to a Canadian program or a worker with an employer waiting, those figures leave room to apply a couple of months ahead and still get a decision before the start date, provided biometrics are given quickly.</p>
<p>The visitor visa line has moved within a narrow band. It was ${h.d(vis.first!)} in our oldest copy (${h.day(vis.firstDate!)}), reached ${h.d(vis.max)} on ${h.day(vis.maxDate)} and is ${h.d(vis.last)} on ${h.day(vis.lastDate)}. Note that the copy of ${h.day(vis.firstDate!)} predates the return of the visa requirement for Mexican citizens, so the applications behind it were a smaller group than today.</p>
${h.hist(S.vis, { max: 12, unit: 'd', caption: 'Visitor visa from Mexico: dated readings, newest first. Date = update date published by IRCC.' })}
<h2>Visa or eTA</h2>
<p>Canada brought back a visa requirement for most Mexican citizens on 29 February 2024. An exception remains for air travel: a Mexican citizen who held a Canadian visa in the past ten years, or who holds a valid United States non-immigrant visa, can apply for an ${h.a('eta', 'eTA')} instead, usually approved within minutes. Everyone else, and anyone arriving by land or by sea, needs a ${h.a('visitor-visa', 'visitor visa')}, and the time above applies to them. The conditions are set out on ${h.src('eta', 'IRCC’s eTA page')}.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'visitor', c: C, m: 'none' }, t: 'From Mexico: your estimated decision date' })}
<h2>The super visa came down</h2>
<p>The ${h.a('super-visa', 'super visa')} from Mexico is the one long line. Our first copy with a figure, dated ${h.day(sv.firstDate!)}, gave ${h.d(sv.first!)}. The next copy, dated ${h.day(K.points(S.sv)[1].date)}, shows ${h.d(K.points(S.sv)[1].v)}, and the time is ${h.t(t('super-visa'))} today, ${ord(rS.pos)} of ${h.n(rS.n)} countries. No copy of IRCC’s file survives between ${h.my(K.HIST.readings.country[1].ircc)} and ${h.my(K.HIST.readings.country[2].ircc)}, so we cannot say when in that period the drop happened.</p>
<h2>Mexico among its neighbours</h2>
<p>The table sets Mexico beside other countries of the Americas, all with the figures IRCC published on ${h.day(D)}. Where IRCC has no figure for a country, the cell says so; we do not fill it in.</p>
${h.table(['Country of filing', 'Visitor visa', 'Study permit', 'Work permit', 'Super visa'], latam(h), `IRCC figures of ${h.day(D)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Work permit times from Mexico have shortened too: from ${h.d(wk.first!, 'w')} in ${h.my(wk.firstDate!)} to ${h.t(t('work'))} now, with a high of ${h.d(wk.max, 'w')} on ${h.day(wk.maxDate)}. The study permit followed a similar arc, peaking at ${h.d(st.max, 'w')} on ${h.day(st.maxDate)}.</p>
<h2>A child sponsorship without a current figure</h2>
<p>${childPub ? `IRCC lists ${h.t(t('child'))} for a ${h.a('dependent-child', 'dependent child sponsorship')} processed for Mexico.` : `For a ${h.a('dependent-child', 'dependent child sponsorship')}, IRCC no longer publishes a time for Mexico. Our archive holds ${h.n(chPts.length)} older figures: ${chPts.map((p) => `${h.d(p.v, 'm')} on ${h.day(p.date)}`).join(' and ')}. Without a current figure, the tool cannot estimate a date for that line, and the older values should not be read as today’s time.`} The way each value is read, and why a past time is not a forecast, is explained on the ${h.a('method', 'method page')}; every dated copy is listed on the ${h.a('history', 'history page')}.</p>
`,
  },
});
