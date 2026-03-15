import { Field, FieldDescription, FieldLabel } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"

export function InputRequired() {
  return (
    <Field>
      <FieldLabel htmlFor="input-required">
        Required Field <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        id="input-required"
        placeholder="This field is required"
        required
      />
      <FieldDescription>This field must be filled out.</FieldDescription>
    </Field>
  )
}
