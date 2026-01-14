import { Checkbox } from "@/examples/base/ui/checkbox"
import { Field, FieldLabel } from "@/examples/base/ui/field"

export function CheckboxDisabled() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="toggle" disabled />
      <FieldLabel htmlFor="toggle">Enable notifications</FieldLabel>
    </Field>
  )
}
