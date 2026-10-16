import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { MessageGroup } from "../registry/new-york-v4/ui/message"

const meta = {
  title: "Shadcn/Components/Message",
  component: MessageGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof MessageGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
