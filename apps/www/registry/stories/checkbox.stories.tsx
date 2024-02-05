import type { Meta, StoryObj } from "@storybook/react"

import { Checkbox } from "@/registry/default/ui/checkbox"

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta = {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <div className="flex space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor={args.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        Accept terms and conditions
      </label>
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
