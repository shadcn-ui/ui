import { Button } from "@/examples/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"

export function TooltipLongContent() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Show Tooltip
        </TooltipTrigger>
        <TooltipContent>
          To learn more about how this works, check out the docs. If you have
          any questions, please reach out to us.
        </TooltipContent>
      </Tooltip>
    </>
  )
}
