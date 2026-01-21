import { Button } from "@/examples/base/ui/button"
import { Kbd } from "@/examples/base/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"
import { SaveIcon } from "lucide-react"

export function TooltipKeyboard() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>
        <SaveIcon />
      </TooltipTrigger>
      <TooltipContent className="pr-1.5">
        <div className="flex items-center gap-2">
          Save Changes <Kbd>S</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
