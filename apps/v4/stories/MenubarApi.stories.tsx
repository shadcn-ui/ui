import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Menubar } from "../registry/new-york-v4/ui/menubar"

const meta = {
  title: "Shadcn/Components/Menubar",
  component: Menubar,
  tags: ["autodocs"],
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
