import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
} from "@/registry/new-york/ui/number-field"

export default function NumberFieldBtnPosition() {
  return (
    <NumberField btnPosition="outside">
      <NumberFieldLabel>Amount</NumberFieldLabel>
      <NumberFieldGroup>
        <NumberFieldIncrement />
        <NumberFieldInput />
        <NumberFieldDecrement />
      </NumberFieldGroup>
    </NumberField>
  )
}
