import { Field, FieldLabel } from "@/examples/base/ui/field"
import { Textarea } from "@/examples/base/ui/textarea"

export function TextareaWithLabel() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-demo-message">Message</FieldLabel>
      <Textarea
        id="textarea-demo-message"
        placeholder="Type your message here."
        rows={6}
      />
    </Field>
  )
}
