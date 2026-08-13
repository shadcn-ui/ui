import { BotIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/styles/aria-nova/ui/button"
import { ButtonGroup } from "@/styles/aria-nova/ui/button-group"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/styles/aria-nova/ui/field"
import {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/styles/aria-nova/ui/popover"
import { Textarea } from "@/styles/aria-nova/ui/textarea"

export default function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <BotIcon /> Copilot
      </Button>
      <PopoverTrigger>
        <Button variant="outline" size="icon" aria-label="Open Popover">
          <ChevronDownIcon />
        </Button>
        <Popover placement="bottom end" className="rounded-xl text-sm">
          <PopoverHeader>
            <PopoverTitle>Start a new task with Copilot</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="task" className="sr-only">
              Task Description
            </FieldLabel>
            <Textarea
              id="task"
              placeholder="I need to..."
              className="resize-none"
            />
            <FieldDescription>
              Copilot will open a pull request for review.
            </FieldDescription>
          </Field>
        </Popover>
      </PopoverTrigger>
    </ButtonGroup>
  )
}
