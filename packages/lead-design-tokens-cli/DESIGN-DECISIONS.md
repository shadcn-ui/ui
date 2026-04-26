# Lead Design System — Decisions

**Status:** Living document  
**Owner:** Jeshua (sole approver)  
**Companion docs:** `DESIGN.md` (generated token inventory), `docs/cli-spec.md` (CLI contract)

---

## Purpose of this document

This captures **why** the Lead design system is structured the way it is. For **what** the system currently contains (tokens, values, modes, approved usages), see `DESIGN.md`, which is generated from the normalized token pipeline and regenerated on every change.

This split exists because rationale and state have different cadences: rationale changes rarely and needs explanation, state changes often and needs accuracy. Mixing them guarantees one or the other decays.

## Audience

1. **Designers** adding tokens or modes — read this to understand the layering rules before editing the paper source.
2. **Developers** consuming generated artifacts — read this to understand the vocabulary before implementing components.
3. **Agents** (Claude Code, Cursor, the design-system-agent skill) — read this as governance context before generating or editing code.

---

## 1. Principles

Four rules that everything downstream follows:

**1.1** **Layer discipline.** Each tier in the token hierarchy references only the tier directly above it. Never sideways, never skipping downward. This is what makes the system scale — a new payment rail adds one token, not twenty.

**1.2** **Modes are orthogonal.** Theme, density, and future per-program theming are dimensions that cut across tiers — not tiers themselves. The semantic and component layers have N mode variants; modes don't sit below components in the reference chain.

**1.3** **Design owns tokens; dev consumes generated artifacts.** Designers author the paper source library in `tokens/source/paper/`. The CLI produces normalized JSON, CSS, types, and docs. Developers never hand-edit generated tokens, and designers never write code to express design intent.

**1.4** **Agents read generated, not raw.** When an agent needs to know a color or spacing value, it reads `DESIGN.md` or `generated/tokens.css`. Raw paper snapshots are pipeline inputs, not runtime truth.

---

## 2. Token Architecture

### 2.1 Tiers

```
primitives
   ↓
semantic.foundation
semantic.feedback        (all three are peers at tier 2)
semantic.interactive
   ↓
component
   ↓
domain
```

**2.1.1 — Primitives.** Raw values with no meaning. `color.blue.600 = #...`, `number.16 = 16`. The vocabulary. Components never reference primitives directly; semantic and domain tiers do. Expanding the palette happens here and only here.

**2.1.2 — Semantic, split into three families.**

- **`semantic.foundation`** — layout chrome. Surface, content, stroke, shift. The structural baseline of every UI.
- **`semantic.feedback`** — status communication. Alert, success, warning, info. One color per meaning, optimized for "what is this telling me."
- **`semantic.interactive`** — action surfaces. Primary (the old "Emphasis"), and future interactive tones as needed.

The three-family split is deliberate — see §3.

**2.1.3 — Component.** Tokens specific to a component's anatomy (bg, fg, border) and states (default, hover, active, disabled, focus). Component tokens reference semantic tokens. A real button needs ~20 component tokens to codegen correctly; the current flat `buttons.*` collection is pre-anatomy (see §9).

**2.1.4 — Domain.** Lead Bank–specific vocabulary: payment rails, transaction states, case states, account types, entity types. References semantic tokens. This is where the system expresses that it serves a bank, not a generic product. Deferred in v1 (see §10).

### 2.2 Modes (orthogonal dimensions)

**2.2.1 — Theme.** `light` is the only mode in v1. `dark` is planned, not scheduled. Per-program theming is explicitly out of scope until and unless external programs require it.

**2.2.2 — Density.** Three modes: `comfortable`, `snug`, `compact`. `snug` is the default. Mental model and scope in §5.

**2.2.3 — Orthogonality rule.** A token that exists in one theme mode must exist in every theme mode. Same for density. The CLI lint step enforces this (see CLI spec §3).

---

## 3. Semantic Structure — the three-family split

The earlier `colors-system` grouping mixed statuses, actions, and a catchall neutral into one bucket. The paper source records the split directly because these values behave differently in three ways:

**3.1 — Accessibility.** On white, `Emphasis` (now `interactive.primary`) measures **6.72:1** and passes AA for all text. Alert, Success, Warning, and Generic all measure 3.89–4.07:1 — below AA for small text. A system that treats them as peers invites misuse; a system that separates them can encode usage rules at the token level (§6).

**3.2 — Frequency and role.** Interactive colors appear on every screen, on primary CTAs. Feedback colors appear occasionally, on status-bearing elements. Foundation colors appear everywhere and everything sits on them. Different roles → different buckets.

**3.3 — Re-homing `Generic`.** The old `Generic` (the grayish-blue catchall) belongs in `semantic.feedback.info`, making feedback a complete `{alert, success, warning, info}` set. This matches how most mature systems organize status colors and gives info a real home instead of a miscellaneous bucket.

---

## 4. Spacing, radius, typography

### 4.1 Spacing — gap and padding stay separate

**Decision:** Keep `spacing.gap` and `spacing.padding` as separate collections even though values are identical today.

**Rationale:** They encode different intents. Gap is the rhythm between siblings in a stack; padding is the breathing room inside a container. Identical values today don't mean identical values forever — tightening inner padding without changing stack rhythm is a real, recurrent design need.

**Drift rule:** If `gap.X` and `padding.X` diverge at the same key, the token file must include a `justification` extension explaining why. The CLI lint step warns on undocumented drift (see CLI spec §3).

### 4.2 Radius

Kept as its own scale. Frozen across density modes in v1 (§5.4).

### 4.3 Typography

**4.3.1 — Three orthogonal dimensions.** Typography is modeled as role, size, and line-height instead of a flat style list. The paper source records these dimensions directly:

- **Role:** family, weight, tracking, case. E.g., `body`, `body-emphasis`, `title`, `code`.
- **Size:** `xs` through `xl` or `display-xl`.
- **Line-height:** `tight` (1.0–1.1), `snug` (1.2–1.3), `normal` (1.5).

A rendered text style is a composition: `body-emphasis` × `md` × `normal`. This is closer to how Tailwind already thinks, and it ends the leading/no-leading duplication.

**4.3.2 — Consolidation target.** The target remains roughly 20 role×size combinations plus 3 line-heights. The CLI reports any source entries that fail to normalize cleanly.

**4.3.3 — Known typography drifts. These are flagged but never auto-fixed by the CLI — synthesis is a design decision, not a tooling decision.**

- `Body-Sm`: `leading/` is Regular, `no-leading/` is Medium. Pick Regular. *(paired-variant weight conflict — requires a `L7-weight-mismatch` exception with `tiebreak: "leading"` until source is aligned)*
- `Title-Md-Emphasis`: no `no-leading/` pair exists. *(designer decides: add pair, or declare the missing variant intentional. Warn, never fail.)*
- `Title-Lg-Emphasis`: doesn't exist. Decide if it's needed.
- Code scale: only `code-xs` (10) and `code-md` (14). No S, L, XL. Decide whether to fill the scale or document the gap.
- Letter-spacing inconsistencies on Title-Sm-Emphasis (−1%) vs. Title-Sm (0) vs. Title-Md-Emphasis (0). *(cross-scale inconsistency — warn-only, these are separate roles with no emission conflict. Picks up hard-fail status only when `leading/` and `no-leading/` of the SAME role+size disagree on tracking.)*

**L7 hard-fail vs. warn distinction.** The CLI distinguishes two kinds of typography conflict:

- **Hard-fail (emission conflict):** `leading/X` and `no-leading/X` variants of the same role+size disagree on weight or tracking. The CLI must emit a single canonical value for `typography.roles.X`; the conflict blocks emission. Requires a `L7-weight-mismatch` or `L7-tracking-mismatch` exception with a `tiebreak` field.
- **Warn (no emission conflict):** Different roles across the scale have inconsistent styling choices (e.g., Title-Sm-Emphasis at −1% tracking while Title-Md-Emphasis is 0%). Each role emits its own value; nothing is blocked. Reported as a drift warning for designer awareness, no exception required.

**Exception schema for L7 drifts.** When a rule-L7 exception is needed for a conflict that blocks emission, the exception entry must include a `tiebreak` field naming the variant whose value is emitted:

```json
{
  "tokenPath": "typography.roles.body-sm",
  "rule": "L7-weight-mismatch",
  "reason": "temporary paper source conflict",
  "tiebreak": "leading",
  "resolvedBy": "2026-Q2"
}
```

The CLI emits the tiebreak-winner's value and logs the choice. It does not default a tiebreak silently — the absence of a tiebreak field on an L7 exception is itself a lint failure.

---

## 5. Density

### 5.1 Mental model

The axis is **user expertise × frequency of use**, not content complexity.

- **Comfortable** — unfamiliar, infrequent, cognitively demanding surfaces. Onboarding, first-run setup, partner-facing dashboards, anything where the user is learning. The default when in doubt.
- **Snug** — the unmarked default. Standard workflows, daily-use surfaces, most of the app. Designers don't pick snug; they get snug and actively choose the others if the surface warrants.
- **Compact** — expert, high-frequency, information-saturated surfaces. Case queues, reconciliation grids, ops terminals, power-user tables. Chosen deliberately.

### 5.2 What density affects

**5.2.1 — Spacing:** gap, padding, component heights (row, input, button).

**5.2.2 — Line-height:** all roles, all densities. Most of the visual "tightness" comes from here.

**5.2.3 — Text size:** data-dense roles only — `body-sm`, `caption`, `code`, `label`. Sizes for `body-md`, titles, headings, and displays stay **constant** across densities, because hierarchy communication should not shift by density.

### 5.3 Size floors, `nonText` classification, and source exceptions

**Floors for roles rendering as readable text:**
- `body-sm`: minimum **13px** in any density.
- All other text roles (`caption`, `label`, `body-md`, `title-*`, `heading-*`, `display-*`): minimum **12px** in any density.

**Non-text classification.** Some roles in the system don't render as readable body text — they function as graphic labels (all-caps badges, icon-adjacent tags, ornamental UI markers). These are marked `$extensions.leadbank.nonText: true` in the typography tokens and exempt from the body-text floor. They are validated under WCAG 1.4.11 (3:1 non-text contrast) through approved pairs rather than text rules.

Current `nonText`-classified sizes: **`code-xs`** (10px, all-caps) — used as badge/tag styling, not body copy.

**Source exceptions** (`/tokens/authored/sourceExceptions.json`). Real source data can temporarily violate floor or drift rules while a fix is in flight. Rather than leaving this implicit (transitional warnings the CLI can't distinguish from regressions), each known violation gets an explicit entry:

```json
{
  "$description": "Known source-data issues with scheduled upstream resolution. Each entry exempts a specific token from a specific lint rule.",
  "exceptions": [
    {
      "tokenPath": "typography.sizes.example-caption",
      "rule": "L5-size-floor",
      "reason": "example below-floor source value; needs raise to 12px",
      "resolvedBy": "2026-Q2"
    }
  ]
}
```

Current paper baseline has **no active source exceptions**.

**Schema enums** (enforced by co-located `sourceExceptions.schema.json`):

- `rule`: one of `"L5-size-floor"`, `"L7-weight-mismatch"`, `"L7-tracking-mismatch"`.
- `tiebreak` (required on L7 rules, forbidden on L5): one of `"leading"`, `"no-leading"`.
- `resolvedBy`: ISO 8601 date (`YYYY-MM-DD`) or quarter shorthand (`YYYY-QN`).

**Date semantics for overdue comparison.** Quarter shorthand resolves to the final calendar day of that quarter in `America/New_York` (Lead Bank's operational timezone), at end-of-day (23:59:59):

| Shorthand | Resolves to          |
|-----------|----------------------|
| `YYYY-Q1` | March 31             |
| `YYYY-Q2` | June 30              |
| `YYYY-Q3` | September 30         |
| `YYYY-Q4` | December 31          |

ISO dates are compared at end-of-day in the same timezone. An exception is `overdue: true` when its resolved instant is earlier than the lint run's current time in America/New_York.

Rules:
- Each exception names exactly one token and one rule.
- Only rules L5 (size floor) and L7 (typography drift, weight or tracking mismatch) are exemptable. L1, L2, L4, L6, L8 cannot be exempted — they protect structural integrity and accessibility.
- Lint output reports all active exceptions. Exceptions whose `resolvedBy` date is in the past are tagged `WARN overdue` — informational, not blocking (to avoid unrelated PRs breaking when a deadline silently slips).
- Adding an exception is a PR that Jeshua reviews, same as any other authored-tier change.

With no exception, a below-floor text size or blocking L7 drift fails lint. With an exception, it warns. Exception parsing happens once at pipeline start (`design-tokens check-exceptions`, §1.5 of the CLI spec) so both `normalize` and `lint` consume the same resolved exception set.

With no exception, a below-floor text size fails lint. With an exception, it warns. This is machine-checkable without inference.

These floors exist because the bank regulatory context and the realistic range of users' visual acuity don't leave room for a 10px "compact body" mode, even if it would look cool.

### 5.4 What density does NOT affect

- Radius
- Color tokens
- Border weights
- Typography role, weight, tracking, case
- Hierarchy text sizes (body-md, titles, headings, displays)

### 5.5 v1 scope: stub, don't implement

Density modes are **stubbed** in the paper source and normalized layer in v1. Structure exists; values are identical across `comfortable`, `snug`, and `compact`. Phase 2 populates real values.

This lets the architecture and tooling prove out without the team having to design three density variants of every spacing token on day one.

### 5.6 Runtime

Applied via `[data-density="comfortable|snug|compact"]` on the app root or any subtree. Subtree overrides are sanctioned — a compact case-queue table can live inside a snug page without drama. User-toggleable preference ships in a later phase.

---

## 6. Accessibility

### 6.1 Approved-pair validation, not exhaustive

The lint step validates **declared semantic pairs**, not every possible foreground/background combination. Exhaustive validation is noisy and catches pairs nobody would ever use; declared-pair validation catches the pairs that matter because someone said they were intended for use.

### 6.2 `approvedPairs.json` — authored, not generated

Location: `/tokens/authored/approvedPairs.json`. This is a designer-authored file, committed directly. It is **not** CLI-generated — the "no-direct-edits" rule applies to `/tokens/normalized/` and `/generated/`, not to `/tokens/authored/`.

Schema:

```json
{
  "$description": "Declared foreground/background pairs for WCAG validation. See DESIGN-DECISIONS.md §6.",
  "pairs": [
    {
      "fg": "semantic.foundation.content.default",
      "bg": "semantic.foundation.surface.0",
      "textSize": "normal",
      "targetLevel": "AA",
      "usage": "body text on default surface"
    }
  ]
}
```

Fields:
- **`fg`**, **`bg`** — token paths, resolved in the target theme mode.
- **`textSize`** — one of:
  - `"normal"` — text below WCAG large-text threshold. Caption, body-sm, body-md, title-sm all sit here.
  - `"large"` — text ≥18pt (~24px) or ≥14pt (~18.66px) bold per WCAG. Title-lg, headings, displays qualify when rendered.
  - `"non-text"` — UI components, borders, icons, focus rings. Per WCAG 1.4.11.
- **`targetLevel`** — `"AA"` or `"AAA"`.
- **`usage`** — free-text human description; does not affect validation math.

A co-located `approvedPairs.schema.json` (JSON Schema) validates file structure on commit.

Source of truth for what contrast the lint step enforces.

### 6.3 Known encoded rule — feedback colors

Feedback colors (`alert`, `success`, `warning`, `info`) fail AA for normal text on light surfaces (they measure 3.89–4.07:1, below the 4.5:1 threshold). They are **not** valid `fg` values in `approvedPairs.json` where `textSize: "normal"` on `surface.0` or `surface.1`.

Permitted entries:
- `textSize: "large"` on light surfaces (needs 3:1 — feedback colors clear this)
- `textSize: "non-text"` for icons, fills, pills, borders, focus rings (needs 3:1)

The CLI lint step fails builds where feedback colors are declared with `textSize: "normal"` on a light surface.

### 6.4 Rule about emphasis

`interactive.primary` passes AA for all text on white (6.72:1). Free to use on body text for links and primary actions.

---

## 7. Tooling

### 7.1 Paper source = authoring

Designers author in `tokens/source/paper/`. The Markdown section files explain intent for human review, and `tokens.paper.json` is the canonical structured source imported by the CLI.

### 7.2 No design-tool dependency in v1

Evaluated and rejected for v1. A design-tool/plugin workflow adds accounts, export formats, and review ambiguity before the token model is proven. Paper source keeps the first version small: reviewable in PRs, editable by any teammate, and machine-checkable from day one.

### 7.3 Custom CLI = transform layer

The CLI is what makes the whole system work. It:
- Imports the paper source library into a raw snapshot
- Normalizes structure (splits tiers, resolves aliases, validates modes, prepares density stubs)
- Lints (layer discipline, contrast, drift, mode completeness)
- Builds consumer artifacts (CSS, types, Tailwind config, DESIGN.md)

Full contract in `docs/cli-spec.md`.

### 7.4 Paper sections match normalized naming

The paper source is organized around the names the normalized package will emit: primitives, semantic foundation/feedback/interactive, spacing, radius, typography, components, and domain. It uses `light` directly for the theme mode and keeps density modes explicit even while v1 values are stubbed.

**Why:** having two vocabularies (one in authoring, one in code) creates a translation tax on every conversation and every tool integration. Making them match keeps the library readable before a designer ever runs the CLI.

---

## 8. Versioning

### 8.1 Semver on the token package

- **Major:** breaking rename, tier restructure, token removal, mode removal.
- **Minor:** new tokens, new modes, new approved pairs, new role/size combinations.
- **Patch:** value updates, alias redirects, lint rule additions, documentation fixes.

### 8.2 Conventional Commits

Commits that touch `/tokens/**` use Conventional Commits format:

```
feat(tokens): add semantic.feedback.info
fix(tokens): correct body-sm weight mismatch
BREAKING CHANGE: rename semantic.feedback.alert to semantic.feedback.danger
```

CI validates format on PR. `BREAKING CHANGE:` footers bump major.

### 8.3 Version stamping

Every generated artifact (`DESIGN.md`, `tokens.css`, `token-types.d.ts`, `tailwind.tokens.ts`) includes a version header:

```
/* Lead Design Tokens v1.2.3 — generated from commit abc123f */
```

Consumers can trace any issue to a specific token version.

### 8.4 Changelog

`CHANGELOG.md` generated from commit history. Lives at repo root.

---

## 9. Component architecture — deferred to phase 2

### 9.1 v1 disposition

The current `buttons.*` collection is flat (one color per variant, no anatomy, no states). In v1 normalization it **passes through unchanged** and is flagged by the lint step as non-conformant. No component work happens in v1.

### 9.2 Phase 2 plan

- Adopt Shadcn as the component base.
- Define component anatomy per component: `button.primary.{bg, fg, border}.{default, hover, active, disabled, focus}`.
- Component tokens reference semantic tokens, never primitives.
- Lead Bank domain components (rail-badge, case-card, transaction-row) compose on top of Shadcn primitives.

Phase 2 has its own decisions doc when it starts.

---

## 10. Domain tokens — deferred

Payment rails (ACH, wire, check, internal, RTP, FedNow, crypto, international wire, loan), transaction states, case states, account types, and entity types all live in a `domain.*` namespace above component tokens.

Deferred in v1. Phase 2 or phase 3. The architecture is ready for them; the values aren't written yet.

Scaling principle when they arrive: adding a new rail is **one token entry** in `domain.rail.*` that references semantic colors. Rail-badge components read `domain.rail.{name}.color` pattern-wise, so new rails propagate automatically through UI without component changes.

---

## 11. Data cleanup — paper source baseline

These historical export issues are resolved in the paper source baseline. Normalize and lint still validate the resulting shape; if any of these patterns reappear, the CLI fails before build.

**11.1 — Primitive schema:**
- `colors.red` has ghost keys `"1300 2"` and `"1300 3"`. Strip or merge into canonical steps.
- `colors.blue` has nonstandard structure `blue-1` through `blue-4` instead of the 100–1000 scale. Restructure to match other ramps without losing source provenance.

**11.2 — Duplicate semantic values:**
- `colors-shift.shift_100` through `shift_400` are all `#4B5B9F`. Collapse to however many distinct values actually exist.
- `colors-surface.surface_0` == `surface_200` (`#F7F7F8`); `surface_100` == `surface_300` (`#FFFFFF`). Two real values, not four. Rename or collapse.

**11.3 — Typography drifts:** per §4.3.3.

**11.4 — Modes:** paper source uses `light` directly.

**11.5 — Semantic restructure:** `colors-system` splits per §3.

---

## 12. Document ownership and approval

- `DESIGN-DECISIONS.md`: Jeshua owns, Jeshua approves all changes. PRs that modify this file require his explicit review.
- `DESIGN.md`: generated. No direct edits. PRs that modify it manually are rejected by CI.
- `docs/cli-spec.md`: Jeshua owns and approves. Changes to the CLI contract require a corresponding entry here first.
- `/tokens/source/paper/**`: designer / design-system-owner authored. Markdown explains intent; `tokens.paper.json` is the canonical machine source.
- `/tokens/raw/paper/**`: generated by CLI `import`. No direct edits after snapshot.
- `/tokens/authored/*.json`: designer / design-system-owner hand-edited, committed directly. Validated by schema on commit. Currently contains `approvedPairs.json` (+ schema) and `sourceExceptions.json` (+ schema).
- `/tokens/normalized/*.json`: generated by CLI `normalize`. No direct edits.
- `/generated/**`: generated by CLI `build`. No direct edits.

---

## 13. Non-conformance to Google's DESIGN.md spec

Lead's `DESIGN.md` is a **token inventory optimized for CLI and agent consumption**. It borrows the filename and the broad idea from Google's open-source spec but does not conform to the YAML-front-matter-plus-nine-prose-sections format.

Why: Google's spec is optimized for a tool that generates starter codebases from design prompts. Lead's DESIGN.md is optimized for agents operating on an existing codebase and needing a machine-readable state summary. Different purpose → different format.

If Google's spec ever becomes industry-standard and tooling emerges that would benefit Lead, revisit.

---

## Decisions Log (numbered for cross-reference)

A flat numbered index of decisions for the CLI spec and other docs to cite. Each number is stable; new decisions get new numbers at the end.

| # | Decision |
|---|----------|
| D1 | Four-layer token tier: primitives → semantic → component → domain. (§2.1) |
| D2 | Semantic splits into foundation, feedback, interactive. (§2.1.2, §3) |
| D3 | Modes are orthogonal dimensions, not tiers. (§1.2, §2.2) |
| D4 | Split `colors-system`: Alert/Success/Warning → feedback. (§3) |
| D5 | `Emphasis` → `semantic.interactive.primary`. (§3) |
| D6 | `Generic` re-homes to `semantic.feedback.info`. (§3.3) |
| D7 | Gap and padding stay as separate collections; drift requires justification. (§4.1) |
| D8 | Radius frozen across density modes in v1. (§4.2, §5.4) |
| D9 | Typography has three orthogonal dimensions: role, size, line-height. (§4.3.1) |
| D10 | Target: ~20 role×size combinations + 3 line-heights. (§4.3.2) |
| D11 | Typography drift fixes: Body-Sm weight, Title-Md-Emphasis pair, code scale, tracking. (§4.3.3) |
| D12 | Density mental model: expertise × frequency. (§5.1) |
| D13 | Three density modes: comfortable, snug, compact. Snug is default. (§5.1) |
| D14 | Density affects spacing, line-height, data-dense text sizes. (§5.2) |
| D15 | Size floors: 12px for text roles, 13px for body-sm. `nonText`-classified sizes exempt (validated under WCAG 1.4.11). (§5.3) |
| D16 | Density does NOT affect radius, color, border weights, hierarchy text sizes. (§5.4) |
| D17 | v1 stubs density modes with identical values across comfortable/snug/compact. (§5.5) |
| D18 | Density runtime: `[data-density]` with subtree overrides. (§5.6) |
| D19 | Approved-pair contrast validation, not exhaustive. (§6.1) |
| D20 | `approvedPairs.json` is authored in `/tokens/authored/` with explicit `textSize` + `targetLevel` schema. Validated by co-located JSON Schema. (§6.2) |
| D21 | Feedback colors not valid for `textSize: "normal"` on light surfaces. (§6.3) |
| D22 | Paper source is the authoring surface; no design-tool dependency in v1. (§7.1, §7.2) |
| D23 | Paper source sections match normalized naming. (§7.4) |
| D24 | Paper source uses `light` directly as the initial theme mode. (§7.4, §11.4) |
| D25 | Semver on token package, Conventional Commits enforced. (§8.1, §8.2) |
| D26 | Every generated artifact includes a version header. (§8.3) |
| D27 | Flat `buttons.*` passes through v1 normalization, flagged non-conformant. (§9.1) |
| D28 | Component anatomy is phase 2. (§9.2) |
| D29 | Domain tokens are phase 2 or 3. (§10) |
| D30 | Paper source baseline must preserve cleanup of red ghost keys, blue structure, and shift/surface dupes; normalize/lint reject regressions. (§11) |
| D31 | Jeshua owns and approves DESIGN-DECISIONS.md and CLI spec. (§12) |
| D32 | DESIGN.md non-conformant to Google's spec; optimized for agents + CLI. (§13) |
| D33 | CLI warns on typography drifts and source-data below-floor violations; never auto-synthesizes missing pairs. (§4.3.3, §5.3) |
| D34 | Four-tier ownership: `raw/` (imported) → `authored/` (hand-edited) → `normalized/` (CLI-generated) → `generated/` (CLI-built). (§12) |
| D35 | CI verifies that every `[D##]` reference across docs resolves to a decision in the log, and that the log is monotonically numbered. (CLI spec §6) |
| D36 | Source-data exceptions tracked explicitly in `/tokens/authored/sourceExceptions.json`. Each exception names one token, one rule (enum: L5-size-floor, L7-weight-mismatch, L7-tracking-mismatch), a reason, and a `resolvedBy` date (ISO or quarter shorthand, resolving to end-of-quarter in America/New_York). L7 exceptions require `tiebreak` field (enum: leading, no-leading). Parsed once in a shared pre-stage consumed by both normalize and lint. Overdue exceptions warn non-blocking. (§4.3.3, §5.3) |
| D37 | Authored files seeded by `import` command, not `normalize`. Ensures `sourceExceptions.json` and `approvedPairs.json` exist before any exception-dependent stage runs. (CLI spec §2) |
| D38 | Normalized typography tokens carry `$extensions["leadbank.sourceExceptionApplied"]` metadata when a tiebreak resolved a paired-variant conflict. Lint reads both this metadata and `_normalization-report.json` as evidence when validating L7 resolution. (CLI spec §3, §4) |
