import React from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { ScrollArea } from "@/registry/default/ui/scroll-area"
import { Separator } from "@/registry/default/ui/separator"

/**
 * Augments native scroll functionality for custom, cross-browser styling.
 */
const meta = {
  title: "ui/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
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
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the scroll area.
 */
export const Default: Story = {}

/**
 * Use the `type` prop with `always` to always show the scroll area.
 */
export const Always: Story = {
  args: {
    type: "always",
  },
}

/**
 * Use the `type` prop with `hover` to show the scroll area on hover.
 */
export const Hover: Story = {
  args: {
    type: "hover",
  },
}

/**
 * Use the `type` prop with `scroll` to show the scroll area when scrolling.
 */
export const Scroll: Story = {
  args: {
    type: "scroll",
  },
}
