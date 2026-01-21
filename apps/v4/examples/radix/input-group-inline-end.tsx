import { Field, FieldDescription, FieldLabel } from "@/examples/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/radix/ui/input-group"
import { EyeOffIcon } from "lucide-react"

export function InputGroupInlineEnd() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-end-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="inline-end-input"
          type="password"
          placeholder="Enter password"
        />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  )
}
