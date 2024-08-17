import React from "react"

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field"
import { Slider } from "@/registry/default/ui/slider"

const MIN_VALUE = 0
const MAX_VALUE = 10

const format = (numStr: any) => {
  if (numStr === "") return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numStr)
}

export default function NumberFieldControlled() {
  const [value, setValue] = React.useState(3)
  return (
    <div className="flex flex-col gap-4">
      <NumberField>
        <NumberFieldInput
          thousandSeparator=","
          value={value}
          onValueChange={(v) => setValue(v)}
          format={format}
          isAllowed={(values) => {
            const { floatValue } = values
            if (!floatValue) return true
            return floatValue >= MIN_VALUE && floatValue <= MAX_VALUE
          }}
        />
        <NumberFieldIncrement />
        <NumberFieldDecrement />
      </NumberField>
      <Slider
        value={[value]}
        onValueChange={(v) => setValue(v[0])}
        min={MIN_VALUE}
        max={MAX_VALUE}
      />
    </div>
  )
}
