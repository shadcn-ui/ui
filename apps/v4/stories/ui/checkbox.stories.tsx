import type { Meta, StoryObj } from "@storybook/react"

import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const DisabledWithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-terms" disabled />
      <label
        htmlFor="disabled-terms"
        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}
