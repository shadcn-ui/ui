import { Badge } from "@/examples/base/ui/badge"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"

export function InputFields() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="input-basic">Basic Input</FieldLabel>
        <Input id="input-basic" placeholder="Enter text" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-with-desc">
          Input with Description
        </FieldLabel>
        <Input id="input-with-desc" placeholder="Enter your username" />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-desc-first">Email Address</FieldLabel>
        <FieldDescription>
          We&apos;ll never share your email with anyone.
        </FieldDescription>
        <Input
          id="input-desc-first"
          type="email"
          placeholder="email@example.com"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-required">
          Required Field <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="input-required"
          placeholder="This field is required"
          required
        />
        <FieldDescription>This field must be filled out.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-disabled">Disabled Input</FieldLabel>
        <Input id="input-disabled" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-badge">
          Input with Badge{" "}
          <Badge variant="secondary" className="ml-auto">
            Recommended
          </Badge>
        </FieldLabel>
        <Input id="input-badge" placeholder="Enter value" />
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
        <Input
          id="input-invalid"
          placeholder="This field has an error"
          aria-invalid
        />
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="input-disabled-field">Disabled Field</FieldLabel>
        <Input id="input-disabled-field" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
