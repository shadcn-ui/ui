@@directive("'use client'")

@module("date-fns")
external formatDate: (Date.t, string) => string = "format"

@react.component
let make = () => {
  let (date, setDate) = React.useState(() => None)
  let (open, setOpen) = React.useState(() => false)

  <Field className="mx-auto w-72">
    <Popover open_=open onOpenChange={(nextOpen, _) => setOpen(_ => nextOpen)}>
      <Field.Label htmlFor="date-picker-with-dropdowns-desktop"> {"Date"->React.string} </Field.Label>
      <Popover.Trigger
        render={<Button
          variant=Button.Variant.Outline
          id="date-picker-with-dropdowns-desktop"
          className="justify-start px-2.5 font-normal"
        />}
      >
        <Icons.ChevronDown className="ml-auto" />
        {switch date {
        | Some(value) => formatDate(value, "PPP")->React.string
        | None => <span> {"Pick a date"->React.string} </span>
        }}
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0" align=BaseUi.Types.Align.Start>
        <Calendar
          mode="single"
          selected=date
          onSelect={(value: option<Date.t>) => setDate(_ => value)}
          captionLayout=Calendar.CaptionLayout.Dropdown
        />
        <div className="flex gap-2 border-t p-2">
          <Button
            variant=Button.Variant.Outline
            size=Button.Size.Sm
            className="w-full"
            onClick={_ => setOpen(_ => false)}
          >
            {"Done"->React.string}
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  </Field>
}
