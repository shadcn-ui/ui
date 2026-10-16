import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "../registry/new-york-v4/ui/badge"

const meta = {
  title: "Shadcn/Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { variant: "default" },
  render: (args) => <Badge {...args}>Badge</Badge>,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
