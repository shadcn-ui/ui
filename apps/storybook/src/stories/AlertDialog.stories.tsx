import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@leadbank/ui"

/**
 * AlertDialog — modal confirmation primitive with `role="alertdialog"`.
 *
 * Use for destructive-action confirmations (delete, sign out, discard
 * changes) and any flow where casual dismissal would lose work. Distinct
 * from generic <Dialog>: the `alertdialog` ARIA role signals to assistive
 * technology that user input is required and the dialog cannot be
 * casually dismissed.
 *
 * Decision contract: docs/alert-dialog-primitive-decision.md (JES-85).
 *
 * Canonical button order: **Cancel first, primary action last** —
 * applied uniformly across all breakpoints. Visual emphasis via Lead
 * Button variants (`outline` for Cancel, `primary` or `danger` for the
 * action), not via position-based assumptions.
 */
const meta: Meta<typeof AlertDialog> = {
  title: "Components/Alert Dialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Modal confirmation primitive (`role=\"alertdialog\"`). For " +
          "destructive actions and any flow where casual dismissal " +
          "would lose user work. Different from generic Dialog: " +
          "AlertDialog cannot be dismissed by clicking outside.",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AlertDialog>

export const DestructiveConfirmation: Story = {
  name: "Destructive confirmation (md)",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All associated data, sessions,
            and integrations will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="danger">Delete account</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const SaveOrDiscard: Story = {
  name: "Save or discard changes (md)",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primary">Close without saving</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved edits to this document. Closing now will
            permanently lose them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Keep editing</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="primary">Discard changes</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const SmallStackedFooter: Story = {
  name: "sm breakpoint (auto-stacked footer)",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primary">Confirm action</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will sign you out of all active sessions on every device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="primary">Sign out everywhere</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "When `<AlertDialogContent size=\"sm\">` is used, the footer " +
          "automatically stacks vertically with full-width buttons — no " +
          "additional prop required. The same auto-stacking behavior " +
          "applies to `<DialogFooter>` inside `<DialogContent size=\"sm\">` " +
          "for visual consistency.",
      },
    },
  },
}

export const WithItemPreview: Story = {
  name: "With item preview (composition pattern)",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Delete file</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this file?</AlertDialogTitle>
          <AlertDialogDescription>
            The file will be moved to trash and permanently deleted after
            30 days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/*
          Composition pattern (per decision §3): show a preview of the
          specific item being acted on with a styled <div>. Not a
          dedicated subcomponent — just regular composition. Using a
          muted background helps it stand apart visually.
        */}
        <div
          style={{
            padding: "12px 16px",
            background: "var(--lead-color-surface-muted)",
            borderRadius: "var(--lead-radius-md)",
            border: "1px solid var(--lead-color-border-default)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <strong style={{ fontSize: 14 }}>Q3-roadmap.pdf</strong>
          <span
            style={{
              fontSize: 12,
              color: "var(--lead-color-text-muted)",
            }}
          >
            2.4 MB · uploaded 3 days ago
          </span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="danger">Delete file</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Show a preview of the specific item being acted on with a " +
          "styled `<div>` between the header and footer. Not a dedicated " +
          "subcomponent — just composition. Per decision §3: callers " +
          "render a muted-background panel matching their item shape.",
      },
    },
  },
}

/* ── Figma parity stories (JES-89) ─────────────────────────────────
 *
 * The two stories below mirror the Figma `15 Lead UI - Alert Dialog`
 * page (45:61255) verbatim, so reviewers can compare Storybook against
 * the source-of-truth design without translation. Use these as the
 * pixel-comparison stories; the destructive/save stories above are
 * meaningful in-context usage.
 */

export const FigmaParityMd: Story = {
  name: "Figma parity (md)",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Title Text</AlertDialogTitle>
          <AlertDialogDescription>
            This is an alert dialog description.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/*
          Figma's md variant includes a nested shaded panel with
          a duplicated title + description. In real use this panel
          previews the specific item being acted on — see the
          `WithItemPreview` story for a meaningful example. Here it
          mirrors the Figma mockup verbatim for visual comparison.
        */}
        <div
          style={{
            padding: 16,
            background: "var(--lead-color-surface-muted)",
            border: "1px solid var(--lead-color-border-default)",
            borderRadius: "var(--lead-radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <strong style={{ fontSize: 16 }}>Title Text</strong>
          <span style={{ fontSize: 14, color: "var(--lead-color-text-muted)" }}>
            This is an alert dialog description.
          </span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="primary">Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `15 Lead UI - Alert Dialog` md breakpoint " +
          "(symbol 29:66660) as closely as the production primitives " +
          "allow. Open the source: " +
          "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66660",
      },
    },
  },
}

export const FigmaParitySm: Story = {
  name: "Figma parity (sm)",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Title Text</AlertDialogTitle>
          <AlertDialogDescription>
            This is an alert dialog description.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/*
            Production renders Cancel first, primary action last, on
            every breakpoint — see decision §4. Figma's sm mockup
            puts Continue first; production deliberately deviates per
            the Cancel-first standardization decision. This is the
            documented non-parity exception.
          */}
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="primary">Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `15 Lead UI - Alert Dialog` sm breakpoint " +
          "(symbol 29:66667). Visual differences from the source: " +
          "**(1) header text auto-centers** at sm via the new " +
          "AlertDialog-scoped CSS rule (matches Figma); **(2) button " +
          "order is Cancel → primary** rather than Figma's primary → " +
          "Cancel — this is the documented non-parity exception per " +
          "the AlertDialog decision doc §4 (Cancel-first " +
          "standardization across breakpoints for keyboard tab-order " +
          "and macOS/Stripe/Linear convention alignment); **(3) sm " +
          "max-width remains Lead Dialog's 360px** rather than " +
          "Figma's 512px — keeping AlertDialog's primitives aligned " +
          "with Dialog's size enum. Open the source: " +
          "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66667",
      },
    },
  },
}
