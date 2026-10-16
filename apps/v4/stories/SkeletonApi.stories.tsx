import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Skeleton } from "../registry/new-york-v4/ui/skeleton"

const meta = {
  title: "Shadcn/Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: { className: "h-5 w-40" },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
