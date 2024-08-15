import { NumberFieldInput } from "@/registry/default/ui/number-field"

export default function NumberFieldPrefix() {
  return (
    <NumberFieldInput
      thousandSeparator=","
      defaultValue={9999.99}
      prefix={"$ "}
    />
  )
}
