// src/commands/normalize.js
// Implements: design-tokens normalize [--dry-run] [--report <path>]
// Spec: docs/cli-spec.md §3
//
// Step outline (see cli-spec.md §3.5 for details):
//   1. Load and validate /tokens/raw/paper/tokens.paper.json
//   2. Split primitives into primitives.colors.json + primitives.numbers.json
//   3. Split semantic into foundation, feedback, interactive [D2]
//   4. Emit spacing.gap.json, spacing.padding.json, radius.json [D7, D8]
//   5. Emit typography roles, sizes, line-heights [D9-D11]
//   6. Stub density modes with identical values [D13, D17]
//   7. Preserve sourceExceptionApplied metadata when exceptions are used [D36, D38]
//   8. Emit _normalization-report.json

import { parseFlags } from '../shared/flags.js';

export async function run(argv) {
  const flags = parseFlags(argv, {
    'dry-run': { type: 'boolean', default: false },
    report: { type: 'string', default: null },
  });

  // TODO: implement per cli-spec.md §3.5
  //   - First call resolveExceptions() to get the resolved exception set
  //   - Read /tokens/raw/paper/tokens.paper.json
  //   - Split the canonical paper source into normalized family files
  //   - Emit $extensions["leadbank.sourceExceptionApplied"] if paper source records a tiebreak [D38]
  throw new Error(
    `'normalize' not yet implemented. ` +
    `See docs/cli-spec.md §3 for the contract. Flags parsed: ${JSON.stringify(flags)}`
  );
}
