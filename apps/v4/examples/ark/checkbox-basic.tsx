import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
} from "@/examples/ark/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/examples/ark/ui/field"

export function CheckboxBasic() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic">
          <CheckboxControl>
            <CheckboxIndicator />
          </CheckboxControl>
          <CheckboxHiddenInput />
        </Checkbox>
        <FieldLabel htmlFor="terms-checkbox-basic">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  )
}
