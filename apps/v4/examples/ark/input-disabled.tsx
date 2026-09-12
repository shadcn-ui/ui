import { Field, FieldDescription, FieldLabel } from "@/styles/ark-nova/ui/field"
import { Input } from "@/styles/ark-nova/ui/input"

export function InputDisabled() {
  return (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="Email" />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}
