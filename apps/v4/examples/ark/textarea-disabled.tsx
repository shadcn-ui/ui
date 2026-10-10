import { Field, FieldLabel } from "@/styles/ark-nova/ui/field"
import { Textarea } from "@/styles/ark-nova/ui/textarea"

export function TextareaDisabled() {
  return (
    <Field disabled>
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Type your message here." />
    </Field>
  )
}
