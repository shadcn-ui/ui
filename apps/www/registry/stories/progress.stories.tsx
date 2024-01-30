import { useEffect, useState } from "react"
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
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the progress.
 */
export const Default: Story = {
  render: (args) => <Progress {...args} />,
  args: {
    value: 30,
  },
}

/**
 * Use the `value` prop to set the progress value and animate between values.
 */
export const Animated: Story = {
  render: (args) => <ProgressDemo {...args} />,
  args: {
    value: 13,
  },
}

const ProgressDemo = (args: Story["args"]) => {
  const [progress, setProgress] = useState(args?.value)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 2000)
    return () => clearTimeout(timer)
  }, [])

  return <Progress {...args} value={progress} className="w-[60%]" />
}
