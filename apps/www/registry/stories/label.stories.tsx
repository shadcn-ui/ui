import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "@/registry/default/ui/label"

/**
 * Renders an accessible label associated with controls.
 */
const meta = {
  title: "ui/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <Label {...args} htmlFor="email" />,
  args: {
    children: "Your email address",
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof Label>

/**
 * The default form of the label.
 */
export const Default: Story = {}
