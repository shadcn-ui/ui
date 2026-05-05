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
