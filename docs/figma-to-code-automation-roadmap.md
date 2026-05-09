# Figma → Code Automation Roadmap

**Status:** planning only. Nothing in this doc is implemented yet beyond Lane 1 (parked) and the foundations of Lane 2 (token CLI commands `import` / `normalize` / `lint` / `build`).

This document explains how the Lead design system will eventually support a safe **"edit in Figma → publish to GitHub/code"** flow. The flow is split into four lanes with very different risk profiles. **Each lane should be built and validated independently** — combining them prematurely creates failure modes that are hard to debug.

---

## Why four lanes, not one pipeline

A single "Figma → GitHub" pipeline sounds tidy, but it conflates very different operations:

- Updating a CSS variable for a tint shift is low-risk and trivially reversible (change a hex value in a token JSON, regenerate `tokens.css`).
- Updating a React component's API surface is high-risk (downstream consumers break, semver implications, focus/keyboard regressions).
- Pushing code-usage snippets *into* Figma Dev Mode (Code Connect) is the inverse direction and shouldn't share infrastructure with Figma → code at all.

Treating these as one pipeline means the slowest, riskiest lane gates the fastest, lowest-risk lane. Splitting them lets tokens ship daily while component generation stays gated for months.

---

## Lane 1 — Code Connect (already built, parked)

**Direction:** code → Figma. Maps Lead React component snippets *into* Figma Dev Mode so designers see the canonical Lead JSX when they inspect a component.

**State:**
- 30 `figma.connect()` calls across 18 component files; all locally dry-run-validated.
- Workflow at `.github/workflows/figma-code-connect.yml` correctly installs lead-ui, runs `figma connect publish --dry-run`, then `figma connect publish` from `packages/lead-ui/`.
- Gated on `vars.FIGMA_CODE_CONNECT_ENABLED == 'true'`.

**Blocker (Figma-side):** the Code Connect Write scope is not selectable in the Figma PAT generation modal for the org/account in use. See `docs/code-connect-publish-readiness.md` §0 for the full admin checklist (plan tier, feature toggle, seat type, membership). All three real publish attempts to date have failed with HTTP 403 at the upload boundary.

**This lane does NOT generate code from Figma.** It pushes existing code references into the design tool. Conflating this with Figma → code automation is a common misunderstanding worth flagging up front.

**Action:** keep `FIGMA_CODE_CONNECT_ENABLED=false` until Figma org enables Code Connect Write scope. No further repo work needed in this lane.

---

## Lane 2 — Token publishing (Figma variables → CSS variables)

**Direction:** Figma → code. The first true "Figma edit triggers code PR" flow we should build.

**Why this lane is safe to automate first:**
- Tokens are values, not behavior. A wrong color hex is recoverable in seconds.
- Generated output is a single file (`packages/lead-ui/src/generated/tokens.css`), easy to review.
- The CLI already exists and is unit-tested (`packages/lead-design-tokens-cli`).

**Pipeline shape:**

1. Figma variables are exported (or fetched via Figma API) → JSON.
2. `lead-design-tokens-cli import` ingests the JSON.
3. `lead-design-tokens-cli normalize` produces a stable, sorted intermediate representation.
4. `lead-design-tokens-cli lint` validates against schema (no missing semantic tokens, no broken aliases, etc.).
5. `lead-design-tokens-cli build` emits `tokens.css`.
6. A GitHub Action runs steps 1–5 and **opens a PR** with the regenerated artifact + a diff summary.
7. A human reviews and merges. No auto-merge.

**Trigger surface:**
- Initially: `workflow_dispatch` (a designer or engineer manually clicks "Run workflow" after publishing Figma changes).
- Later (optional): scheduled poll of the Figma file's lastModified timestamp, only if rate limits allow.

**What the PR comment / body should contain:**
- Token diff summary (added/removed/changed names, value diffs).
- Link to the source Figma file and the variable collection that changed.
- Bundle-size impact (CSS-only, expected to be ≤1 kB delta for typical token edits).
- A reminder that this PR may not be auto-merged.

**Status:** `import` and `normalize` are partially built; `lint` and `build` are operational; the GitHub Action shape is *not yet implemented*.

---

## Lane 3 — Component spec auditing (read-only, advisory)

**Direction:** Figma → code, but **as a report**, not as edits.

**Purpose:** detect drift between Figma component property surfaces and React component APIs *before* anyone hand-codes a regression. For example: Figma adds a `loading` boolean to Button; the audit reports that `Button.tsx` has no matching prop and either documents the Lead-side decision (intentionally not added) or surfaces a TODO.

**Pipeline shape:**

1. Fetch Figma component property surfaces via the Figma API (using the same File Read scope that already works).
2. Walk Lead's React component types (TypeScript AST) to extract prop interfaces.
3. Compare per-component:
   - Figma props with no React equivalent → flag as "consider adding to React API."
   - React props with no Figma equivalent → flag as "Lead-only API decision; document in `API-CONSISTENCY.md`."
   - Enum value mismatches → flag as drift.
4. Produce a markdown report and post as a PR comment, OR open a "drift report" issue weekly.

**Where DirectedEdges Specs (or a similar component-spec format) might fit:** as an *audit/reference* output of this lane. The audit could emit a Spec file describing the current Lead/Figma alignment, and that Spec becomes a versioned source-of-truth for the design-system contract. **Do not** wire DirectedEdges Specs as a *generator* feeding Lane 4 until Lane 3 has been running stably for at least a quarter.

**Critical rule:** this lane never auto-edits React components. It only reports. Humans decide what the API change should be.

**Status:** Storybook export prototypes shipped — Badge (JES-82), Card (JES-84), Alert Dialog (JES-83). The Alert Dialog export surfaced a real production gap (no `<AlertDialog>` primitive); the resulting decision is documented in [`alert-dialog-primitive-decision.md`](./alert-dialog-primitive-decision.md) (JES-85), and the production primitive plus visual parity stories shipped in JES-86 and JES-89. The lane-wide standard and inventory are at [`storybook-figma-parity-standard.md`](./storybook-figma-parity-standard.md) (JES-90) and [`storybook-figma-parity-inventory.md`](./storybook-figma-parity-inventory.md) (JES-91). JES-108 closed the final Field/Label source-node gap by creating standalone Figma source components and parity stories, so Lane 3 is now complete at 21/21 components.

---

## Lane 4 — Component code generation (future, advanced)

**Direction:** Figma → code. The end-state vision: a Figma component change opens a PR with a *proposed* React API update.

**Why this is last:**
- Component APIs carry semver implications. A wrong prop name or default value breaks consumer apps.
- Focus management, ARIA roles, keyboard handling, and form integration are *not* in Figma. A generator that ships React without those layers ships broken accessibility.
- Lead's components are compositional (Card, Tabs, Accordion, DropdownMenu) — the generator must understand "this Figma variant means a new `<DropdownMenuCheckboxItem>`, not a new `variant` prop on `<DropdownMenuItem>`." Lane 1's variant-as-component-switch convention shows this is non-trivial.

**Constraints if and when we build this:**
- **Always opens a PR**, never commits directly.
- **Generated files are explicitly marked** (e.g., header comment `// AUTO-GENERATED — do not edit by hand; edit Figma source at <node-id>` or a sibling `.generated.tsx` filename convention).
- **Dry-run mode** that produces a preview without opening a PR; humans can preview locally before wiring up the trigger.
- **Generation is gated on a Lane 3 audit pass** — no generation if the Figma surface and React surface are already in drift; resolve the drift first.

**Status:** not on the near-term roadmap. Revisit after Lanes 2 and 3 have been operational for ~6 months.

---

## Recommended sequence

1. **Keep Code Connect parked.** `FIGMA_CODE_CONNECT_ENABLED=false`. No more retries until the Figma scope is selectable.
2. **Finish token CLI `import` and `normalize`** — the remaining gaps in `packages/lead-design-tokens-cli`. These are pure-function CLI commands with unit tests; low-risk to build. **(Done — PR #36, merge `29491fe32`.)**
3. **Add a GitHub Action for Lane 2.** Manual `workflow_dispatch` only at first. **Design:** [`token-publishing-action-design.md`](./token-publishing-action-design.md). **Implementation:** [`.github/workflows/token-publishing.yml`](../.github/workflows/token-publishing.yml) (JES-74). The action:
   - Fetches/imports Figma tokens.
   - Runs `import → normalize → lint → build`.
   - Opens a PR with the regenerated `tokens.css` and JSON manifest.
   - Posts a token diff summary as the PR description.
4. **Iterate on the diff summary** until it's useful enough that a designer or engineer can review the PR in under 60 seconds.
5. **Add Lane 3 spec auditing** as a separate workflow producing a report. Consume the report manually for a quarter before considering automation.
6. **Only after Lanes 2 and 3 have been stable for months**, evaluate Lane 4. The decision to even start Lane 4 should be re-examined; it may turn out the manual code-writing path with Lane 3 audits is good enough.

---

## Guardrails (apply across all lanes that produce PRs)

- **Never push generated code directly to `main`.** All Figma-driven changes flow through pull requests.
- **Always open PRs as draft** until a human marks them ready. The PR body must clearly state which lane produced it (Lane 2 / Lane 3 / Lane 4) and what generated artifact is included.
- **Keep generated files marked.** Either by file naming convention (`*.generated.*`) or a header comment that pre-commit hooks refuse to let humans edit.
- **Require dry-run / validation before PR creation.** A failing dry-run aborts the PR, surfaces the failure as a workflow log, and notifies via the existing CI failure channels.
- **Keep Code Connect publish (Lane 1) infrastructurally separate from Lane 2 / 3 / 4.** They share secrets (`FIGMA_ACCESS_TOKEN`) but should not share workflow files. A Lane 2 token-publish PR should never indirectly trigger a Code Connect publish, and vice versa.
- **Do not treat Figma as a unilateral source of truth for React APIs.** Figma describes the visual contract; React encodes the behavioral contract (focus, ARIA, form integration, polymorphism). Lane 3 produces *advisory* reports, not authoritative API edits. The two surfaces are aligned by deliberate human decisions documented in `API-CONSISTENCY.md`, not by mechanical reconciliation.

---

## Related docs

- `docs/figma-to-code-sync.md` — the manual Figma-to-code release process used today.
- `docs/code-connect-publish-readiness.md` — Lane 1 status, publish blocker, admin checklist.
- `packages/lead-ui/API-CONSISTENCY.md` — the canonical record of intentional API gaps between Figma and Lead React.
- `packages/lead-design-tokens-cli/docs/` — token CLI design and decisions, the foundation Lane 2 builds on.
