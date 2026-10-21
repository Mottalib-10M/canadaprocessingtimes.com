import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Brésil : la page part du permis d'études, puis visite, travail et super visa. */
const C = 'BR';
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
const S = { vis: `c:visitor-outside-canada:${C}`, sv: `c:supervisa:${C}`, st: `c:study:${C}`, wk: `c:work:${C}` };
const vis = K.fullTrend(S.vis)!, sv = K.fullTrend(S.sv)!, st = K.fullTrend(S.st)!, wk = K.fullTrend(S.wk)!;
const stPts = K.points(S.st);
const rV = rank('visitor'), rS = rank('super-visa'), rSt = rank('study'), rW = rank('work');
const childPub = days('child') != null;
const PEERS = ['MX', 'CO', 'PE', 'CL', 'IN', 'CN', 'FR'].filter((c) => K.countriesOf('study').includes(c));
const fasterPeers = PEERS.filter((c) => (days('study', c) ?? Infinity) < (days('study') ?? 0));

function studyPeers(h: Helpers) {
  return [C, ...PEERS].map((c) => {
    const tr = K.fullTrend(`c:study:${c}`);
    return [c === C ? `<strong>${h.cn(c)}</strong>` : K.COUNTRY_PAGE[c] ? h.a(K.COUNTRY_PAGE[c], h.cn(c)) : h.cn(c), h.t(t('study', c)), tr?.first != null ? `${h.d(tr.first, 'w')} (${h.my(tr.firstDate!)})` : ''];
  });
}

export default defineGuide({
  id: 'brazil', group: 'countries', order: 108, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['study-permit', 'pgwp', 'visitor-visa', 'work-permit', 'eta', 'mexico'],
  sources: ['ptimes-country', 'study-permit', 'visit', 'eta', 'work-permit', 'super-visa', 'wayback'],
  en: {
    slug: 'brazil-processing-times',
    nav: 'Brazil', card: 'Study permit first, then visit, work and super visa',
    title: 'Study Permit Processing Time from Brazil, With Visas 2026',
    description: 'Study permit time for students applying from Brazil in 2026, with the visitor visa, work permit and super visa lines and each dated IRCC reading since 2024.',
    h1: 'Study permit and other processing times from Brazil',
    intro: `A study permit applied for from Brazil took ${K.fmtTime(t('study'), 'en')} in IRCC’s figures of ${E.day(D)}; a visitor visa took ${K.fmtTime(t('visitor'), 'en')}.`,
    resume: `A Canadian study permit requested from Brazil currently takes ${K.fmtTime(t('study'), 'en')}, according to IRCC’s country file of ${E.day(D)}. That places Brazil ${ord(rSt.pos)} of the ${E.n(rSt.n)} countries with a study permit figure, counted from the fastest. The time has varied: ${E.d(st.first!, 'w')} in our oldest copy, dated ${E.day(st.firstDate!)}, and a high of ${E.d(st.max, 'w')} on ${E.day(st.maxDate)}. For other applications from Brazil, a visitor visa takes ${K.fmtTime(t('visitor'), 'en')} (${ord(rV.pos)} of ${E.n(rV.n)}), a work permit ${K.fmtTime(t('work'), 'en')} (${ord(rW.pos)} of ${E.n(rW.n)}) and a parent or grandparent super visa ${K.fmtTime(t('super-visa'), 'en')} (${ord(rS.pos)} of ${E.n(rS.n)}). ${childPub ? `A dependent child sponsorship is listed at ${K.fmtTime(t('child'), 'en')}.` : 'IRCC publishes no figure for a dependent child sponsorship processed for Brazil.'} Each number is a past time, the span within which IRCC decided 80% of recent files from Brazil, counted from a complete application and not including biometrics. It is a guide for planning, not a promised date.`,
    faqs: [
      { q: 'How long does a study permit from Brazil take for a fall intake?', a: `IRCC’s figure of ${E.day(D)} is ${K.fmtTime(t('study'), 'en')} for a study permit applied for from Brazil. For a September start, that time has to fit between the letter of acceptance and the departure date, with biometrics on top. The line peaked at ${E.d(st.max, 'w')} on ${E.day(st.maxDate)}, so leaving a margin beyond the current figure is prudent.` },
      { q: 'Can Brazilians visit Canada with an eTA instead of a visa?', a: 'Brazilian citizens flying to Canada can apply for an eTA if they held a Canadian visa in the last ten years or currently hold a valid United States non-immigrant visa. Other Brazilian travellers, and those arriving by land or sea, need a visitor visa. The eTA is applied for online and is usually approved within minutes.' },
      { q: 'What documents slow down a study permit from Brazil?', a: 'The most common delays come from a missing provincial or territorial attestation letter, proof of funds that does not match the amount IRCC asks for, or a late biometrics appointment. IRCC counts its processing time from the day it receives a complete application, so any document requested afterwards adds to the wait.' },
    ],
    body: (h) => `
<h2>Study permit from Brazil, reading by reading</h2>
<p>For a Brazilian student, the ${h.a('study-permit', 'study permit')} line is the first figure to check. On ${h.day(D)} it stood at ${h.t(t('study'))}. Our first copy, from ${h.day(stPts[0].date)}, gave ${h.d(stPts[0].v, 'w')}; the next, from ${h.day(stPts[1].date)}, gave ${h.d(stPts[1].v, 'w')}. Since ${h.my(stPts[2].date)}, the line has stayed between ${h.d(Math.min(...stPts.slice(2).map((p) => p.v)), 'w')} and ${h.d(Math.max(...stPts.slice(2).map((p) => p.v)), 'w')}.</p>
<p>There is a long gap in that record. No public copy of IRCC’s country file was kept by the Internet Archive between ${h.my(K.HIST.readings.country[1].ircc)} and ${h.my(K.HIST.readings.country[2].ircc)}. The table therefore jumps from the second reading to the third, and we do not draw a line between them.</p>
${h.hist(S.st, { max: 12, unit: 'w', caption: 'Study permit from Brazil: dated readings, newest first. Date = update date published by IRCC.' })}
<h2>What changed for students since 2024</h2>
<p>Two rule changes shape the files behind these numbers. Since January 2024, most new study permit applicants must include a provincial or territorial attestation letter, issued by the province within its share of the national cap. And on 8 November 2024, IRCC ended the Student Direct Stream, so all study permit applications now go through the regular process. Neither change appears as a separate line in IRCC’s file: the study permit figure for Brazil covers every application decided from Brazil, whatever the program level. Details are on ${h.src('study-permit', 'IRCC’s study permit page')}.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'study', c: C, m: 'none' }, t: 'From Brazil: your estimated decision date' })}
<h2>Planning backwards from the start date</h2>
<p>A simple way to use the figure is to count backwards. Take the first day of classes, subtract the published time of ${h.t(t('study'))}, then subtract the weeks you need to book and attend a biometrics appointment and to arrange travel. The date you reach is the latest point to submit a complete application if the line holds. Because the figure covers only 80% of recent files, one application in five took longer, so a cautious plan adds a margin on top. The tool above does the forward version of this sum: enter the month IRCC received your file and it shows the date the published time points to.</p>
<h2>Brazil against other countries of origin</h2>
<p>Of the countries in the table below, ${fasterPeers.length ? `${fasterPeers.map((c) => h.cn(c)).join(', ')} ${fasterPeers.length === 1 ? 'has' : 'have'} a shorter study permit time than Brazil` : 'none has a shorter study permit time than Brazil'} on ${h.day(D)}. The last column shows the oldest value we hold for each, to show where each line started.</p>
${h.table(['Country of filing', 'Study permit now', 'Oldest copy kept'], studyPeers(h), `Study permit applied for from outside Canada, IRCC figure of ${h.day(D)}.`, ['l', 'r', 'r'])}
<h2>Visiting, working and the super visa</h2>
<p>The ${h.a('visitor-visa', 'visitor visa')} from Brazil is ${h.t(t('visitor'))}. It reached ${h.d(vis.max)} on ${h.day(vis.maxDate)}, then came back down. Many Brazilian travellers do not need it: those who held a Canadian visa in the last ten years or hold a valid United States non-immigrant visa can fly in with an ${h.a('eta', 'eTA')}. The ${h.a('work-permit', 'work permit')} is ${h.t(t('work'))}, after a high of ${h.d(wk.max, 'w')} on ${h.day(wk.maxDate)}. A student who finishes an eligible program can then apply for a ${h.a('pgwp', 'post-graduation work permit')} from inside Canada, which follows a different line from this one.</p>
<p>The ${h.a('super-visa', 'super visa')}, for parents and grandparents of Canadian citizens and permanent residents, is ${h.t(t('super-visa'))} from Brazil, ${ord(rS.pos)} of ${h.n(rS.n)} countries with a figure. Its oldest value in our archive is ${h.d(sv.first!)}, dated ${h.day(sv.firstDate!)}. ${childPub ? '' : `For a ${h.a('dependent-child', 'dependent child sponsorship')}, IRCC publishes no time for Brazil.`} How we read and store each figure is set out on the ${h.a('method', 'method page')}, and all dated copies are on the ${h.a('history', 'history page')}.</p>
`,
  },
});
