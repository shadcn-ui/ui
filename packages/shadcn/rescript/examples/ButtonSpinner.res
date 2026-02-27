@react.component
let make = () =>
  <div className="flex gap-2">
    <Button variant=Button.Variant.Outline disabled=true>
      <Spinner dataIcon="inline-start" />
      {"Generating"->React.string}
    </Button>
    <Button variant=Button.Variant.Secondary disabled=true>
      {"Downloading"->React.string}
      <Spinner dataIcon="inline-start" />
    </Button>
  </div>
