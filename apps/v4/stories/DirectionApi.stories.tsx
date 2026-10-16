import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { DirectionProvider } from "../registry/new-york-v4/ui/direction"

const meta = {
  title: "Shadcn/Components/Direction",
  component: DirectionProvider,
  tags: ["autodocs"],
  args: { dir: "ltr" },
  render: (args) => (
    <DirectionProvider {...args}>
      <div className="rounded-md border p-4">Direction-aware content</div>
    </DirectionProvider>
  ),
} satisfies Meta<typeof DirectionProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
