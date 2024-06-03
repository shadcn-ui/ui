import * as React from "react"

import { PhoneInput } from "@/registry/default/ui/phone-input"

export default function PhoneInputDemo() {
  const [value, setValue] = React.useState("")

  return (
    <PhoneInput
      value={value}
      onChange={setValue}
      placeholder="Enter a phone nsumber"
    />
  )
}
