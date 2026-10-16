import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Empty } from "../registry/new-york-v4/ui/empty"

const meta = {
  title: "Shadcn/Components/Empty",
  component: Empty,
  tags: ["autodocs"],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
