import { Field, FieldDescription, FieldLabel } from "@/examples/ark/ui/field"
import { Input } from "@/examples/ark/ui/input"

export function InputInvalid() {
  return (
    <Field invalid>
      <FieldLabel>Invalid Input</FieldLabel>
      <Input placeholder="Error" />
      <FieldDescription>
        This field contains validation errors.
      </FieldDescription>
    </Field>
  )
}
