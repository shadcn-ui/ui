import { Button } from "@/examples/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
