"use client"

import * as React from "react"
import { DateRangePicker } from "@/registry/default/ui/date-range-picker"


export default function DateRangePickerDemo() {

  return (
    <DateRangePicker showExternalPresets showInternalPresets numberOfMonths={3} />
  )
}