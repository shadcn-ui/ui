"use client"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/aria/ui/dialog"
import {
  HoverCard,
  HoverCardTrigger,
} from "@/registry/bases/aria/ui/hover-card"

export default function HoverCardExample() {
  return (
    <ExampleWrapper>
      <HoverCardSides />
      <HoverCardInDialog />
    </ExampleWrapper>
  )
}

const HOVER_CARD_PLACEMENTS = [
  "start",
  "left",
  "top",
  "bottom",
  "right",
  "end",
] as const

function HoverCardSides() {
  return (
    <Example title="Sides" containerClassName="col-span-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {HOVER_CARD_PLACEMENTS.map((placement) => (
          <HoverCardTrigger key={placement} delay={100} closeDelay={100}>
            <Button variant="outline" className="capitalize">
              {placement}
            </Button>
            <HoverCard placement={placement}>
              <div className="flex flex-col style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-luma:gap-2">
                <h4 className="font-medium">Hover Card</h4>
                <p>
                  This hover card appears on the {placement} side of the
                  trigger.
                </p>
              </div>
            </HoverCard>
          </HoverCardTrigger>
        ))}
      </div>
    </Example>
  )
}

function HoverCardInDialog() {
  return (
    <Example title="In Dialog">
      <DialogTrigger>
        <Button variant="outline">Open Dialog</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Hover Card Example</DialogTitle>
            <DialogDescription>
              Hover over the button below to see the hover card.
            </DialogDescription>
          </DialogHeader>
          <HoverCardTrigger delay={100} closeDelay={100}>
            <Button variant="outline" className="w-fit">
              Hover me
            </Button>
            <HoverCard>
              <div className="flex flex-col style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-luma:gap-2">
                <h4 className="font-medium">Hover Card</h4>
                <p>
                  This hover card appears inside a dialog. Hover over the button
                  to see it.
                </p>
              </div>
            </HoverCard>
          </HoverCardTrigger>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}
