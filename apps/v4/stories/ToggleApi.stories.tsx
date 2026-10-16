import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Toggle } from "../registry/new-york-v4/ui/toggle"

const meta = {
  title: "Shadcn/Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: { variant: "default", size: "default", defaultPressed: false },
  render: (args) => <Toggle {...args}>Toggle</Toggle>,
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
