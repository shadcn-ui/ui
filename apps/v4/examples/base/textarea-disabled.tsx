import { Field, FieldLabel } from "@/examples/base/ui/field"
import { Textarea } from "@/examples/base/ui/textarea"

export function TextareaDisabled() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-demo-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-demo-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  )
}
