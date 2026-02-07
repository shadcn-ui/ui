import type { Meta, StoryObj } from "@storybook/react"

import { Switch } from "@/registry/new-york-v4/ui/switch"

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => <Switch />,
}

export const Checked: Story = {
  render: () => <Switch defaultChecked />,
}

export const Disabled: Story = {
  render: () => <Switch disabled />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <label
        htmlFor="airplane-mode"
        className="text-sm leading-none font-medium"
      >
        Airplane Mode
      </label>
    </div>
  ),
}
