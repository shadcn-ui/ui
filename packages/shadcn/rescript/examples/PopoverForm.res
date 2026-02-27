@react.component
let make = () => {
  let triggerClassName = Button.buttonVariants(~variant=Button.Variant.Outline)

  <Popover>
    <Popover.Trigger className=triggerClassName type_="button">
      {"Open Popover"->React.string}
    </Popover.Trigger>
    <Popover.Content className="w-64" align=BaseUi.Types.Align.Start>
      <Popover.Header>
        <Popover.Title> {"Dimensions"->React.string} </Popover.Title>
        <Popover.Description>
          {"Set the dimensions for the layer."->React.string}
        </Popover.Description>
      </Popover.Header>
      <Field.Group className="gap-4">
        <Field orientation=BaseUi.Types.Orientation.Horizontal>
          <Field.Label htmlFor="width" className="w-1/2"> {"Width"->React.string} </Field.Label>
          <Input id="width" defaultValue="100%" />
        </Field>
        <Field orientation=BaseUi.Types.Orientation.Horizontal>
          <Field.Label htmlFor="height" className="w-1/2"> {"Height"->React.string} </Field.Label>
          <Input id="height" defaultValue="25px" />
        </Field>
      </Field.Group>
    </Popover.Content>
  </Popover>
}
