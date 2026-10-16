import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "../registry/new-york-v4/ui/input"

const meta = {
  title: "Shadcn/Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter text",
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
