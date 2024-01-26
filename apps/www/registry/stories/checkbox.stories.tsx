import type { Meta, StoryObj } from "@storybook/react"

import { Checkbox } from "@/registry/default/ui/checkbox"

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta: Meta<typeof Checkbox> = {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Base: Story = {
  render: (args) => (
    <div className="items-top flex space-x-2">
      <Checkbox {...args} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={args.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  ),
  args: {
    id: "terms1",
  },
}

export const Disabled: Story = {
  render: Base.render,
  args: {
    id: "terms2",
    disabled: true,
  },
}
