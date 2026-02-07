import type { Meta, StoryObj } from "@storybook/react"
import { Loader2, Mail } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => <Button>Default</Button>,
}

export const Destructive: Story = {
  render: () => <Button variant="destructive">Destructive</Button>,
}

export const Outline: Story = {
  render: () => <Button variant="outline">Outline</Button>,
}

export const Secondary: Story = {
  render: () => <Button variant="secondary">Secondary</Button>,
}

export const Ghost: Story = {
  render: () => <Button variant="ghost">Ghost</Button>,
}

export const LinkVariant: Story = {
  name: "Link",
  render: () => <Button variant="link">Link</Button>,
}

export const Disabled: Story = {
  render: () => <Button disabled>Disabled</Button>,
}

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Mail />
      Login with Email
    </Button>
  ),
}

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="animate-spin" />
      Please wait
    </Button>
  ),
}
