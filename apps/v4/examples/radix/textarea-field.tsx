import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/styles/radix-nova/ui/field"
import { Textarea } from "@/styles/radix-nova/ui/textarea"

export function TextareaField() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>
      <Textarea id="textarea-message" placeholder="Type your message here." />
    </Field>
  )
}
