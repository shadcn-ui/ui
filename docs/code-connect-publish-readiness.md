# Figma Code Connect — Publish Readiness Audit

**Status (as of merge `293ef2679`, 2026-04-27):** publishing remains **disabled**. All known mappings are dry-run-validated against live Figma. This document is the single-source checklist for enabling publish — read it end-to-end before flipping any flag.

---

## 1. Current mapping inventory

**18 mapping files. 30 logical `figma.connect()` calls. 9 components fully mapped, 9 component families with multiple subcomponent mappings, 2 components intentionally unmapped (see §6).**

| Component | File | `figma.connect()` calls | Notes |
|---|---|---|---|
| Accordion | `packages/lead-ui/src/components/Accordion/Accordion.figma.tsx` | 2 | Root (example-only) + AccordionItem |
| Alert | `packages/lead-ui/src/components/Alert/Alert.figma.tsx` | 1 | |
| Badge | `packages/lead-ui/src/components/Badge/Badge.figma.tsx` | 1 | Outline variant unmapped (no Lead equivalent) |
| Button | `packages/lead-ui/src/components/Button/Button.figma.tsx` | 1 | |
| Card | `packages/lead-ui/src/components/Card/Card.figma.tsx` | 1 | |
| Checkbox | `packages/lead-ui/src/components/Checkbox/Checkbox.figma.tsx` | 1 | |
| Dialog | `packages/lead-ui/src/components/Dialog/Dialog.figma.tsx` | 1 | Title + Description as locals |
| DropdownMenu | `packages/lead-ui/src/components/DropdownMenu/DropdownMenu.figma.tsx` | 8 | Variant-as-component-switch: Default→Item, Checkbox→CheckboxItem, Radio→RadioItem |
| Input | `packages/lead-ui/src/components/Input/Input.figma.tsx` | 1 | |
| Popover | `packages/lead-ui/src/components/Popover/Popover.figma.tsx` | 1 | example-only |
| Progress | `packages/lead-ui/src/components/Progress/Progress.figma.tsx` | 1 | Percent enum → numeric value |
| RadioGroup | `packages/lead-ui/src/components/RadioGroup/RadioGroup.figma.tsx` | 1 | RadioGroupItem (item-level, not group) |
| Select | `packages/lead-ui/src/components/Select/Select.figma.tsx` | 4 | Trigger/Item/Label/Content |
| Separator | `packages/lead-ui/src/components/Separator/Separator.figma.tsx` | 1 | Clean orientation enum |
| Skeleton | `packages/lead-ui/src/components/Skeleton/Skeleton.figma.tsx` | 1 | Only Text variant mapped |
| Switch | `packages/lead-ui/src/components/Switch/Switch.figma.tsx` | 1 | |
| Tabs | `packages/lead-ui/src/components/Tabs/Tabs.figma.tsx` | 2 | Root (example-only) + TabsTrigger |
| Tooltip | `packages/lead-ui/src/components/Tooltip/Tooltip.figma.tsx` | 1 | Side enum → Radix side prop |

Verify the count locally:

```bash
grep -c "^figma.connect(" packages/lead-ui/src/components/*/*.figma.tsx | awk -F: '{s+=$2} END {print s}'
```

---

## 2. Dry-run status

**Last full dry-run: 2026-04-27, on PR #30.** Result: `All Code Connect files are valid (3271ms)` — every mapping resolved against the live Figma file. The dry-run output also surfaced macOS-Finder duplicate `*.figma 2.tsx` files in the parser results (since cleaned up in PR #31).

A fresh dry-run is **required** before flipping `FIGMA_CODE_CONNECT_ENABLED`:

```bash
cd packages/lead-ui
FIGMA_ACCESS_TOKEN=figd_… npx figma connect publish --dry-run
```

Expected output: every mapping listed once (no duplicates), and `All Code Connect files are valid` at the end. The `cd packages/lead-ui` matters — Code Connect resolves the `react` parser via the nearest `package.json` peer dep.

---

## 3. Duplicate hygiene

`find . -name '* 2.*'` (excluding `node_modules` / `.git`) returns **empty**. The macOS-Finder accidental-duplicate rule in `.gitignore`:

```gitignore
# macOS Finder accidental duplicates ("Foo 2.tsx", "package 2.json", etc.).
# These are working-tree noise; never commit them.
* 2.*
* 2
```

is on `main` from PR #31. This prevents `Cmd-D` Finder duplicates from being committed. **Note:** this does *not* prevent the Code Connect parser from picking up untracked duplicates in the working tree — the parser walks the filesystem, ignoring git state. If duplicates ever reappear locally, delete them manually (`find . -name '* 2.*' -not -path '*/node_modules/*' -delete`) before running publish.

---

## 4. Publish prerequisites

Before flipping the publish flag, the repo needs:

1. **`FIGMA_ACCESS_TOKEN` GitHub Actions secret.**
   - Settings → Secrets and variables → Actions → New repository secret.
   - Name: `FIGMA_ACCESS_TOKEN`. Value: a personal access token with Code Connect write scope (`figd_…`).
   - Never paste this token into commits, PR bodies, issue comments, CI logs, or `.env` files committed to the repo.

2. **`FIGMA_CODE_CONNECT_ENABLED` GitHub Actions variable.**
   - Settings → Secrets and variables → Actions → Variables tab → New repository variable.
   - Name: `FIGMA_CODE_CONNECT_ENABLED`. Value: `false` initially.
   - Flipping to `true` is the publish-enable step (§5).

3. **Up-to-date dry-run.** Most recent green dry-run should be against `main` HEAD or a still-open PR. If the last dry-run is more than ~1 day old or Figma components have moved since, re-run §2.

---

## 5. Safe enablement steps

Follow these in order. Stop at the first failure.

1. **Confirm prerequisites.** `FIGMA_ACCESS_TOKEN` secret and `FIGMA_CODE_CONNECT_ENABLED` variable both exist (§4). Variable currently reads `false`.

2. **Run a final dry-run** locally with the same token (§2). Output must be `All Code Connect files are valid` with no duplicates listed.

3. **Communicate.** Post in the design-system channel that publish is about to flip on. This gives Figma users a heads-up that Dev Mode code snippets are about to update.

4. **Flip the variable.** Settings → Variables → edit `FIGMA_CODE_CONNECT_ENABLED` → set to `true`. No PR or commit needed.

5. **Trigger the publish workflow.** The repo's existing workflow (or run `npm run figma:code-connect:publish` from a CI job that has `FIGMA_ACCESS_TOKEN` in scope) — **never run real publish from a developer laptop unless explicitly authorized for an emergency fix.**

6. **Verify in Figma Dev Mode.** Open one mapped component (e.g. Button at node `29:67711`), confirm the Lead React snippet appears under "Code".

7. **Watch for one full day.** Any Figma user who reports stale code should be diagnosed against the merged mapping (mapping bug → patch PR), not by toggling the flag back off.

---

## 6. Remaining unmapped components

| Component | Reason unmapped | Path forward |
|---|---|---|
| `Field` (form field group) | Compositional wrapper; Figma file has no `Field` source-of-truth node distinct from individual control nodes (Input/Select/Checkbox already map their containers). Mapping `Field` would require a Figma node that doesn't exist in the manifest yet. | Wait for design to publish a `Field` component in Figma, then add a mapping PR. |
| `Label` | Same — used inside other components' `figma.connect()` examples (`Field` + `FieldLabel`), but no standalone `Label` Figma node distinct from the labels embedded in trigger/control variants. | Same — add when Figma exposes a standalone `Label` component. |

**Variant gaps within mapped components** (documented in each `.figma.tsx` file):
- Badge `Outline` — no Lead variant.
- Skeleton `Default` / `Card` — no clean React equivalent.
- DropdownMenuItem `Variant=Icon` — Lead has no icon prop; not invented.
- Most components: hover/focus/pressed/error states are runtime UI states, not React props.

These are *intentional* gaps, not TODOs. Adding a Lead variant or prop to close them is a deliberate API decision.

---

## 7. Rollback

If publish goes wrong (designers see broken or wrong snippets):

1. **Disable publish immediately.** Settings → Variables → set `FIGMA_CODE_CONNECT_ENABLED=false`. Existing snippets in Figma remain visible until the next publish replaces or removes them; new mappings will not publish.

2. **Revert the offending mapping PR if the bug is in a recent change.** `git revert <merge-commit>` and merge the revert. Re-flip `FIGMA_CODE_CONNECT_ENABLED=true` only after a fresh dry-run is green again.

3. **Hard rollback (rare).** If a wide swath of Figma components has gone stale and pinning the flag off isn't enough, contact Figma support to clear the connection registry — the publish API doesn't expose a "delete all" operation.

---

## 8. What not to do

- **Do not paste `FIGMA_ACCESS_TOKEN` into commits, PR descriptions, issue comments, or any committed file.** It belongs in repo secrets only.
- **Do not run `npm run figma:code-connect:publish` from a developer laptop** unless explicitly authorized for an emergency fix. Real publish belongs in CI.
- **Do not add fake or placeholder Figma URLs** to mapping files. Every `figma.connect()` URL must use a real `node-id` from the design file. (See PR #4 / PR #10 history for the dry-run validation requirement.)
- **Do not flip `FIGMA_CODE_CONNECT_ENABLED=true` without a recent green dry-run.** The flag is the only thing standing between an untested mapping and a broken Dev Mode experience.
- **Do not invent React props to match Figma surface.** When a Figma property has no truthful React equivalent, document it as unmapped — see Skeleton `Card`, DropdownMenu `Variant=Icon`, etc.

---

## 9. Bundle impact

`*.figma.tsx` files are excluded from the runtime bundle via `tsconfig.build.json`'s exclusion (added in PR #10). Verified: `find packages/lead-ui/dist -name '*.figma*'` returns empty after `npm run lead:ui:build`. Bundle size at this audit: **57.70 kB gzipped JS / 4.57 kB gzipped CSS** — within the API-CONSISTENCY budget (60 kB warn / 75 kB hard / 90 kB ceiling).

Mapping files are dev/Figma-tooling artifacts only. Adding more mappings does not increase what end-user apps ship.
