import { HelpCircle, InfoIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/styles/aria-nova/ui/input-group"
import { Tooltip, TooltipTrigger } from "@/styles/aria-nova/ui/tooltip"

export default function InputGroupTooltip() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter password" type="password" />
        <InputGroupAddon align="inline-end">
          <TooltipTrigger>
            <InputGroupButton variant="ghost" aria-label="Info" size="icon-xs">
              <InfoIcon />
            </InputGroupButton>
            <Tooltip>
              <p>Password must be at least 8 characters</p>
            </Tooltip>
          </TooltipTrigger>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Your email address" />
        <InputGroupAddon align="inline-end">
          <TooltipTrigger>
            <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
              <HelpCircle />
            </InputGroupButton>
            <Tooltip>
              <p>We&apos;ll use this to send you notifications</p>
            </Tooltip>
          </TooltipTrigger>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter API key" />
        <TooltipTrigger>
          <InputGroupAddon>
            <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
              <HelpCircle />
            </InputGroupButton>
          </InputGroupAddon>
          <Tooltip placement="left">
            <p>Click for help with API keys</p>
          </Tooltip>
        </TooltipTrigger>
      </InputGroup>
    </div>
  )
}
