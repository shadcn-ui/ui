import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ResizablePanelGroup } from "../registry/new-york-v4/ui/resizable"

const meta = {
  title: "Shadcn/Components/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
