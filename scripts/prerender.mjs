// Pre-render the JSX pages (home + services) to static HTML.
// Run after editing anything in /site:  node scripts/prerender.mjs
// Requires: npm i @babel/core @babel/preset-react react react-dom  (dev only, not deployed)
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const babel = require('@babel/core');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(root, f), s);

// Build one VM context in which all site JSX runs, like the browser did.
const ctx = { React, console };
ctx.window = ctx;              // Object.assign(window, {...}) => bare globals
vm.createContext(ctx);

const compile = src => babel.transformSync(src, { presets: [['@babel/preset-react', { runtime: 'classic', development: false }]] }).code;

for (const f of ['site/tokens.jsx', 'site/sections-1.jsx', 'site/sections-2.jsx', 'site/sections-3.jsx', 'site/service-data.jsx', 'site/service-page.jsx']) {
  vm.runInContext(compile(read(f)), ctx, { filename: f });
}
// app.jsx defines Site() then mounts — strip the mount line.
vm.runInContext(compile(read('site/app.jsx').replace(/ReactDOM\.createRoot[\s\S]*$/, '')), ctx, { filename: 'site/app.jsx' });

const renderRoot = el => '<div id="root">' + ReactDOMServer.renderToStaticMarkup(el) + '</div>';

// Replace <div id="root">…</div> through the trailing scripts with static markup.
function splice(file, markup) {
  const h = read(file);
  const start = h.indexOf('<div id="root">');
  const end = h.lastIndexOf('</body>');
  if (start === -1 || end === -1) throw new Error('anchors not found in ' + file);
  write(file, h.slice(0, start) + markup + '\n\n</body>\n</html>\n');
  console.log('rendered', file);
}

splice('index.html', renderRoot(React.createElement(ctx.Site)));

const slugs = ['web-development', 'ppc', 'tracking', 'business-software', 'optimization', 'analytics', 'automation'];
for (const slug of slugs) {
  splice(`services/${slug}.html`, renderRoot(React.createElement(ctx.ServicePage, { slug })));
}
console.log('done — pages are now fully static (no client-side React/Babel)');
