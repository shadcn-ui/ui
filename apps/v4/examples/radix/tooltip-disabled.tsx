import { Button } from "@/styles/radix-nova/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/radix-nova/ui/tooltip"

export function TooltipDisabled() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block w-fit">
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This feature is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  )
}
