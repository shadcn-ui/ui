import { Button } from "@/examples/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"

export function TooltipLongContent() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" className="w-fit">
          Show Tooltip
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        To learn more about how this works, check out the docs. If you have any
        questions, please reach out to us.
      </TooltipContent>
    </Tooltip>
  )
}
