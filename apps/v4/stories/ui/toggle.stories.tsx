import type { Meta, StoryObj } from "@storybook/react"
import { Bold, Italic, Underline } from "lucide-react"

import { Toggle } from "@/registry/new-york-v4/ui/toggle"

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold />
    </Toggle>
  ),
}

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Italic />
    </Toggle>
  ),
}

export const Pressed: Story = {
  render: () => (
    <Toggle defaultPressed aria-label="Toggle bold">
      <Bold />
    </Toggle>
  ),
}

export const WithText: Story = {
  name: "With Text",
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Toggle disabled aria-label="Toggle underline">
      <Underline />
    </Toggle>
  ),
}
