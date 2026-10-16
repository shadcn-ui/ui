import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ButtonGroup } from "../registry/new-york-v4/ui/button-group"

const meta = {
  title: "Shadcn/Components/Button Group",
  component: ButtonGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
