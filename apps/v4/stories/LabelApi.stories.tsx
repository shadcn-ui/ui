import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Label } from "../registry/new-york-v4/ui/label"

const meta = {
  title: "Shadcn/Components/Label",
  component: Label,
  tags: ["autodocs"],
  args: { children: "Label" },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
