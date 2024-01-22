import { Meta, StoryObj } from "@storybook/react"
import { Bold, Italic, Underline } from "lucide-react"

import { Toggle } from "@/registry/default/ui/toggle"

/**
 * A two-state button that can be either on or off.
 */
const meta: Meta<typeof Toggle> = {
  title: "ui/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Toggle>

export const Base: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
  args: {},
}

export const Outline: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
  args: {
    variant: "outline",
  },
}

export const WithText: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <Italic className="mr-2 h-4 w-4" />
      Italic
    </Toggle>
  ),
  args: {},
}

export const Small: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
  args: {
    size: "sm",
  },
}

export const Large: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
  args: {
    size: "lg",
  },
}

export const Disabled: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle underline">
      <Underline className="h-4 w-4" />
    </Toggle>
  ),
  args: {
    disabled: true,
  },
}
