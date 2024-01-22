import React from "react"
import { Meta, StoryObj } from "@storybook/react"

import { ScrollArea } from "@/registry/default/ui/scroll-area"
import { Separator } from "@/registry/default/ui/separator"

/**
 * Augments native scroll functionality for custom, cross-browser styling.
 */
const meta: Meta<typeof ScrollArea> = {
  title: "ui/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof ScrollArea>

export const Base: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-72 w-48 rounded-md border border-slate-100 dark:border-slate-700"
    >
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 })
          .map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
          .map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm" key={tag}>
                {tag}
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
      </div>
    </ScrollArea>
  ),
  args: {},
}

export const Always: Story = {
  render: Base.render,
  args: {
    type: "always",
  },
}

export const Hover: Story = {
  render: Base.render,
  args: {
    type: "hover",
  },
}

export const Scroll: Story = {
  render: Base.render,
  args: {
    type: "scroll",
  },
}
