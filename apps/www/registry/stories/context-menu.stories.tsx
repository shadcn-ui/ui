import type { Meta, StoryObj } from "@storybook/react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
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
      <ContextMenuContent className="w-32">
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

/**
 * A context menu with shortcuts.
 */
export const WithShortcuts: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-accent text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

/**
 * A context menu with a submenu.
 */
export const WithSubmenu: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-accent text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <ContextMenuItem>
          New Tab
          <ContextMenuShortcut>⌘N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

/**
 * A context menu with checkboxes.
 */
export const WithCheckboxes: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-accent text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuCheckboxItem checked>
          Show Comments
          <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Preview</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

/**
 * A context menu with a radio group.
 */
export const WithRadioGroup: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-md border border-dashed bg-accent text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuRadioGroup value="light">
          <ContextMenuLabel inset>Theme</ContextMenuLabel>
          <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
          <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
