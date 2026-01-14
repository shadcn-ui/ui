import { Field, FieldDescription, FieldLabel } from "@/examples/radix/ui/field"
import { Textarea } from "@/examples/radix/ui/textarea"

export function TextareaWithDescription() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-demo-message-2">Message</FieldLabel>
      <Textarea
        id="textarea-demo-message-2"
        placeholder="Type your message here."
        rows={6}
      />
      <FieldDescription>
        Type your message and press enter to send.
      </FieldDescription>
    </Field>
  )
}
