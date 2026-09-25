import { Button } from "@/styles/radix-nova/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/styles/radix-nova/ui/tooltip"

export function TooltipDelay() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip has a 200ms delay.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
