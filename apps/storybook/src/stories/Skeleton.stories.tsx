import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@leadbank/ui"

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead skeleton placeholder for loading content. Three shapes (`text`, `rect`, `circle`) and a shimmer animation. Decorative by default (`role='none'`, `aria-hidden=true`) — pair the placeholder with a parent that announces the loading state.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    shape: { control: { type: "select" }, options: ["text", "rect", "circle"] },
    decorative: { control: "boolean" },
  },
  args: { shape: "rect", decorative: true },
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Shapes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-3)",
        alignItems: "center",
      }}
    >
      <Skeleton shape="circle" style={{ width: 48, height: 48 }} />
      <Skeleton shape="rect" style={{ width: 160, height: 32 }} />
      <Skeleton shape="text" style={{ width: 200 }} />
    </div>
  ),
}

export const TextLines: Story = {
  name: "Text lines",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-2)",
        width: 360,
      }}
    >
      <Skeleton shape="text" style={{ width: "60%" }} />
      <Skeleton shape="text" />
      <Skeleton shape="text" />
      <Skeleton shape="text" style={{ width: "85%" }} />
    </div>
  ),
}

export const InCardLoadingState: Story = {
  name: "In a Card (loading state)",
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
          <Skeleton shape="circle" style={{ width: 36, height: 36 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flex: 1,
            }}
          >
            <Skeleton shape="text" style={{ width: "40%" }} />
            <Skeleton shape="text" style={{ width: "70%", height: 12 }} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton shape="text" />
        <Skeleton shape="text" />
        <Skeleton shape="text" style={{ width: "85%" }} />
      </CardContent>
    </Card>
  ),
}

export const Semantic: Story = {
  name: "Semantic (aria-live region)",
  render: () => (
    <Skeleton
      decorative={false}
      aria-label="Loading user profile"
      style={{ width: 200, height: 24 }}
    />
  ),
}
