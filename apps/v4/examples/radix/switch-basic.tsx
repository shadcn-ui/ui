import { Field, FieldLabel } from "@/examples/radix/ui/field"
import { Switch } from "@/examples/radix/ui/switch"

export function SwitchBasic() {
  return (
    <Field orientation="horizontal">
      <Switch id="switch-basic" />
      <FieldLabel htmlFor="switch-basic">Airplane Mode</FieldLabel>
    </Field>
  )
}
