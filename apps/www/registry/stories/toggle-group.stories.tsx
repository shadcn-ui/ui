import { Meta, StoryObj } from "@storybook/react"
import { Bold, Italic, Underline } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/default/ui/toggle-group"

/**
 * A set of two-state buttons that can be toggled on or off.
 */
const meta: Meta<typeof ToggleGroup> = {
  title: "ui/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof ToggleGroup>

export const Base: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  args: {
    type: "multiple",
  },
}

export const Outline: Story = {
  render: Base.render,
  args: {
    ...Base.args,
    variant: "outline",
  },
}

export const Single: Story = {
  render: Base.render,
  args: {
    type: "single",
  },
}

export const Small: Story = {
  render: Base.render,
  args: {
    ...Base.args,
    size: "sm",
  },
}

export const Large: Story = {
  render: Base.render,
  args: {
    ...Base.args,
    size: "lg",
  },
}

export const Disabled: Story = {
  render: Base.render,
  args: {
    ...Base.args,
    disabled: true,
  },
}
