import { AudioLinesIcon, PlusIcon } from "lucide-react"

import { Button } from "@/styles/react-aria-nova/ui/button"
import { ButtonGroup } from "@/styles/react-aria-nova/ui/button-group"
import { Input } from "@/styles/react-aria-nova/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/react-aria-nova/ui/input-group"
import { Tooltip, TooltipTrigger } from "@/styles/react-aria-nova/ui/tooltip"

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
          <TooltipTrigger>
            <InputGroupAddon align="inline-end">
              <AudioLinesIcon />
            </InputGroupAddon>
            <Tooltip>Voice Mode</Tooltip>
          </TooltipTrigger>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
