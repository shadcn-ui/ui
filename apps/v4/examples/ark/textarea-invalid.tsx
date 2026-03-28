import { Field, FieldDescription, FieldLabel } from "@/examples/ark/ui/field"
import { Textarea } from "@/examples/ark/ui/textarea"

export function TextareaInvalid() {
  return (
    <Field invalid>
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Type your message here." />
      <FieldDescription>Please enter a valid message.</FieldDescription>
    </Field>
  )
}
