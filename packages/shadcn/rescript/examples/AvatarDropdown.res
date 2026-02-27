@react.component
let make = () => {
  let triggerClassName =
    `${Button.buttonVariants(~variant=Button.Variant.Ghost, ~size=Button.Size.Icon)} rounded-full`

  <DropdownMenu>
    <DropdownMenu.Trigger className=triggerClassName type_="button">
      <Avatar>
        <Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" renderBeforeHydration={true} />
        <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
      </Avatar>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content className="w-32">
      <DropdownMenu.Group>
        <DropdownMenu.Item> {"Profile"->React.string} </DropdownMenu.Item>
        <DropdownMenu.Item> {"Billing"->React.string} </DropdownMenu.Item>
        <DropdownMenu.Item> {"Settings"->React.string} </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator> {React.null} </DropdownMenu.Separator>
      <DropdownMenu.Group>
        <DropdownMenu.Item variant=DropdownMenu.Variant.Destructive>
          {"Log out"->React.string}
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu>
}
