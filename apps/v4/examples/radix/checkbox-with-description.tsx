import { Checkbox } from "@/examples/radix/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/examples/radix/ui/field"

export function CheckboxWithDescription() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="terms-2" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
        <FieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </FieldDescription>
      </FieldContent>
    </Field>
  )
}
