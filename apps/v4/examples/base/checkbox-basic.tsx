import { Checkbox } from "@/examples/base/ui/checkbox"
import { Field, FieldLabel } from "@/examples/base/ui/field"

export function CheckboxBasic() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
    </Field>
  )
}
