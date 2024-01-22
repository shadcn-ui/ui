import { Meta, StoryObj } from "@storybook/react"
import { Loader2, Mail } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

/**
 * Displays a button or a component that looks like a button.
 */
const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Base: Story = {
  render: (args) => <Button {...args}>Button</Button>,
  args: {
    variant: "default",
  },
}

export const Outline: Story = {
  render: Base.render,
  args: {
    variant: "outline",
  },
}

export const Ghost: Story = {
  render: Base.render,
  args: {
    variant: "ghost",
  },
}

export const Secondary: Story = {
  render: Base.render,
  args: {
    variant: "secondary",
  },
}

export const Destructive: Story = {
  render: Base.render,
  args: {
    variant: "destructive",
  },
}

export const Link: Story = {
  render: Base.render,
  args: {
    variant: "link",
  },
}

export const Loading: Story = {
  render: (args) => (
    <Button {...args}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Button
    </Button>
  ),
  args: {
    ...Outline.args,
  },
}

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" /> Login with Email Button
    </Button>
  ),
  args: {
    ...Secondary.args,
  },
}
