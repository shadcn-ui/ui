# `@leadbank/design-tokens-cli`

Lead design system token pipeline — the CLI that transforms a paper-authored token library into normalized tokens, validates them, and emits consumer artifacts (CSS, types, Tailwind, `DESIGN.md`).

## Status

**Build pipeline v1 + paper-first scaffold.** Four commands are real and tested today:

- `import` snapshots `tokens/source/paper/` into `tokens/raw/paper/`, validates `tokens.paper.json`, writes a manifest, and seeds authored files.
- `check-exceptions` validates `/tokens/authored/sourceExceptions.json`.
- `check-decisions` validates `[D##]` references in the docs.
- **`build` (v1)** — reads a normalized-token JSON file and emits a single `tokens.css` artifact with a `:root { ... }` block of flattened CSS custom properties. See [`docs/cli-spec.md` §5](docs/cli-spec.md) for the full v2+ contract.

The remaining two (`normalize`, `lint`) have real signatures, real flag parsing, and detailed TODOs pointing at the spec — but throw `not implemented` when run.

### `build` v1 scope

**v1 supports:**

- `--input <path>` (default: `test/fixtures/tokens.normalized.fixture.json`) — any JSON file with a nested token tree. Leaves can be primitive strings/numbers or `{ value, ... }` wrappers (other fields reserved).
- `--out <path>` (default: `../lead-ui/src/generated/tokens.css`) — single CSS file output.
- Top-level groups sorted alphabetically; deterministic output.
- Header stamp with version + "DO NOT EDIT BY HAND" warning.
- Fail-fast errors for missing input, malformed JSON, or zero tokens.

**v1 does NOT support yet (deferred to v2):**

- `token-types.d.ts`, `tailwind.tokens.ts`, `DESIGN.md`, `CHANGELOG.md` artifacts.
- Density / theme cascades — single `:root` block only. (Spec §5.5 v1 emits identical density values anyway.)
- `lint` precondition. The spec says `build` should refuse to run if `lint` fails; that command is still a stub. v1 builds whatever the input file says.
- Reading directly from `/tokens/normalized/`. v1 takes any path via `--input`. Once `normalize` lands, point this at the normalized output instead of the fixture.

## Layout

```
.
├── bin/design-tokens.js       thin dispatcher
├── src/
│   ├── commands/
│   │   ├── import.js            REAL (see cli-spec.md §2)
│   │   ├── normalize.js         stub (see cli-spec.md §3)
│   │   ├── lint.js              stub (see cli-spec.md §4)
│   │   ├── build.js             REAL v1 (see cli-spec.md §5; v1 scope above)
│   │   ├── check-exceptions.js  REAL (see cli-spec.md §1.5)
│   │   └── check-decisions.js   REAL (see cli-spec.md §6.1)
│   └── shared/
│       ├── flags.js             tiny wrapper around node:util parseArgs
│       ├── dates.js             YYYY-QN and YYYY-MM-DD → instant in ET
│       ├── decisions.js         [D##] grammar parser
│       ├── build-css.js         flattenTokens + renderCssFile (build v1)
│       └── version.js           reads CLI version from package.json
├── schemas/
│   ├── approvedPairs.schema.json
│   ├── paperTokens.schema.json
│   └── sourceExceptions.schema.json
├── scripts/
│   └── validate-schemas.js      meta-check that schemas are well-formed
├── test/
│   ├── decisions.test.js        11 cases covering the grammar
│   ├── check-exceptions.test.js 16 cases incl. schema + DST + overdue
│   └── import.test.js           3 cases covering paper snapshots
├── docs/
│   ├── DESIGN-DECISIONS.md      (copy from authored source)
│   ├── DESIGN.md                (copy from authored source)
│   └── cli-spec.md              (copy from authored source)
├── tokens/
│   └── source/paper/
│       ├── tokens.paper.json     canonical paper source
│       └── sections/             human-readable library sections
└── package.json
```

## Running

```bash
npm install
npm test                    # run all unit tests (50 cases)
npm run lint:schemas        # meta-validate the authored-tier schemas
npm run check-decisions     # verify [D##] references resolve
npm run build               # build v1: emit ../lead-ui/src/generated/tokens.css from the fixture
node bin/design-tokens.js --help
node bin/design-tokens.js import --force
node bin/design-tokens.js check-exceptions --json
node bin/design-tokens.js build --input my-tokens.json --out my-tokens.css
```

## Paper authoring workflow

The paper library lives in `tokens/source/paper/`.

- Edit `tokens/source/paper/sections/*.md` for human-readable intent.
- Edit `tokens/source/paper/tokens.paper.json` for the canonical structured token values.
- Run `node bin/design-tokens.js import --force` to snapshot the source into `tokens/raw/paper/`.
- Edit `/tokens/authored/approvedPairs.json` for approved contrast pairs.
- Edit `/tokens/authored/sourceExceptions.json` only when a temporary source-data exception is intentional.

## What's next (implementation order recommendation)

1. **`normalize` primitives and semantic tokens** — convert `tokens/raw/paper/tokens.paper.json` into normalized DTCG-style files. When this lands, swap `build`'s default `--input` from the fixture to `/tokens/normalized/`.
2. **`normalize` spacing, radius, typography** — paper source already names canonical tokens, so this is mostly splitting files and preserving metadata.
3. **`lint`** — rules L1, L2, L3, L8 first (simplest). Then L4, L5 (needs exceptions), L7 (needs metadata), L6 (contrast math).
4. **`build` v2** — add `token-types.d.ts`, `tailwind.tokens.ts`, `DESIGN.md`; add density/theme cascades. v1 already emits `tokens.css`.

## Design decisions reflected here

- Single dispatcher in `bin/`, one file per command in `src/commands/`.
- Commands are pure functions (`export async function run(argv)`) so they can be composed, tested, or called from other stages.
- `resolveExceptions` and `checkDecisions` are exported separately from `run` so `normalize` and `lint` can call them directly without argv gymnastics.
- Paper source is intentionally structured JSON plus Markdown sections. The Markdown is for people; `tokens.paper.json` is for the CLI.
- No heavy dependencies. Ajv for schema validation, everything else is std-lib.
- ESM throughout (`"type": "module"`). Requires Node 20+ for stable `parseArgs` and Intl timezone behavior.

## Open questions (still)

1. Where does `package.json` live relative to `tokens/`? The CLI reads version from there; assumes repo root for now.
2. Tailwind v3 or v4? Affects `tailwind.tokens.ts` emission.
3. Distribution: npm publish under a Lead Bank scope? Private registry?
4. Do we want a `design-tokens doctor` command that runs all checks in sequence for a pre-commit hook? (Would be useful.)
