import * as React from "react"

import {
  PhoneInput,
  type PhoneInputValue,
} from "@/registry/new-york/ui/phone-input"

export default function PhoneInputDemo() {
  const [value, setValue] = React.useState<PhoneInputValue>()

  return (
    <PhoneInput
      value={value}
      onChange={setValue}
      placeholder="Enter a phone number"
    />
  )
}
