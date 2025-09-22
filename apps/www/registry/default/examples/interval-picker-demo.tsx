import { IntervalPicker, IntervalPickerValue } from "@/registry/default/ui/interval-picker"
import { useState } from "react"

export default function IntervalPickerDemo() {
  const [value, setValue] = useState<IntervalPickerValue>({
    frequency: 1,
    unit: "week",
    weekdays: [3], // Wednesday
    endType: "never",
  })

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <IntervalPicker
        value={value}
        onChange={setValue}
        onCancel={() => console.log("Cancelled")}
        onDone={() => console.log("Done:", value)}
      />
    </div>
  )
}