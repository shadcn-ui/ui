@@directive("'use client'")

@new external makeDate: (int, int, int) => Date.t = "Date"
@send external getFullYear: Date.t => int = "getFullYear"
@send external getMonth: Date.t => int = "getMonth"

@react.component
let make = () => {
  let now = Date.make()
  let year = now->getFullYear
  let month = now->getMonth
  let (date, setDate) = React.useState(() => Some(makeDate(year, month, 12)))

  <Card dataSize=Card.Size.Sm className="mx-auto w-fit">
    <Card.Content>
      <Calendar
        mode="single"
        selected=date
        onSelect={(value: option<Date.t>) => setDate(_ => value)}
        className="p-0"
      />
    </Card.Content>
    <Card.Footer className="bg-card border-t">
      <Field.Group>
        <Field>
          <Field.Label htmlFor="time-from"> {"Start Time"->React.string} </Field.Label>
          <InputGroup>
            <InputGroup.Input
              id="time-from"
              type_="time"
              step=1.
              defaultValue="10:30:00"
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            <InputGroup.Addon>
              <Icons.Clock2 className="text-muted-foreground" />
            </InputGroup.Addon>
          </InputGroup>
        </Field>
        <Field>
          <Field.Label htmlFor="time-to"> {"End Time"->React.string} </Field.Label>
          <InputGroup>
            <InputGroup.Input
              id="time-to"
              type_="time"
              step=1.
              defaultValue="12:30:00"
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            <InputGroup.Addon>
              <Icons.Clock2 className="text-muted-foreground" />
            </InputGroup.Addon>
          </InputGroup>
        </Field>
      </Field.Group>
    </Card.Footer>
  </Card>
}
