import Image from "next/image"
import { Meta, StoryObj } from "@storybook/react"

import { AspectRatio } from "@/registry/default/ui/aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "ui/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof AspectRatio>

export const Base: Story = {
  render: (args) => (
    <AspectRatio {...args} className="bg-slate-50 dark:bg-slate-800">
      <Image
        src="https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=800&dpr=2&q=80"
        alt="Photo by Alvaro Pinot"
        fill
        className="rounded-md object-cover"
      />
    </AspectRatio>
  ),
  args: {
    ratio: 16 / 9,
  },
}
