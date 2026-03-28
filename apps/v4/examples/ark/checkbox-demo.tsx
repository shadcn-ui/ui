"use client"

import { Checkbox } from "@/examples/ark/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/examples/ark/ui/field"

export default function CheckboxDemo() {
  return (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox" name="terms-checkbox">
          Accept terms and conditions
        </Checkbox>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-2" name="terms-checkbox-2" defaultChecked>
          <FieldContent>
            <FieldTitle>Accept terms and conditions</FieldTitle>
            <FieldDescription>
              By clicking this checkbox, you agree to the terms.
            </FieldDescription>
          </FieldContent>
        </Checkbox>
      </Field>
      <Field orientation="horizontal" disabled>
        <Checkbox id="toggle-checkbox" name="toggle-checkbox">
          Enable notifications
        </Checkbox>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2">
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                You can enable or disable notifications at any time.
              </FieldDescription>
            </FieldContent>
          </Checkbox>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}
