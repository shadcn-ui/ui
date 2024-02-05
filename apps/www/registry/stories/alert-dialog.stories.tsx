import type { Meta, StoryObj } from "@storybook/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/default/ui/alert-dialog"

/**
 * A modal dialog that interrupts the user with important content and expects
 * a response.
 */
const meta = {
  title: "ui/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: "centered",
    children: (
      <>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </>
    ),
  },
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the alert dialog.
 */
export const Default: Story = {}
