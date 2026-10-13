// Regenerates registry.json from src/components/ui, src/lib and src/hooks,
// reading each file's imports for its npm and registry dependencies, then
// runs `shadcn build` to write public/r/. Run with `npm run registry:build`.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const NAMESPACE = '@ns';
const NPM = ['class-variance-authority', 'clsx', 'tailwind-merge', '@nativescript/canvas-svg'];

const sources = [
  { dir: 'src/lib', type: 'registry:lib', only: ['utils.ts', 'slot.tsx', 'theme.ts'] },
  { dir: 'src/hooks', type: 'registry:hook' },
  { dir: 'src/components/ui', type: 'registry:ui' },
];

// Dependencies a file needs but doesn't import: chart.tsx draws with <svg>,
// which src/dom.ts registers from @nativescript/canvas-svg.
const EXTRA = {
  chart: {
    dependencies: ['@nativescript/canvas-svg'],
    description: 'Bar, line and area charts drawn with @nativescript/canvas-svg. Register <svg> as src/dom.ts does.',
  },
};

const title = (name) =>
  name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');

const items = [];
for (const { dir, type, only } of sources) {
  for (const file of fs.readdirSync(dir).sort()) {
    if (!/\.tsx?$/.test(file) || (only && !only.includes(file))) continue;
    const name = path.basename(file).replace(/\.tsx?$/, '');
    const source = fs.readFileSync(path.join(dir, file), 'utf8');
    const imports = [...source.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
    const registryDependencies = [
      ...new Set(
        imports
          .filter((i) => /^@\/(lib|hooks|components\/ui)\//.test(i))
          .map((i) => `${NAMESPACE}/${path.basename(i)}`)
          .filter((dep) => dep !== `${NAMESPACE}/${name}`),
      ),
    ];
    const extra = EXTRA[name] ?? {};
    const dependencies = [...new Set([...NPM.filter((pkg) => imports.includes(pkg)), ...(extra.dependencies ?? [])])];
    items.push({
      name,
      type,
      title: title(name),
      description: extra.description ?? `${title(name)} for NativeScript (MasonKit).`,
      ...(dependencies.length && { dependencies }),
      ...(registryDependencies.length && { registryDependencies }),
      files: [{ path: `${dir}/${file}`, type }],
    });
  }
}

fs.writeFileSync(
  'registry.json',
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'ns',
      homepage: 'https://github.com/triniwiz/nativescript-desktop-starter-template-shadcn',
      items,
    },
    null,
    2,
  ) + '\n',
);
console.log(`registry.json: ${items.length} items`);
execSync('npx -y shadcn@latest build', { stdio: 'inherit' });

// shadcn copies each file's content as checked out; on Windows (autocrlf)
// that's CRLF. Normalize to LF so the output is the same on every machine.
const OUT = 'public/r';
for (const file of fs.readdirSync(OUT)) {
  if (!file.endsWith('.json')) continue;
  const target = path.join(OUT, file);
  const text = fs.readFileSync(target, 'utf8');
  const normalized = text.replaceAll('\\r\\n', '\\n').replaceAll('\r\n', '\n');
  if (normalized !== text) fs.writeFileSync(target, normalized);
}
