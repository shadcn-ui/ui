# Registry

This directory is the source of truth for the v4 component registry. The build
pipeline (`../scripts/build-registry.mts`) reads the authored source here and
generates the runtime indexes, the local `styles/` consumed by the docs app, and
the installable output under `public/r/`.

## Source of truth (authored by hand)

- **`bases/base/`, `bases/radix/`** — the two authored base registries (Base UI
  and Radix). Each holds a `registry.ts` plus `ui/`, `lib/`, `hooks/`, `blocks/`,
  `examples/`, and `internal/`. Shared surfaces should stay in sync across both
  bases — see [`bases/README.md`](./bases/README.md).
- **`styles/style-*.css`** — the style token files (`nova`, `sera`, `vega`, …).
  Each defines the design tokens for one style.
- **`new-york-v4/`** — the legacy source registry. Unlike the generated
  combinations below, its `registry.ts` and component files are authored
  directly and committed.
- **`../examples/base`, `../examples/radix`** — authored component demos. See
  [`../examples/README.md`](../examples/README.md).

## Generated output (do not edit by hand)

Persistent (committed):

- `bases/__index__.tsx` — runtime lookup for the authored bases.
- `__index__.tsx` — runtime lookup across legacy styles and every base/style
  combination.
- `__blocks__.json` — block metadata index.
- `../examples/__index__.tsx` — runtime lookup for demos.
- `../styles/<style>/ui/*` — compiled components for each base/style
  combination, imported by the docs app.
- `../styles/<style>/ui-rtl/*` — RTL variants, generated for `base-nova` and
  `radix-nova` only.
- `../public/r/*` — installable registry JSON served by the website and the CLI.

Temporary (created during the build, then cleaned up):

- `<style>/*` — per-combination registries (e.g. `base-nova/`).
- `../registry-<style>.json`

## The style model

There are two kinds of "styles", and the distinction drives the build flags:

- **Generated combinations** — every base (`base`, `radix`) crossed with every
  style token (`nova`, `sera`, …) produces a combination like `base-nova` or
  `radix-sera`. These are generated from the authored bases plus the style CSS;
  nothing under `registry/<combination>/` is committed.
- **Legacy source registry** — `new-york-v4` is authored directly and committed.
  It is not generated from a base/style combination.

## Building

Run from `apps/v4`:

```bash
pnpm registry:build
```

This runs the full pipeline: build the bases, generate every combination, write
the runtime indexes, export `public/r/` for every style, copy the compiled UI
into `styles/`, and build the RTL styles. It is the canonical build — generated
output is prettier-formatted. **Run this before committing or for production.**

### Fast targeted builds

The targeted flags below are for quick local iteration. To stay fast they
**skip formatting** the generated output, so they can leave generated files
unformatted (and produce large but harmless `git diff` churn). The full
`pnpm registry:build` above re-canonicalizes everything, so run it before you
commit.

For local iteration you can rebuild only the artifact you changed:

```bash
pnpm registry:build --examples            # examples/__index__.tsx
pnpm registry:build --indexes             # runtime registry indexes
pnpm registry:build --style base-nova     # styles/base-nova/ui (+ ui-rtl)
pnpm registry:build --style all           # every generated combination
pnpm registry:build --registry base-nova  # public/r/styles/base-nova
pnpm registry:build --registry all        # every style, incl. new-york-v4
```

| Flag                      | Rebuilds                                                                         | Run after                            |
| ------------------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| `--examples`              | `../examples/__index__.tsx`                                                      | adding, removing, or renaming a demo |
| `--indexes`               | `bases/__index__.tsx`, `__index__.tsx`, `__blocks__.json`, `public/r/index.json` | changing registry or block metadata  |
| `--style <style\|all>`    | `../styles/<style>/ui` and `ui-rtl`                                              | editing authored base UI/components  |
| `--registry <style\|all>` | `../public/r/styles/<style>`                                                     | changing what the CLI installs       |

Notes:

- Flags can be combined, e.g. `--style base-nova --registry base-nova`.
- `all` targets every supported style.
- Editing an existing example file usually does **not** need a rebuild — only
  adding, removing, or renaming one (which changes the index) does.
- `--style new-york-v4` is rejected because it is a legacy source registry, not a
  generated combination. Use `--registry new-york-v4` instead.
- Unknown targets fail with the list of valid style ids.
