import { Field } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import { Label } from "@/examples/base/ui/label"

export function LabelDisabled() {
  return (
    <Field data-disabled={true}>
      <Label htmlFor="label-demo-disabled">Disabled</Label>
      <Input id="label-demo-disabled" placeholder="Disabled" disabled />
    </Field>
  )
}
