import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
} from "@/registry/default/ui/number-field"

export default function NumberFieldDemo() {
  return (
    <NumberField>
      <NumberFieldLabel>Amount</NumberFieldLabel>
      <NumberFieldGroup>
        <NumberFieldIncrement />
        <NumberFieldInput />
        <NumberFieldDecrement />
      </NumberFieldGroup>
    </NumberField>
  )
}
