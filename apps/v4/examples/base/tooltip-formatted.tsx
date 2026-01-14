import { Button } from "@/examples/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"

export function TooltipFormatted() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Status
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Active</p>
            <p className="text-xs opacity-80">Last updated 2 hours ago</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
