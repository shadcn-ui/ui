@@directive("'use client'")

type dateRange = {
  from: option<Date.t>,
  to: option<Date.t>,
}

@new external makeDate: (int, int, int) => Date.t = "Date"
@send external getFullYear: Date.t => int = "getFullYear"
@send external getDay: Date.t => int = "getDay"

@react.component
let make = () => {
  let year = Date.make()->getFullYear
  let startDate = makeDate(year, 11, 8)
  let initialRange: dateRange = {
    from: Some(startDate),
    to: Some(makeDate(year, 11, 18)),
  }
  let (range, setRange) = React.useState(() => Some(initialRange))

  <Card className="mx-auto w-fit p-0">
    <Card.Content className="p-0">
      <Calendar
        mode="range"
        defaultMonth=?{
          switch range {
          | Some(value) => value.from
          | None => None
          }
        }
        selected=range
        onSelect={(value: option<dateRange>) => setRange(_ => value)}
        numberOfMonths=1
        captionLayout=Calendar.CaptionLayout.Dropdown
        className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
        formatters={{
          formatMonthDropdown: date =>
            date->Date.toLocaleDateStringWithLocaleAndOptions("default", {month: #long}),
        }}
        components={{
          dayButton: props => {
            let isWeekend = switch props.day.date->getDay {
            | 0 | 6 => true
            | _ => false
            }
            <Calendar.DayButton {...props}>
              {switch props.children {
              | Some(value) => value
              | None => React.null
              }}
              {if props.modifiers.outside->Option.getOr(false) {
                React.null
              } else {
                <span> {(if isWeekend {"$120"} else {"$100"})->React.string} </span>
              }}
            </Calendar.DayButton>
          },
        }}
      />
    </Card.Content>
  </Card>
}
