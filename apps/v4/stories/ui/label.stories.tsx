import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "@/registry/new-york-v4/ui/label"

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  render: () => <Label>Email address</Label>,
}
