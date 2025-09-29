import { InfoIcon } from "lucide-react"

import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/registry/new-york-v4/ui/input-group"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export default function InputGroupLabel() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <Input id="email" placeholder="shadcn" />
        <InputGroupAddon>
          <Label htmlFor="email">@</Label>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <Input id="email-2" placeholder="shadcn@vercel.com" />
        <InputGroupAddon align="block-start">
          <Label htmlFor="email-2">Email</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton
                variant="ghost"
                aria-label="Help"
                className="ml-auto rounded-full"
                size="icon-xs"
              >
                <InfoIcon />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>We&apos;ll use this to send you notifications</p>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
