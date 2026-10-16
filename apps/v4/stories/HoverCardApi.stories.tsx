import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { HoverCard } from "../registry/new-york-v4/ui/hover-card"

const meta = {
  title: "Shadcn/Components/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
