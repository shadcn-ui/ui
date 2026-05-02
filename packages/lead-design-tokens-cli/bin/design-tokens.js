#!/usr/bin/env node
// bin/design-tokens.js
// Thin dispatcher. Each command owns its own argv parsing for now — we'll
// factor out a shared flag parser once the commands stabilize.

import { run as runImport } from '../src/commands/import.js';
import { run as runNormalize } from '../src/commands/normalize.js';
import { run as runLint } from '../src/commands/lint.js';
import { run as runBuild } from '../src/commands/build.js';
import { run as runCheckExceptions } from '../src/commands/check-exceptions.js';
import { run as runCheckDecisions } from '../src/commands/check-decisions.js';

const [, , command, ...args] = process.argv;

const commands = {
  'import': runImport,
  'normalize': runNormalize,
  'lint': runLint,
  'build': runBuild,
  'check-exceptions': runCheckExceptions,
  'check-decisions': runCheckDecisions,
};

const usage = `
design-tokens <command> [options]

Commands:
  import             Snapshot token source into /tokens/raw/.
                       --from paper (default): snapshot paper token source, seed authored files.
                       --from figma --figma-export <path>: snapshot a local Figma variables JSON export.
  normalize          Transform raw token source into normalized tokens.
                       --from figma (default): convert /tokens/raw/figma/variables.raw.json
                         into /tokens/normalized/tokens.json (consumed by 'build').
                       --from paper: not yet implemented.
  lint               Validate normalized tokens against design-system rules.
  build              Emit consumer artifacts (CSS, types, Tailwind, DESIGN.md).
  check-exceptions   Parse and validate /tokens/authored/sourceExceptions.json.
  check-decisions    Validate [D##] references across docs resolve to the decisions log.

See docs/cli-spec.md for the full contract.
`.trim();

if (!command || command === '--help' || command === '-h') {
  console.log(usage);
  process.exit(command ? 0 : 1);
}

const handler = commands[command];
if (!handler) {
  console.error(`Unknown command: ${command}`);
  console.error(usage);
  process.exit(2);
}

try {
  const exitCode = await handler(args);
  process.exit(exitCode ?? 0);
} catch (err) {
  console.error(`${command} failed:`, err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
}
