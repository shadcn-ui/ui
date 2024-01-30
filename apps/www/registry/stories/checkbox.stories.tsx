import type { Meta, StoryObj } from "@storybook/react"

import { Checkbox } from "@/registry/default/ui/checkbox"
import { Label } from "@/registry/default/ui/label"

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta = {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <div className="items-top flex space-x-2">
      <Checkbox {...args} />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={args.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </Label>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  ),
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the checkbox.
 */
export const Default: Story = {
  args: {
    id: "terms1",
  },
}

/**
 * Use the `disabled` prop to disable the checkbox.
 */
export const Disabled: Story = {
  args: {
    id: "terms2",
    disabled: true,
  },
}
