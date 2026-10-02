import { Checkbox } from "@/styles/ark-nova/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/styles/ark-nova/ui/field"

export function CheckboxBasic() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic">
          Accept terms and conditions
        </Checkbox>
      </Field>
    </FieldGroup>
  )
}
