# Token Publishing GitHub Action — Design Proposal

**Status:** design only. **Tracks Linear `JES-74`.** No workflow file is added in this PR — the YAML below is reviewable but uncommitted.

This document proposes the v1 contract for the token publishing GitHub Action that opens a draft PR from the token CLI pipeline. The CLI work is done (PR #36); this is the wrapping automation per Lane 2 of [`figma-to-code-automation-roadmap.md`](./figma-to-code-automation-roadmap.md).

---

## Problem

The token CLI now supports `import → normalize → build` end-to-end with file-based input. To make "Figma edit → code PR" real, we need a GitHub Action that:

1. Acquires a Figma variables JSON export.
2. Runs the CLI pipeline to regenerate `packages/lead-ui/src/generated/tokens.css`.
3. Validates that the result still typechecks and tests pass.
4. **Opens a draft PR** with the regenerated artifact and a diff summary. Never pushes to `main`.

The genuinely-open question is **step 1: where does the Figma export come from in CI?**

---

## Input shape — four options weighed

### Option A — `workflow_dispatch` with inline JSON text input

```yaml
inputs:
  figma_export:
    description: 'Paste the JSON body of GET /v1/files/:key/variables/local'
    required: true
    type: string
```

- **Pros:** zero new infrastructure. No API calls. No new secret scope. Fully reviewable inputs.
- **Cons:** GitHub Actions input length limit is ~65 KB. Real Figma exports for the Lead file already exceed this. Hard ceiling, hard fail.

### Option B — Direct Figma API fetch using existing `FIGMA_ACCESS_TOKEN` secret ✅ **recommended**

```yaml
inputs:
  figma_file_key:
    description: 'Figma file key (the segment after /design/ in the file URL)'
    required: true
    default: 'f2gKVfCJNOS0MeLUk4CM8u'
    type: string
```

The action runs `curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" https://api.figma.com/v1/files/$FIGMA_FILE_KEY/variables/local > export.json`, then runs the CLI pipeline against `export.json`.

- **Pros:**
  - The `FIGMA_ACCESS_TOKEN` secret already exists with **File Read** scope (verified — that's the scope the Code Connect dry-runs already use). File Read is exactly what `GET /v1/files/:key/variables/local` requires.
  - **No new secret needed.** No new scope. The Code Connect Write scope is *not* required for this lane (that's Lane 1).
  - Best designer ergonomics: trigger workflow → wait → review draft PR. No copy-paste step.
  - Handles arbitrarily large exports — no input-length ceiling.
- **Cons:**
  - Direct API call. The roadmap says "No direct Figma API calls unless clearly justified and documented" — this is the justification: same secret/scope already in repo, no API write, lowest-friction designer flow.
  - Figma API rate limits (60/min for Figma's public API tier). For a manually-triggered workflow this is non-binding; document the limit so future scheduled-trigger work knows.
  - Network failure modes (DNS, TLS, 5xx). Mitigated by `set -e` on `curl --fail` and a clear job log.

### Option C — Pre-committed file at `tokens/source/figma/variables.export.json`

A human commits the export file; the action regenerates `tokens.css` and opens a PR.

- **Pros:** zero API calls. Fully reviewable inputs (the source file is in git history).
- **Cons:** duplicates the source of truth (Figma + git). Requires a manual commit step before the workflow does anything useful — which is what the workflow is supposed to obviate. This is essentially "automate the regeneration but not the fetch," which is a much weaker improvement.

### Option D — `workflow_dispatch` with `figma_export_url` input (URL fetch)

The action curls a user-provided URL.

- **Pros:** handles large exports.
- **Cons:** SSRF risk (untrusted URL in CI). Requires a hostname allowlist. Adds infrastructure (gist/CDN) for designers to manage. Worse than Option B in every dimension.

### Decision

**Option B (direct Figma API fetch).** The justification clears the roadmap's bar:

> *"No direct Figma API calls unless clearly justified and documented."*

The justification is: existing secret, existing scope (File Read), no write scope needed, no infrastructure addition, best ergonomics, no SSRF, no input-size ceiling. Documented above and inline in the workflow YAML below.

---

## v1 contract

### Trigger

`workflow_dispatch` only for v1. No `push`, no `schedule`. A designer (or engineer) runs the workflow manually from the Actions tab after publishing token changes in Figma.

### Inputs

| Input | Type | Required | Default | Notes |
|---|---|---|---|---|
| `figma_file_key` | string | yes | `f2gKVfCJNOS0MeLUk4CM8u` | Lead Design System staging file key |

No other inputs in v1. Multi-mode emission, theme cascades, and project key selection are deferred.

### Permissions

```yaml
permissions:
  contents: write       # to push the generated branch
  pull-requests: write  # to open the draft PR
```

These are scoped to the workflow job, not the workflow at file level — so other jobs can't accidentally inherit them.

### Steps (in order)

1. **Checkout** at full depth so the diff is meaningful.
2. **Setup Node 22** with npm cache for both `lead-design-tokens-cli` and `lead-ui` package-lock files.
3. **Install dependencies** for both `lead-design-tokens-cli` and `lead-ui` (`--workspaces=false`).
4. **Fetch Figma variables export** via `curl --fail` to a tempfile. Failure exits non-zero with a clear log.
5. **Run `design-tokens import --from figma --figma-export <tempfile> --force`.**
6. **Run `design-tokens normalize --from figma --force`.**
7. **Run `design-tokens build --input tokens/normalized/tokens.json --out packages/lead-ui/src/generated/tokens.css`.**
8. **Validation gate** (all three must pass before PR creation):
   - `npm run lead:ui:typecheck` (the generated CSS is referenced via plain `@import`, so this confirms the import path still resolves).
   - `npm run lead:ui:test` (catches token regressions that break component tests — e.g., if a renamed token is consumed by a test snapshot).
   - `npm run lead:ui:build` (confirms the bundle still compiles).
9. **Detect diff**. If `git diff --quiet packages/lead-ui/src/generated/tokens.css` is true (no change), exit cleanly with `Token CSS unchanged — no PR needed.` and a non-failure status. This avoids noisy empty PRs when designers re-trigger after no Figma changes.
10. **Open draft PR** via `gh pr create --draft`. Branch name `tokens/figma-publish/<run-id>`. Body includes:
    - Source file key.
    - Number of tokens before/after.
    - Plain-English diff summary (added/removed/changed token names; value diffs).
    - Validation outcome confirmation.
    - Manual review checklist (visual regression, brand alignment, contrast).

The action **never** pushes to `main`. The branch is created from `main`, all writes happen on that branch, the PR is draft so auto-merge cannot fire.

### What the workflow file would look like (uncommitted, for review)

```yaml
name: Token Publishing

on:
  workflow_dispatch:
    inputs:
      figma_file_key:
        description: 'Figma file key (segment after /design/ in the URL)'
        required: true
        default: 'f2gKVfCJNOS0MeLUk4CM8u'
        type: string

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: |
            packages/lead-design-tokens-cli/package-lock.json
            packages/lead-ui/package-lock.json

      - name: Install token CLI deps
        run: npm ci --prefix packages/lead-design-tokens-cli --workspaces=false

      - name: Install lead-ui deps
        run: npm ci --prefix packages/lead-ui --workspaces=false

      - name: Fetch Figma variables export
        env:
          FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
          FIGMA_FILE_KEY: ${{ inputs.figma_file_key }}
        run: |
          curl --fail --silent --show-error \
            -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
            "https://api.figma.com/v1/files/$FIGMA_FILE_KEY/variables/local" \
            -o /tmp/figma-export.json
          test -s /tmp/figma-export.json

      - name: Import + normalize + build
        working-directory: packages/lead-design-tokens-cli
        run: |
          node bin/design-tokens.js import --from figma --figma-export /tmp/figma-export.json --force
          node bin/design-tokens.js normalize --from figma --force
          node bin/design-tokens.js build \
            --input tokens/normalized/tokens.json \
            --out ../lead-ui/src/generated/tokens.css

      - name: Validate (typecheck + test + build)
        run: |
          npm run lead:ui:typecheck
          npm run lead:ui:test
          npm run lead:ui:build

      - name: Detect diff
        id: diff
        run: |
          if git diff --quiet packages/lead-ui/src/generated/tokens.css; then
            echo "changed=false" >> "$GITHUB_OUTPUT"
            echo "Token CSS unchanged — no PR needed."
          else
            echo "changed=true" >> "$GITHUB_OUTPUT"
          fi

      - name: Open draft PR
        if: steps.diff.outputs.changed == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          BRANCH="tokens/figma-publish/${{ github.run_id }}"
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git checkout -b "$BRANCH"
          git add packages/lead-ui/src/generated/tokens.css \
                  packages/lead-design-tokens-cli/tokens/raw/figma/ \
                  packages/lead-design-tokens-cli/tokens/normalized/
          git commit -m "chore(tokens): regenerate from Figma file ${{ inputs.figma_file_key }}"
          git push -u origin "$BRANCH"
          gh pr create \
            --draft \
            --base main \
            --head "$BRANCH" \
            --title "chore(tokens): regenerate from Figma" \
            --body "Auto-generated by .github/workflows/token-publishing.yml. Figma file key: \`${{ inputs.figma_file_key }}\`. Validation (typecheck + test + build) passed before this PR was opened. **Review the diff in \`packages/lead-ui/src/generated/tokens.css\`** and check the visual / brand / contrast implications before marking ready."
```

### Validation gate

Three checks must pass before the PR is opened:

1. **`lead:ui:typecheck`** — the generated CSS is referenced by `packages/lead-ui/src/tokens.css`'s `@import`, so a missing/renamed file would break the import resolution. Typecheck catches downstream issues if any TypeScript sources reference token names by string (rare but possible).
2. **`lead:ui:test`** — Vitest runs against the same generated tokens.css that ships in the bundle. If a test snapshot pins a CSS-variable value or a component's test asserts a specific token, regressions surface here.
3. **`lead:ui:build`** — confirms the regenerated CSS still compiles into the production bundle without breaking Vite's CSS pipeline.

If any gate fails, the workflow exits non-zero **before opening a PR**. Designers see a workflow failure with the exact log, not a broken PR.

### Diff-empty case

If the regenerated `tokens.css` is byte-identical to the version already on `main`, the workflow exits cleanly without opening a PR. This avoids noisy empty PRs when designers re-trigger after no actual Figma changes (a common pattern with manual triggers).

---

## What is implemented vs. deferred

### v1 (this proposal)

- ✅ `workflow_dispatch` with `figma_file_key` input.
- ✅ Direct Figma API fetch using existing `FIGMA_ACCESS_TOKEN` (File Read scope only).
- ✅ Validation gate before PR creation.
- ✅ Draft PR via `gh pr create --draft`.
- ✅ Diff-empty short-circuit.

### Deferred to v2+

- **Token diff summary in PR body.** v1's PR body is hand-written boilerplate; v2 adds a parsed before/after diff (added/removed/changed token names + value diffs). Requires a `design-tokens diff` subcommand or a one-off scripted parse — its own slice.
- **Visual regression preview** (Storybook deploy of the PR branch with the new tokens). Requires Storybook deploy infra changes.
- **Scheduled trigger** (poll Figma's `lastModifiedTime` and only run when it advances). Out of scope; manual `workflow_dispatch` is the v1 surface.
- **Multi-mode emission.** Currently only `defaultModeId` is read by the CLI. Light/dark/density modes emit single-block CSS today; v2+ adds layered emission and the workflow surfaces mode selection as an input.
- **`VARIABLE_ALIAS` resolution.** CLI v1 errors clearly; the workflow inherits that. Resolution is a CLI concern, not a workflow concern.
- **Project key selection.** v1 hardcodes `figma_file_key` default; v2 may support multiple files or a config file in the repo.
- **Concurrency control.** v1 has no `concurrency:` block. If two designers trigger simultaneously, both runs will succeed (different `github.run_id` branches) and the second will become a noop on diff or open a competing PR. Worth a `concurrency: token-publish` group in v2.

---

## Out of scope (and why)

- **Direct push to `main`.** Explicitly forbidden. Always opens a draft PR.
- **Auto-merge.** Draft PRs cannot auto-merge by GitHub's rules. Even if a future PR is marked ready, **never** auto-merge token PRs — designers should always review the visual implications.
- **Code Connect interactions.** This workflow is Lane 2; Lane 1 publishing remains separately gated. Zero overlap with `figma-code-connect.yml`. The `FIGMA_ACCESS_TOKEN` is shared (because File Read scope is sufficient for both), but the variable `FIGMA_CODE_CONNECT_ENABLED` is *not* read by this workflow and remains `false` regardless of token publishing state.
- **Implementing the workflow file.** This PR is design-only per JES-74's caution ("Do not start until CLI commands are stable") and the parent prompt's fallback ("If not obvious, create a docs-only PR"). The next slice implements the YAML based on this proposal — separate PR, separate review.

---

## Rollback

If the published workflow misbehaves once implemented:

1. **Disable the workflow.** Settings → Actions → Workflows → "Token Publishing" → Disable. Designers can no longer trigger it; existing draft PRs remain open and reviewable.
2. **Close the offending draft PR.** Branch is named `tokens/figma-publish/<run-id>` — easy to find and delete.
3. **Revert generated `tokens.css`** if a bad PR was merged. `git revert <merge-commit>` and re-merge with the corrected source.

---

## Decisions for review

Before implementing, please confirm:

1. **Direct Figma API fetch is acceptable** as the v1 input shape (Option B). The roadmap permitted it conditionally; this doc satisfies the "clearly justified and documented" condition. If you'd prefer Option A or C instead, say so and v1 takes a different shape.
2. **Hardcoded default file key (`f2gKVfCJNOS0MeLUk4CM8u`) is acceptable** as a UX nicety. Designers can override it; the default just removes friction for the common case.
3. **`peter-evans/create-pull-request` action vs. raw `gh` CLI.** v1 uses raw `gh` (no new dependency, no third-party action). The action would be slightly cleaner; raw `gh` is more transparent. I recommend raw `gh`.
4. **Concurrency control is deferred to v2.** Concurrent triggers produce two branches; not great, not catastrophic. If you'd rather it be a v1 requirement, add `concurrency: token-publish` to the YAML.

After your review, the next PR implements the workflow file (a small `.github/workflows/token-publishing.yml` plus a possible README link from the roadmap doc).
