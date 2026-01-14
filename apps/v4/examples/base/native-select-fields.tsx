import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/examples/base/ui/native-select"
import { Select } from "@/examples/base/ui/select"

export function NativeSelectFields() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="native-select-basic">
          Basic Native Select
        </FieldLabel>
        <NativeSelect id="native-select-basic">
          <NativeSelectOption value="">Choose an option</NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="native-select-country">Country</FieldLabel>
        <NativeSelect id="native-select-country">
          <NativeSelectOption value="">Select your country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>
          Select the country where you currently reside.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="native-select-timezone">Timezone</FieldLabel>
        <FieldDescription>
          Choose your local timezone for accurate scheduling.
        </FieldDescription>
        <NativeSelect id="native-select-timezone">
          <NativeSelectOption value="">Select timezone</NativeSelectOption>
          <NativeSelectOption value="utc">UTC</NativeSelectOption>
          <NativeSelectOption value="est">Eastern Time</NativeSelectOption>
          <NativeSelectOption value="pst">Pacific Time</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="native-select-grouped">Grouped Options</FieldLabel>
        <NativeSelect id="native-select-grouped">
          <NativeSelectOption value="">Select a region</NativeSelectOption>
          <NativeSelectOptGroup label="North America">
            <NativeSelectOption value="us">United States</NativeSelectOption>
            <NativeSelectOption value="ca">Canada</NativeSelectOption>
            <NativeSelectOption value="mx">Mexico</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Europe">
            <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
            <NativeSelectOption value="fr">France</NativeSelectOption>
            <NativeSelectOption value="de">Germany</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
        <FieldDescription>
          Native select with grouped options using optgroup.
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="native-select-invalid">
          Invalid Native Select
        </FieldLabel>
        <NativeSelect id="native-select-invalid" aria-invalid>
          <NativeSelectOption value="">
            This field has an error
          </NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="native-select-disabled-field">
          Disabled Field
        </FieldLabel>
        <NativeSelect id="native-select-disabled-field" disabled>
          <NativeSelectOption value="">Cannot select</NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
