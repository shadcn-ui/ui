import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
} from "@/registry/new-york/ui/number-field"

export default function NumberFieldNumberFormatting() {
  return (
    <NumberField
      label="Currency"
      defaultValue={1888}
      formatOptions={{
        style: "currency",
        currency: "EUR",
        currencyDisplay: "code",
        currencySign: "accounting",
      }}
    >
      <NumberFieldLabel>Currency</NumberFieldLabel>
      <NumberFieldGroup>
        <NumberFieldIncrement />
        <NumberFieldInput />
        <NumberFieldDecrement />
      </NumberFieldGroup>
    </NumberField>
  )
}
