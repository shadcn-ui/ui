import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Checkbox } from "../registry/new-york-v4/ui/checkbox"

const meta = {
  title: "Shadcn/Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { "aria-label": "Accept terms", defaultChecked: false },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
