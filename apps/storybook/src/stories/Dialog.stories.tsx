import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
} from "@leadbank/ui"

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead modal dialog built on @radix-ui/react-dialog. Composes DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, and DialogClose. Includes overlay, focus trap, ESC-to-close, and proper aria-labelledby/aria-describedby wiring.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Lead</DialogTitle>
          <DialogDescription>
            We've put together a quick tour. It takes about 90 seconds.
          </DialogDescription>
        </DialogHeader>
        <p>You can revisit this any time from the help menu.</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Skip</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Start tour</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const FormDialog: Story = {
  name: "Form dialog",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your name and contact email. Changes save instantly.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel required>Full name</FieldLabel>
              <FieldControl>
                <Input defaultValue="Jane Doe" />
              </FieldControl>
            </Field>
            <Field>
              <FieldLabel required>Email</FieldLabel>
              <FieldDescription>Used for sign-in and notifications.</FieldDescription>
              <FieldControl>
                <Input type="email" defaultValue="jane@lead.example" />
              </FieldControl>
            </Field>
          </FieldGroup>

          <DialogFooter align="between">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ),
}

export const DestructiveConfirmation: Story = {
  name: "Destructive confirmation",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete workspace</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--lead-space-2)",
            }}
          >
            <DialogTitle>Delete workspace</DialogTitle>
            <Badge variant="danger" size="sm">
              Destructive
            </Badge>
          </div>
          <DialogDescription>
            This permanently removes your workspace and every project in it.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="danger">
          <AlertTitle>This action cannot be undone.</AlertTitle>
          <AlertDescription>
            All data is removed within 24 hours. Make sure you have a backup.
          </AlertDescription>
        </Alert>

        <DialogFooter align="between">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="danger">Delete workspace</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const SmallSize: Story = {
  name: "Small size",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Confirm</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Confirm signout</DialogTitle>
          <DialogDescription>
            You'll need to sign in again on this device.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Sign out</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const LargeSize: Story = {
  name: "Large size",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open large</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Release notes — v4.2.1</DialogTitle>
          <DialogDescription>
            Highlights from this week's deployment.
          </DialogDescription>
        </DialogHeader>
        <ul style={{ margin: 0, paddingLeft: "var(--lead-space-5)" }}>
          <li>Faster registry indexing across all workspaces.</li>
          <li>Audit log filters for the last 90 days.</li>
          <li>Various polish on Field error states.</li>
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
