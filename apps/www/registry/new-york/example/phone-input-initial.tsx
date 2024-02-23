import * as React from "react"

import { PhoneInput } from "@/registry/new-york/ui/phone-input"

export default function PhoneInputInitial() {
  const [value, setValue] = React.useState("")

  return (
    <PhoneInput
      value={value}
      onChange={setValue}
      initialValueFormat="national"
    />
  )
}
