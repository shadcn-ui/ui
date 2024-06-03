import * as React from "react"

import { PhoneInput } from "@/registry/new-york/ui/phone-input"

export default function PhoneInputInternational() {
  const [value, setValue] = React.useState("")

  return (
    <PhoneInput
      value={value}
      onChange={setValue}
      international
      defaultCountry="US"
    />
  )
}
