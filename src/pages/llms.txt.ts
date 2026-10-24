/** llms.txt (RECETTE §21), généré à partir du registre des pages et de l'instantané du jour. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route, hasRoute } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en} / ${SITE_NAMES.fr}`, '',
    `> Independent calculators and open data on Immigration, Refugees and Citizenship Canada (IRCC) applications, in English and French: visitor visas, super visas, study and work permits, permit extensions, Express Entry and other permanent residence programs, family sponsorship, refugees, citizenship and PR cards. The reader copies the processing time shown on IRCC's Check processing times tool and the calculator turns it into an estimated decision date; pages add IRCC service standards and their results (${K.STD_YEARS.join(', ')}) and monthly volumes from IRCC open data (applications received, finalized and approved, permanent resident admissions, work and study permits, Express Entry invitations by score band, new citizens) from ${K.MONTHS[0]} to ${K.LAST.ops}. Contains information licensed under the Open Government Licence - Canada. Published by Radif Partners, not affiliated with or endorsed by IRCC or the Government of Canada; estimates only, not legal advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.fr}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [`- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`, ...(p.fr && hasRoute(p.id, 'fr') ? [`- [${p.fr.nav}](${SITE_URL}${route(p.id, 'fr')}) : ${p.fr.card}`] : [])]), '']),
    '## About', `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Méthode](${SITE_URL}${route('method', 'fr')})`, `- [About](${SITE_URL}${route('about', 'en')})`, `- [À propos](${SITE_URL}${route('about', 'fr')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
