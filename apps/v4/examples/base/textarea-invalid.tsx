import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/styles/base-force-ui/ui/field"
import { Textarea } from "@/styles/base-force-ui/ui/textarea"

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
