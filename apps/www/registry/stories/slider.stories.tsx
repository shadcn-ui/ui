import type { Meta, StoryObj } from "@storybook/react"

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

/**
 * The default form of the slider.
 */
export const Default: Story = {
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
}

/**
 * Use the `inverted` prop to have the slider fill from right to left.
 */
export const Inverted: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    inverted: true,
  },
}

/**
 * Use the `disabled` prop to disable the slider.
 */
export const Disabled: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    disabled: true,
  },
}

/**
 * Use an array with the `defaultValue` prop to create a range slider.
 */
export const Interval: Story = {
  args: {
    defaultValue: [33, 88],
    max: 100,
    step: 1,
  },
}
