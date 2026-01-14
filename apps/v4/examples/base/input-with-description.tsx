import { Field, FieldDescription, FieldLabel } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"

export function InputWithDescription() {
  return (
    <Field>
      <FieldLabel htmlFor="input-demo-username">Username</FieldLabel>
      <Input
        id="input-demo-username"
        type="text"
        placeholder="Enter your username"
      />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  )
}
