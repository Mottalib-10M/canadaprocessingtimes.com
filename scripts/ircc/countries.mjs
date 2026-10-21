/**
 * Noms des pays des fichiers IRCC, en anglais et en français, figés dans src/data/ircc/countries.json.
 * Figés plutôt que calculés dans le navigateur : Intl.DisplayNames ne rend pas exactement les mêmes noms dans
 * Node et dans chaque navigateur, et un nom différent casse l'hydratation des simulateurs.
 */
import fs from 'node:fs';
const OVERRIDE = { PS: { en: 'Gaza', fr: 'Gaza' }, WB: { en: 'West Bank', fr: 'Cisjordanie' }, CA: { en: 'Canada', fr: 'Canada' } };
export function writeCountries(latest) {
  const codes = new Set();
  for (const byC of Object.values(latest.country ?? {})) for (const c of Object.keys(byC)) codes.add(c);
  const en = new Intl.DisplayNames(['en-CA'], { type: 'region' }), fr = new Intl.DisplayNames(['fr-CA'], { type: 'region' });
  const name = (dn, c, l) => OVERRIDE[c]?.[l] ?? (() => { try { return dn.of(c) ?? c; } catch { return c; } })();
  const out = Object.fromEntries([...codes].sort().map((c) => [c, { en: name(en, c, 'en'), fr: name(fr, c, 'fr') }]));
  fs.writeFileSync(new URL('../../src/data/ircc/countries.json', import.meta.url), `${JSON.stringify(out)}\n`);
  return Object.keys(out).length;
}
