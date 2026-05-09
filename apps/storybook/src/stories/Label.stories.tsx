import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input, Label } from "@leadbank/ui"

/**
 * Label — Storybook stories.
 *
 * Includes Figma-parity stories matching the source design at:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=213-116
 *
 * Parity reference: docs/storybook-figma-parity-standard.md.
 */

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead form label. Three sizes, plus a `required` indicator with an accessible 'required' announcement. Pair with an Input via `htmlFor`.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Email",
    size: "md",
  },
}

export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {}

export const Small: Story = {
  args: { size: "sm" },
}

export const Medium: Story = {
  args: { size: "md" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Required: Story = {
  args: { required: true },
}

export const PairedWithInput: Story = {
  name: "Paired with Input",
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-2)",
        width: 320,
      }}
    >
      <Label {...args} htmlFor="email-input">
        {args.children}
      </Label>
      <Input id="email-input" placeholder="you@example.com" />
    </div>
  ),
  args: {
    children: "Email",
    required: true,
  },
}

export const FigmaParitySizeRequiredState: Story = {
  name: "Figma parity (Size × Required × State)",
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors the standalone Label source component created in Figma at https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=213-116. Mapped surfaces: Size → `size`, Required → `required`, and State=Disabled → `disabled`. No documented non-parity exceptions: the Figma source was created from Lead React's Label API.",
      },
    },
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "var(--lead-space-4)",
        gridTemplateColumns: "repeat(4, minmax(120px, max-content))",
        alignItems: "center",
      }}
    >
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} style={{ display: "contents" }}>
          <Label size={size}>Label</Label>
          <Label size={size} disabled>
            Label
          </Label>
          <Label size={size} required>
            Label
          </Label>
          <Label size={size} required disabled>
            Label
          </Label>
        </div>
      ))}
    </div>
  ),
}
