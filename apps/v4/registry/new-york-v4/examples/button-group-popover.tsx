import { BotIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <BotIcon /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open Popover">
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="rounded-xl p-0 text-sm">
          <div className="px-4 py-3">
            <div className="text-sm font-medium">Agent Tasks</div>
          </div>
          <Separator />
          <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">
            <Textarea
              placeholder="Describe your task in natural language."
              className="mb-4 resize-none"
            />
            <p className="font-medium">Start a new task with Copilot</p>
            <p className="text-muted-foreground">
              Describe your task in natural language. Copilot will work in the
              background and open a pull request for your review.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
