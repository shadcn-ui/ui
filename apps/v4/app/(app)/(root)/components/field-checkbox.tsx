import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { Field, FieldLabel } from "@/registry/new-york-v4/ui/field"

export function FieldCheckbox() {
  return (
    <FieldLabel htmlFor="checkbox-demo">
      <Field orientation="horizontal">
        <Checkbox id="checkbox-demo" defaultChecked />
        <FieldLabel htmlFor="checkbox-demo" className="line-clamp-1">
          I agree to the terms and conditions
        </FieldLabel>
      </Field>
    </FieldLabel>
  )
}
