import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BubbleGroup } from "../registry/new-york-v4/ui/bubble"

const meta = {
  title: "Shadcn/Components/Bubble",
  component: BubbleGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof BubbleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
