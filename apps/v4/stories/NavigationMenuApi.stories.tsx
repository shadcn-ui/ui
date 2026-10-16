import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { NavigationMenu } from "../registry/new-york-v4/ui/navigation-menu"

const meta = {
  title: "Shadcn/Components/Navigation Menu",
  component: NavigationMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
