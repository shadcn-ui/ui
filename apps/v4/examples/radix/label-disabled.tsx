import { Field } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"
import { Label } from "@/examples/radix/ui/label"

export function LabelDisabled() {
  return (
    <Field data-disabled={true}>
      <Label htmlFor="label-demo-disabled">Disabled</Label>
      <Input id="label-demo-disabled" placeholder="Disabled" disabled />
    </Field>
  )
}
