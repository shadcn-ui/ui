import { Field, FieldLabel } from "@/examples/radix/ui/field"
import { Textarea } from "@/examples/radix/ui/textarea"

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
