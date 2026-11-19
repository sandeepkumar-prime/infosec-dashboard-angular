/**
 * `npm start` for any Node version.
 *
 *  - Node 16 or older: runs `ng serve` (live reload).
 *  - Node 17 or newer: `ng serve` cannot run there (webpack-dev-server 3 needs the removed
 *    `http_parser` module), so this runs `ng build --watch` and serves the output with a small
 *    built-in static server. After a code change, refresh the browser.
 *
 * Usage: npm start [-- --port 4300]
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { runNg, NODE_MAJOR } = require('./ng');

const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const PORT = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) : 4200;

if (NODE_MAJOR <= 16) {
  runNg(['serve', ...args]).on('exit', code => process.exit(code || 0));
} else {
  const DIST = path.join(__dirname, '..', 'dist', 'securescope-360');
  const TYPES = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
    '.svg': 'image/svg+xml', '.map': 'application/json', '.ico': 'image/x-icon', '.png': 'image/png'
  };

  console.log(`Node ${process.versions.node}: using "ng build --watch" + static server (ng serve needs Node <= 16).`);
  const build = runNg(['build', '--watch']);
  build.on('exit', code => process.exit(code || 0));

  http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.normalize(path.join(DIST, urlPath));
    if (!file.startsWith(DIST)) {
      res.writeHead(403);
      return res.end();
    }
    // SPA fallback: unknown paths (e.g. /reports/F-1001) get index.html.
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(DIST, 'index.html');
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        return res.end('Build in progress - refresh in a few seconds.');
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  }).listen(PORT, () => console.log(`\n  App: http://localhost:${PORT}/  (refresh after the build finishes)\n`));

  process.on('SIGINT', () => { build.kill('SIGINT'); process.exit(0); });
}
