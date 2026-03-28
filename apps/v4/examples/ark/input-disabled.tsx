import { Field, FieldDescription, FieldLabel } from "@/examples/ark/ui/field"
import { Input } from "@/examples/ark/ui/input"

export function InputDisabled() {
  return (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="Email" />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}
