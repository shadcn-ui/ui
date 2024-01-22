import { Meta, StoryObj } from "@storybook/react"

import { Separator } from "@/registry/default/ui/separator"

/**
 * Visually or semantically separates content.
 */
const meta: Meta<typeof Separator> = {
  title: "ui/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Separator>

export const Base: Story = {
  render: (args) => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          An open-source UI component library.
        </p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator {...args} orientation="vertical" />
        <div>Docs</div>
        <Separator {...args} orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
  args: {
    orientation: "horizontal",
  },
}
