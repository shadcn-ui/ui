import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Switch } from "../registry/new-york-v4/ui/switch"

const meta = {
  title: "Shadcn/Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { "aria-label": "Toggle setting", defaultChecked: false },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
