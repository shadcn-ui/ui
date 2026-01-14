import { Checkbox } from "@/examples/base/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/examples/base/ui/field"

export function CheckboxWithTitle() {
  return (
    <FieldGroup>
      <FieldLabel htmlFor="toggle-2">
        <Field orientation="horizontal">
          <Checkbox id="toggle-2" defaultChecked />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              You can enable or disable notifications at any time.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="toggle-4">
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="toggle-4" disabled />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              You can enable or disable notifications at any time.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}
