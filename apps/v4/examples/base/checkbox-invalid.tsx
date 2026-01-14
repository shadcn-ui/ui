import { Checkbox } from "@/examples/base/ui/checkbox"
import { Field, FieldLabel } from "@/examples/base/ui/field"

export function CheckboxInvalid() {
  return (
    <Field orientation="horizontal" data-invalid>
      <Checkbox id="terms-3" aria-invalid />
      <FieldLabel htmlFor="terms-3">Accept terms and conditions</FieldLabel>
    </Field>
  )
}
