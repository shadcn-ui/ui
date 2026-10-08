import { Checkbox } from "@/styles/aria-nova/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/styles/aria-nova/ui/field"

export function CheckboxInvalid() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox
          id="terms-checkbox-invalid"
          name="terms-checkbox-invalid"
          isInvalid
        />
        <FieldLabel htmlFor="terms-checkbox-invalid">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  )
}
