@react.component
let make = () =>
  <div className="flex flex-wrap items-center gap-2 md:flex-row">
    <Button dataVariant=BaseUi.Types.Variant.Outline>{"Button"->React.string}</Button>
    <Button dataVariant=BaseUi.Types.Variant.Outline dataSize=BaseUi.Types.Size.Icon ariaLabel="Submit">
      <Icons.ArrowUp />
    </Button>
  </div>
