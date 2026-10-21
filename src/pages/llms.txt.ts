/** llms.txt (RECETTE §21), généré à partir du registre des pages et de l'instantané du jour. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route, hasRoute } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const D = K.L.dates;
  const lines = [
    `# ${SITE_NAMES.en} / ${SITE_NAMES.fr}`, '',
    `> Processing times published by Immigration, Refugees and Citizenship Canada (IRCC), in English and French: visitor visas, super visas, study and work permits by country of filing, permit extensions with IRCC's weekly queue, Express Entry and other permanent residence programs, family sponsorship, refugees, citizenship and PR cards, with IRCC's forward-looking queue by month of filing. Every IRCC update is archived with its date since ${K.firstReading('noncountry')} (older updates from Internet Archive copies, each cited with its capture date). Calculators turn a filing date into an estimated decision date, show the trend and count physical presence for citizenship. Latest IRCC updates: country times ${D.country}, forward-looking times ${D.flpt}, weekly extension queues ${D.tr}. Independent site published by Radif Partners, not affiliated with IRCC or the Government of Canada; estimates only, not legal advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.fr}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [`- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`, ...(p.fr && hasRoute(p.id, 'fr') ? [`- [${p.fr.nav}](${SITE_URL}${route(p.id, 'fr')}) : ${p.fr.card}`] : [])]), '']),
    '## About', `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Méthode](${SITE_URL}${route('method', 'fr')})`, `- [About](${SITE_URL}${route('about', 'en')})`, `- [À propos](${SITE_URL}${route('about', 'fr')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
