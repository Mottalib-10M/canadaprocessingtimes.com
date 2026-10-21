import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Nigeria : le visa de visiteur a fait le grand écart depuis 2024. Tout chiffre vient du fichier par pays d'IRCC. */
const C = 'NG';
const E = K.en;
const D = K.L.dates.country;
const R = K.HIST.readings.country.map((r) => r.ircc);
const t = (p: string, c = C) => K.readingOf(p, c).t;
const days = (p: string, c = C) => K.daysOf(t(p, c));
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
function rank(p: string, c = C) {
  const all = K.countriesOf(p).map((x) => K.daysOf(K.readingOf(p, x).t)).filter((x): x is number => x != null);
  const d = days(p, c);
  return { pos: d == null ? 0 : all.filter((x) => x < d).length + 1, n: all.length };
}
const S = { vis: `c:visitor-outside-canada:${C}`, sv: `c:supervisa:${C}`, st: `c:study:${C}`, wk: `c:work:${C}`, ch: `c:child_dependent:${C}` };
const vis = K.fullTrend(S.vis)!, sv = K.fullTrend(S.sv)!, st = K.fullTrend(S.st)!, wk = K.fullTrend(S.wk)!, ch = K.fullTrend(S.ch)!;
const vp = K.points(S.vis);
const lowAt = vp.findIndex((p) => p.date === vis.minDate);
const sinceLow = vp.slice(lowAt);
const risesSinceLow = sinceLow.filter((p, i) => i > 0 && p.v > sinceLow[i - 1].v).length;
const rV = rank('visitor'), rS = rank('super-visa'), rSt = rank('study'), rW = rank('work'), rC = rank('child');
const svQuicker = (days('super-visa') ?? 0) < (days('visitor') ?? 0);
const NEIGH = ['GH', 'SN', 'CM', 'KE', 'ZA'].filter((c) => K.countriesOf('visitor').includes(c));

function neighbours(h: Helpers) {
  return [C, ...NEIGH].map((c) => [
    c === C ? `<strong>${h.cn(c)}</strong>` : K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c),
    h.t(t('visitor', c)), h.t(t('super-visa', c)), h.t(t('study', c)), h.t(t('work', c)),
  ]);
}

export default defineGuide({
  id: 'nigeria', group: 'countries', order: 105, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['visitor-visa', 'super-visa', 'study-permit', 'work-permit', 'dependent-child', 'cameroon'],
  sources: ['ptimes-country', 'visit', 'super-visa', 'study-permit', 'work-permit', 'spouse', 'biometrics', 'wayback'],
  en: {
    slug: 'nigeria-processing-times',
    nav: 'Nigeria', card: 'Visitor visa swing since 2024, study, work, child',
    title: 'Processing Times from Nigeria: Visitor Visa, Permits 2026',
    description: 'Visitor visa, super visa, study and work permit and child sponsorship times for applications made from Nigeria in 2026, with each dated IRCC reading since 2024.',
    h1: 'Processing times for applications made from Nigeria',
    intro: `IRCC’s figures for Nigeria, dated ${E.day(D)}: visitor visa ${K.fmtTime(t('visitor'), 'en')}, study permit ${K.fmtTime(t('study'), 'en')}, work permit ${K.fmtTime(t('work'), 'en')}.`,
    resume: `A visitor visa applied for from Nigeria currently takes ${K.fmtTime(t('visitor'), 'en')}, according to the processing times IRCC published on ${E.day(D)}. That puts Nigeria ${ord(rV.pos)} of the ${E.n(rV.n)} countries with a figure, counted from the fastest. The line has travelled a long way: ${E.d(vis.first!)} in the oldest copy we hold, dated ${E.day(vis.firstDate!)}, then a low of ${E.d(vis.min)} on ${E.day(vis.minDate)}, and since that low it has gone up at ${E.n(risesSinceLow)} of the ${E.n(sinceLow.length - 1)} readings that followed. The other lines for Nigeria are a super visa at ${K.fmtTime(t('super-visa'), 'en')}, a study permit at ${K.fmtTime(t('study'), 'en')}, a work permit at ${K.fmtTime(t('work'), 'en')} and a dependent child sponsorship at ${K.fmtTime(t('child'), 'en')}. Each figure is a past time: how long IRCC took to finish 80% of the files it recently decided from Nigeria, counted from receipt of a complete application, with the biometrics appointment on top. It describes what happened to other applicants, not a promised date for yours.`,
    faqs: [
      { q: 'How long does a Canadian visitor visa from Nigeria take right now?', a: `IRCC’s figure dated ${E.day(D)} is ${K.fmtTime(t('visitor'), 'en')} for a visitor visa applied for from Nigeria. The lowest value in our archive was ${E.d(vis.min)} on ${E.day(vis.minDate)} and the highest ${E.d(vis.max)} on ${E.day(vis.maxDate)}. Count from the day IRCC received your complete application; giving fingerprints and a photo comes on top of that time.` },
      { q: 'Is a super visa from Nigeria quicker than a visitor visa?', a: `On ${E.day(D)} the super visa line for Nigeria was ${K.fmtTime(t('super-visa'), 'en')} against ${K.fmtTime(t('visitor'), 'en')} for an ordinary visitor visa. ${svQuicker ? 'So the super visa is currently the shorter of the two,' : 'So the ordinary visitor visa is currently the shorter of the two,'} although the super visa asks for more: a Canadian child or grandchild who meets the income test, private medical insurance and a medical exam.` },
      { q: 'Do Nigerian students wait longer than students from other countries?', a: `The study permit time from Nigeria is ${K.fmtTime(t('study'), 'en')}, which is ${ord(rSt.pos)} of the ${E.n(rSt.n)} countries with a figure on ${E.day(D)}. Ghana is at ${K.fmtTime(t('study', 'GH'), 'en')} and Kenya at ${K.fmtTime(t('study', 'KE'), 'en')}. The time runs from receipt of a complete application, so a missing document or a late biometrics appointment adds to it.` },
      { q: 'How long does sponsoring a dependent child living in Nigeria take?', a: `IRCC lists ${K.fmtTime(t('child'), 'en')} for a dependent child sponsorship processed for Nigeria, on ${E.day(D)}. Only ${E.n(rC.n)} countries have a published figure for this line, and Nigeria is ${ord(rC.pos)} of them. Our oldest copy, dated ${E.day(ch.firstDate!)}, showed ${E.d(ch.first!, 'm')}.` },
    ],
    body: (h) => `
<h2>A visitor visa line that fell, then climbed back</h2>
<p>No line for Nigeria has moved as much as the visitor visa. In the copy of IRCC’s file dated ${h.day(vis.firstDate!)}, the time was ${h.d(vis.first!)}. By ${h.day(vp[1].date)} it was ${h.d(vp[1].v)}, and the next copy we could find, dated ${h.day(vp[2].date)}, showed ${h.d(vp[2].v)}. The lowest value we hold is ${h.d(vis.min)}, on ${h.day(vis.minDate)}. From that low it rose at ${h.n(risesSinceLow)} of the ${h.n(sinceLow.length - 1)} following readings and reached ${h.d(vis.last)} on ${h.day(vis.lastDate)}.</p>
<p>The archive has a hole worth stating plainly. Between ${h.day(R[1])} and ${h.day(R[2])}, no public copy of the country file survives in the Internet Archive, so we cannot say what happened in those months: whether the time went down steadily or bounced in between. The table below lists only the readings that exist, each with the copy it comes from.</p>
${h.hist(S.vis, { max: 12, unit: 'd', caption: `Visitor visa from Nigeria: every dated reading we hold, newest first. Date = update date published by IRCC.` })}
<p>Why the swing? IRCC does not publish its reasons by country. What the figure reflects is the volume of files decided by the offices that handle Nigerian applications and how many of them needed extra checks. A rise over several readings, like the one since ${h.my(vis.minDate)}, usually means more files reached a decision that had been waiting a long time.</p>
<h2>Nigeria against all countries</h2>
<p>Placed in the full list, Nigeria is ${ord(rV.pos)} of ${h.n(rV.n)} for the visitor visa, ${ord(rS.pos)} of ${h.n(rS.n)} for the super visa, ${ord(rSt.pos)} of ${h.n(rSt.n)} for the study permit and ${ord(rW.pos)} of ${h.n(rW.n)} for the work permit, always counted from the shortest time. ${svQuicker ? `The super visa is the odd one out: at ${h.t(t('super-visa'))}, it is currently shorter than the plain ${h.a('visitor-visa', 'visitor visa')}.` : `The super visa, at ${h.t(t('super-visa'))}, sits close to the plain ${h.a('visitor-visa', 'visitor visa')}.`} Its own history ran from ${h.d(sv.first!)} in ${h.my(sv.firstDate!)} to ${h.d(sv.last)} now.</p>
<p>The comparison with other countries in the region helps read these numbers. Each line in the table is the figure IRCC published on ${h.day(D)} for applications made from that country.</p>
${h.table(['Country of filing', 'Visitor visa', 'Super visa', 'Study permit', 'Work permit'], neighbours(h), `IRCC figures of ${h.day(D)} for Nigeria and other African countries.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Study and work permits</h2>
<p>The ${h.a('study-permit', 'study permit')} line for Nigeria went from ${h.d(st.first!, 'w')} in ${h.my(st.firstDate!)} down to ${h.d(st.min, 'w')} on ${h.day(st.minDate)}, and stands at ${h.t(t('study'))} today. The ${h.a('work-permit', 'work permit')} line followed a similar path, from ${h.d(wk.first!, 'w')} to a low of ${h.d(wk.min, 'w')} on ${h.day(wk.minDate)}, then ${h.t(t('work'))} now. Both are counted in weeks by IRCC. When a figure stays flat for several readings in a row, it often means the office is deciding files at about the pace they arrive.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'From Nigeria: your estimated decision date' })}
<h2>Sponsoring a child in Nigeria</h2>
<p>Nigeria is one of only ${h.n(rC.n)} countries for which IRCC publishes a time for a ${h.a('dependent-child', 'dependent child sponsorship')}. The current figure is ${h.t(t('child'))}. It was ${h.d(ch.first!, 'm')} in ${h.my(ch.firstDate!)}, dropped to ${h.d(ch.min, 'm')} on ${h.day(ch.minDate)} and has gone back up since. This line counts the whole sponsorship, from the day IRCC receives the application to the decision on permanent residence, so it is measured in months rather than weeks.</p>
<h2>Which line applies to you</h2>
<p>The country is the one you apply from, not your passport. A Nigerian citizen who lives legally in Ghana, the United Kingdom or the United Arab Emirates and applies there falls under that country’s line. Nigerian citizens need a visa to visit Canada and cannot use an eTA, and every applicant from Nigeria gives biometrics, so the date in the tool is the date IRCC received the complete application plus the published time, with the appointment to add. How each figure is read and stored is set out on the ${h.a('method', 'method page')}, and all dated copies are on the ${h.a('history', 'history page')}.</p>
`,
  },
});
