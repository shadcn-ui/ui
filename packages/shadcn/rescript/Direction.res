@@directive("'use client'")

open BaseUi.Types

module DirectionProvider = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.DirectionProvider {...props} />
}

let useDirection = BaseUi.DirectionProvider.useDirection
