@react.component
let make = () =>
  <Tooltip>
    <Tooltip.Trigger render={<Button dataVariant=BaseUi.Types.Variant.Outline />}>
      {"Hover"->React.string}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>{"Add to library"->React.string}</p>
    </Tooltip.Content>
  </Tooltip>
