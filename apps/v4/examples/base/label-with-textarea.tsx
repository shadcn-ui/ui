import { Field } from "@/examples/base/ui/field"
import { Label } from "@/examples/base/ui/label"
import { Textarea } from "@/examples/base/ui/textarea"

export function LabelWithTextarea() {
  return (
    <Field>
      <Label htmlFor="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Message" />
    </Field>
  )
}
