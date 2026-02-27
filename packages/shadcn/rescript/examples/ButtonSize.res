@react.component
let make = () =>
  <div className="flex flex-col items-start gap-8 sm:flex-row">
    <div className="flex items-start gap-2">
      <Button size=Button.Size.Xs variant=Button.Variant.Outline> {"Extra Small"->React.string} </Button>
      <Button size=Button.Size.IconXs ariaLabel="Submit" variant=Button.Variant.Outline>
        <Icons.ArrowUpRight />
      </Button>
    </div>
    <div className="flex items-start gap-2">
      <Button size=Button.Size.Sm variant=Button.Variant.Outline> {"Small"->React.string} </Button>
      <Button size=Button.Size.IconSm ariaLabel="Submit" variant=Button.Variant.Outline>
        <Icons.ArrowUpRight />
      </Button>
    </div>
    <div className="flex items-start gap-2">
      <Button variant=Button.Variant.Outline> {"Default"->React.string} </Button>
      <Button size=Button.Size.Icon ariaLabel="Submit" variant=Button.Variant.Outline>
        <Icons.ArrowUpRight />
      </Button>
    </div>
    <div className="flex items-start gap-2">
      <Button variant=Button.Variant.Outline size=Button.Size.Lg> {"Large"->React.string} </Button>
      <Button size=Button.Size.IconLg ariaLabel="Submit" variant=Button.Variant.Outline>
        <Icons.ArrowUpRight />
      </Button>
    </div>
  </div>
