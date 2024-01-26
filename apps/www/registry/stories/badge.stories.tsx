import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@/registry/default/ui/badge"

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta: Meta<typeof Badge> = {
  title: "ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof Badge>

/**
 * The default form of the badge.
 */
export const Default: Story = {
  render: (args) => <Badge {...args}>Badge</Badge>,
  args: {},
}

/**
 * Use the `secondary` badge to call for less urgent information, blending
 * into the interface while still signaling minor updates or statuses.
 */
export const Secondary: Story = {
  render: Default.render,
  args: {
    variant: "secondary",
  },
}

/**
 * Use the `destructive` badge to  indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  render: Default.render,
  args: {
    variant: "destructive",
  },
}

/**
 * Use the `outline` badge for overlaying without obscuring interface details,
 * emphasizing clarity and subtlety..
 */
export const Outline: Story = {
  render: Default.render,
  args: {
    variant: "outline",
  },
}
