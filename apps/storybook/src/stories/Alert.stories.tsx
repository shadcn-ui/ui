import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@leadbank/ui"

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead inline alert. `neutral` / `info` / `success` use `role='status'` (polite, aria-live). `warning` / `danger` use `role='alert'` (assertive). Compose with `AlertTitle` and `AlertDescription`. Callers can override `role` for special cases.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "info", "success", "warning", "danger"],
    },
  },
  args: { variant: "neutral" },
}

export default meta

type Story = StoryObj<typeof Alert>

export const TitleAndDescription: Story = {
  name: "Title + description",
  render: (args) => (
    <Alert {...args} style={{ width: 480 }}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Your trial ends in 3 days. Add a payment method to keep your
        workspace active.
      </AlertDescription>
    </Alert>
  ),
}

export const TitleOnly: Story = {
  name: "Title only",
  render: (args) => (
    <Alert {...args} style={{ width: 480 }}>
      <AlertTitle>Saved.</AlertTitle>
    </Alert>
  ),
}

export const DescriptionOnly: Story = {
  name: "Description only",
  render: (args) => (
    <Alert {...args} style={{ width: 480 }}>
      <AlertDescription>
        We've emailed you a confirmation link.
      </AlertDescription>
    </Alert>
  ),
}

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-3)",
        width: 480,
      }}
    >
      <Alert variant="neutral">
        <AlertTitle>Neutral</AlertTitle>
        <AlertDescription>Polite update for the user.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          We added a new export option to billing reports.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Saved.</AlertTitle>
        <AlertDescription>
          Your changes are live for everyone in this workspace.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Trial ending soon</AlertTitle>
        <AlertDescription>
          Your trial ends in 3 days. Add a payment method to continue.
        </AlertDescription>
      </Alert>
      <Alert variant="danger">
        <AlertTitle>Action failed</AlertTitle>
        <AlertDescription>
          We couldn't update your billing. Please try again or contact
          support.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const InCardContext: Story = {
  name: "Inside a Card",
  render: () => (
    <Card style={{ width: 480 }}>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="warning">
          <AlertTitle>Payment method expires next week.</AlertTitle>
          <AlertDescription>
            Update it now so your invoices on the 1st aren't interrupted.
          </AlertDescription>
        </Alert>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "var(--lead-space-3)",
          }}
        >
          <Button>Update payment method</Button>
        </div>
      </CardContent>
    </Card>
  ),
}
