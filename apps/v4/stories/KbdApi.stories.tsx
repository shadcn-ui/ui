import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Kbd } from "../registry/new-york-v4/ui/kbd"

const meta = {
  title: "Shadcn/Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  args: { children: "Ctrl K" },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
