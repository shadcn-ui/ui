import type { Meta, StoryObj } from "@storybook/react"

import { AspectRatio } from "@/registry/new-york-v4/ui/aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Ratio16x9: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9}>
        <div className="bg-muted flex h-full w-full items-center justify-center rounded-md">
          <span className="text-muted-foreground text-sm">16:9</span>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Ratio1x1: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={1}>
        <div className="bg-muted flex h-full w-full items-center justify-center rounded-md">
          <span className="text-muted-foreground text-sm">1:1</span>
        </div>
      </AspectRatio>
    </div>
  ),
}
