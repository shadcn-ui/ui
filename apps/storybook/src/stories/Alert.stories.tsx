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

const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const WarningIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export const WithIcon: Story = {
  name: "With caller-supplied icon",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-3)",
        width: 480,
      }}
    >
      <Alert variant="info" icon={<InfoIcon />}>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          We added a new export option to billing reports.
        </AlertDescription>
      </Alert>
      <Alert variant="warning" icon={<WarningIcon />}>
        <AlertTitle>Trial ending soon</AlertTitle>
        <AlertDescription>
          Add a payment method to keep your workspace active.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
