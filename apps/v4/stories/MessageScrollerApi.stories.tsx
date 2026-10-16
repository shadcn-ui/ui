import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { MessageScrollerProvider } from "../registry/new-york-v4/ui/message-scroller"

const meta = {
  title: "Shadcn/Components/Message Scroller",
  component: MessageScrollerProvider,
  tags: ["autodocs"],
} satisfies Meta<typeof MessageScrollerProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
