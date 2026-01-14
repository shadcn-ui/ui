import { Checkbox } from "@/examples/base/ui/checkbox"
import { Field } from "@/examples/base/ui/field"
import { Label } from "@/examples/base/ui/label"

export function LabelWithCheckbox() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="label-demo-terms" />
      <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
    </Field>
  )
}
