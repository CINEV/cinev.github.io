import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from '../showcase-source/node_modules/prettier/index.mjs';
import { parsers } from '../showcase-source/node_modules/prettier/plugins/html.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const paths = process.argv.slice(2).filter(arg => arg !== '--check');
const files = paths.length ? paths : [
  'showcase-source/index.html',
  'dist/404.html',
  ...['', 'en/'].flatMap(language =>
    ['', 'archive/', 'poseshot/', 'shotloom/', 'a2p/', 'showcase/'].map(
      page => `dist/${language}${page}index.html`,
    ),
  ),
];
for (const file of files) {
  const path = resolve(root, file);
  const source = await readFile(path, 'utf8');
  const options = await prettier.resolveConfig(path);
  // Shotloom's exported document uses white-space: pre-wrap. Preserve its body
  // text exactly, including spaces and line breaks, while formatting the tags.
  const preserved = [];
  let input = source;
  if (file.replaceAll('\\', '/').includes('/shotloom/')) {
    const ast = await parsers.html.parse(source);
    const collect = (node, inBody = false) => {
      if (node.name === 'svg') return;
      inBody ||= node.name === 'body';
      if (inBody && node.kind === 'text') preserved.push(node.sourceSpan);
      for (const child of node.children ?? []) collect(child, inBody);
    };
    collect(ast);
    for (let i = preserved.length - 1; i >= 0; i--) {
      const { start, end } = preserved[i];
      preserved[i] = source.slice(start.offset, end.offset);
      input = input.slice(0, start.offset) + `CINEV_TEXT_${i}_END` + input.slice(end.offset);
    }
    options.htmlWhitespaceSensitivity = 'strict';
  }
  input = input.replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/g, (_, css) =>
    `<style>${css.replace(/^[ \t]+/gm, indent => indent.replaceAll('\t', '  '))}</style>`,
  );
  let formatted = await prettier.format(input, { ...options, filepath: path });
  formatted = formatted.replace(/CINEV_TEXT_(\d+)_END/g, (_, index) => preserved[Number(index)]);
  // Browsers move trailing document whitespace into the body. With pre-wrap,
  // Prettier's final newline would add a visible blank line below the footer.
  if (file.replaceAll('\\', '/').includes('/shotloom/')) formatted = formatted.trimEnd();
  if (source === formatted) continue;
  if (check) {
    console.error(`Needs formatting: ${file}`);
    process.exitCode = 1;
  } else {
    await writeFile(path, formatted);
    console.log(`Formatted: ${file}`);
  }
}
