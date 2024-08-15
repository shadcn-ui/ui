import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/new-york/ui/number-field"

export default function NumberFieldDemo() {
  return (
    <NumberField>
      <NumberFieldInput thousandSeparator="," placeholder="Enter a number" />
      <NumberFieldIncrement />
      <NumberFieldDecrement />
    </NumberField>
  )
}
