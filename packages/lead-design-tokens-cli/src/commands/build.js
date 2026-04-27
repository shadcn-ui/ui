// src/commands/build.js
// Implements: design-tokens build [--input <path>] [--out <path>]
// Spec: docs/cli-spec.md §5
//
// v1 scope (this file):
//   - Reads a single normalized-token JSON file.
//   - Emits one CSS file at <out> containing a :root { ... } block of
//     flattened CSS custom properties (one per leaf token).
//   - Stamps a header with version + "generated, do not edit" warning.
//
// Out of v1 scope (tracked for v2):
//   - token-types.d.ts, tailwind.tokens.ts, DESIGN.md, CHANGELOG.md.
//   - Density / theme mode cascades. v1 emits a single :root block; the
//     spec says density blocks emit identical values in v1 anyway [D17],
//     so the value is purely structural and is deferred without loss.
//   - Lint precondition. The spec requires `lint` to pass first; that
//     command is still a stub. v1 builds whatever the input file says.
//   - Reading from /tokens/normalized/. v1 takes any JSON file via
//     --input, so callers can point it at a fixture during development
//     and at /tokens/normalized/ once normalize lands.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { parseFlags } from "../shared/flags.js";
import { flattenTokens, renderCssFile } from "../shared/build-css.js";
import { readPackageVersion } from "../shared/version.js";

const DEFAULT_INPUT = "test/fixtures/tokens.normalized.fixture.json";
const DEFAULT_OUT = "../lead-ui/src/generated/tokens.css";

export async function run(argv) {
  const flags = parseFlags(argv, {
    input: { type: "string", default: DEFAULT_INPUT },
    out: { type: "string", default: DEFAULT_OUT },
  });

  const cwd = process.cwd();
  const inputPath = resolve(cwd, flags.input);
  const outPath = resolve(cwd, flags.out);

  let raw;
  try {
    raw = await readFile(inputPath, "utf8");
  } catch (err) {
    throw new Error(
      `build: failed to read input "${flags.input}" — ${err.message}`
    );
  }

  let tokens;
  try {
    tokens = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `build: input "${flags.input}" is not valid JSON — ${err.message}`
    );
  }

  const pairs = flattenTokens(tokens);
  if (pairs.length === 0) {
    throw new Error(`build: input "${flags.input}" produced zero tokens.`);
  }

  const version = await readPackageVersion();
  const css = renderCssFile(pairs, {
    version,
    generator: "design-tokens build",
    header: `source: ${flags.input}`,
  });

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, css, "utf8");

  console.log(
    `build: wrote ${pairs.length} CSS variables -> ${flags.out}`
  );
  return 0;
}
