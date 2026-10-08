import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

const result = await build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  minify: true,
  legalComments: 'none',
  platform: 'browser',
  format: 'iife',
  target: ['es2020'],
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.css': 'css' },
  outdir: 'standalone-build',
  entryNames: 'app',
  write: false,
});

const javascript = result.outputFiles.find((file) => file.path.endsWith('.js'))?.text;
const css = result.outputFiles.find((file) => file.path.endsWith('.css'))?.text;
if (!javascript || !css) throw new Error('Could not generate standalone JavaScript and CSS bundles.');

const document = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f4f4f6" />
    <meta name="description" content="Flyp property operations and task management" />
    <title>Flyp · Property tasks</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Roboto+Slab:wght@600;700;800&display=swap" rel="stylesheet" />
    <style>${css.replace(/<\/style/gi, '<\\/style')}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>${javascript.replace(/<\/script/gi, '<\\/script')}</script>
  </body>
</html>
`;

const outputPath = 'flyp-property-operations.html';
await writeFile(outputPath, document);
const stats = await readFile(outputPath, 'utf8');
console.log(`Created ${outputPath} (${(Buffer.byteLength(stats) / 1024 / 1024).toFixed(2)} MB).`);
