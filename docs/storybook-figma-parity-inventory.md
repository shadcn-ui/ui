# Storybook ↔ Figma Visual Parity Inventory

**Status:** snapshot updated 2026-05-05 after JES-92 merged. Tracks Linear `JES-91`. See [`storybook-figma-parity-standard.md`](./storybook-figma-parity-standard.md) for the working standard each row in this inventory is being measured against.

This is the canonical list of every Lead component, its Figma source node, and its current Storybook parity status. New parity work picks rows from here in the recommended batch order at the bottom.

## Recent updates

- **2026-05-05 — JES-92 / Batch A merged** ([PR #46](https://github.com/jnanthak83/lead-design-system/pull/46), merge `55714fbc4`). Five components moved to 🟢: Separator, Progress, Skeleton, Alert, Badge. Three documented non-parity exceptions (all API-shape): Skeleton `Default`/`Card` caller compositions, Alert Icon slot, Badge Outline missing. See PR for full per-component delta.
- **2026-05-05 — JES-90 / JES-91 merged.** This doc and the parity standard landed on `main`.

---

## Inventory

**Legend (Status column):**

- 🟢 **Done** — production parity stories exist with documented exceptions; deployed Storybook visually matches Figma.
- 🟡 **Has experimental** — experimental Figma-export story exists but production parity stories are not yet aligned.
- 🟠 **Production-only** — production stories exist (pre-date the parity standard); no parity audit yet.
- 🔵 **Blocked: no Figma node** — the component is shipped in Lead but has no source-of-truth Figma component to compare against.

| Component | Figma node | Production story | Experimental export | Parity stories | Status | Notes |
|---|---|---|---|---|---|---|
| **Accordion** | [`29:66202`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66202) (root) + [`29:66236`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66236) (item) | ✅ `Accordion.stories.tsx` | — | — | 🟠 | Compositional. Likely needs item-level parity story showing trigger states. |
| **Alert** | [`29:66418`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66418) | ✅ `Alert.stories.tsx` | — | ✅ `Figma parity (Default + Destructive)` | 🟢 | JES-92. Documented non-parity: Icon=true → caller-supplied `icon?: ReactNode` (API-CONSISTENCY §8.5). |
| **AlertDialog** | [`29:66659`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66659) (symbol) + [`29:66660`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66660) (md) + [`29:66667`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66667) (sm) | ✅ `AlertDialog.stories.tsx` (4 stories) | ✅ `AlertDialog.figma-export.stories.tsx` | ✅ `Figma parity (md)`, `Figma parity (sm)` | 🟢 | **Reference pattern.** Decision doc `alert-dialog-primitive-decision.md`. Two non-parity exceptions: button order (decision §4), sm width (compact 360px vs Figma 512px). |
| **Badge** | [`29:66938`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66938) | ✅ `Badge.stories.tsx` | ✅ `Badge.figma-export.stories.tsx` | ✅ `Figma parity (Default / Secondary / Destructive / Verified)` | 🟢 | JES-92. Documented non-parity: Outline has no Lead variant (lives in experimental export only). |
| **Button** | [`29:67711`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-67711) (root, see also `29:383`/`29:384`/`29:636` referenced in design context) | ✅ `Button.stories.tsx` | — | — | 🟠 | High-traffic component. Many variants (primary/secondary/outline/ghost/danger). Worth careful per-variant parity. |
| **Card** | [`29:72255`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-72255) | ✅ `Card.stories.tsx` | ✅ `Card.figma-export.stories.tsx` | — | 🟠 | Compositional. Production parity story pending Batch C (JES-94). Experimental export still exists at `Experimental / Figma Export / Card` — image-card variant approximated; Avatar component absent. |
| **Checkbox** | [`29:85556`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-85556) | ✅ `Checkbox.stories.tsx` | — | — | 🟠 | |
| **Dialog** | [`29:91865`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-91865) | ✅ `Dialog.stories.tsx` | — | — | 🟠 | Distinct from AlertDialog. Stacked-footer-at-sm consistency rule already applied (PR #43). |
| **DropdownMenu** | [`29:92788`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92788) (root), [`29:92680`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92680) (content), [`29:92735`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92735) (item), [`29:92802`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92802) (label), [`29:92856`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92856) (separator), [`29:92869`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92869) (sub-trigger) | ✅ `DropdownMenu.stories.tsx` | — | — | 🟠 | Highest-complexity inventory entry: variant-as-component-switch already documented in Code Connect mapping. Parity stories should mirror Default/Checkbox/Radio/Icon variants. |
| **Field** | — (compositional wrapper; no standalone Figma node yet) | ✅ `Field.stories.tsx` | — | — | 🔵 | Used inside other components' compositions (e.g. Select). Per `figma-to-code-automation-roadmap.md` §6, intentional unmapped — wait for design to publish source-of-truth nodes before adding parity stories. |
| **Input** | [`29:95030`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-95030) | ✅ `Input.stories.tsx` | — | — | 🟠 | |
| **Label** | — (compositional; no standalone Figma node) | ✅ `Label.stories.tsx` | — | — | 🔵 | Same as Field — embedded labels exist within trigger/control variants but no standalone source node. |
| **Popover** | [`29:96969`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-96969) | ✅ `Popover.stories.tsx` | — | — | 🟠 | Code Connect mapping is example-only (no Figma text/enum props). Parity story should mirror canonical positioning + arrow. |
| **Progress** | [`29:97110`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97110) | ✅ `Progress.stories.tsx` | — | ✅ `Figma parity (Percent variants)` | 🟢 | JES-92. No documented non-parity — Figma `Percent` enum is discrete subset of Lead's continuous `value`. |
| **RadioGroup** | [`29:97236`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97236) (item) | ✅ `RadioGroup.stories.tsx` | — | — | 🟠 | Figma node is item-level; group-level Figma node may not exist (similar to Field/Label). |
| **Select** | [`29:98157`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98157) (trigger/control), [`29:97998`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97998) (item), [`29:97936`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97936) (label), [`29:98193`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98193) (menu) | ✅ `Select.stories.tsx` | — | — | 🟠 | Compositional with multiple Figma nodes. Trigger/control node represents the *whole labeled field*, not just the button — see `Select.figma.tsx` for the mapping rationale. |
| **Separator** | [`29:98862`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98862) | ✅ `Separator.stories.tsx` | — | ✅ `Figma parity (horizontal + vertical)` | 🟢 | JES-92. Clean 1:1 mapping; no documented non-parity. |
| **Skeleton** | [`29:103198`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103198) | ✅ `Skeleton.stories.tsx` | — | ✅ `Figma parity (Default / Card / Text compositions)` | 🟢 | JES-92. Documented non-parity: Figma `Default`/`Card` are caller-side compositions of Lead's `text`/`rect`/`circle` shape primitives. |
| **Switch** | [`29:103697`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103697) | ✅ `Switch.stories.tsx` | — | — | 🟠 | |
| **Tabs** | [`29:105685`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105685) (root), [`29:105668`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105668) (trigger) | ✅ `Tabs.stories.tsx` | — | — | 🟠 | |
| **Tooltip** | [`29:107066`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-107066) | ✅ `Tooltip.stories.tsx` | — | — | 🟠 | Side enum maps cleanly. |

**Summary counts (after JES-92 / Batch A):**

- 🟢 Done: **6** (AlertDialog, Alert, Badge, Progress, Separator, Skeleton)
- 🟡 Has experimental: **0** (Card moved to 🟠 — its experimental export still exists, but its production-parity stories are now scheduled in Batch C / JES-94 alongside other compositional content components, so it's tracked under the same status as the other Batch C rows)
- 🟠 Production-only: **13** (Accordion, Button, Card, Checkbox, Dialog, DropdownMenu, Input, Popover, RadioGroup, Select, Switch, Tabs, Tooltip)
- 🔵 Blocked: **2** (Field, Label — intentional, awaiting Figma source nodes)

---

## Recommended batch order

Each batch is a Linear issue (JES-92 through JES-95). Batch order is set by **risk + Figma surface complexity + likelihood of needing a decision PR**, ascending.

Inside each batch, components are independently ship-able as separate PRs — the batching is for prioritization, not bundling.

### Batch A — JES-92: visual primitives ✅ DONE

Shipped 2026-05-05 in [PR #46](https://github.com/jnanthak83/lead-design-system/pull/46) (merge `55714fbc4`). Five components moved to 🟢: Separator, Progress, Skeleton, Alert, Badge. Three documented non-parity exceptions (all API-shape, all permanent design-system choices): Skeleton `Default`/`Card` caller compositions, Alert Icon slot, Badge Outline missing. The batch shipped as a single Storybook-only PR rather than the originally-estimated 4-5 separate PRs — bundle-by-batch turned out lower-overhead than per-component PRs at this scope.

### Batch B — JES-93: form controls (low risk, likely no decision docs)

Standalone form controls with single Figma surface. Likely match cleanly; if not, the gap is usually a token issue (token PR), not an API decision.

| Component | Figma node | Reason |
|---|---|---|
| **Checkbox** | `29:85556` | |
| **Switch** | `29:103697` | |
| **RadioGroup** | `29:97236` (item) | Figma node is item-level; group composition is React-side. |
| **Input** | `29:95030` | |
| **Tooltip** | `29:107066` | Side enum maps cleanly. |

**Estimated:** 5 PRs, each Storybook-stories-only.

### Batch C — JES-94: compositional content (medium risk)

Compositional or content-heavy components. May reveal Figma surface that needs decision-doc treatment (similar to AlertDialog) before parity stories can ship.

| Component | Figma node | Reason |
|---|---|---|
| **Alert** | `29:66418` | Inline status. Icon-prop exception already documented. |
| **Card** | `29:72255` | Has experimental export. Multiple compositions to mirror; image asset and Avatar may need API decisions or stay approximated. |
| **Tabs** | `29:105685` + `29:105668` | Trigger states (default/active/disabled) and orientation. |
| **Accordion** | `29:66202` + `29:66236` | Item-state visual changes (open/closed/disabled). |

**Estimated:** 4 PRs. Card and Accordion may spawn decision doc PRs first.

### Batch D — JES-95: overlays + complex (highest risk)

Overlay primitives and the highest-complexity component (DropdownMenu). Most likely to surface decision-doc-worthy gaps. Should be done last, after the Lane has built parity-PR muscle memory on simpler components.

| Component | Figma node | Reason |
|---|---|---|
| **Dialog** | `29:91865` | Distinct from AlertDialog. Visual differences may surface stacked-footer-at-md questions. |
| **Popover** | `29:96969` | Code Connect mapping is example-only; Figma surface is sparse. Parity story documents canonical positioning. |
| **Select** | `29:98157` + 3 more | Compositional with multiple Figma nodes. Trigger/control node represents *whole labeled field*. |
| **DropdownMenu** | `29:92788` + 5 more | Highest complexity. Variant-as-component-switch is already documented; parity should mirror Default/Checkbox/Radio variants. |
| **Button** | `29:67711` | High-traffic; many variants. Saved for Batch D because every Lead app touches it — parity changes have wide blast radius. |

**Estimated:** 5 PRs. DropdownMenu, Select, and Button are most likely to spawn decision PRs.

---

## What this inventory does NOT do

- **Does not modify any production component.** Pure docs.
- **Does not start parity work.** Each batch ticket (JES-92 through JES-95, to be filed) is the actual implementation work.
- **Does not commit to a date or order beyond batch grouping.** Inside each batch, individual components can ship in any order based on reviewer availability and design-team feedback.
- **Does not promise that every component reaches 🟢.** Some intentional exceptions (Field, Label, Skeleton's `Card` variant) will stay 🔵/🟠 forever by design. That's the point of the exception format in the standard doc.

---

## What changes when this lands on `main`

- Future parity PRs reference these two docs in their PR body for the standard + the inventory row.
- The roadmap's Lane 3 status section can link to both docs as the "what's next" surface.
- New components added to Lead must add a row to this inventory (or document why a Figma node doesn't exist).
- The 🟢/🟡/🟠/🔵 status of each row is updated as parity work lands.

---

## Tracked Linear issues

- **JES-90** — this standard's authority issue.
- **JES-91** — this inventory's authority issue.
- **JES-92** (to file) — Batch A: Separator / Skeleton / Progress / Badge.
- **JES-93** (to file) — Batch B: Checkbox / Switch / RadioGroup / Input / Tooltip.
- **JES-94** (to file) — Batch C: Alert / Card / Tabs / Accordion.
- **JES-95** (to file) — Batch D: Dialog / Popover / Select / DropdownMenu / Button.
