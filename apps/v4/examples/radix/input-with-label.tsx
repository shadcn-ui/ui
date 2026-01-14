import { Field, FieldLabel } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"

export function InputWithLabel() {
  return (
    <Field>
      <FieldLabel htmlFor="input-demo-email">Email</FieldLabel>
      <Input
        id="input-demo-email"
        type="email"
        placeholder="name@example.com"
      />
    </Field>
  )
}
