import { Button } from "@/examples/react-aria/ui/button"
import { ButtonGroup } from "@/examples/react-aria/ui/button-group"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/examples/react-aria/ui/field"
import { Popover, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/examples/react-aria/ui/popover";
import { Textarea } from "@/examples/react-aria/ui/textarea"
import { BotIcon, ChevronDownIcon } from "lucide-react"

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
        <Popover align="end" className="rounded-xl text-sm">
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
  );
}
