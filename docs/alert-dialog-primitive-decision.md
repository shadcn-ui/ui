# Decision: Production `<AlertDialog>` primitive (JES-85)

**Status:** decided. Implementation deferred to follow-up issue. **Tracks Linear `JES-85`.**

This document resolves the four decision questions raised by the Alert Dialog Figma → Storybook export prototype (JES-83, PR #41, merged at `7293f6310`). Each decision below has a recommendation, a rationale, and an explicit follow-up.

---

## Inputs

- **Storybook prototype:** `Experimental / Figma Export / Alert Dialog` on the deployed Pages site (PR #41).
- **Figma source:** page [`45:61255`](https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=45-61255) "15 Lead UI - Alert Dialog", component symbol `29:66659`, breakpoint variants `29:66660` (md) and `29:66667` (sm).
- **Existing Lead primitives reviewed:** `<Dialog>` (generic Radix Dialog modal), `<Alert>` (inline non-modal status), `<Button>` (with `outline`/`primary`/etc. variants). None of these provide `role="alertdialog"` semantics.
- **Reference:** [Radix `@radix-ui/react-alert-dialog`](https://www.radix-ui.com/primitives/docs/components/alert-dialog) and the [shadcn AlertDialog pattern](https://ui.shadcn.com/docs/components/alert-dialog) — both treat AlertDialog as a separate primitive from Dialog. Lead's Figma file references the shadcn pattern explicitly.

---

## Decision 1 — Add a dedicated `<AlertDialog>` primitive?

**Recommendation: YES.** Add `<AlertDialog>` as a new component family in `@leadbank/ui`, modelled on Radix's `@radix-ui/react-alert-dialog`.

### Why

The `role="alertdialog"` ARIA role exists for a specific reason: it tells assistive technology that the modal **requires user input** to proceed, and that the user **cannot dismiss it by clicking outside or pressing Escape** without a deliberate decision. Generic `Dialog` (`role="dialog"`) does not communicate this; it's a passive modal that can be casually dismissed.

For destructive-action confirmations ("Delete this account?", "Discard unsaved changes?"), the difference is meaningful:

- **Screen reader users** get a different verbal cue indicating a decision is required.
- **Keyboard users** are funneled through the action buttons rather than allowed to escape past the question.
- **Focus management** is stricter — focus traps are tighter and dismissal paths are explicit.

These are not theoretical; they're documented WAI-ARIA best practices for confirmation flows. Composition with the existing `<Dialog>` cannot replicate them without re-implementing Radix's AlertDialog primitive in user code, which is exactly what dedicated primitives prevent.

### What "yes" means in practice

A new `packages/lead-ui/src/components/AlertDialog/` directory exporting:
- `AlertDialog` (root)
- `AlertDialogTrigger`
- `AlertDialogPortal`
- `AlertDialogOverlay`
- `AlertDialogContent` (with size: "sm" | "md" matching Dialog's pattern)
- `AlertDialogHeader`
- `AlertDialogTitle`
- `AlertDialogDescription`
- `AlertDialogFooter`
- `AlertDialogAction` (the destructive/confirmatory action — distinguishes from a generic Button by semantic role)
- `AlertDialogCancel` (the safe option — distinguishes similarly)

The naming mirrors Radix and shadcn so the import surface is what design-system users expect.

### Why not just compose with `<Dialog>`?

Rejected. The Storybook prototype already uses `<Dialog>` to approximate the visual, and the prototype's deferred-decisions story flags the accessibility gap explicitly. Asking every consumer to remember to set `role="alertdialog"` on the underlying div, manage focus correctly, and disable outside-click dismissal is exactly the kind of accidental-omission Lead's design system exists to prevent.

### Follow-up

Create issue **JES-86** (filed after this decision doc merges): implement `<AlertDialog>` per the surface above. Recommended subscope:
- Wrap `@radix-ui/react-alert-dialog` (already a peer dep candidate; add to `package.json`).
- Match `<Dialog>`'s styling primitives (CSS classes, size enum, footer alignment) so visual consistency is automatic.
- Storybook stories for happy-path destructive confirmation, save-changes-or-discard, and reused composition matching the Figma `md`/`sm` breakpoints.
- Tests covering keyboard navigation (Esc behavior, focus trap, action-button activation), `role="alertdialog"` assertion, and the modal forced-decision contract.

---

## Decision 2 — Stacked layout mode for `<DialogFooter>`?

**Recommendation: YES, but as automatic responsive behavior tied to `DialogContent` size.** No new prop on `<DialogFooter>` itself.

### Why

The Figma `sm` breakpoint stacks footer buttons vertically with full width. Three options were considered:

- **(a) `direction="row" | "column"` prop** — adds API surface; callers have to remember which to use.
- **(b) `align="stack"` extending the existing align enum** — overloads `align` (which is about *spread*, not direction). Confusing.
- **(c) Auto-stacking when `DialogContent size="sm"`** — no new API; matches Figma intent exactly; document the behavior.
- **(d) Caller-controlled (status quo)** — every caller writes the same inline flex-column. Bad ergonomics.

Option (c) is the truthful default: the Figma design makes this exact correspondence (`Breakpoint=sm` ⇒ stacked footer), so encoding it as automatic behavior at `DialogContent size="sm"` (and the equivalent `AlertDialogContent size="sm"`) matches the design contract without expanding the API.

### What "yes" means in practice

In the `<DialogFooter>` (and new `<AlertDialogFooter>`) implementation, read the parent `<DialogContent>` size via context. When `size === "sm"`, render `flex-direction: column` with `width: 100%` on direct button children. When `size === "md"` or `"lg"`, render the existing horizontal layout with `align` controlling justification.

### Follow-up

Bundled into the `<AlertDialog>` implementation issue (JES-86). Same change applied to `<DialogFooter>` as a consistency fix — the Figma Dialog component (`29:72255`, exported in JES-84) doesn't currently use small/stacked footers, but if it ever does, the behavior should be uniform.

---

## Decision 3 — "Confirmation summary" panel as a reusable component?

**Recommendation: NO.** Document the pattern; do not formalize.

### Why

The Figma `md` breakpoint shows a nested shaded panel with a duplicated title + description inside the dialog body. Reading the design context, this almost certainly represents a **placeholder for the actual content being acted on** — in real use, this panel would contain the *specific item* the user is confirming (e.g., the file name being deleted, the account being deactivated, the message being sent). The duplicated title/description is a Figma authoring convenience showing where that content slot would live, not a literal pattern.

There's no dedicated subcomponent worth adding because:
- The shaded callout *is* just a styled `<div>` (or could be `<Card variant="muted">` if Lead adds that variant). Existing primitives compose it.
- The content is always caller-specific: the dialog title says "Delete this file?", the panel shows the file name. There's no shared structure to extract.
- A `<AlertDialogSummary>` subcomponent would be a single-purpose styled wrapper that adds nothing over composition.

### What "no" means in practice

Document in the AlertDialog component description: "If the action targets a specific item, render its preview inside `<AlertDialogContent>` between the header and the footer. A neutral muted background helps it stand apart visually." Show a Storybook example with a specific item (e.g., "Delete account: jane@example.com — this will remove all associated data") so the pattern is discoverable.

### Follow-up

None as a code change. The pattern documentation lands as part of the `<AlertDialog>` implementation in JES-86.

---

## Decision 4 — Standardize button order across breakpoints?

**Recommendation: YES — Cancel first, primary action last, on every breakpoint.**

### Why

The Figma source has the button order **reversed between `md` and `sm`**:
- `md`: Cancel | Continue (Cancel left, primary right)
- `sm`: Continue, Cancel (primary on top, Cancel below)

Both can be defended in isolation, but inconsistency across breakpoints fails users who use both desktop and mobile views of the same app.

The recommendation is **Cancel first / primary last**, applied uniformly. Reasons:

1. **Convention alignment.** macOS Human Interface Guidelines, Stripe's design system, Linear's UI, and shadcn's AlertDialog all place the primary action last. This is the most familiar layout for users encountering Lead-built apps.
2. **Visual hierarchy.** The eye reads left-to-right (and top-to-bottom in the stacked case), naturally landing on the primary filled button last. The visual emphasis already encodes "this is what you're confirming."
3. **Keyboard tab order.** Default tab order ends on the primary action. A user who tabs through and presses Enter confirms. A user who tabs through and presses Escape cancels. Both are decisive.
4. **Symmetry.** Same order on both breakpoints means muscle memory transfers across device sizes, and translation between `md` and `sm` doesn't surprise users.

### What "yes" means in practice

The `<AlertDialog>` implementation enforces Cancel-first / primary-last in its rendered output regardless of which order children are passed in. (Or, simpler: document the convention and rely on caller compliance, with a Storybook story showing the canonical order.)

The Figma `sm` breakpoint should be updated to match (Cancel on top, Continue below — *not* the current Continue-on-top design). This is a Figma-side fix tracked in a separate design ticket, not a code change.

### Follow-up

- **Code:** documented in `<AlertDialog>` Storybook stories as the canonical pattern (no enforcement code; trust the caller).
- **Design:** open a Linear issue for the Figma sm breakpoint update — "Reverse button order in `15 Lead UI - Alert Dialog` sm breakpoint to match design-system-wide convention (Cancel first, Continue last)."

---

## Summary of follow-ups

| Decision | Action | Follow-up |
|---|---|---|
| 1. Add `<AlertDialog>` | YES | New Linear issue for implementation (filed alongside this decision merge). |
| 2. Stacked footer mode | YES (auto from size) | Bundled into the `<AlertDialog>` implementation. |
| 3. Confirmation summary panel | NO (document pattern) | Documentation only; lands with `<AlertDialog>` stories. |
| 4. Button order standardization | YES (Cancel first, primary last) | Storybook stories show canonical order; separate Figma-side fix for the sm breakpoint design. |

## What does NOT change

- No production code in this PR. Decision-only.
- No `<AlertDialog>` implementation yet — that's JES-86 (next).
- No changes to existing `<Dialog>`, `<Alert>`, or `<Button>` APIs in this PR.
- No Code Connect / token publishing changes.
- `FIGMA_CODE_CONNECT_ENABLED` remains `false`.
