import Image from "next/image"
import type { Meta, StoryObj } from "@storybook/react"

import { AspectRatio } from "@/registry/default/ui/aspect-ratio"

/**
 * Displays content within a desired ratio.
 */
const meta = {
  title: "ui/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <div className="w-1/2">
      <AspectRatio {...args} className="bg-slate-50 dark:bg-slate-800">
        <Image
          src="https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=800&dpr=2&q=80"
          alt="Photo by Alvaro Pinot"
          fill
          className="rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the aspect ratio.
 */
export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
}

/**
 * Use the `1:1` aspect ratio to display a square image.
 */
export const Square: Story = {
  args: {
    ratio: 1,
  },
}

/**
 * Use the `4:3` aspect ratio to display a landscape image.
 */
export const Landscape: Story = {
  args: {
    ratio: 4 / 3,
  },
}

/**
 * Use the `2.35:1` aspect ratio to display a cinemascope image.
 */
export const Cinemascope: Story = {
  args: {
    ratio: 2.35 / 1,
  },
}
