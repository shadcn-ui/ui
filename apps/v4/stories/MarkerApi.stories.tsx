import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Marker } from "../registry/new-york-v4/ui/marker"

const meta = {
  title: "Shadcn/Components/Marker",
  component: Marker,
  tags: ["autodocs"],
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
