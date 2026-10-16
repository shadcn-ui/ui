import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Progress } from "../registry/new-york-v4/ui/progress"

const meta = {
  title: "Shadcn/Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { value: 60 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
