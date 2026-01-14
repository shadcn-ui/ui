import { Field, FieldLabel } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"

export function InputDisabled() {
  return (
    <Field>
      <FieldLabel htmlFor="input-demo-disabled">Email</FieldLabel>
      <Input
        id="input-demo-disabled"
        type="email"
        placeholder="Email"
        disabled
      />
    </Field>
  )
}
