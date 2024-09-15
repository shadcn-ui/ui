import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
} from "@/registry/default/ui/number-field"

export default function NumberFieldDisabled() {
  return (
    <NumberField isDisabled>
      <NumberFieldLabel>Amount</NumberFieldLabel>
      <NumberFieldGroup>
        <NumberFieldIncrement />
        <NumberFieldInput />
        <NumberFieldDecrement />
      </NumberFieldGroup>
    </NumberField>
  )
}
