@react.component
let make = () =>
  <div className="flex w-full flex-wrap justify-center gap-2">
    <Badge>{"Badge"->React.string}</Badge>
    <Badge dataVariant=BaseUi.Types.Variant.Secondary>{"Secondary"->React.string}</Badge>
    <Badge dataVariant=BaseUi.Types.Variant.Destructive>{"Destructive"->React.string}</Badge>
    <Badge dataVariant=BaseUi.Types.Variant.Outline>{"Outline"->React.string}</Badge>
  </div>
