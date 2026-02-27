@react.component
let make = () =>
  <div className="flex flex-wrap gap-2">
    <Badge variant=Badge.Variant.Destructive>
      <Spinner dataIcon="inline-start" />
      {"Deleting"->React.string}
    </Badge>
    <Badge variant=Badge.Variant.Secondary>
      {"Generating"->React.string}
      <Spinner dataIcon="inline-end" />
    </Badge>
  </div>
