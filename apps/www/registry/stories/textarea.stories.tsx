import { Meta, StoryObj } from "@storybook/react"

import { Button } from "../default/ui/button"
import { Label } from "../default/ui/label"
import { Textarea } from "../default/ui/textarea"

const meta: Meta<typeof Textarea> = {
  title: "ui/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: (args) => <Textarea {...args} />,
  args: {
    placeholder: "Type your message here.",
  },
}

export const Disabled: Story = {
  render: (args) => <Textarea {...args} />,
  args: {
    ...Default.args,
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" />
    </div>
  ),
  args: { ...Default.args },
}

export const WithText: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">Your Message</Label>
      <Textarea {...args} id="message-2" />
      <p className="text-sm text-slate-500">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
  args: { ...Default.args },
}

export const WithButton: Story = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Textarea {...args} />
      <Button>Send message</Button>
    </div>
  ),
  args: { ...Default.args },
}
