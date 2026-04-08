import { SaveIcon } from "lucide-react"

import { Button } from "@/styles/react-aria-nova/ui/button"
import { Kbd } from "@/styles/react-aria-nova/ui/kbd"
import { Tooltip, TooltipTrigger } from "@/styles/react-aria-nova/ui/tooltip"

export function TooltipKeyboard() {
  return (
    <TooltipTrigger>
      <Button variant="outline" size="icon-sm">
        <SaveIcon />
      </Button>
      <Tooltip>
        Save Changes <Kbd>S</Kbd>
      </Tooltip>
    </TooltipTrigger>
  )
}
