import type { Meta, StoryObj } from "@storybook/react"

import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"

/**
 * A set of checkable buttons—known as radio buttons—where no more than one of
 * the buttons can be checked at a time.
 */
const meta = {
  title: "ui/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    defaultValue: "comfortable",
    className: "grid gap-2 grid-cols-[1rem_1fr] items-center",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="default" id="r1" />
      <label htmlFor="r1">Default</label>
      <RadioGroupItem value="comfortable" id="r2" />
      <label htmlFor="r2">Comfortable</label>
      <RadioGroupItem value="compact" id="r3" />
      <label htmlFor="r3">Compact</label>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the radio group.
 */
export const Default: Story = {}
