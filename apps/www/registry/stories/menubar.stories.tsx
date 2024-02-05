import type { Meta, StoryObj } from "@storybook/react"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/default/ui/menubar"

/**
 * A visually persistent menu common in desktop applications that provides
 * quick access to a consistent set of commands.
 */
const meta = {
  title: "ui/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    children: (
      <>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </>
    ),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Menubar>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the menubar.
 */
export const Default: Story = {}

/**
 * A menubar with a submenu.
 */
export const WithSubmenu: Story = {
  args: {
    children: (
      <>
        <MenubarMenu>
          <MenubarTrigger>Actions</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Download</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </>
    ),
  },
}

/**
 * A menubar with radio items.
 */
export const WithRadioItems: Story = {
  args: {
    children: (
      <>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="md">
              <MenubarRadioItem value="sm">Small</MenubarRadioItem>
              <MenubarRadioItem value="md">Medium</MenubarRadioItem>
              <MenubarRadioItem value="lg">Large</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </>
    ),
  },
}
