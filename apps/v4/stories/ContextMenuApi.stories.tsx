import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ContextMenu } from "../registry/new-york-v4/ui/context-menu"

const meta = {
  title: "Shadcn/Components/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
