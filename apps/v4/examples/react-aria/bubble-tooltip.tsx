import { CheckIcon } from "lucide-react"

import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from "@/styles/react-aria-nova/ui/bubble"
import { Button } from "@/styles/react-aria-nova/ui/button"
import { Tooltip, TooltipTrigger } from "@/styles/react-aria-nova/ui/tooltip"

export function BubbleTooltipDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-12">
      <Bubble variant="secondary">
        <BubbleContent>Did you remove the stale route?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes, removed it from the registry.</BubbleContent>
        <BubbleReactions>
          <TooltipTrigger>
            <Button variant="ghost" size="icon-xs">
              <CheckIcon />
            </Button>
            <Tooltip>Read on Jan 5, 2026 at 4:32 PM</Tooltip>
          </TooltipTrigger>
        </BubbleReactions>
      </Bubble>
    </div>
  )
}
