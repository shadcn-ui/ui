import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/radix/ui/field"
import { Textarea } from "@/examples/radix/ui/textarea"

export function TextareaFields() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="textarea-basic">Basic Textarea</FieldLabel>
        <Textarea id="textarea-basic" placeholder="Enter your message" />
      </Field>
      <Field>
        <FieldLabel htmlFor="textarea-comments">Comments</FieldLabel>
        <Textarea
          id="textarea-comments"
          placeholder="Share your thoughts..."
          className="min-h-[100px]"
        />
        <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="textarea-bio">Bio</FieldLabel>
        <FieldDescription>
          Tell us about yourself in a few sentences.
        </FieldDescription>
        <Textarea
          id="textarea-bio"
          placeholder="I am a..."
          className="min-h-[120px]"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="textarea-desc-after">Message</FieldLabel>
        <Textarea id="textarea-desc-after" placeholder="Enter your message" />
        <FieldDescription>
          Enter your message so it is long enough to test the layout.
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="textarea-invalid">Invalid Textarea</FieldLabel>
        <Textarea
          id="textarea-invalid"
          placeholder="This field has an error"
          aria-invalid
        />
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="textarea-disabled-field">
          Disabled Field
        </FieldLabel>
        <Textarea
          id="textarea-disabled-field"
          placeholder="Cannot edit"
          disabled
        />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
