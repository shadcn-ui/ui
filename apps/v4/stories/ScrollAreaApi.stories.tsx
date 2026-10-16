import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ScrollArea } from "../registry/new-york-v4/ui/scroll-area"

const meta = {
  title: "Shadcn/Components/Scroll Area",
  component: ScrollArea,
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
