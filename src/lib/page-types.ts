/**
 * Une page = UN fichier de contenu (CONTRIBUTING-PAGES.md) : `src/content/guides/<id>.ts`, avec la
 * version française (`fr`) et la version anglaise (`en`) côte à côte. Routes, menus, pied de page,
 * sitemap, hreflang, schémas et liens internes lisent ces fichiers et rien d'autre.
 */
import type { Kit } from './kit';
import type { Lang } from './format';

export interface FAQ { q: string; a: string }
export interface MiniOpts { /** titre */ t?: string; /** champs montrés */ p?: string[]; /** valeurs par défaut */ d?: Record<string, number | string>; /** texte du lien */ c?: string }

export interface Helpers extends Kit {
  lang: Lang;
  /** Lien interne par id de page, dans la langue de la page. Id inconnu = test en échec. */
  a: (id: string, text: string) => string;
  /** Tableau ; les nombres sont formatés dans la langue, les chaînes insérées en HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Lien vers une source de params-2026.json (clé), page française ou anglaise selon la langue. */
  src: (key: string, text?: string) => string;
  ext: (url: string, text: string) => string;
  box: (title: string, html: string) => string;
  /** Mini-simulateur bâti sur un calculateur de tool-specs.ts. */
  mini: (kind: string, opts?: MiniOpts) => string;
  /** Formats de la langue de la page : nombre, date, mois et année, délai publié, jours dans une unité. */
  n: (x: number, d?: number) => string; day: (iso: string) => string; my: (iso: string) => string;
  t: (t: import('./data').Reading['t']) => string; d: (days: number, u?: string) => string;
  /** Nom d'un pays dans la langue. */
  cn: (code: string) => string;
  /** Tableau des relevés datés d'une série (historique complet), chaque ligne avec sa provenance citée. */
  hist: (series: string, opts?: { max?: number; unit?: string; caption?: string }) => string;
}

export type Group = 'visit' | 'study' | 'work' | 'pr' | 'family' | 'cit' | 'tools' | 'countries';

export interface LangPage {
  /** Segment d'URL, minuscules et tirets, sans accent. */
  slug: string;
  nav: string; card: string;
  /** 50 à 60 caractères, terme clé d'abord, année comprise (RECETTE §11). */
  title: string;
  /** 150 à 160 caractères, année comprise. */
  description: string;
  h1: string; intro: string;
  /** UN paragraphe de 120 mots ou plus : la réponse directe, chiffrée (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
}
export interface GuideDef {
  id: string; group: Group; order: number;
  /** Calculateur en tête : une clé de tool-specs.ts. */
  tool: string;
  toolArg?: Record<string, number | string>;
  related: string[];
  /** Clés de params-2026.json > sources. */
  sources: string[];
  /** Version française facultative : la page n'existe alors qu'en anglais (routes partielles). */
  fr?: LangPage; en: LangPage;
  /** Pays que décrit la page (pages par pays). */
  country?: string;
}
export const defineGuide = (p: GuideDef): GuideDef => p;
