@react.component
let make = () =>
  <div className="flex flex-wrap items-center gap-2 md:flex-row">
    <Button variant=BaseUi.Types.Variant.Outline> {"Button"->React.string} </Button>
    <Button variant=BaseUi.Types.Variant.Outline size=BaseUi.Types.Size.Icon ariaLabel="Submit">
      <Icons.ArrowUp />
    </Button>
  </div>
