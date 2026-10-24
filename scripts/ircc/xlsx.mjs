/**
 * Lecteur XLSX minimal, sans dépendance : une feuille de calcul = une archive ZIP de fichiers XML.
 * On lit le répertoire central de l'archive, on décompresse (zlib) xl/sharedStrings.xml et la première
 * feuille, et l'on rend les lignes sous forme de tableaux de valeurs (texte ou nombre, null si vide).
 * Suffit pour les fichiers « Operational Processing » d'IRCC (open.canada.ca), qui ne publient pas de CSV.
 */
import zlib from 'node:zlib';

function entries(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('xlsx : archive ZIP illisible');
  const n = buf.readUInt16LE(eocd + 10), off = buf.readUInt32LE(eocd + 16);
  const out = new Map();
  let p = off;
  for (let i = 0; i < n; i++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
    const nl = buf.readUInt16LE(p + 28), el = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), lho = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nl);
    out.set(name, { method, csize, lho });
    p += 46 + nl + el + cl;
  }
  return {
    has: (name) => out.has(name),
    read(name) {
      const e = out.get(name); if (!e) return null;
      const start = e.lho + 30 + buf.readUInt16LE(e.lho + 26) + buf.readUInt16LE(e.lho + 28);
      const data = buf.subarray(start, start + e.csize);
      return (e.method === 8 ? zlib.inflateRawSync(data) : data).toString('utf8');
    },
  };
}
const unxml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d))).replace(/&amp;/g, '&');
const colOf = (ref) => { let c = 0; for (const ch of ref.replace(/\d+/g, '')) c = c * 26 + ch.charCodeAt(0) - 64; return c - 1; };

/** Lignes de la première feuille : Array<Array<string|number|null>>. */
export function readXlsx(buf) {
  const z = entries(buf);
  const shared = [];
  const ss = z.read('xl/sharedStrings.xml');
  if (ss) for (const m of ss.matchAll(/<si>([\s\S]*?)<\/si>/g)) shared.push(unxml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')));
  const wb = z.read('xl/workbook.xml') ?? '';
  const rels = z.read('xl/_rels/workbook.xml.rels') ?? '';
  const rid = wb.match(/<sheet [^>]*r:id="([^"]+)"/)?.[1];
  const target = rid ? rels.match(new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"|Target="([^"]+)"[^>]*Id="${rid}"`)) : null;
  const path = target ? `xl/${(target[1] ?? target[2]).replace(/^\/?xl\//, '')}` : 'xl/worksheets/sheet1.xml';
  const xml = z.read(path) ?? z.read('xl/worksheets/sheet1.xml');
  if (!xml) throw new Error('xlsx : feuille introuvable');
  const rows = [];
  for (const r of xml.matchAll(/<row\b[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const row = [];
    for (const c of (r[1] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = c[1], inner = c[2] ?? '';
      const ref = attrs.match(/r="([A-Z]+\d+)"/)?.[1];
      const t = attrs.match(/t="([^"]+)"/)?.[1];
      const v = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      let val = null;
      if (t === 's' && v != null) val = shared[Number(v)];
      else if (t === 'inlineStr') val = unxml([...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join(''));
      else if (t === 'str') val = v != null ? unxml(v) : null;
      else if (v != null) val = Number(v);
      const i = ref ? colOf(ref) : row.length;
      while (row.length < i) row.push(null);
      row[i] = val;
    }
    rows.push(row);
  }
  return rows;
}
