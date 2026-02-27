@react.component
let make = () => {
  let triggerClassName = `${Button.buttonVariants(~variant=Button.Variant.Outline)} w-fit`

  <Popover>
    <Popover.Trigger className=triggerClassName type_="button">
      {"Open Popover"->React.string}
    </Popover.Trigger>
    <Popover.Content align=BaseUi.Types.Align.Start>
      <Popover.Header>
        <Popover.Title> {"Dimensions"->React.string} </Popover.Title>
        <Popover.Description>
          {"Set the dimensions for the layer."->React.string}
        </Popover.Description>
      </Popover.Header>
    </Popover.Content>
  </Popover>
}
