@react.component
let make = () =>
  <ButtonGroup>
    <Input placeholder="Search..." />
    <Button variant=Button.Variant.Outline ariaLabel="Search">
      <Icons.Search />
    </Button>
  </ButtonGroup>
