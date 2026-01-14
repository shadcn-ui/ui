import { Field } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import { Label } from "@/examples/base/ui/label"

export function LabelWithInput() {
  return (
    <Field>
      <Label htmlFor="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="Username" />
    </Field>
  )
}
