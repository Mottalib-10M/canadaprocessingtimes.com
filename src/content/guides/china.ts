import { defineGuide, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* China: every figure read from IRCC's country file and our dated archive at build time. */
const C = 'CN';
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
const sv = K.fullTrend(SER['super-visa'])!, vi = K.fullTrend(SER.visitor)!, sd = K.fullTrend(SER.study)!, wk = K.fullTrend(SER.work)!, ch = K.fullTrend(SER.child)!;
const svAll = known('super-visa');
const svNone = K.countriesOf('super-visa').length - svAll.length;
const svOct = at(SER['super-visa'], R[R.length - 1].ircc)!, svJul = at(SER['super-visa'], R[2].ircc)!;
const gap = (K.daysOf(t('super-visa')) ?? 0) - (K.daysOf(t('visitor')) ?? 0);
const near = ['HK', 'TW', 'MO'].filter((c) => K.daysOf(t('visitor', c)) != null);
const nm = (c: string, h: Helpers) => (c === 'HK' ? 'Hong Kong' : c === 'MO' ? 'Macao' : h.cn(c));

function compare(h: Helpers) {
  return ['CN', ...near].map((c) => [nm(c, h), h.t(t('visitor', c)), K.daysOf(t('super-visa', c)) != null ? h.t(t('super-visa', c)) : 'no time published']);
}

export default defineGuide({
  id: 'china', group: 'countries', order: 102, country: C,
  tool: 'delai', toolArg: { g: 'visitor', c: C, only: 'visitor,super-visa,study,work,child' },
  related: ['super-visa', 'visitor-visa', 'parents-grandparents', 'study-permit', 'work-permit', 'dependent-child'],
  sources: ['ptimes-country', 'super-visa', 'visit', 'biometrics', 'wayback'],
  en: {
    slug: 'processing-times-china',
    nav: 'China', card: 'Super visa for parents, visitor, study and work lines from China',
    title: 'Super Visa and Visa Processing Times from China, 2026',
    description: 'Canadian super visa, visitor visa, study permit, work permit and child sponsorship times for applicants in mainland China in 2026, with dated IRCC history.',
    h1: 'Processing times for applications filed from China',
    intro: `Parents and grandparents applying from China wait ${K.fmtTime(t('super-visa'), 'en')} for a super visa in IRCC’s file of ${E.day(D)}, against ${K.fmtTime(t('visitor'), 'en')} for an ordinary visitor visa.`,
    resume: `A parent and grandparent super visa requested from China currently takes ${K.fmtTime(t('super-visa'), 'en')}, according to the country file IRCC published on ${E.day(D)}. Only ${E.n(svAll.length)} countries have a published super visa figure, and China is ${rank('super-visa')}; the middle value among them is ${E.d(mid('super-visa'))}. The line was at ${E.d(sv.first!)} in our oldest copy, dated ${E.day(sv.firstDate!)}, reached ${E.d(sv.max)} on ${E.day(sv.maxDate)} and stood at ${E.d(svJul)} on ${E.day(R[2].ircc)} ${svOct > svJul ? 'before rising again' : 'and has not risen since'}. A regular visitor visa from China takes ${K.fmtTime(t('visitor'), 'en')}, a study permit ${K.fmtTime(t('study'), 'en')}, a work permit ${K.fmtTime(t('work'), 'en')} and dependent child sponsorship ${K.fmtTime(t('child'), 'en')}. These are past times: the period within which IRCC finished 80% of recent applications from China, from receipt of a complete file and without biometrics. Hong Kong and Taiwan have their own lines in IRCC’s list. The tool above turns any line into an estimated decision date.`,
    faqs: [
      { q: 'How long does a super visa take for parents living in China?', a: `IRCC’s figure of ${E.day(D)} is ${K.fmtTime(t('super-visa'), 'en')} for applications made from mainland China, ${move(sv)} ${E.d(sv.prev!)} on ${E.day(sv.prevDate!)}. The time starts when IRCC receives the complete application, including the invitation letter and the insurance proof, and does not count the biometrics appointment or a medical exam.` },
      { q: 'Should parents in China apply for a super visa or a regular visitor visa?', a: `It depends on the stay. On ${E.day(D)} the visitor visa from China was ${K.fmtTime(t('visitor'), 'en')} and the super visa ${K.fmtTime(t('super-visa'), 'en')}. A visitor visa usually allows stays of up to six months per entry; a super visa allows up to five years per entry but needs an income commitment from the child or grandchild and private medical insurance.` },
      { q: 'Do applicants in Hong Kong use the China processing time?', a: `No. IRCC lists Hong Kong as its own place of filing. On ${E.day(D)} a visitor visa from Hong Kong read ${K.fmtTime(t('visitor', 'HK'), 'en')} and a super visa ${K.fmtTime(t('super-visa', 'HK'), 'en')}, against ${K.fmtTime(t('visitor'), 'en')} and ${K.fmtTime(t('super-visa'), 'en')} from mainland China. Pick the place where you live and apply from.` },
    ],
    body: (h) => `
<h2>The super visa line from China</h2>
<p>The super visa is the document for parents and grandparents of Canadian citizens and permanent residents who want long stays rather than a short trip. On ${h.day(D)} IRCC published ${h.t(t('super-visa'))} for applications from China. That is ${h.d(gap)} more than the visitor visa from the same country. In the file, ${h.n(svNone)} countries show no super visa time at all, so China is one of the few places where a figure can be checked week to week.</p>
${h.hist(SER['super-visa'], { max: 12 })}
<p>The archive holds the two older copies of ${h.day(sv.firstDate!)} and ${h.day(R[1].ircc)}, then a gap: no public copy of IRCC’s country file was saved between ${h.my(R[1].ircc)} and ${h.my(R[2].ircc)}, so we cannot say how the line moved in that period. From ${h.day(R[2].ircc)}, when it read ${h.d(svJul)}, the copies are close together and show the time ${svOct > svJul ? 'climbing' : 'moving'} to ${h.d(svOct)}. A rise over several readings is a better signal than any one week, but it remains a description of files already decided.</p>
<h2>What the super visa file must contain</h2>
<p>IRCC’s ${h.src('super-visa', 'super visa page')} sets the conditions. The applicant must be the parent or grandparent of a Canadian citizen or permanent resident. The child or grandchild signs a letter of invitation with a promise of financial support and shows that their household income meets the minimum IRCC sets. The applicant needs private medical insurance from a Canadian insurer, or an eligible foreign one, and usually an immigration medical exam. Each missing piece leads to a request for documents, and the clock does not run while IRCC waits for the answer.</p>
<p>The reward for the extra paperwork is length: up to five years per entry, against the shorter stays allowed on a visitor visa. The ${h.a('parents-grandparents', 'parent and grandparent sponsorship page')} covers the separate route to permanent residence, which is a far longer process.</p>
${h.mini('delai', { p: ['g', 'm'], d: { g: 'super-visa', c: C, m: 'none' }, t: 'Super visa from China: estimated decision date' })}
<h2>Mainland China, Hong Kong, Taiwan and Macao</h2>
<p>IRCC lists these places separately, and the figure follows where you live and apply, not the passport you hold. A Chinese citizen resident in Hong Kong uses the Hong Kong line.</p>
${h.table(['Place of filing', 'Visitor visa', 'Super visa'], compare(h), `IRCC country file of ${h.day(D)}.`, ['l', 'r', 'r'])}
<h2>Students, workers and children from China</h2>
<p>A study permit from China reads ${h.t(t('study'))}, ${rank('study')} countries; it was ${h.d(sd.prev!, 'w')} on ${h.day(sd.prevDate!)} and ${h.d(sd.first!, 'w')} in our oldest copy. Work permits are quicker at ${h.t(t('work'))}, ${rank('work')}, a long way below the ${h.d(wk.max, 'w')} recorded on ${h.day(wk.maxDate)}. Dependent child sponsorship takes ${h.t(t('child'))} and is ${rank('child')} countries with a figure. The visitor visa, at ${h.t(t('visitor'))}, peaked in our archive at ${h.d(vi.max)} on ${h.day(vi.maxDate)}.</p>
<p>For every line, biometrics come on top of the published time; IRCC explains who must give them on its ${h.src('biometrics', 'biometrics page')}. The ${h.a('method', 'method page')} sets out how each copy is dated.</p>
`,
  },
});
