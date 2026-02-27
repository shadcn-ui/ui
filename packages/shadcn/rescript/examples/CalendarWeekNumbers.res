@@directive("'use client'")

@new external makeDate: (int, int, int) => Date.t = "Date"
@send external getFullYear: Date.t => int = "getFullYear"

@react.component
let make = () => {
  let year = Date.make()->getFullYear
  let initialDate = makeDate(year, 0, 12)
  let (date, setDate) = React.useState(() => Some(initialDate))

  <Card className="mx-auto w-fit p-0">
    <Card.Content className="p-0">
      <Calendar
        mode="single"
        defaultMonth=?date
        selected=date
        onSelect={(value: option<Date.t>) => setDate(_ => value)}
        showWeekNumber={true}
      />
    </Card.Content>
  </Card>
}
