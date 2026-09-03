import { Field, FieldDescription, FieldLabel } from "@/styles/ark-nova/ui/field"
import { Input } from "@/styles/ark-nova/ui/input"

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
