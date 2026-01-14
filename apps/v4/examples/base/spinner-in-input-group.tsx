import { Field, FieldLabel } from "@/examples/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import { Spinner } from "@/examples/base/ui/spinner"

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
