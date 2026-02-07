import type { Meta, StoryObj } from "@storybook/react"

import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"

const meta: Meta<typeof RadioGroup> = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <label htmlFor="r1" className="text-sm leading-none font-medium">
          Default
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <label htmlFor="r2" className="text-sm leading-none font-medium">
          Comfortable
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <label htmlFor="r3" className="text-sm leading-none font-medium">
          Compact
        </label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="default" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="d1" />
        <label htmlFor="d1" className="text-sm leading-none font-medium">
          Default
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="d2" />
        <label htmlFor="d2" className="text-sm leading-none font-medium">
          Comfortable
        </label>
      </div>
    </RadioGroup>
  ),
}
