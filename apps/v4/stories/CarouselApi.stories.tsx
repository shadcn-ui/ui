import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Carousel } from "../registry/new-york-v4/ui/carousel"

const meta = {
  title: "Shadcn/Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
