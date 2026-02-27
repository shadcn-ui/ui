module TablerIcons = {
  type props = {className?: string}

  module Plus = {
    @module("@tabler/icons-react")
    external make: React.component<props> = "IconPlus"
  }
}

@react.component
let make = () =>
  <ButtonGroup>
    <Button variant=Button.Variant.Secondary> {"Button"->React.string} </Button>
    <ButtonGroup.Separator />
    <Button size=Button.Size.Icon variant=Button.Variant.Secondary>
      <TablerIcons.Plus />
    </Button>
  </ButtonGroup>
