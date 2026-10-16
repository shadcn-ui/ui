import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AspectRatio } from "../registry/new-york-v4/ui/aspect-ratio"

const meta = {
  title: "Shadcn/Components/Aspect Ratio",
  component: AspectRatio,
  tags: ["autodocs"],
  args: { ratio: 16 / 9 },
  render: (args) => (
    <AspectRatio {...args} className="w-64 rounded-md bg-muted" />
  ),
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
