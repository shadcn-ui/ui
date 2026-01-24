import { Field, FieldLabel } from "@/examples/radix/ui/field"
import { Switch } from "@/examples/radix/ui/switch"

export default function FieldSwitch() {
  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
      <Switch id="2fa" />
    </Field>
  )
}
