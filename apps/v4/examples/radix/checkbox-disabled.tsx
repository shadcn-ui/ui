import { Checkbox } from "@/examples/radix/ui/checkbox"
import { Field, FieldLabel } from "@/examples/radix/ui/field"

export function CheckboxDisabled() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="toggle" disabled />
      <FieldLabel htmlFor="toggle">Enable notifications</FieldLabel>
    </Field>
  )
}
