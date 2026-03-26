import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/examples/base/ui/field"
import { RadioGroup, RadioGroupItem } from "@/examples/base/ui/radio-group"

export function RadioFields() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label">Subscription Plan</FieldLegend>
        <RadioGroup defaultValue="free">
          <Field orientation="horizontal">
            <RadioGroupItem value="free" id="radio-free" />
            <FieldLabel htmlFor="radio-free" className="font-normal">
              Free Plan
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="pro" id="radio-pro" />
            <FieldLabel htmlFor="radio-pro" className="font-normal">
              Pro Plan
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="enterprise" id="radio-enterprise" />
            <FieldLabel htmlFor="radio-enterprise" className="font-normal">
              Enterprise
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Battery Level</FieldLegend>
        <FieldDescription>
          Choose your preferred battery level.
        </FieldDescription>
        <RadioGroup>
          <Field orientation="horizontal">
            <RadioGroupItem value="high" id="battery-high" />
            <FieldLabel htmlFor="battery-high">High</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="medium" id="battery-medium" />
            <FieldLabel htmlFor="battery-medium">Medium</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="low" id="battery-low" />
            <FieldLabel htmlFor="battery-low">Low</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <RadioGroup className="gap-6">
        <Field orientation="horizontal">
          <RadioGroupItem value="option1" id="radio-content-1" />
          <FieldContent>
            <FieldLabel htmlFor="radio-content-1">Enable Touch ID</FieldLabel>
            <FieldDescription>
              Enable Touch ID to quickly unlock your device.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option2" id="radio-content-2" />
          <FieldContent>
            <FieldLabel htmlFor="radio-content-2">
              Enable Touch ID and Face ID to make it even faster to unlock your
              device. This is a long label to test the layout.
            </FieldLabel>
            <FieldDescription>
              Enable Touch ID to quickly unlock your device.
            </FieldDescription>
          </FieldContent>
        </Field>
      </RadioGroup>
      <RadioGroup className="gap-3">
        <FieldLabel htmlFor="radio-title-1">
          <Field orientation="horizontal">
            <RadioGroupItem value="title1" id="radio-title-1" />
            <FieldContent>
              <FieldTitle>Enable Touch ID</FieldTitle>
              <FieldDescription>
                Enable Touch ID to quickly unlock your device.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="radio-title-2">
          <Field orientation="horizontal">
            <RadioGroupItem value="title2" id="radio-title-2" />
            <FieldContent>
              <FieldTitle>
                Enable Touch ID and Face ID to make it even faster to unlock
                your device. This is a long label to test the layout.
              </FieldTitle>
              <FieldDescription>
                Enable Touch ID to quickly unlock your device.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </RadioGroup>
      <FieldSet>
        <FieldLegend variant="label">Invalid Radio Group</FieldLegend>
        <RadioGroup>
          <Field data-invalid orientation="horizontal">
            <RadioGroupItem
              value="invalid1"
              id="radio-invalid-1"
              aria-invalid
            />
            <FieldLabel htmlFor="radio-invalid-1">Invalid Option 1</FieldLabel>
          </Field>
          <Field data-invalid orientation="horizontal">
            <RadioGroupItem
              value="invalid2"
              id="radio-invalid-2"
              aria-invalid
            />
            <FieldLabel htmlFor="radio-invalid-2">Invalid Option 2</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Disabled Radio Group</FieldLegend>
        <RadioGroup disabled>
          <Field data-disabled orientation="horizontal">
            <RadioGroupItem value="disabled1" id="radio-disabled-1" disabled />
            <FieldLabel htmlFor="radio-disabled-1">
              Disabled Option 1
            </FieldLabel>
          </Field>
          <Field data-disabled orientation="horizontal">
            <RadioGroupItem value="disabled2" id="radio-disabled-2" disabled />
            <FieldLabel htmlFor="radio-disabled-2">
              Disabled Option 2
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </FieldGroup>
  )
}
