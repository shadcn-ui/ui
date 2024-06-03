import type { Meta, StoryObj } from "@storybook/react"

import { Progress } from "@/registry/default/ui/progress"

/**
 * Displays an indicator showing the completion progress of a task, typically
 * displayed as a progress bar.
 */
const meta = {
  title: "ui/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    value: 30,
    max: 100,
  },
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the progress.
 */
export const Default: Story = {}

/**
 * When the progress is indeterminate.
 */
export const Indeterminate: Story = {
  args: {
    value: undefined,
  },
}

/**
 * When the progress is completed.
 */
export const Completed: Story = {
  args: {
    value: 100,
  },
}
