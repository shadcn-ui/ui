import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field"

export default function NumberFieldPrefixSuffix() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <strong>Prefix</strong>
        <NumberFieldInput
          thousandSeparator=","
          defaultValue={9999.99}
          prefix={"$ "}
        />
      </div>
      <div className="flex flex-col gap-2">
        <strong>Suffix</strong>
        <NumberField>
          <NumberFieldInput
            thousandSeparator=","
            defaultValue={5.5}
            suffix={" acres"}
            decimalScale={1}
          />
          <NumberFieldIncrement step={0.1} />
          <NumberFieldDecrement step={0.1} />
        </NumberField>
      </div>
    </div>
  )
}
