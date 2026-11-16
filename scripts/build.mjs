import { cp, mkdir, readFile, readdir, rm, lstat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== 'dist') throw new Error('Invalid build output');
try {
  if ((await lstat(output)).isSymbolicLink()) throw new Error('Build output must not be a symlink');
  await rm(output, { recursive: true });
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(output, { recursive: true });
await cp(path.join(root, 'src/pages'), output, { recursive: true });
await cp(path.join(root, 'public'), output, { recursive: true });
await cp(path.join(root, 'src/styles'), path.join(output, 'assets/css'), { recursive: true });
await cp(path.join(root, 'src/scripts'), path.join(output, 'assets/js'), { recursive: true });
const sidebar = await readFile(path.join(root, 'src/components/sidebar.html'), 'utf8');
const footer = await readFile(path.join(root, 'src/components/footer.html'), 'utf8');
let count = 0;
async function render(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await render(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const relative = path.relative(output, file).split(path.sep).join('/');
    const depth = relative.split('/').length - 1;
    const prefix = depth ? '../'.repeat(depth) : './';
    let html = (await readFile(file, 'utf8')).replace('{{SIDEBAR}}', sidebar).replace('{{FOOTER}}', footer);
    for (const match of html.matchAll(/\{\{SECTION:([\w-]+)\}\}/g)) {
      const section = await readFile(path.join(root, 'src/sections', `${match[1]}.html`), 'utf8');
      html = html.replace(match[0], section);
    }
    const routes = { ABOUT: 'about/index.html', REPORTS: 'reports/index.html', FINANCIAL: 'reports/financial-analysis/index.html', CERTIFICATE: 'activities/certificate/index.html' };
    for (const [name, route] of Object.entries(routes)) {
      const exact = relative === route;
      const active = exact || (name === 'REPORTS' && relative.startsWith('reports/'));
      html = html.replaceAll(`{{${name}_ACTIVE}}`, active ? ' active' : '').replaceAll(`{{${name}_CURRENT}}`, exact ? ' aria-current="page"' : '');
    }
    html = html.replaceAll('{{ROOT}}', prefix).replaceAll('{{HOME}}', depth ? prefix : '');
    if (/\{\{[^}]+\}\}/.test(html)) throw new Error(`Unresolved template in ${relative}`);
    await writeFile(file, html);
    count++;
  }
}
await render(output);
console.log(`Built ${count} pages in dist/`);
