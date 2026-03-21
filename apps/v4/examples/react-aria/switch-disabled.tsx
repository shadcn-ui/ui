import { Field, FieldLabel } from "@/examples/react-aria/ui/field"
import { Switch } from "@/examples/react-aria/ui/switch"

export function SwitchDisabled() {
  return (
    <Field orientation="horizontal" data-disabled className="w-fit">
      <Switch id="switch-disabled-unchecked" isDisabled />
      <FieldLabel htmlFor="switch-disabled-unchecked">Disabled</FieldLabel>
    </Field>
  );
}
