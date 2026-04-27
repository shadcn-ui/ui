import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@leadbank/ui"

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead status/label badge. Renders as a non-interactive `<span>`. Five variants and three sizes via Lead CSS variables; optional leading dot for status indicators.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "brand", "success", "warning", "danger"],
    },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    dot: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
    variant: "neutral",
    size: "md",
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-2)",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="brand">Brand</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-3)",
        alignItems: "center",
      }}
    >
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  name: "Status dots",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-2)",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Badge variant="success" dot>
        Live
      </Badge>
      <Badge variant="warning" dot>
        Degraded
      </Badge>
      <Badge variant="danger" dot>
        Down
      </Badge>
      <Badge variant="neutral" dot>
        Offline
      </Badge>
    </div>
  ),
}

export const InCardContext: Story = {
  name: "In a Card",
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--lead-space-3)",
          }}
        >
          <CardTitle level={3}>Production deployment</CardTitle>
          <Badge variant="success" dot>
            Live
          </Badge>
        </div>
        <CardDescription>Last shipped 14 minutes ago.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", gap: "var(--lead-space-2)" }}>
          <Badge variant="brand" size="sm">
            v4.2.1
          </Badge>
          <Badge variant="neutral" size="sm">
            us-east-1
          </Badge>
        </div>
      </CardContent>
    </Card>
  ),
}
