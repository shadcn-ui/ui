import { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@/registry/default/ui/badge"

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta: Meta<typeof Badge> = {
  title: "ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Badge>

export const Base: Story = {
  render: (args) => <Badge {...args}>Badge</Badge>,
  args: {},
}

export const Secondary: Story = {
  render: Base.render,
  args: {
    variant: "secondary",
  },
}

export const Destructive: Story = {
  render: Base.render,
  args: {
    variant: "destructive",
  },
}

export const Outline: Story = {
  render: Base.render,
  args: {
    variant: "outline",
  },
}
