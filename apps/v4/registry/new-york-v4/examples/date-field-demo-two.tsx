"use client"

import * as React from "react"
import { DateField } from "../ui/date-field"

export function DateFieldDemoTwo() {
  const [value, setValue] = React.useState<Date | undefined>(() => new Date())

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full justify-center overflow-x-auto">
        <DateField
          value={value}
          onValueChange={setValue}
          use12Hour={false}
          captionLayout="dropdown"
        />
      </div>
    </div>
  )
}
