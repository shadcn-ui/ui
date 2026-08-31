import { Checkbox } from "@/styles/ark-nova/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/styles/ark-nova/ui/field"

export function CheckboxDisabled() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" disabled>
        <Checkbox id="toggle-checkbox-disabled" name="toggle-checkbox-disabled">
          Enable notifications
        </Checkbox>
      </Field>
    </FieldGroup>
  )
}
