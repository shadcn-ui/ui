import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { InputGroup } from "../registry/new-york-v4/ui/input-group"

const meta = {
  title: "Shadcn/Components/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
