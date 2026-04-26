// src/commands/lint.js
// Implements: design-tokens lint [--fix] [--json]
// Spec: docs/cli-spec.md §4
//
// Rules (see cli-spec.md §4.4):
//   L1  Layer discipline [D1]
//   L2  Mode completeness [D3]
//   L3  Gap/padding drift — WARN ONLY [D7]
//   L4  Density affects only allowed tokens [D14, D16]
//   L5  Size floors — with sourceExceptions lookup [D15, D33, D36]
//   L6  Approved-pair contrast — explicit textSize × targetLevel thresholds [D19-D21]
//   L7  Typography drift — validates sourceExceptionApplied metadata + report [D11, D36, D38]
//   L8  Non-conformant components — warn only [D27]

import { parseFlags } from '../shared/flags.js';

export async function run(argv) {
  const flags = parseFlags(argv, {
    fix: { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
  });

  // TODO: implement per cli-spec.md §4
  //   Inputs [D36, D38]:
  //     /tokens/normalized/*.json
  //     /tokens/normalized/_normalization-report.json
  //     /tokens/authored/approvedPairs.json (+ schema)
  //     /tokens/authored/sourceExceptions.json (+ schema)
  //   Output: structured report, exit 1 on failures, 0 on warnings only.
  throw new Error(
    `'lint' not yet implemented. ` +
    `See docs/cli-spec.md §4 for the contract. Flags parsed: ${JSON.stringify(flags)}`
  );
}
