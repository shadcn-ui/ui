import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/examples/base/ui/field"
import { Textarea } from "@/examples/base/ui/textarea"

export default function FieldTextarea() {
  return (
    <FieldSet className="w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
          <Textarea
            id="feedback"
            placeholder="Your feedback helps us improve..."
            rows={4}
          />
          <FieldDescription>
            Share your thoughts about our service.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
