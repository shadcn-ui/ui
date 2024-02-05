import type { Meta, StoryObj } from "@storybook/react"
import { AlertCircle, Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/default/ui/alert"

/**
 * Displays a callout for user attention.
 */
const meta = {
  title: "ui/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>
/**
 * The default form of the alert.
 */
export const Default: Story = {
  args: {
    variant: "default",
    children: (
      <>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </>
    ),
  },
}

/**
 * Use the `destructive` alert to indicate a destructive action.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </>
    ),
  },
}
