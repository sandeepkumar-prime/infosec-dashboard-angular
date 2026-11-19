/**
 * Runs the Angular CLI with the given arguments.
 * On Node 17+ it adds --openssl-legacy-provider, which webpack 4 (Angular 10) needs.
 */
const { spawn } = require('child_process');

const NODE_MAJOR = parseInt(process.versions.node.split('.')[0], 10);
const NG_BIN = require.resolve('@angular/cli/bin/ng');

function runNg(args, extraEnv) {
  const env = { ...process.env, ...extraEnv };
  if (NODE_MAJOR >= 17 && !/openssl-legacy-provider/.test(env.NODE_OPTIONS || '')) {
    env.NODE_OPTIONS = ((env.NODE_OPTIONS || '') + ' --openssl-legacy-provider').trim();
  }
  return spawn(process.execPath, [NG_BIN, ...args], { stdio: 'inherit', env });
}

module.exports = { runNg, NODE_MAJOR };

if (require.main === module) {
  runNg(process.argv.slice(2)).on('exit', code => process.exit(code || 0));
}
