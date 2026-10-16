import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Textarea } from "../registry/new-york-v4/ui/textarea"

const meta = {
  title: "Shadcn/Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { placeholder: "Write a message", rows: 4 },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
