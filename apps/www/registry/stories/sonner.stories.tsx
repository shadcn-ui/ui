import { Meta, StoryObj } from "@storybook/react"
import { toast } from "sonner"

import { Button } from "@/registry/default/ui/button"
import { Toaster } from "@/registry/default/ui/sonner"

const meta: Meta<typeof Toaster> = {
  title: "ui/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Toaster>

export const Base: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
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
      </Button>
      <Toaster {...args} />
    </div>
  ),
  args: {},
}
