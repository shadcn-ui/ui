import { Meta, StoryObj } from "@storybook/react"

import { Label } from "@/registry/default/ui/label"
import { Switch } from "@/registry/default/ui/switch"

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta: Meta<typeof Switch> = {
  title: "ui/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof Switch>

export const Base: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
  args: {},
}

export const Disabled: Story = {
  render: Base.render,
  args: {
    disabled: true,
  },
}
