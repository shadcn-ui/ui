import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Command } from "../registry/new-york-v4/ui/command"

const meta = {
  title: "Shadcn/Components/Command",
  component: Command,
  tags: ["autodocs"],
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
