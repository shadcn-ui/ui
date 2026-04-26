# `@leadbank/design-tokens-cli`

Lead design system token pipeline — the CLI that transforms a paper-authored token library into normalized tokens, validates them, and emits consumer artifacts (CSS, types, Tailwind, `DESIGN.md`).

## Status

**Paper-first scaffold.** Three commands are real and tested/useful today:

- `import` snapshots `tokens/source/paper/` into `tokens/raw/paper/`, validates `tokens.paper.json`, writes a manifest, and seeds authored files.
- `check-exceptions` validates `/tokens/authored/sourceExceptions.json`.
- `check-decisions` validates `[D##]` references in the docs.

The other three (`normalize`, `lint`, `build`) have real signatures, real flag parsing, and detailed TODOs pointing at the spec — but throw `not implemented` when run.

This is deliberate: the goal is a skeleton someone can clone and start filling in, not a premature attempt at the whole token transform.

## Layout

```
.
├── bin/design-tokens.js       thin dispatcher
├── src/
│   ├── commands/
│   │   ├── import.js            REAL (see cli-spec.md §2)
│   │   ├── normalize.js         stub (see cli-spec.md §3)
│   │   ├── lint.js              stub (see cli-spec.md §4)
│   │   ├── build.js             stub (see cli-spec.md §5)
│   │   ├── check-exceptions.js  REAL (see cli-spec.md §1.5)
│   │   └── check-decisions.js   REAL (see cli-spec.md §6.1)
│   └── shared/
│       ├── flags.js             tiny wrapper around node:util parseArgs
│       ├── dates.js             YYYY-QN and YYYY-MM-DD → instant in ET
│       └── decisions.js         [D##] grammar parser
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
npm test                    # run all unit tests (31 cases)
npm run lint:schemas        # meta-validate the authored-tier schemas
npm run check-decisions     # verify [D##] references resolve
node bin/design-tokens.js --help
node bin/design-tokens.js import --force
node bin/design-tokens.js check-exceptions --json
```

## Paper authoring workflow

The paper library lives in `tokens/source/paper/`.

- Edit `tokens/source/paper/sections/*.md` for human-readable intent.
- Edit `tokens/source/paper/tokens.paper.json` for the canonical structured token values.
- Run `node bin/design-tokens.js import --force` to snapshot the source into `tokens/raw/paper/`.
- Edit `/tokens/authored/approvedPairs.json` for approved contrast pairs.
- Edit `/tokens/authored/sourceExceptions.json` only when a temporary source-data exception is intentional.

## What's next (implementation order recommendation)

1. **`normalize` primitives and semantic tokens** — convert `tokens/raw/paper/tokens.paper.json` into normalized DTCG-style files.
2. **`normalize` spacing, radius, typography** — paper source already names canonical tokens, so this is mostly splitting files and preserving metadata.
3. **`lint`** — rules L1, L2, L3, L8 first (simplest). Then L4, L5 (needs exceptions), L7 (needs metadata), L6 (contrast math).
4. **`build`** — mechanical once normalize is solid.

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
