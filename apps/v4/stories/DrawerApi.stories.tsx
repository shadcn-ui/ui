import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Drawer } from "../registry/new-york-v4/ui/drawer"

const meta = {
  title: "Shadcn/Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
