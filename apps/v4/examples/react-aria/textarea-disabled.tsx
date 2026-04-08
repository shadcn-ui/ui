import { Field, FieldLabel } from "@/styles/react-aria-nova/ui/field"
import { Textarea } from "@/styles/react-aria-nova/ui/textarea"

export function TextareaDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  )
}
