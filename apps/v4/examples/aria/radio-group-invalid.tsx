import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/styles/aria-nova/ui/field"
import { RadioGroup, RadioGroupItem } from "@/styles/aria-nova/ui/radio-group"

export function RadioGroupInvalid() {
  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label">Notification Preferences</FieldLegend>
      <FieldDescription>
        Choose how you want to receive notifications.
      </FieldDescription>
      <RadioGroup
        aria-label="Notification Preferences"
        defaultValue="email"
        isInvalid
      >
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="email" id="invalid-email" />
          <FieldLabel htmlFor="invalid-email" className="font-normal">
            Email only
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="sms" id="invalid-sms" />
          <FieldLabel htmlFor="invalid-sms" className="font-normal">
            SMS only
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="both" id="invalid-both" />
          <FieldLabel htmlFor="invalid-both" className="font-normal">
            Both Email & SMS
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  )
}
