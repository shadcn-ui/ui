import type { Meta, StoryObj } from "@storybook/react"

import { Textarea } from "@/registry/new-york-v4/ui/textarea"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => <Textarea className="w-[320px]" />,
}

export const WithPlaceholder: Story = {
  render: () => (
    <Textarea className="w-[320px]" placeholder="Type your message here." />
  ),
}

export const Disabled: Story = {
  render: () => (
    <Textarea
      className="w-[320px]"
      placeholder="This textarea is disabled."
      disabled
    />
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-[320px] gap-1.5">
      <label htmlFor="message" className="text-sm font-medium">
        Your message
      </label>
      <Textarea id="message" placeholder="Type your message here." />
      <p className="text-muted-foreground text-sm">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
}
