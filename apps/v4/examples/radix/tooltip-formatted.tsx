import { Button } from "@/examples/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"

export function TooltipFormatted() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" className="w-fit">
          Status
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Active</p>
          <p className="text-xs opacity-80">Last updated 2 hours ago</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
