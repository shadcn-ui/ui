import { Meta, StoryObj } from "@storybook/react"

import { Skeleton } from "@/registry/default/ui/skeleton"

/**
 * Use to show a placeholder while content is loading.
 */
const meta: Meta<typeof Skeleton> = {
  title: "ui/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Base: Story = {
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Skeleton {...args} className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-[250px]" />
        <Skeleton {...args} className="h-4 w-[200px]" />
      </div>
    </div>
  ),
  args: {},
}
