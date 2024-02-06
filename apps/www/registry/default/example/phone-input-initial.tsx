import * as React from "react"

import {
  PhoneInput,
  type PhoneInputValue,
} from "@/registry/default/ui/phone-input"

export default function PhoneInputInitial() {
  const [value, setValue] = React.useState<PhoneInputValue>()

  return (
    <PhoneInput
      value={value}
      onChange={setValue}
      initialValueFormat="national"
    />
  )
}
