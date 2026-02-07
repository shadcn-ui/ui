import type { Meta, StoryObj } from "@storybook/react"

import { Slider } from "@/registry/new-york-v4/ui/slider"

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => <Slider defaultValue={[50]} max={100} className="w-[300px]" />,
}

export const Range: Story = {
  render: () => (
    <Slider defaultValue={[25, 75]} max={100} className="w-[300px]" />
  ),
}

export const WithSteps: Story = {
  render: () => (
    <Slider
      defaultValue={[50]}
      max={100}
      step={10}
      className="w-[300px]"
    />
  ),
}

export const Disabled: Story = {
  render: () => (
    <Slider
      defaultValue={[50]}
      max={100}
      disabled
      className="w-[300px]"
    />
  ),
}
