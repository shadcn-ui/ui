import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/bases/base/ui/hover-card"

export default function HoverCardExample() {
  return (
    <ExampleWrapper>
      <HoverCardSides />
    </ExampleWrapper>
  )
}

const HOVER_CARD_SIDES = ["top", "right", "bottom", "left"] as const

function HoverCardSides() {
  return (
    <Example title="Sides" containerClassName="col-span-full">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {HOVER_CARD_SIDES.map((side) => (
          <HoverCard key={side}>
            <HoverCardTrigger
              delay={100}
              closeDelay={100}
              render={<Button variant="outline" className="capitalize" />}
            >
              {side}
            </HoverCardTrigger>
            <HoverCardContent side={side}>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold">Hover Card</h4>
                <p className="text-sm">
                  This hover card appears on the {side} side of the trigger.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </Example>
  )
}
