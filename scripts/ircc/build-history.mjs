/**
 * Reconstitue l'historique antérieur à notre premier relevé à partir des copies publiques de la Wayback Machine
 * (web.archive.org), une capture par date publiée par IRCC, chacune citée par son horodatage. Aucun point n'est
 * inventé : une date sans capture n'a pas de point. Usage : node scripts/ircc/build-history.mjs [depuis=20240101]
 */
import { FILES, API_BASE, getJSON } from './lib.mjs';
import { load, save, addReading } from './history.mjs';
import { writeRecent } from './recent.mjs';

const from = process.argv[2] ?? '20240101';
const CDX = 'https://web.archive.org/cdx/search/cdx';
const h = load();
for (const kind of ['country', 'noncountry', 'flpt', 'tr']) {
  const url = `${API_BASE}${FILES[kind]}`.replace('https://', '');
  const rows = await getJSON(`${CDX}?url=${encodeURIComponent(url)}&output=json&fl=timestamp,digest&filter=statuscode:200&from=${from}`);
  const seen = new Set(); const caps = [];
  for (const [ts, dg] of rows.slice(1)) if (!seen.has(dg)) { seen.add(dg); caps.push(ts); }
  let added = 0;
  for (const ts of caps) {
    try {
      const json = await getJSON(`https://web.archive.org/web/${ts}id_/https://${url}`, 4);
      if (addReading(h, kind, json, `web.archive.org/web/${ts}`)) added++;
    } catch (e) { console.warn(`  capture ${ts} illisible : ${e.message}`); }
  }
  console.log(`${kind} : ${caps.length} captures distinctes, ${added} relevé(s) ajouté(s)`);
  save(h);
  writeRecent(h);
}
