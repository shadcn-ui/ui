import type { Meta, StoryObj } from "@storybook/react"

import { DirectionProvider } from "@/registry/new-york-v4/ui/direction"

const meta: Meta<typeof DirectionProvider> = {
  title: "UI/Direction",
  component: DirectionProvider,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof DirectionProvider>

export const LeftToRight: Story = {
  render: () => (
    <DirectionProvider dir="ltr">
      <div className="border-border flex flex-col gap-2 rounded-md border p-4">
        <p className="text-sm font-medium">Left to Right</p>
        <p className="text-muted-foreground text-sm">
          This content flows from left to right.
        </p>
      </div>
    </DirectionProvider>
  ),
}

export const RightToLeft: Story = {
  render: () => (
    <DirectionProvider dir="rtl">
      <div
        dir="rtl"
        className="border-border flex flex-col gap-2 rounded-md border p-4"
      >
        <p className="text-sm font-medium">من اليمين إلى اليسار</p>
        <p className="text-muted-foreground text-sm">
          هذا المحتوى يتدفق من اليمين إلى اليسار.
        </p>
      </div>
    </DirectionProvider>
  ),
}
