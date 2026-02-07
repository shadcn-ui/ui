import type { Meta, StoryObj } from "@storybook/react"

import { ScrollArea, ScrollBar } from "@/registry/new-york-v4/ui/scroll-area"

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof ScrollArea>

const tags = Array.from({ length: 50 }, (_, i) => `v1.0.0-beta.${i + 1}`)

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="text-sm">
            {tag}
            <div className="my-2 h-px bg-border" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted text-sm"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const BothDirections: Story = {
  render: () => (
    <ScrollArea className="h-72 w-72 rounded-md border">
      <div className="w-[600px] p-4">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="text-sm whitespace-nowrap">
            Row {i + 1} — This is a long line of text that extends beyond the
            visible area to demonstrate horizontal scrolling behavior.
            <div className="my-2 h-px bg-border" />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}
