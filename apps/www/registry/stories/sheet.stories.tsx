import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/default/ui/sheet"

/**
 * Extends the Dialog component to display content that complements the main
 * content of the screen.
 */
const meta: Meta<typeof Sheet> = {
  title: "ui/Sheet",
  component: Sheet,
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
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>
              <button className="hover:underline">Cancel</button>
            </SheetClose>
            <button className="rounded bg-primary px-4 py-2 text-primary-foreground">
              Submit
            </button>
          </SheetFooter>
        </SheetContent>
      </>
    ),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the sheet.
 */
export const Default: Story = {}
