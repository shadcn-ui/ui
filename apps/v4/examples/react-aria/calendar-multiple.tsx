import { Calendar } from "@/examples/react-aria/ui/calendar"
import { Card, CardContent } from "@/examples/react-aria/ui/card"

export function CalendarMultiple() {
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar mode="multiple" />
      </CardContent>
    </Card>
  )
}
