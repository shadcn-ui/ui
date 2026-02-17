@react.component
let make = () =>
  <Button
    dataVariant=BaseUi.Types.Variant.Outline
    onClick={_ => ()}
  >
    {"Show Toast"->React.string}
  </Button>
