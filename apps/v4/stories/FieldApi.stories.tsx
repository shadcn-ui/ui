import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Field } from "../registry/new-york-v4/ui/field"

const meta = {
  title: "Shadcn/Components/Field",
  component: Field,
  tags: ["autodocs"],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
