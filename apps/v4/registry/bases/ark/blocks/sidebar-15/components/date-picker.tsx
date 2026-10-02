import * as React from "react"

import {
  Calendar,
  CalendarDate,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/registry/bases/ark/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/registry/bases/ark/ui/sidebar"

export function DatePicker() {
  const now = new Date()
  const [value, setValue] = React.useState<DateValue[]>([
    new CalendarDate(now.getFullYear(), now.getMonth() + 1, 12),
  ])
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          selectionMode="single"
          value={value}
          onValueChange={(details: DatePickerValueChangeDetails) =>
            setValue(details.value)
          }
          className="bg-transparent [--cell-size:2.1rem]"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
