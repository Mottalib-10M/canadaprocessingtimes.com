import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  fr: { home: 'Délais de traitement au Canada', method: 'Méthode', about: 'À propos', widget: 'Intégrer le simulateur', contact: 'Contact', editorial: 'Politique éditoriale', privacy: 'Confidentialité', terms: 'Mentions légales', cookies: 'Cookies' },
  en: { home: 'Canada processing times', method: 'Method', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
export const GROUPS: Array<{ id: Group; label: Record<Locale, string> }> = [
  { id: 'visit', label: { fr: 'Visiter', en: 'Visit' } },
  { id: 'study', label: { fr: 'Études', en: 'Study' } },
  { id: 'work', label: { fr: 'Travail', en: 'Work' } },
  { id: 'pr', label: { fr: 'Résidence permanente', en: 'Permanent residence' } },
  { id: 'family', label: { fr: 'Famille et réfugiés', en: 'Family and refugees' } },
  { id: 'cit', label: { fr: 'Citoyenneté', en: 'Citizenship' } },
  { id: 'tools', label: { fr: 'Rondes et historique', en: 'Draws and history' } },
  { id: 'countries', label: { fr: 'Par pays', en: 'By country' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? guideById(id)?.en.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
/** Pages d'un groupe qui existent dans la langue (le français ne couvre qu'une partie des pays). */
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  // Menu : les familles de demandes ; les pays et les outils vont au pied de page et sur l'accueil.
  const merge: Array<{ label: Record<Locale, string>; groups: Group[] }> = [
    { label: { fr: 'Visiter, étudier', en: 'Visit and study' }, groups: ['visit', 'study'] },
    { label: { fr: 'Travailler', en: 'Work' }, groups: ['work'] },
    { label: { fr: 'Résidence permanente', en: 'Permanent residence' }, groups: ['pr', 'family'] },
    { label: { fr: 'Citoyenneté, rondes', en: 'Citizenship, draws' }, groups: ['cit', 'tools'] },
    { label: { fr: 'Par pays', en: 'By country' }, groups: ['countries'] },
  ];
  return merge.map((m) => ({ label: m.label[lang], links: m.groups.flatMap((g) => inGroup(g, lang)) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  { label: lang === 'fr' ? 'Outils' : 'Tools', links: inGroup('tools', lang).concat(inGroup('cit', lang)) },
  { label: lang === 'fr' ? 'Ce site' : 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Tous les pays suivis, à un clic de toute page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => inGroup('countries', lang);
