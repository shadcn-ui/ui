import type { Meta, StoryObj } from "@storybook/react"
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
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof ToggleGroup>

/**
 * The default form of the toggle group.
 */
export const Default: Story = {
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

/**
 * Use the `outline` variant to emphasizing the individuality of each button
 * while keeping them visually cohesive.
 */
export const Outline: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    variant: "outline",
  },
}

/**
 * Use the `single` type to create exclusive selection within the button
 * group, allowing only one button to be active at a time.
 */
export const Single: Story = {
  render: Default.render,
  args: {
    type: "single",
  },
}

/**
 * Use the `sm` size for a compact version of the button group, featuring
 * smaller buttons for spaces with limited real estate.
 */
export const Small: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    size: "sm",
  },
}

/**
 * Use the `lg` size for a more prominent version of the button group, featuring
 * larger buttons for emphasis.
 */
export const Large: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    size: "lg",
  },
}

/**
 * Add the `disabled` prop to a button to prevent interactions.
 */
export const Disabled: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    disabled: true,
  },
}
