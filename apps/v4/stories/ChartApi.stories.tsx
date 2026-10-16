import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ChartContainer } from "../registry/new-york-v4/ui/chart"

const meta = {
  title: "Shadcn/Components/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  args: { config: {} },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
