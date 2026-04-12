import { AudioLinesIcon, PlusIcon } from "lucide-react"

import { Button } from "@/styles/radix-nova/ui/button"
import { ButtonGroup } from "@/styles/radix-nova/ui/button-group"
import { Input } from "@/styles/radix-nova/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/radix-nova/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/radix-nova/ui/tooltip"

export function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Send a message..." />
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupAddon align="inline-end">
                <AudioLinesIcon />
              </InputGroupAddon>
            </TooltipTrigger>
            <TooltipContent>Voice Mode</TooltipContent>
          </Tooltip>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
