import type { Meta, StoryObj } from "@storybook/react"
import { toast } from "sonner"

import { Toaster } from "@/registry/default/ui/sonner"

/**
 * An opinionated toast component for React.
 */
const meta: Meta<typeof Toaster> = {
  title: "ui/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the toaster.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() =>
          toast("Event has been created", {
            description: new Date().toLocaleString(),
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </button>
      <Toaster {...args} />
    </div>
  ),
}
