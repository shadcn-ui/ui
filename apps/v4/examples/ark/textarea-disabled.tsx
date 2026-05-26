import { Field, FieldLabel } from "@/examples/ark/ui/field"
import { Textarea } from "@/examples/ark/ui/textarea"

export function TextareaDisabled() {
  return (
    <Field disabled>
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Type your message here." />
    </Field>
  )
}
