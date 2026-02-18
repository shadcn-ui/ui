@@directive("'use client'")

@react.component
let make = () =>
  <Direction.DirectionProvider>
    <div className="rounded-md border px-3 py-2"> {"Direction context"->React.string} </div>
  </Direction.DirectionProvider>
