@@directive("'use client'")

type dateRange = {
  from: option<Date.t>,
  to: option<Date.t>,
}

@new external makeDate: (int, int, int) => Date.t = "Date"
@send external getFullYear: Date.t => int = "getFullYear"

@react.component
let make = () => {
  let year = Date.make()->getFullYear
  let startDate = makeDate(year, 0, 12)
  let initialRange: dateRange = {
    from: Some(startDate),
    to: Some(makeDate(year, 0, 42)),
  }
  let (dateRange, setDateRange) = React.useState(() => Some(initialRange))

  <Calendar
    mode="range"
    defaultMonth=?{
      switch dateRange {
      | Some(value) => value.from
      | None => None
      }
    }
    selected=dateRange
    onSelect={(value: option<dateRange>) => setDateRange(_ => value)}
    numberOfMonths=2
    className="rounded-lg border"
  />
}
