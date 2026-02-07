import type { Meta, StoryObj } from "@storybook/react"

import { Spinner } from "@/registry/new-york-v4/ui/spinner"

const meta: Meta<typeof Spinner> = {
  title: "UI/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  render: () => <Spinner />,
}

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner />
      <span className="text-muted-foreground text-sm">Loading...</span>
    </div>
  ),
}
