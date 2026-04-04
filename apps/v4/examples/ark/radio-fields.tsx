import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/examples/ark/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
} from "@/examples/ark/ui/radio-group"

export function RadioFields() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label">Subscription Plan</FieldLegend>
        <RadioGroup defaultValue="free">
          <Field orientation="horizontal">
            <RadioGroupItem value="free" id="radio-free">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="radio-free" className="font-normal">
              Free Plan
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="pro" id="radio-pro">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="radio-pro" className="font-normal">
              Pro Plan
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="enterprise" id="radio-enterprise">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
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
            <RadioGroupItem value="high" id="battery-high">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="battery-high">High</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="medium" id="battery-medium">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="battery-medium">Medium</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="low" id="battery-low">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="battery-low">Low</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <RadioGroup className="gap-6">
        <Field orientation="horizontal">
          <RadioGroupItem value="option1" id="radio-content-1">
            <RadioGroupItemControl />
            <RadioGroupItemHiddenInput />
          </RadioGroupItem>
          <FieldContent>
            <FieldLabel htmlFor="radio-content-1">Enable Touch ID</FieldLabel>
            <FieldDescription>
              Enable Touch ID to quickly unlock your device.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option2" id="radio-content-2">
            <RadioGroupItemControl />
            <RadioGroupItemHiddenInput />
          </RadioGroupItem>
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
            <RadioGroupItem value="title1" id="radio-title-1">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
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
            <RadioGroupItem value="title2" id="radio-title-2">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
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
          <Field invalid orientation="horizontal">
            <RadioGroupItem value="invalid1" id="radio-invalid-1">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="radio-invalid-1">Invalid Option 1</FieldLabel>
          </Field>
          <Field invalid orientation="horizontal">
            <RadioGroupItem value="invalid2" id="radio-invalid-2">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="radio-invalid-2">Invalid Option 2</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Disabled Radio Group</FieldLegend>
        <RadioGroup disabled>
          <Field disabled orientation="horizontal">
            <RadioGroupItem value="disabled1" id="radio-disabled-1">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="radio-disabled-1">
              Disabled Option 1
            </FieldLabel>
          </Field>
          <Field disabled orientation="horizontal">
            <RadioGroupItem value="disabled2" id="radio-disabled-2">
              <RadioGroupItemControl />
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
            <FieldLabel htmlFor="radio-disabled-2">
              Disabled Option 2
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </FieldGroup>
  )
}
