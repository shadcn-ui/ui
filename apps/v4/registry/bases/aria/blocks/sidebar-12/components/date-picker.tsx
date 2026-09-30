import * as React from "react"
import { CalendarDate } from "@internationalized/date"

import { Calendar } from "@/registry/bases/aria/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/registry/bases/aria/ui/sidebar"

export function DatePicker() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 12)
  )
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          value={date}
          onChange={setDate}
          captionLayout="dropdown"
          className="bg-transparent [--cell-size:2.1rem]"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
