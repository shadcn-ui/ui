@@directive("'use client'")

@react.component
let make = () =>
  <Button variant=BaseUi.Types.Variant.Outline onClick={_ => ()}>
    {"Show Toast"->React.string}
  </Button>
