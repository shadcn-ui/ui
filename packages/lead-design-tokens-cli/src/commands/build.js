// src/commands/build.js
// Implements: design-tokens build [--out <path>]
// Spec: docs/cli-spec.md §5
//
// Emits (see cli-spec.md §5.4):
//   /generated/tokens.css            CSS custom properties, mode-cascaded
//   /generated/token-types.d.ts      TypeScript types
//   /generated/tailwind.tokens.ts    Tailwind theme extension
//   /generated/token-reference.generated.md
//   /DESIGN.md                       Agent-facing token inventory [D32]
//
// Every output is stamped with version header [D26].

import { parseFlags } from '../shared/flags.js';

export async function run(argv) {
  const flags = parseFlags(argv, {
    out: { type: 'string', default: './generated' },
  });

  // TODO: implement per cli-spec.md §5.5
  //   - Verify lint passed (or was explicitly skipped with --force)
  //   - Read version from package.json (or tokens/version.json when we decide)
  //   - Emit all artifacts with version header
  //   - Generate DESIGN.md from normalized state
  throw new Error(
    `'build' not yet implemented. ` +
    `See docs/cli-spec.md §5 for the contract. Flags parsed: ${JSON.stringify(flags)}`
  );
}
