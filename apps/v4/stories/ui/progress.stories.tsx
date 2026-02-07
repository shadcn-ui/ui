import type { Meta, StoryObj } from "@storybook/react"

import { Progress } from "@/registry/new-york-v4/ui/progress"

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: () => <Progress value={50} className="w-[300px]" />,
}
