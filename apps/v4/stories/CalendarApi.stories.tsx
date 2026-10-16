import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Calendar } from "../registry/new-york-v4/ui/calendar"

const meta = {
  title: "Shadcn/Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  args: { mode: "single" },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
