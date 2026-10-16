import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Separator } from "../registry/new-york-v4/ui/separator"

const meta = {
  title: "Shadcn/Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  args: { orientation: "horizontal" },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
