import * as React from "react"

import { PhoneInput } from "@/registry/default/ui/phone-input"

export default function PhoneInputDefault() {
  const [value, setValue] = React.useState("")

  return <PhoneInput value={value} onChange={setValue} defaultCountry="US" />
}
