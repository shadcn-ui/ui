import * as React from "react"

import { PhoneInput } from "@/registry/new-york/ui/phone-input"

export default function PhoneInputDefault() {
  const [value, setValue] = React.useState("")

  return <PhoneInput value={value} onChange={setValue} defaultCountry="US" />
}
