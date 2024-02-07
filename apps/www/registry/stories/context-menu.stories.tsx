import type { Meta, StoryObj } from "@storybook/react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/default/ui/context-menu"

/**
 * Displays a menu to the user — such as a set of actions or functions —
 * triggered by a button.
 */
const meta = {
  title: "ui/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  argTypes: {},
  args: {},
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-accent text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ContextMenu>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the context menu.
 */
export const Default: Story = {}
