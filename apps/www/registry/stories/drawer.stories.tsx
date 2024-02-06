import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/registry/default/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer"

/**
 * A drawer component for React.
 */
const meta: Meta<typeof Drawer> = {
  title: "ui/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <button className="rounded bg-primary px-4 py-2 text-primary-foreground">
            Submit
          </button>
          <DrawerClose>
            <button className="hover:underline">Cancel</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the drawer.
 */
export const Default: Story = {}
