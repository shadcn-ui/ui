import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@leadbank/ui"

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead progress bar built on @radix-ui/react-progress. Sizes `sm`/`md`/`lg`, variants `default`/`success`/`warning`/`danger`, plus indeterminate when `value` is omitted or null. Always pair with an `aria-label` or `aria-labelledby`.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    variant: {
      control: { type: "select" },
      options: ["default", "success", "warning", "danger"],
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    max: { control: "number" },
  },
  args: { size: "md", variant: "default", value: 60, max: 100 },
}

export default meta

type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Progress {...args} aria-label="Upload progress" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-3)",
        width: 320,
      }}
    >
      <Progress value={70} size="sm" aria-label="sm" />
      <Progress value={70} size="md" aria-label="md" />
      <Progress value={70} size="lg" aria-label="lg" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-3)",
        width: 320,
      }}
    >
      <Progress value={60} variant="default" aria-label="default" />
      <Progress value={100} variant="success" aria-label="success" />
      <Progress value={30} variant="warning" aria-label="warning" />
      <Progress value={15} variant="danger" aria-label="danger" />
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Progress aria-label="Loading" />
    </div>
  ),
}

export const InCardUploadState: Story = {
  name: "In a Card (upload state)",
  render: () => (
    <Card style={{ width: 380 }}>
      <CardHeader>
        <CardTitle>Uploading project assets</CardTitle>
        <CardDescription>
          38 of 200 files complete. Don't close this tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={38}
          max={200}
          aria-label="Upload progress"
        />
      </CardContent>
    </Card>
  ),
}

/**
 * Figma parity story (JES-92, batch A).
 *
 * Mirrors the Figma `Lead UI - Progress` page (component symbol
 * 29:97110). Figma's `Percent` variant has 5 discrete values
 * (0%, 25%, 50%, 75%, 100%) — see the existing Code Connect
 * mapping (Progress.figma.tsx) for the enum-to-number translation.
 *
 * Lead's `<Progress>` accepts a continuous `value` prop (0–100), so
 * the Figma enum is a strict subset. Rendered here at all 5 documented
 * percentages.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97110
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Percent variants)",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: 360,
        padding: 16,
        background: "var(--lead-color-surface-default)",
      }}
    >
      {[100, 75, 50, 25, 0].map((value) => (
        <div
          key={value}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <span
            style={{
              fontSize: 12,
              minWidth: 40,
              color: "var(--lead-color-text-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}%
          </span>
          <div style={{ flex: 1 }}>
            <Progress value={value} />
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Progress` (29:97110). Renders all " +
          "5 documented Percent variants (0/25/50/75/100). The Figma " +
          "enum is a discrete subset of Lead's continuous `value` " +
          "prop. No documented non-parity exceptions.",
      },
    },
  },
}
