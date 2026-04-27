import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@leadbank/ui"

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead text input. Three sizes, default and error variants, plus disabled and invalid states. Internal data-* state attributes cannot be overridden by callers.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "error"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "search", "url"],
    },
  },
  args: {
    placeholder: "you@example.com",
    "aria-label": "email",
    variant: "default",
    size: "md",
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Input {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof Input>

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

export const ErrorVariant: Story = {
  name: "Error variant",
  args: { variant: "error" },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
}

export const Email: Story = {
  args: { type: "email", placeholder: "name@lead.example" },
}

export const Password: Story = {
  args: { type: "password", placeholder: "••••••••" },
}
