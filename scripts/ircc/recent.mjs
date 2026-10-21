/**
 * Extrait léger de l'historique pour les simulateurs (src/data/ircc/recent.json), chargé dans le navigateur :
 * tous les relevés par pays, prospectifs et hebdomadaires, et les 52 derniers relevés « sans pays » (un an).
 * Les pages, rendues au build, lisent l'historique complet.
 */
import fs from 'node:fs';
const KEEP = { country: Infinity, noncountry: 52, flpt: Infinity, tr: Infinity };
const fileOf = (k) => (k.startsWith('c:') ? 'country' : k.startsWith('n:') ? 'noncountry' : k.startsWith('t:') || k === 'w:SP-EXT' || k === 'w:WP-EXT' ? 'tr' : 'flpt');
export function writeRecent(h) {
  const dates = {}, cut = {};
  for (const [f, R] of Object.entries(h.readings)) { cut[f] = Math.max(0, R.length - KEEP[f]); dates[f] = R.slice(cut[f]).map((r) => r.ircc); }
  const s = {};
  for (const [k, v] of Object.entries(h.s)) {
    if (k.startsWith('c:') && !/^c:(visitor-outside-canada|supervisa|study|work|child_dependent):/.test(k)) continue;
    const vals = v.slice(cut[fileOf(k)]);
    if (vals.some((x) => x != null)) s[k] = vals;
  }
  fs.writeFileSync(new URL('../../src/data/ircc/recent.json', import.meta.url), `${JSON.stringify({ dates, s })}\n`);
}
