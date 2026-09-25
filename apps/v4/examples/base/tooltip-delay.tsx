import { Button } from "@/styles/base-nova/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/styles/base-nova/ui/tooltip"

export function TooltipDelay() {
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip has a 200ms delay.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
