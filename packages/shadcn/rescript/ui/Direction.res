@@directive("'use client'")

open BaseUi.Types

module DirectionProvider = {
  @react.component
  let make = (~children=?, ~className=?, ~style=?) =>
    <BaseUi.DirectionProvider ?children ?className ?style />
}

let useDirection = BaseUi.DirectionProvider.useDirection
