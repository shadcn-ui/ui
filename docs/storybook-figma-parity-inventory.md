# Storybook ↔ Figma Visual Parity Inventory

**Status:** snapshot updated 2026-05-09 after JES-108. **Lane 3 parity sweep is complete: 21/21 components 🟢 (100%).** Field and Label were previously blocked, but standalone Figma source components now exist and production parity stories reference them. Tracks Linear `JES-91`. See [`storybook-figma-parity-standard.md`](./storybook-figma-parity-standard.md) for the working standard each row in this inventory is being measured against.

This is the canonical list of every Lead component, its Figma source node, and its current Storybook parity status. New parity work picks rows from here in the recommended batch order at the bottom.

## Recent updates

- **2026-05-09 — JES-108 / Field + Label source gap closed.** Standalone Figma source components were created directly in the Lead staging file: Label component set [`213:116`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=213-116), Field component set [`216:1154`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1154), and FieldGroup component [`216:1155`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1155). Two components moved from 🔵 to 🟢 with production parity stories. **Lane 3 milestone reaches 21/21 🟢 (100%).**
- **2026-05-08 — JES-95 / Batch D merged** ([PR #52](https://github.com/jnanthak83/lead-design-system/pull/52), merge `0b2b3ffd8`). **Final batch.** Five components moved to 🟢: Button, Dialog, Popover, Select, DropdownMenu. Five exception sets documented (4 API-shape, 1 zero-exception): Button (Link variant + icon size + runtime states), Dialog (Breakpoint naming difference), Popover (**zero exceptions** — example-only mapping), Select (Show booleans + runtime states + item Variant=Checkbox), DropdownMenu (Variant=Icon + Show Shortcut + runtime states). Live Figma MCP unavailable; sourced from Code Connect mappings. **Lane 3 milestone reaches 19/21 🟢 (90%) — structurally complete. Field/Label remain 🔵 by design.**
- **2026-05-06 — JES-94 / Batch C merged** ([PR #50](https://github.com/jnanthak83/lead-design-system/pull/50), merge `3aa6a21be`). Three components moved to 🟢: Card, Tabs, Accordion. Three documented non-parity exceptions (all API-shape): Card section booleans → React composition, Tabs/Accordion per-element Active is parent-value-driven (Radix controlled-value semantics). Live Figma MCP unavailable; sourced from Code Connect mappings. **Lane 3 milestone now at 14/21 components 🟢 (67%).**
- **2026-05-06 — JES-93 / Batch B merged** ([PR #48](https://github.com/jnanthak83/lead-design-system/pull/48), merge `5252b0814`). Five components moved to 🟢: Checkbox, Switch, RadioGroupItem, Input, Tooltip. Four documented non-parity exceptions (all API-shape): Checkbox Focus/Pressed runtime CSS, Switch Type=Box / Side variants, RadioGroupItem Type / Font Weight caller styling, Input Variant=File + runtime Focus/Filled states. Tooltip is the lane's first "no exception" parity (Figma surface maps 1:1 to `<TooltipContent>` props). Live Figma MCP unavailable; sourced from Code Connect mappings (parity-standard fallback path).
- **2026-05-05 — JES-92 / Batch A merged** ([PR #46](https://github.com/jnanthak83/lead-design-system/pull/46), merge `55714fbc4`). Five components moved to 🟢: Separator, Progress, Skeleton, Alert, Badge. Three documented non-parity exceptions (all API-shape): Skeleton `Default`/`Card` caller compositions, Alert Icon slot, Badge Outline missing. See PR for full per-component delta.
- **2026-05-05 — JES-90 / JES-91 merged.** This doc and the parity standard landed on `main`.

---

## Inventory

**Legend (Status column):**

- 🟢 **Done** — production parity stories exist with documented exceptions; deployed Storybook visually matches Figma.
- 🟡 **Has experimental** — experimental Figma-export story exists but production parity stories are not yet aligned.
- 🟠 **Production-only** — production stories exist (pre-date the parity standard); no parity audit yet.
- 🔵 **Blocked: no Figma node** — the component is shipped in Lead but has no source-of-truth Figma component to compare against. No current rows are blocked after JES-108.

| Component | Figma node | Production story | Experimental export | Parity stories | Status | Notes |
|---|---|---|---|---|---|---|
| **Accordion** | [`29:66202`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66202) (root) + [`29:66236`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66236) (item) | ✅ `Accordion.stories.tsx` | — | ✅ `Figma parity (Active On/Off + Trigger Text + Content Text)` | 🟢 | JES-94. Documented non-parity: per-item Active is parent-value-driven (Radix controlled value); State=Hover/Focus/Pressed are runtime CSS. |
| **Alert** | [`29:66418`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66418) | ✅ `Alert.stories.tsx` | — | ✅ `Figma parity (Default + Destructive)` | 🟢 | JES-92. Documented non-parity: Icon=true → caller-supplied `icon?: ReactNode` (API-CONSISTENCY §8.5). |
| **AlertDialog** | [`29:66659`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66659) (symbol) + [`29:66660`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66660) (md) + [`29:66667`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66667) (sm) | ✅ `AlertDialog.stories.tsx` (4 stories) | ✅ `AlertDialog.figma-export.stories.tsx` | ✅ `Figma parity (md)`, `Figma parity (sm)` | 🟢 | **Reference pattern.** Decision doc `alert-dialog-primitive-decision.md`. Two non-parity exceptions: button order (decision §4), sm width (compact 360px vs Figma 512px). |
| **Badge** | [`29:66938`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66938) | ✅ `Badge.stories.tsx` | ✅ `Badge.figma-export.stories.tsx` | ✅ `Figma parity (Default / Secondary / Destructive / Verified)` | 🟢 | JES-92. Documented non-parity: Outline has no Lead variant (lives in experimental export only). |
| **Button** | [`29:67711`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-67711) (root) | ✅ `Button.stories.tsx` | — | ✅ `Figma parity (Variant × Size matrix)` | 🟢 | JES-95. Documented non-parity: Figma Link variant has no Lead equivalent; Size=icon is caller composition; Hover/Focus/Pressed are runtime CSS. No production API expansion. |
| **Card** | [`29:72255`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-72255) | ✅ `Card.stories.tsx` | ✅ `Card.figma-export.stories.tsx` | ✅ `Figma parity (default header + content + footer)` | 🟢 | JES-94. Documented non-parity: section booleans (Card Header / Card Content / Card Footer) and instance-swap props map to React composition, not props. Image asset and Avatar approximations carry from JES-84 experimental export. |
| **Checkbox** | [`29:85556`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-85556) | ✅ `Checkbox.stories.tsx` | — | ✅ `Figma parity (Status + State)` | 🟢 | JES-93. Documented non-parity: Figma State=Focus/Pressed are runtime CSS states, not React props. |
| **Dialog** | [`29:91865`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-91865) | ✅ `Dialog.stories.tsx` | — | ✅ `Figma parity (default — title + description + footer)` | 🟢 | JES-95. Documented non-parity: Figma Breakpoint variant doesn't share names with Lead's `<DialogContent size>`. Stacked-footer-at-sm consistency already applied (PR #43). |
| **DropdownMenu** | [`29:92788`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92788) (root), [`29:92680`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92680) (content), [`29:92735`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92735) (item), [`29:92802`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92802) (label), [`29:92856`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92856) (separator), [`29:92869`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92869) (sub-trigger) | ✅ `DropdownMenu.stories.tsx` | — | ✅ `Figma parity (Variant=Default / Checkbox / Radio + Disabled)` | 🟢 | JES-95. Documented non-parity: Variant=Icon (no icon-leading slot on items today), Show Shortcut/Shortcut Text (no shortcut prop), Hover/Error runtime states. Variant-as-component-switch (Default → `<DropdownMenuItem>`, Checkbox → `<DropdownMenuCheckboxItem>`, Radio → `<DropdownMenuRadioItem>`) story-only and truthful. |
| **Field** | [`216:1154`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1154) (Field component set) + [`216:1155`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1155) (FieldGroup) | ✅ `Field.stories.tsx` | — | ✅ `Figma parity (Field variants)`, `Figma parity (FieldGroup)` | 🟢 | JES-108. Standalone Figma source components created from Lead React. No documented non-parity — FieldLabel, FieldDescription, FieldControl, and FieldError are represented as named sublayers/composition inside the Field source. |
| **Input** | [`29:95030`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-95030) | ✅ `Input.stories.tsx` | — | ✅ `Figma parity (Default / Filled / Disabled / Error)` | 🟢 | JES-93. Documented non-parity: Variant=File and runtime Focus/Filled states are not React props. |
| **Label** | [`213:116`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=213-116) | ✅ `Label.stories.tsx` | — | ✅ `Figma parity (Size × Required × State)` | 🟢 | JES-108. Standalone Figma source component set created from Lead React. No documented non-parity — Size, Required, and State=Disabled map 1:1 to `size`, `required`, and `disabled`. |
| **Popover** | [`29:96969`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-96969) | ✅ `Popover.stories.tsx` | — | ✅ `Figma parity (canonical compositional shape)` | 🟢 | JES-95. **Zero exceptions** — Figma surface is example-only (no documented text/enum props), so there are no exceptions to document. Lane's second zero-exception parity (after Tooltip in Batch B). |
| **Progress** | [`29:97110`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97110) | ✅ `Progress.stories.tsx` | — | ✅ `Figma parity (Percent variants)` | 🟢 | JES-92. No documented non-parity — Figma `Percent` enum is discrete subset of Lead's continuous `value`. |
| **RadioGroup** | [`29:97236`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97236) (item) | ✅ `RadioGroup.stories.tsx` | — | ✅ `Figma parity (Active On/Off + Disabled)` | 🟢 | JES-93. Documented non-parity: Type=Box and Font Weight are caller styling concerns, not item-level Lead props. Group-root Figma node `29:97178` remains unmapped per `RadioGroup.figma.tsx`. |
| **Select** | [`29:98157`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98157) (trigger/control), [`29:97998`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97998) (item), [`29:97936`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97936) (label), [`29:98193`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98193) (menu) | ✅ `Select.stories.tsx` | — | ✅ `Figma parity (labeled field with placeholder + disabled)` | 🟢 | JES-95. Documented non-parity: Figma Show Label/Description/Icon booleans → composition; runtime State variants are CSS; item-level Show Icon/Type=Icon/Variant=Checkbox have no Lead `<SelectItem>` props. Trigger/control node represents the *whole labeled field*. |
| **Separator** | [`29:98862`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98862) | ✅ `Separator.stories.tsx` | — | ✅ `Figma parity (horizontal + vertical)` | 🟢 | JES-92. Clean 1:1 mapping; no documented non-parity. |
| **Skeleton** | [`29:103198`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103198) | ✅ `Skeleton.stories.tsx` | — | ✅ `Figma parity (Default / Card / Text compositions)` | 🟢 | JES-92. Documented non-parity: Figma `Default`/`Card` are caller-side compositions of Lead's `text`/`rect`/`circle` shape primitives. |
| **Switch** | [`29:103697`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103697) | ✅ `Switch.stories.tsx` | — | ✅ `Figma parity (Active On/Off + Disabled)` | 🟢 | JES-93. Documented non-parity: Type=Box and Side=Left|Right are not Lead props (label placement is caller composition). |
| **Tabs** | [`29:105685`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105685) (root), [`29:105668`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105668) (trigger) | ✅ `Tabs.stories.tsx` | — | ✅ `Figma parity (Active + Disabled trigger states)` | 🟢 | JES-94. Documented non-parity: per-trigger Active is parent-value-driven (Radix controlled value); State=Focus is runtime CSS. |
| **Tooltip** | [`29:107066`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-107066) | ✅ `Tooltip.stories.tsx` | — | ✅ `Figma parity (all four sides)` | 🟢 | JES-93. Clean 1:1 mapping; no documented non-parity (lane's first non-AlertDialog component to ship parity with zero exceptions). |

**Summary counts (after JES-108 — final state):**

- 🟢 Done: **21** (Accordion, AlertDialog, Alert, Badge, Button, Card, Checkbox, Dialog, DropdownMenu, Field, Input, Label, Popover, Progress, RadioGroup, Select, Separator, Skeleton, Switch, Tabs, Tooltip)
- 🟡 Has experimental: **0**
- 🟠 Production-only: **0**
- 🔵 Blocked: **0**

**The parity sweep is complete.** 21/21 components are 🟢. Field and Label moved from intentionally blocked to complete after standalone Figma source components were created directly in the Lead staging file. No further parity batches are required.

---

## Recommended batch order

Each batch is a Linear issue (JES-92 through JES-95). Batch order is set by **risk + Figma surface complexity + likelihood of needing a decision PR**, ascending.

Inside each batch, components are independently ship-able as separate PRs — the batching is for prioritization, not bundling.

### Batch A — JES-92: visual primitives ✅ DONE

Shipped 2026-05-05 in [PR #46](https://github.com/jnanthak83/lead-design-system/pull/46) (merge `55714fbc4`). Five components moved to 🟢: Separator, Progress, Skeleton, Alert, Badge. Three documented non-parity exceptions (all API-shape, all permanent design-system choices): Skeleton `Default`/`Card` caller compositions, Alert Icon slot, Badge Outline missing. The batch shipped as a single Storybook-only PR rather than the originally-estimated 4-5 separate PRs — bundle-by-batch turned out lower-overhead than per-component PRs at this scope.

### Batch B — JES-93: form controls ✅ DONE

Shipped 2026-05-06 in [PR #48](https://github.com/jnanthak83/lead-design-system/pull/48) (merge `5252b0814`). Five components moved to 🟢: Checkbox, Switch, RadioGroupItem, Input, Tooltip. Four documented non-parity exceptions (all API-shape, all permanent design-system choices): Checkbox Focus/Pressed runtime CSS, Switch Type=Box / Side variants, RadioGroupItem Type / Font Weight, Input Variant=File + runtime Focus/Filled states. Tooltip shipped with **zero exceptions** — Figma's surface maps 1:1 to Lead's `<TooltipContent>` props.

Live Figma MCP was unavailable during authoring; the batch sourced from existing Code Connect mappings instead — the parity standard's documented fallback path. Each parity story includes the Figma node URL inline for reviewer visual comparison against the live design.

### Batch C — JES-94: compositional content ✅ DONE

Shipped 2026-05-06 in [PR #50](https://github.com/jnanthak83/lead-design-system/pull/50) (merge `3aa6a21be`). Three components moved to 🟢: Card, Tabs, Accordion. Three documented non-parity exceptions (all API-shape, all permanent): Card section booleans → React composition, Tabs per-trigger Active is parent-value-driven, Accordion per-item Active is parent-value-driven. The Card row carried Image and Avatar approximations from JES-84's experimental export.

The Tabs and Accordion exceptions both reduce to one Radix concept: **state is owned by the parent, not the child** — controlled vs. uncontrolled value semantics. Originally this section also listed Alert, but Alert was completed in Batch A (JES-92) and never needed Batch C treatment; that stale reference is removed.

No decision PRs were needed (initial estimate flagged Card/Accordion as possible decision-doc candidates; in practice the existing Code Connect mappings authoritatively documented the API-shape exceptions, so parity stories shipped story-only).

### Batch D — JES-95: overlays + complex ✅ DONE

Shipped 2026-05-08 in [PR #52](https://github.com/jnanthak83/lead-design-system/pull/52) (merge `0b2b3ffd8`). **Final batch of the parity sweep.** Five components moved to 🟢: Button, Dialog, Popover, Select, DropdownMenu. Four documented non-parity exceptions (all API-shape, all permanent design-system choices) plus one zero-exception (Popover).

The original risk priors (Button wide blast radius; DropdownMenu high complexity; possible decision PRs spawned) did not materialize. Code Connect mappings authoritatively documented every API-shape exception, so parity stories shipped story-only with no production source changes. The prep work from earlier sessions converged the contracts in advance.

The variant-as-component-switch pattern (DropdownMenu's Default → `<DropdownMenuItem>`, Checkbox → `<DropdownMenuCheckboxItem>`, Radio → `<DropdownMenuRadioItem>`) shipped story-only and truthful. No Lead `<Button variant="link">` was fabricated; no Lead `<SelectItem>` icon prop was invented.

---

## What this inventory does NOT do

- **Does not modify any production component.** Pure docs.
- **Does not replace the parity standard.** The rules for story shape, exception format, and verification remain in [`storybook-figma-parity-standard.md`](./storybook-figma-parity-standard.md).
- **Does not start future parity work.** New components still need their own focused issue and PR before this inventory changes again.
- **Does not promise that every future component reaches 🟢.** Some future components may still be intentionally blocked if Figma has no source node, and some Figma variants may remain documented exceptions (for example Skeleton's `Card` composition). That's the point of the exception format in the standard doc.

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
- **JES-92** — Batch A: Separator / Skeleton / Progress / Badge.
- **JES-93** — Batch B: Checkbox / Switch / RadioGroup / Input / Tooltip.
- **JES-94** — Batch C: Card / Tabs / Accordion.
- **JES-95** — Batch D: Dialog / Popover / Select / DropdownMenu / Button.
- **JES-108** — Field / Label source components and parity closeout.
