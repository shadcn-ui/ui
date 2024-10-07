import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
} from "@/registry/default/ui/number-field"

export default function NumberFieldLabelPosition() {
  return (
    <NumberField labelPosition="left">
      <NumberFieldLabel>Amount</NumberFieldLabel>
      <NumberFieldGroup>
        <NumberFieldIncrement />
        <NumberFieldInput />
        <NumberFieldDecrement />
      </NumberFieldGroup>
    </NumberField>
  )
}
