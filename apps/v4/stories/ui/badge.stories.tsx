import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@/registry/new-york-v4/ui/badge"

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => <Badge>Badge</Badge>,
}

export const Secondary: Story = {
  render: () => <Badge variant="secondary">Secondary</Badge>,
}

export const Destructive: Story = {
  render: () => <Badge variant="destructive">Destructive</Badge>,
}

export const Outline: Story = {
  render: () => <Badge variant="outline">Outline</Badge>,
}

export const Ghost: Story = {
  render: () => <Badge variant="ghost">Ghost</Badge>,
}

export const Link: Story = {
  render: () => <Badge variant="link">Link</Badge>,
}
