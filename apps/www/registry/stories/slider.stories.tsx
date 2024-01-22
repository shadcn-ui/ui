import { Meta, StoryObj } from "@storybook/react"

import { Slider } from "@/registry/default/ui/slider"

/**
 * An input where the user selects a value from within a given range.
 */
const meta: Meta<typeof Slider> = {
  title: "ui/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Slider>

export const Base: Story = {
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
}

export const Inverted: Story = {
  render: Base.render,
  args: {
    ...Base.args,
    inverted: true,
  },
}

export const Disabled: Story = {
  render: Base.render,
  args: {
    ...Base.args,
    disabled: true,
  },
}

export const Interval: Story = {
  args: {
    defaultValue: [33, 88],
    max: 100,
    step: 1,
  },
}
