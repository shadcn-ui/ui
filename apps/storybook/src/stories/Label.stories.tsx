import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input, Label } from "@leadbank/ui"

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
