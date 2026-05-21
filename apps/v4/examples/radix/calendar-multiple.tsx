import { Calendar } from "@/styles/radix-nova/ui/calendar"
import { Card, CardContent } from "@/styles/radix-nova/ui/card"

export function CalendarMultiple() {
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar mode="multiple" />
      </CardContent>
    </Card>
  )
}
