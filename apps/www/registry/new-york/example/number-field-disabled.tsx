import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/new-york/ui/number-field"

export default function NumberFieldDisabled() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-full flex flex-col gap-2">
        <strong>Input Only Disabled</strong>
        <NumberField>
          <NumberFieldInput
            disabled
            thousandSeparator=","
            placeholder="Input Disabled"
          />
          <NumberFieldIncrement step={5} />
          <NumberFieldDecrement step={2} />
        </NumberField>
      </div>
      <div className="w-full flex flex-col gap-2">
        <strong>Only Decrement Disabled</strong>
        <NumberField>
          <NumberFieldInput
            disabled
            thousandSeparator=","
            placeholder="Only Decrement Disabled"
          />
          <NumberFieldIncrement />
          <NumberFieldDecrement disabled />
        </NumberField>
      </div>
      <div className="w-full flex flex-col gap-2">
        <strong>Fully Disabled</strong>
        <NumberField disabled>
          <NumberFieldInput
            disabled
            thousandSeparator=","
            placeholder="Fully Disabled"
          />
          <NumberFieldIncrement />
          <NumberFieldDecrement />
        </NumberField>
      </div>
    </div>
  )
}
