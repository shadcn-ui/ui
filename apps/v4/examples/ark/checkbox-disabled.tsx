import { Checkbox } from "@/examples/ark/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/examples/ark/ui/field"

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
