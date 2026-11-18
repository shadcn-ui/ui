import { Field, FieldLabel } from "@/styles/aria-nova/ui/field"
import { Switch } from "@/styles/aria-nova/ui/switch"

export default function FieldSwitch() {
  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
      <Switch id="2fa" />
    </Field>
  )
}
