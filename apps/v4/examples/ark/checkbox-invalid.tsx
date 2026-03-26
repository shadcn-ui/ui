import { Checkbox } from "@/examples/ark/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/examples/ark/ui/field"

export function CheckboxInvalid() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox
          id="terms-checkbox-invalid"
          name="terms-checkbox-invalid"
          aria-invalid
        >
          Accept terms and conditions
        </Checkbox>
      </Field>
    </FieldGroup>
  )
}
