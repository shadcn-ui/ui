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

## Public registry health monitoring

`directory.json` remains the authored source of truth for public registry
metadata. The scheduled monitor reads that file, checks each registry, and
publishes generated state to a private Vercel Blob store. Generated health data
must never be committed to the repository.

The monitor writes these paths:

```text
registry-health/v1/state.json
registry-health/v1/latest.json
registry-health/v1/runs/<timestamp>.json
registry-health/v1/daily/<date>.json
```

`latest.json` is the only Blob document read by the website. The server reads it
with Blob credentials, then the public `/r/registries.json` route merges the
sanitized health overlay by exact namespace. The route fails open to the
original directory payload when health is disabled, stale, or unavailable.
If a newly added registry is not in the latest snapshot yet, it remains in the
payload without `health` until the monitor first observes it.
The route uses five-minute ISR, so normal traffic is served from cache and does
not read Blob on every request.

Each newly generated health entry includes a stable status reason code and a
human-readable message for its primary status condition. The public route does
not expose raw monitor diagnostics, and status reasons do not affect scores or
ranking.

### Authentication and configuration

New Blob connections use Vercel OIDC inside the linked Vercel project. The
connected registry health store exposes `REGISTRY_HEALTH_BLOB_STORE_ID`, which
the website passes explicitly when reading `latest.json`. The standard
`BLOB_STORE_ID` name remains supported as a fallback. A server-only
`BLOB_READ_WRITE_TOKEN` is also supported when OIDC is unavailable. Client code
never receives these credentials.

The monitor runs in GitHub Actions, outside Vercel's OIDC runtime. Configure a
separate repository Actions secret named `BLOB_READ_WRITE_TOKEN` for that
workflow. The token is available only while downloading the previous private
state and publishing the new snapshot. The registry check step, contributor URL
requests, and CLI dry-run subprocesses run without Blob credentials. Never
expose the token through a `NEXT_PUBLIC_` variable, logs, or step summaries.

Configure this Vercel server environment variable:

- `REGISTRY_HEALTH_BLOB_STORE_ID`: the ID of the connected private registry
  health Blob store. Vercel provides this value when the store is connected to
  the project.
- `REGISTRY_HEALTH_ENABLED`: set to `1` to merge the additive health object into
  `/r/registries.json`; set to `0` to return the original four-field payload.
  The Registry Directory does not consume the health object during the initial
  data-collection phase.

### Running and rollout

The `Monitor Registries` workflow runs hourly and supports manual `hourly`,
`daily`, `weekly`, and `all` modes. Registry failures are recorded as data. The
workflow fails only when its own configuration, state, or publication fails.
Automatic daily and weekly work uses the last successful phase timestamps in
`state.json`, so a delayed cron run does not skip those checks.

To run the monitor locally with credentials loaded from the linked Vercel
project, use the workspace-root Turbo command:

```bash
MONITOR_MODE=hourly vercel env run -- pnpm registry:health
```

If the local environment file lives under `apps/v4`, run from that directory
and use `pnpm -w registry:health` so pnpm still selects the workspace-root
script.

Turbo builds the monitor's workspace dependencies before running it. Local runs
run the same three phases as the workflow: authenticated state download,
credential-free registry checks, and authenticated publication. They publish
health state to the connected Blob store. Valid modes are `auto`, `hourly`,
`daily`, `weekly`, and `all`.

For the initial rollout:

1. Connect a private Blob store to the Vercel project.
2. Configure the GitHub Actions write secret.
3. Set `REGISTRY_HEALTH_ENABLED=1` and deploy the additive API overlay.
4. Dispatch an hourly run and confirm all four Blob path families.
5. Collect at least seven days of observations and inspect false positives.
6. Add the Registry Directory presentation in a follow-up after the data and
   thresholds have been reviewed.

To roll back the public API overlay immediately, set
`REGISTRY_HEALTH_ENABLED=0`. Disable the scheduled workflow separately if its
requests are causing load or false positives. Blob history can remain in place
for diagnosis.
