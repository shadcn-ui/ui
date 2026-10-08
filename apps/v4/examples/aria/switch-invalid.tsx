import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/styles/aria-nova/ui/field"
import { Switch } from "@/styles/aria-nova/ui/switch"

export function SwitchInvalid() {
  return (
    <Field orientation="horizontal" className="max-w-sm" data-invalid>
      <FieldContent>
        <FieldLabel htmlFor="switch-terms">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          You must accept the terms and conditions to continue.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-terms" data-invalid />
    </Field>
  )
}
