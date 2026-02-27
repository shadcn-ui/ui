@@directive("'use client'")

type preset = {
  label: string,
  value: int,
}

@new external makeDate: (int, int, int) => Date.t = "Date"
@send external getFullYear: Date.t => int = "getFullYear"
@send external getMonth: Date.t => int = "getMonth"
@send external getDate: Date.t => int = "getDate"

let presets: array<preset> = [
  {label: "Today", value: 0},
  {label: "Tomorrow", value: 1},
  {label: "In 3 days", value: 3},
  {label: "In a week", value: 7},
  {label: "In 2 weeks", value: 14},
]

@react.component
let make = () => {
  let now = Date.make()
  let year = now->getFullYear
  let month = now->getMonth
  let (date, setDate) = React.useState(() => Some(makeDate(year, 1, 12)))
  let (currentMonth, setCurrentMonth) = React.useState(() => makeDate(year, month, 1))

  <Card className="mx-auto w-fit max-w-[300px]" dataSize=Card.Size.Sm>
    <Card.Content>
      <Calendar
        mode="single"
        selected=date
        onSelect={(value: option<Date.t>) => setDate(_ => value)}
        month=currentMonth
        onMonthChange={(value: Date.t) => setCurrentMonth(_ => value)}
        fixedWeeks={true}
        className="p-0 [--cell-size:--spacing(9.5)]"
      />
    </Card.Content>
    <Card.Footer className="flex flex-wrap gap-2 border-t">
      {presets
      ->Array.map(preset =>
        <Button
          key={preset.value->Int.toString}
          variant=Button.Variant.Outline
          size=Button.Size.Sm
          className="flex-1"
          onClick={_ => {
            let today = Date.make()
            let newDate = makeDate(today->getFullYear, today->getMonth, today->getDate + preset.value)
            setDate(_ => Some(newDate))
            setCurrentMonth(_ => makeDate(newDate->getFullYear, newDate->getMonth, 1))
          }}
        >
          {preset.label->React.string}
        </Button>
      )
      ->React.array}
    </Card.Footer>
  </Card>
}
