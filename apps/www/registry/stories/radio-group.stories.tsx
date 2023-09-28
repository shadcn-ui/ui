import { Meta, StoryObj } from "@storybook/react"

import { Label } from "@/registry/default/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"

const meta: Meta<typeof RadioGroup> = {
  title: "ui/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof RadioGroup>

export const Base: Story = {
  render: (args) => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
  args: {},
}
