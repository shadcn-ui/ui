@@directive("'use client'")

@new external makeDate: (int, int, int) => Date.t = "Date"
@send external getFullYear: Date.t => int = "getFullYear"
@send external getTime: Date.t => float = "getTime"

@react.component
let make = () => {
  let year = Date.make()->getFullYear
  let initialDate = makeDate(year, 0, 6)
  let (date, setDate) = React.useState(() => Some(initialDate))
  let bookedDates = Array.make(~length=15, initialDate)
  for i in 0 to 14 {
    bookedDates[i] = makeDate(year, 0, 12 + i)
  }
  let isBooked = (day: Date.t) =>
    bookedDates->Array.some(bookedDate => bookedDate->getTime == day->getTime)

  <Card className="mx-auto w-fit p-0">
    <Card.Content className="p-0">
      <Calendar
        mode="single"
        defaultMonth=?date
        selected=date
        onSelect={(value: option<Date.t>) => setDate(_ => value)}
        disabled=isBooked
        modifiers={dict{"booked": isBooked}}
        modifiersClassNames={dict{"booked": "[&>button]:line-through opacity-100"}}
      />
    </Card.Content>
  </Card>
}
