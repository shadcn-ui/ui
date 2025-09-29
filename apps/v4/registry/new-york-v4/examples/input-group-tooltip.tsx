import { HelpCircle, InfoIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export default function InputGroupTooltip() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter password" type="password" />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton
                variant="ghost"
                aria-label="Info"
                size="icon-xs"
              >
                <InfoIcon />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Password must be at least 8 characters</p>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Your email address" />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton
                variant="ghost"
                aria-label="Help"
                size="icon-xs"
              >
                <HelpCircle />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>We&apos;ll use this to send you notifications</p>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter API key" />
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupAddon>
              <InputGroupButton
                variant="ghost"
                aria-label="Help"
                size="icon-xs"
              >
                <HelpCircle />
              </InputGroupButton>
            </InputGroupAddon>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Click for help with API keys</p>
          </TooltipContent>
        </Tooltip>
      </InputGroup>
    </div>
  )
}
