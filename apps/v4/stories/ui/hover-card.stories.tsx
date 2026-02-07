import type { Meta, StoryObj } from "@storybook/react"
import { CalendarDays } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york-v4/ui/hover-card"
import { Button } from "@/registry/new-york-v4/ui/button"

const meta: Meta<typeof HoverCard> = {
  title: "UI/HoverCard",
  component: HoverCard,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="bg-muted flex size-10 items-center justify-center rounded-full text-sm font-bold">
            N
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="text-muted-foreground mr-2 size-4" />
              <span className="text-muted-foreground text-xs">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const TextTrigger: Story = {
  name: "Text Link Trigger",
  render: () => (
    <div className="text-sm">
      Learn more about{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href="#"
            className="font-medium underline underline-offset-4"
          >
            Radix Primitives
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Radix Primitives</h4>
            <p className="text-sm">
              An open-source UI component library for building high-quality,
              accessible design systems and web apps.
            </p>
            <p className="text-muted-foreground text-xs">
              radix-ui.com/primitives
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      to get started.
    </div>
  ),
}

export const CustomAlignment: Story = {
  name: "Custom Alignment",
  render: () => (
    <div className="flex gap-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline" size="sm">
            Align Start
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-64">
          <p className="text-sm">
            This hover card is aligned to the start of the trigger.
          </p>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline" size="sm">
            Align End
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="w-64">
          <p className="text-sm">
            This hover card is aligned to the end of the trigger.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}
