@react.component
let make = () =>
  <Tooltip>
    <Tooltip.Trigger render={<span className="inline-block w-fit" />}>
      <Button variant=Button.Variant.Outline disabled={true}>
        {"Disabled"->React.string}
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p> {"This feature is currently unavailable"->React.string} </p>
    </Tooltip.Content>
  </Tooltip>
