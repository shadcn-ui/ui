import { Checkbox } from "@/examples/ark/ui/checkbox"
import { Field, FieldGroup } from "@/examples/ark/ui/field"

export function CheckboxInvalid() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" invalid>
        <Checkbox id="terms-checkbox-invalid" name="terms-checkbox-invalid">
          Accept terms and conditions
        </Checkbox>
      </Field>
    </FieldGroup>
  )
}
