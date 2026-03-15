import { Field, FieldDescription, FieldLabel } from "@/examples/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import { SearchIcon } from "lucide-react"

export function InputGroupInlineStart() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-start-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput id="inline-start-input" placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the start.</FieldDescription>
    </Field>
  )
}
