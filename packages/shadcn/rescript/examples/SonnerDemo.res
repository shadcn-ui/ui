@@directive("'use client'")

@react.component
let make = () =>
  <Button variant=Button.Variant.Outline onClick={_ => ()}>
    {"Show Toast"->React.string}
  </Button>
