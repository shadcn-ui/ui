@react.component
let make = () =>
  <div className="flex w-full max-w-md flex-col gap-6">
    <Item variant=BaseUi.Types.Variant.Outline>
      <Item.Content>
        <Item.Title> {"Basic Item"->React.string} </Item.Title>
        <Item.Description>
          {"A simple item with title and description."->React.string}
        </Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button variant=BaseUi.Types.Variant.Outline size=BaseUi.Types.Size.Sm>
          {"Action"->React.string}
        </Button>
      </Item.Actions>
    </Item>
    <Item variant=BaseUi.Types.Variant.Outline size=BaseUi.Types.Size.Sm render={<a href="#" />}>
      <Item.Media>
        <Icons.BadgeCheck className="size-5" />
      </Item.Media>
      <Item.Content>
        <Item.Title> {"Your profile has been verified."->React.string} </Item.Title>
      </Item.Content>
      <Item.Actions>
        <Icons.ChevronRight className="size-4" />
      </Item.Actions>
    </Item>
  </div>
