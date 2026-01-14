import { Button } from "@/examples/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"
import { InfoIcon } from "lucide-react"

export function TooltipWithIcon() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
          <InfoIcon />
          <span className="sr-only">Info</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Additional information</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
