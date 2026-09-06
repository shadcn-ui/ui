import { CheckIcon } from "lucide-react"

import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from "@/styles/radix-rhea/ui/bubble"
import { Button } from "@/styles/radix-rhea/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/radix-rhea/ui/tooltip"

export function BubbleTooltipDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-12">
      <Bubble variant="secondary">
        <BubbleContent>Did you remove the stale route?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes, removed it from the registry.</BubbleContent>
        <BubbleReactions className="p-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <CheckIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Read on Jan 5, 2026 at 4:32 PM</TooltipContent>
          </Tooltip>
        </BubbleReactions>
      </Bubble>
    </div>
  )
}
