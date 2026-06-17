import { Field, FieldLabel } from "@/styles/base-force-ui/ui/field"
import { Switch } from "@/styles/base-force-ui/ui/switch"

export default function FieldSwitch() {
  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
      <Switch id="2fa" />
    </Field>
  )
}
