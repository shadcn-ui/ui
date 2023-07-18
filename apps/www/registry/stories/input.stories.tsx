import { Meta, StoryObj } from "@storybook/react"

import { Button } from "../default/ui/button"
import { Input } from "../default/ui/input"
import { Label } from "../default/ui/label"

const meta: Meta<typeof Input> = {
  title: "ui/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  render: (args) => <Input {...args} />,
  args: {
    type: "email",
    placeholder: "Email",
  },
}
export const Disabled: Story = {
  render: (args) => <Input disabled {...args} />,
  args: { ...Default.args },
}
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">{args.placeholder}</Label>
      <Input {...args} id="email" />
    </div>
  ),
  args: { ...Default.args },
}
export const WithText: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-2">{args.placeholder}</Label>
      <Input {...args} id="email-2" />
      <p className="text-sm text-slate-500">Enter your email address.</p>
    </div>
  ),
  args: { ...Default.args },
}
export const WithButton: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input {...args} />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
  args: { ...Default.args },
}
