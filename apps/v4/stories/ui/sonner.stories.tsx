import type { Meta, StoryObj } from "@storybook/react"
import { toast } from "sonner"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Toaster } from "@/registry/new-york-v4/ui/sonner"

const meta: Meta<typeof Toaster> = {
  title: "UI/Sonner",
  component: Toaster,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Default: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast("Event has been created.")}
    >
      Show Toast
    </Button>
  ),
}

export const Success: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.success("Event has been created successfully.", {
          style: {
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
          },
        })
      }
    >
      Show Success
    </Button>
  ),
}

export const Error: Story = {
  name: "Error",
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.error("Something went wrong.", {
          style: {
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
          },
        })
      }
    >
      Show Error
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.warning("Please review your input.", {
          style: {
            background: "#fffbeb",
            border: "1px solid #fde68a",
            color: "#92400e",
          },
        })
      }
    >
      Show Warning
    </Button>
  ),
}

export const Info: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.info("Your trial expires in 3 days.", {
          style: {
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1e40af",
          },
        })
      }
    >
      Show Info
    </Button>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created.", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show With Action
    </Button>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event Created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
        })
      }
    >
      Show With Description
    </Button>
  ),
}
