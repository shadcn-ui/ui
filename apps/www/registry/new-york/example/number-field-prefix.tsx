import { NumberFieldInput } from "@/registry/new-york/ui/number-field"

export default function NumberFieldPrefix() {
  return (
    <NumberFieldInput
      thousandSeparator=","
      defaultValue={9999.99}
      prefix={"$ "}
    />
  )
}
