import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/styles/radix-force-ui/ui/field"
import { Input } from "@/styles/radix-force-ui/ui/input"

export function InputDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="input-demo-disabled">Email</FieldLabel>
      <Input
        id="input-demo-disabled"
        type="email"
        placeholder="Email"
        disabled
      />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}
