/**
 * Experimental — Figma → Storybook export prototype (Alert Dialog).
 *
 * **This is NOT Code Connect.** Storybook-only preview generated from
 * the Figma `15 Lead UI - Alert Dialog` page, intended for visual review
 * before any production component decision.
 *
 * **Source Figma node** (Alert Dialog symbol, file
 *  `f2gKVfCJNOS0MeLUk4CM8u`):
 *
 *   Page (`45:61255`):
 *     https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=45-61255
 *   Component symbol (`29:66659`):
 *     https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66659
 *
 * **Design context source:** live Figma MCP fetch on `29:66659`. The
 * component documentation references shadcn's AlertDialog pattern
 * (https://ui.shadcn.com/docs/components/alert-dialog) — a
 * confirmation modal with `role="alertdialog"`, distinct from a generic
 * Dialog.
 *
 * **Production gap (the central finding of this prototype):**
 * Lead UI does NOT currently ship a dedicated `<AlertDialog>` component.
 * It has `<Dialog>` (generic modal) and `<Alert>` (inline alert), but
 * no Radix-AlertDialog-equivalent confirmation primitive with
 * `role="alertdialog"` semantics. This Storybook preview approximates
 * the Figma design using `<Dialog>` + a stacked-footer style, but the
 * approximation has accessibility implications worth flagging — see the
 * "Deferred / production decision" story for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@leadbank/ui"

const FIGMA_PAGE_URL =
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=45-61255"
const FIGMA_COMPONENT_NODE = "29:66659"
const FIGMA_BREAKPOINT_MD = "29:66660"
const FIGMA_BREAKPOINT_SM = "29:66667"

const meta: Meta<typeof Dialog> = {
  title: "Experimental/Figma Export/Alert Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Storybook-only Figma export prototype (JES-83). Renders the " +
          "Figma Alert Dialog component's two breakpoints (md, sm) using " +
          "Lead's existing `<Dialog>` primitive as an approximation. " +
          "**Lead has no dedicated `<AlertDialog>` component** — this " +
          "preview surfaces that gap for review. " +
          `Source page: ${FIGMA_PAGE_URL}. Component symbol: ${FIGMA_COMPONENT_NODE}. ` +
          "**Not Code Connect. Not a production change.**",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

/* ── Approximated: md breakpoint (horizontal footer) ──────────────── */

/**
 * Figma `Breakpoint=md` (`29:66660`) → Lead `<Dialog size="md">` with
 * default end-aligned footer.
 *
 * Mapped:
 *   - titleText        → DialogTitle children
 *   - descriptionText  → DialogDescription children
 *   - "Cancel" button  → Lead `<Button variant="outline">` + DialogClose
 *   - "Continue" button → Lead `<Button variant="primary">`
 *
 * Approximated:
 *   - The entire alert-dialog scaffold uses `<Dialog>` because Lead has
 *     no `<AlertDialog>` primitive. Production-equivalent semantics
 *     (`role="alertdialog"`, modal confirmation focus management) are
 *     NOT present.
 *   - The Figma design includes a *nested* shaded panel showing a
 *     duplicated title + description inside the dialog body. This looks
 *     like a "confirmation summary" pattern (showing the user what
 *     they're confirming). Rendered here as a Storybook-only inline
 *     style; whether this becomes a production pattern is a separate
 *     question.
 */
export const FigmaBreakpointMd: Story = {
  name: "md breakpoint — horizontal footer",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        Figma <code>Breakpoint=md</code> (<code>{FIGMA_BREAKPOINT_MD}</code>):
        title + description left-aligned, optional nested confirmation panel,
        right-aligned footer with Cancel (outline) + Continue (primary).
        Approximated using <code>{`<Dialog size="md">`}</code> +{" "}
        <code>{`<DialogFooter align="end">`}</code>.
      </Annotation>
      <Dialog>
        <DialogTrigger>
          <Button variant="primary">Open md alert dialog</Button>
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Title Text</DialogTitle>
            <DialogDescription>
              This is an alert dialog description.
            </DialogDescription>
          </DialogHeader>
          {/* Storybook-only "confirmation summary" panel — NOT a Lead
              production pattern. Mirrors the nested panel in the Figma
              md breakpoint. */}
          <div
            style={{
              background: "rgba(75, 91, 159, 0.04)",
              borderRadius: "var(--lead-radius-md, 12px)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <strong style={{ fontSize: 16, color: "var(--lead-color-text-default, #15161a)" }}>
              Title Text
            </strong>
            <span style={{ fontSize: 14, color: "var(--lead-color-text-muted, #5a5d68)" }}>
              This is an alert dialog description.
            </span>
          </div>
          <DialogFooter align="end">
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="primary">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

/* ── Approximated: sm breakpoint (stacked footer, centered text) ──── */

/**
 * Figma `Breakpoint=sm` (`29:66667`) → Lead `<Dialog size="sm">` with
 * stacked, full-width footer buttons and centered text.
 *
 * Notable difference from md: the **button order is reversed**. md
 * places Cancel before Continue; sm places Continue before Cancel
 * (Continue on top, Cancel below). This is the Figma source's choice;
 * worth flagging for accessibility review.
 */
export const FigmaBreakpointSm: Story = {
  name: "sm breakpoint — stacked footer",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        Figma <code>Breakpoint=sm</code> (<code>{FIGMA_BREAKPOINT_SM}</code>):
        title + description center-aligned, no nested panel, stacked
        full-width footer with Continue (primary) on top, Cancel (outline)
        below. Approximated using <code>{`<Dialog size="sm">`}</code> +
        Storybook-only stacked-footer styles. Lead's{" "}
        <code>{`<DialogFooter>`}</code> doesn't have a built-in stacked
        mode today; this preview applies inline flex-column to demonstrate.
      </Annotation>
      <Dialog>
        <DialogTrigger>
          <Button variant="primary">Open sm alert dialog</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
              <DialogTitle>Title Text</DialogTitle>
              <DialogDescription>
                This is an alert dialog description.
              </DialogDescription>
            </div>
          </DialogHeader>
          {/* Storybook-only stacked footer. Lead's `<DialogFooter>` is
              flex-row by default; stacking is achieved here with inline
              styles, NOT a production prop. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
            }}
          >
            <Button variant="primary" style={{ width: "100%" }}>
              Continue
            </Button>
            <DialogClose>
              <Button variant="outline" style={{ width: "100%" }}>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

/* ── Surface map — Figma vs. Lead React, deferred items called out ── */

export const FigmaSurfaceMap: Story = {
  name: "Surface mapping (Figma → Lead React)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Annotation>
        Source Figma page:{" "}
        <a href={FIGMA_PAGE_URL} target="_blank" rel="noreferrer">{FIGMA_PAGE_URL}</a>
        <br />
        Component symbol: <code>{FIGMA_COMPONENT_NODE}</code>. Documentation
        link in Figma references the shadcn AlertDialog pattern, which is
        a Radix-distinct primitive from generic Dialog.
      </Annotation>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: "12px 24px",
          alignItems: "start",
        }}
      >
        <ColumnHeader>Figma property / piece</ColumnHeader>
        <ColumnHeader>Lead React</ColumnHeader>
        <ColumnHeader>Mapping note</ColumnHeader>

        <Cell><code>titleText</code> (text)</Cell>
        <Cell><code>{`<DialogTitle>{titleText}</DialogTitle>`}</code></Cell>
        <Note>Direct text-to-children mapping.</Note>

        <Cell><code>descriptionText</code> (text)</Cell>
        <Cell><code>{`<DialogDescription>{descriptionText}</DialogDescription>`}</code></Cell>
        <Note>Direct text-to-children mapping.</Note>

        <Cell><code>breakpoint=md</code></Cell>
        <Cell><code>{`<DialogContent size="md">`}</code></Cell>
        <Note>
          <strong>Approximated.</strong> Lead's <code>size</code> controls
          width; the right-aligned footer comes from <code>DialogFooter</code>'s
          default <code>align="end"</code>.
        </Note>

        <Cell><code>breakpoint=sm</code></Cell>
        <Cell><code>{`<DialogContent size="sm">`}</code></Cell>
        <Note>
          <strong>Approximated.</strong> Stacked full-width footer is
          achieved with story-local inline styles. Lead{" "}
          <code>DialogFooter</code> has no built-in stacked mode.
        </Note>

        <Cell>Cancel button</Cell>
        <Cell><code>{`<Button variant="outline">`}</code></Cell>
        <Note>
          Direct mapping — Figma references shadcn outline button, Lead
          has <code>variant="outline"</code>.
        </Note>

        <Cell>Continue button</Cell>
        <Cell><code>{`<Button variant="primary">`}</code></Cell>
        <Note>Direct mapping.</Note>

        <Cell>Centered text (sm)</Cell>
        <Cell>inline <code>textAlign: "center"</code></Cell>
        <Note>
          <strong>Approximated.</strong> Lead{" "}
          <code>DialogTitle</code>/<code>DialogDescription</code> have no
          alignment prop; centered with story-local style.
        </Note>

        <Cell>Nested confirmation panel (md)</Cell>
        <Cell>story-local div with shaded background</Cell>
        <Note>
          <strong>Approximated.</strong> Figma includes a duplicated
          title+description inside a shaded callout panel. Likely a
          "confirmation summary" pattern. Storybook-only style for now;
          worth a design conversation about whether this is a real Lead
          pattern.
        </Note>

        <Cell>Reversed button order (sm)</Cell>
        <Cell>story renders Continue first, Cancel second</Cell>
        <Note>
          <strong>Flag for review.</strong> sm reverses the md order
          (Continue → Cancel). Worth checking whether this is intentional
          Lead pattern or a Figma artifact. Some accessibility guidance
          puts the destructive action *second*, not first.
        </Note>

        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          <code>role="alertdialog"</code> semantics
        </Cell>
        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          ⚠ deferred — production decision
        </Cell>
        <Note>
          Lead has no <code>{`<AlertDialog>`}</code> primitive. Generic{" "}
          <code>{`<Dialog>`}</code> renders <code>role="dialog"</code>, not{" "}
          <code>role="alertdialog"</code>. The semantic difference matters
          for assistive tech announcing "this requires a decision." See
          deferred decisions section below.
        </Note>

        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          Light/Dark theme variants
        </Cell>
        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          ⚠ deferred
        </Cell>
        <Note>
          Figma page shows both themes. Lead Storybook theming is a
          separate concern; not rendered here.
        </Note>
      </div>
    </div>
  ),
}

/* ── Deferred production decisions ────────────────────────────────── */

export const DeferredProductionDecisions: Story = {
  name: "Deferred — production decisions for review",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        The following items are <strong>not</strong> resolved by this
        Storybook preview. They require deliberate API decisions before
        any production change. Each is a candidate follow-up issue, not a
        defect in the current prototype.
      </Annotation>

      <DecisionCard
        title="Add a dedicated <AlertDialog> primitive?"
        body={
          <>
            Radix exposes <code>@radix-ui/react-alert-dialog</code> as a separate
            primitive from <code>@radix-ui/react-dialog</code>. The key difference
            is <code>role="alertdialog"</code> (signals to assistive tech that
            user input is *required*; the dialog cannot be dismissed by clicking
            outside). Lead currently has only the generic <code>Dialog</code>.
            Adding a dedicated <code>AlertDialog</code> would mean a new
            component family (<code>AlertDialog</code>,{" "}
            <code>AlertDialogTrigger</code>, <code>AlertDialogContent</code>,{" "}
            <code>AlertDialogAction</code>, <code>AlertDialogCancel</code>, etc.)
            and an API decision on whether <code>Dialog</code> and{" "}
            <code>AlertDialog</code> share styling primitives or each ship their
            own. Recommended path: add it; the accessibility win is real.
          </>
        }
      />

      <DecisionCard
        title="Add a stacked-footer mode to <DialogFooter>?"
        body={
          <>
            The sm breakpoint stacks footer buttons vertically with full width.
            Lead's <code>DialogFooter</code> currently supports{" "}
            <code>align="start" | "end" | "between"</code>. Options: (a) add{" "}
            <code>direction="row" | "column"</code>; (b) add{" "}
            <code>align="stack"</code>; (c) make stacking responsive and
            automatic at small dialog sizes; (d) keep it caller-controlled with
            inline styles like this preview. Each has trade-offs — design
            decision.
          </>
        }
      />

      <DecisionCard
        title="Document or formalize the 'confirmation summary' panel?"
        body={
          <>
            The Figma md breakpoint includes a nested shaded panel showing a
            duplicated title+description. This is unusual for an alert dialog.
            Possibilities: (a) it's a one-off design pattern showing the
            specific item being acted on (in real use, this content would be
            different from the dialog title); (b) it's a Figma authoring error;
            (c) it's a deliberate "confirm what you're about to do" pattern.
            Worth confirming with the designer who authored the page.
          </>
        }
      />

      <DecisionCard
        title="Reversed button order between breakpoints (sm vs md)"
        body={
          <>
            md: Cancel | Continue. sm: Continue | Cancel. Some accessibility
            guidance puts the destructive/primary action <em>last</em> (so
            keyboard tab-order ends on the action being confirmed); other
            guidance puts the safe/cancel action last (so accidental Enter
            cancels rather than confirms). The Figma design takes opposite
            positions on each breakpoint. Decide which one Lead standardizes
            on, and apply consistently.
          </>
        }
      />
    </div>
  ),
}

/* ── helpers ──────────────────────────────────────────────────────── */

function DecisionCard({
  title,
  body,
}: {
  title: string
  body: React.ReactNode
}) {
  return (
    <div
      style={{
        padding: "16px 20px",
        border: "1px solid var(--lead-color-border-default, #d6d8e0)",
        borderRadius: "var(--lead-radius-md, 8px)",
        background: "var(--lead-color-surface-default, #fff)",
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 600,
          color: "var(--lead-color-text-default, #15161a)",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          fontSize: 13,
          lineHeight: "20px",
          color: "var(--lead-color-text-default, #15161a)",
        }}
      >
        {body}
      </div>
    </div>
  )
}

function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "var(--lead-color-surface-muted, #f5f5f6)",
        border: "1px solid var(--lead-color-border-default, #d6d8e0)",
        borderRadius: "var(--lead-radius-md, 8px)",
        fontSize: 13,
        lineHeight: "20px",
        color: "var(--lead-color-text-default, #15161a)",
      }}
    >
      {children}
    </div>
  )
}

function ColumnHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "var(--lead-color-text-muted, #5a5d68)",
      }}
    >
      {children}
    </div>
  )
}

function Cell({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        fontSize: 13,
        color: "var(--lead-color-text-default, #15161a)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: "var(--lead-color-text-muted, #5a5d68)" }}>
      {children}
    </div>
  )
}
