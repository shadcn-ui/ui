import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Slider } from "../registry/new-york-v4/ui/slider"

const meta = {
  title: "Shadcn/Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { defaultValue: [50], max: 100, min: 0, step: 1 },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
