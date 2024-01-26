import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "@/registry/default/ui/label"

/**
 * Renders an accessible label associated with controls.
 */
const meta: Meta<typeof Label> = {
  title: "ui/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Label>

/**
 * The default form of the label.
 */
export const Default: Story = {
  render: (args) => (
    <Label {...args} htmlFor="email">
      Your email address
    </Label>
  ),
  args: {},
}
