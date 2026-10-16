import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Spinner } from "../registry/new-york-v4/ui/spinner"

const meta = {
  title: "Shadcn/Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
