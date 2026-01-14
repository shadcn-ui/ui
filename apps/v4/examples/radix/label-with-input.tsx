import { Field } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"
import { Label } from "@/examples/radix/ui/label"

export function LabelWithInput() {
  return (
    <Field>
      <Label htmlFor="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="Username" />
    </Field>
  )
}
