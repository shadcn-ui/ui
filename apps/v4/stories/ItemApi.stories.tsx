import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Item } from "../registry/new-york-v4/ui/item"

const meta = {
  title: "Shadcn/Components/Item",
  component: Item,
  tags: ["autodocs"],
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
