import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const failures = [];
let checked = 0;
async function checkLink(file, value) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return;
  const page = path.relative(root, file).split(path.sep).join('/');
  const url = new URL(value.replaceAll('&amp;', '&'), `https://portfolio.local/${page}`);
  let target = path.join(root, decodeURIComponent(url.pathname));
  try {
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    await stat(target);
    if (url.hash && target.endsWith('.html')) {
      const html = await readFile(target, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      if (!html.includes(`id="${id}"`)) throw new Error(`missing anchor ${id}`);
    }
    checked++;
  } catch (error) { failures.push(`${page}: ${value} (${error.message})`); }
}
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!/\.(html|css)$/.test(entry.name)) continue;
    const text = await readFile(file, 'utf8');
    const references = entry.name.endsWith('.html') ? text.matchAll(/(?:href|src)="([^"]+)"/g) : text.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g);
    for (const match of references) await checkLink(file, match[1]);
    if (entry.name.endsWith('.html') && /tel:|(?:\+82[ -]?10|010)[ -]?\d{4}[ -]?\d{4}/.test(text)) failures.push(`${file}: phone number found`);
  }
}
await visit(root);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Checked ${checked} local links and assets; no phone numbers in public HTML.`);
