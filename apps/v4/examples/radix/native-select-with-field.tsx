import { Field, FieldDescription, FieldLabel } from "@/examples/radix/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/radix/ui/native-select"

export function NativeSelectWithField() {
  return (
    <Field>
      <FieldLabel htmlFor="native-select-country">Country</FieldLabel>
      <NativeSelect id="native-select-country">
        <NativeSelectOption value="">Select a country</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
        <NativeSelectOption value="au">Australia</NativeSelectOption>
      </NativeSelect>
      <FieldDescription>Select your country of residence.</FieldDescription>
    </Field>
  )
}
