import type { Meta, StoryObj } from "@storybook/react"

import { Kbd, KbdGroup } from "@/registry/new-york-v4/ui/kbd"

const meta: Meta<typeof Kbd> = {
  title: "UI/Kbd",
  component: Kbd,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {
  render: () => <Kbd>K</Kbd>,
}

export const CommandK: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}

export const CtrlC: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>C</Kbd>
    </KbdGroup>
  ),
}

export const ShiftEnter: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⇧</Kbd>
      <Kbd>↵</Kbd>
    </KbdGroup>
  ),
}

export const Escape: Story = {
  render: () => <Kbd>Esc</Kbd>,
}
