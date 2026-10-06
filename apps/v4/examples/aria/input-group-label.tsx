import { InfoIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/styles/aria-nova/ui/input-group"
import { Label } from "@/styles/aria-nova/ui/label"
import { Tooltip, TooltipTrigger } from "@/styles/aria-nova/ui/tooltip"

export default function InputGroupLabel() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput id="email" placeholder="username" />
        <InputGroupAddon>
          <Label htmlFor="email">@</Label>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput id="email-2" placeholder="user@example.com" />
        <InputGroupAddon align="block-start">
          <Label htmlFor="email-2" className="text-foreground">
            Email
          </Label>
          <TooltipTrigger>
            <InputGroupButton
              variant="ghost"
              aria-label="Help"
              className="ml-auto rounded-full"
              size="icon-xs"
            >
              <InfoIcon />
            </InputGroupButton>
            <Tooltip>
              <p>We&apos;ll use this to send you notifications</p>
            </Tooltip>
          </TooltipTrigger>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
