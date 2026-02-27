@react.component
let make = () =>
  <div className="flex flex-col items-start gap-8">
    <ButtonGroup>
      <Button variant=Button.Variant.Outline size=Button.Size.Sm> {"Small"->React.string} </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.Sm> {"Button"->React.string} </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.Sm> {"Group"->React.string} </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.IconSm>
        <Icons.Plus />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant=Button.Variant.Outline> {"Default"->React.string} </Button>
      <Button variant=Button.Variant.Outline> {"Button"->React.string} </Button>
      <Button variant=Button.Variant.Outline> {"Group"->React.string} </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.Icon>
        <Icons.Plus />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant=Button.Variant.Outline size=Button.Size.Lg> {"Large"->React.string} </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.Lg> {"Button"->React.string} </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.Lg> {"Group"->React.string} </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.IconLg>
        <Icons.Plus />
      </Button>
    </ButtonGroup>
  </div>
