import { Checkbox } from "@/examples/radix/ui/checkbox"
import { Field, FieldLabel } from "@/examples/radix/ui/field"

export function CheckboxBasic() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
    </Field>
  )
}
