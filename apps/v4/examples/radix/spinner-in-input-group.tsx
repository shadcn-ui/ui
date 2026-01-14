import { Field, FieldLabel } from "@/examples/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/radix/ui/input-group"
import { Spinner } from "@/examples/radix/ui/spinner"

export function SpinnerInInputGroup() {
  return (
    <Field>
      <FieldLabel htmlFor="input-group-spinner">Input Group</FieldLabel>
      <InputGroup>
        <InputGroupInput id="input-group-spinner" />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
