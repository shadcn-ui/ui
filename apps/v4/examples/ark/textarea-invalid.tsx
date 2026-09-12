import { Field, FieldDescription, FieldLabel } from "@/styles/ark-nova/ui/field"
import { Textarea } from "@/styles/ark-nova/ui/textarea"

export function TextareaInvalid() {
  return (
    <Field invalid>
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Type your message here." />
      <FieldDescription>Please enter a valid message.</FieldDescription>
    </Field>
  )
}
