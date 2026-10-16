import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ThemeProvider } from "next-themes"

import { Toaster } from "../registry/new-york-v4/ui/sonner"

const meta = {
  title: "Shadcn/Components/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  render: (args) => (
    <ThemeProvider attribute="class">
      <Toaster {...args} />
    </ThemeProvider>
  ),
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
