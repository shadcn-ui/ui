import { Checkbox } from "@/examples/radix/ui/checkbox"
import { Field } from "@/examples/radix/ui/field"
import { Label } from "@/examples/radix/ui/label"

export function LabelWithCheckbox() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="label-demo-terms" />
      <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
    </Field>
  )
}
