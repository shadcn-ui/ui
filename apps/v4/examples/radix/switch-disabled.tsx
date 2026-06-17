import { Field, FieldLabel } from "@/styles/radix-force-ui/ui/field"
import { Switch } from "@/styles/radix-force-ui/ui/switch"

export function SwitchDisabled() {
  return (
    <Field orientation="horizontal" data-disabled className="w-fit">
      <Switch id="switch-disabled-unchecked" disabled />
      <FieldLabel htmlFor="switch-disabled-unchecked">Disabled</FieldLabel>
    </Field>
  )
}
