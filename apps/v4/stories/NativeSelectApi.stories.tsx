import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { NativeSelect } from "../registry/new-york-v4/ui/native-select"

const meta = {
  title: "Shadcn/Components/Native Select",
  component: NativeSelect,
  tags: ["autodocs"],
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
