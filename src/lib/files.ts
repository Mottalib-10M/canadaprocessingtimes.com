/** Adresses des fichiers publiés par IRCC que le site relit. */
import type { Src } from './data';
const BASE = 'https://www.canada.ca/content/dam/ircc/documents/json/';
export const FILES_URL: Record<Src, string> = {
  country: `${BASE}data-ptime-en.json`, noncountry: `${BASE}data-ptime-non-country-en.json`, flpt: `${BASE}flpt-en.json`, tr: `${BASE}flpt-by-week-en.json`,
};
export const EE_URL = `${BASE}ee_rounds_123_en.json`;
