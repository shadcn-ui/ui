import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/styles/aria-nova/ui/field"
import { Textarea } from "@/styles/aria-nova/ui/textarea"

export function TextareaInvalid() {
  return (
    <Field data-invalid>
      <FieldLabel htmlFor="textarea-invalid">Message</FieldLabel>
      <Textarea
        id="textarea-invalid"
        placeholder="Type your message here."
        aria-invalid
      />
      <FieldDescription>Please enter a valid message.</FieldDescription>
    </Field>
  )
}
