import {
  NumberField,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field"

export default function NumberFieldIncrementOnly() {
  return (
    <NumberField>
      <NumberFieldInput thousandSeparator="," placeholder="Enter a number" />
      <NumberFieldIncrement className="h-full" />
    </NumberField>
  )
}
