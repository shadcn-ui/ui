import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalendarDateRangePicker } from "@/components/examples/calendar/date-range-picker"

export function DemoDatePicker() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="date" className="shrink-0">
            Pick a date
          </Label>
          <CalendarDateRangePicker className="[&>button]:w-[260px]" />
        </div>
      </CardContent>
    </Card>
  )
}
