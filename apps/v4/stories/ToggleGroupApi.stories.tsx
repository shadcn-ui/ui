import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "../registry/new-york-v4/ui/toggle-group"

const meta = {
  title: "Shadcn/Components/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  args: { type: "single", defaultValue: "left", variant: "outline" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
