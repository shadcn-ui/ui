import { Field, FieldLabel } from "@/examples/base/ui/field"
import { Switch } from "@/examples/base/ui/switch"

export function SwitchBasic() {
  return (
    <Field orientation="horizontal">
      <Switch id="switch-basic" />
      <FieldLabel htmlFor="switch-basic">Airplane Mode</FieldLabel>
    </Field>
  )
}
