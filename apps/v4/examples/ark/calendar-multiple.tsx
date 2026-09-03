import { Calendar } from "@/styles/ark-nova/ui/calendar"
import { Card, CardContent } from "@/styles/ark-nova/ui/card"

export function CalendarMultiple() {
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar selectionMode="multiple" />
      </CardContent>
    </Card>
  )
}
