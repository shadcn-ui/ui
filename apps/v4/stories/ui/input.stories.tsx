import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  render: () => <Input />,
}

export const WithPlaceholder: Story = {
  render: () => <Input placeholder="Enter your name..." />,
}

export const Disabled: Story = {
  render: () => <Input placeholder="Disabled input" disabled />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const FileInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  ),
}

export const PasswordType: Story = {
  render: () => <Input type="password" placeholder="Enter password" />,
}
