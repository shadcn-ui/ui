import { Field } from "@/examples/radix/ui/field"
import { Label } from "@/examples/radix/ui/label"
import { Textarea } from "@/examples/radix/ui/textarea"

export function LabelWithTextarea() {
  return (
    <Field>
      <Label htmlFor="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Message" />
    </Field>
  )
}
