import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@/registry/default/ui/badge"

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta = {
  title: "ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the badge.
 */
export const Default: Story = {}

/**
 * Use the `secondary` badge to call for less urgent information, blending
 * into the interface while still signaling minor updates or statuses.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
}

/**
 * Use the `destructive` badge to  indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
}

/**
 * Use the `outline` badge for overlaying without obscuring interface details,
 * emphasizing clarity and subtlety..
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
}
