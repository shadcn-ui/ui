"use client"

import * as React from "react"
import { DateRangePicker } from "@/registry/default/ui/date-range-picker"


export default function DateRangePickerDemo() {

  return (
    <DateRangePicker showExternalPresets showInternalPresets numberOfMonths={2} 
    presets={[
      {
        key: "today",
        label: "Today",
        range: {
          from: new Date(),
        },
      },
      {
        key: "yesterday",
        label: "Yesterday",
        range: {
          from: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
      {
        key: "last-7-days",
        label: "Last 7 days",
        range: {
          from: new Date(new Date().setDate(new Date().getDate() - 7)),
          to: new Date(),
        },
      },
    ]}
    />
  )
}