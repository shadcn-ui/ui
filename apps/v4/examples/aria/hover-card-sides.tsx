"use client"

import { Button } from "@/styles/aria-nova/ui/button"
import { HoverCard, HoverCardTrigger } from "@/styles/aria-nova/ui/hover-card"

const HOVER_CARD_PLACEMENTS = ["left", "top", "bottom", "right"] as const

export function HoverCardSides() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {HOVER_CARD_PLACEMENTS.map((placement) => (
        <HoverCardTrigger key={placement} delay={100} closeDelay={100}>
          <Button variant="outline" className="capitalize">
            {placement}
          </Button>
          <HoverCard placement={placement}>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Hover Card</h4>
              <p>
                This hover card appears on the {placement} side of the trigger.
              </p>
            </div>
          </HoverCard>
        </HoverCardTrigger>
      ))}
    </div>
  )
}
