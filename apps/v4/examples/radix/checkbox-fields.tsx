import { Checkbox } from "@/examples/radix/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/examples/radix/ui/field"
import { Select } from "@/examples/radix/ui/select"

export function CheckboxFields() {
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-basic" defaultChecked />
        <FieldLabel htmlFor="checkbox-basic" className="font-normal">
          I agree to the terms and conditions
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="checkbox-right">
          Accept terms and conditions
        </FieldLabel>
        <Checkbox id="checkbox-right" />
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-with-desc" />
        <FieldContent>
          <FieldLabel htmlFor="checkbox-with-desc">
            Subscribe to newsletter
          </FieldLabel>
          <FieldDescription>
            Receive weekly updates about new features and promotions.
          </FieldDescription>
        </FieldContent>
      </Field>
      <FieldLabel htmlFor="checkbox-with-title">
        <Field orientation="horizontal">
          <Checkbox id="checkbox-with-title" />
          <FieldContent>
            <FieldTitle>Enable Touch ID</FieldTitle>
            <FieldDescription>
              Enable Touch ID to quickly unlock your device.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldSet>
        <FieldLegend variant="label">Preferences</FieldLegend>
        <FieldDescription>
          Select all that apply to customize your experience.
        </FieldDescription>
        <FieldGroup className="gap-3">
          <Field orientation="horizontal">
            <Checkbox id="pref-dark" />
            <FieldLabel htmlFor="pref-dark" className="font-normal">
              Dark mode
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="pref-compact" />
            <FieldLabel htmlFor="pref-compact" className="font-normal">
              Compact view
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="pref-notifications" />
            <FieldLabel htmlFor="pref-notifications" className="font-normal">
              Enable notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Field data-invalid orientation="horizontal">
        <Checkbox id="checkbox-invalid" aria-invalid />
        <FieldLabel htmlFor="checkbox-invalid" className="font-normal">
          Invalid checkbox
        </FieldLabel>
      </Field>
      <Field data-disabled orientation="horizontal">
        <Checkbox id="checkbox-disabled-field" disabled />
        <FieldLabel htmlFor="checkbox-disabled-field" className="font-normal">
          Disabled checkbox
        </FieldLabel>
      </Field>
    </FieldGroup>
  )
}
