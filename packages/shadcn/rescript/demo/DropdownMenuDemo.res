@@directive("'use client'")

@react.component
let make = () =>
  <DropdownMenu>
    <DropdownMenu.Trigger render={<Button dataVariant=BaseUi.Types.Variant.Outline />}>
      {"Open"->React.string}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content className="w-40" align=BaseUi.Types.Align.Start>
      <DropdownMenu.Group>
        <DropdownMenu.Label>{"My Account"->React.string}</DropdownMenu.Label>
        <DropdownMenu.Item>
          {"Profile"->React.string}
          <DropdownMenu.Shortcut>{"⇧⌘P"->React.string}</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          {"Billing"->React.string}
          <DropdownMenu.Shortcut>{"⌘B"->React.string}</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          {"Settings"->React.string}
          <DropdownMenu.Shortcut>{"⌘S"->React.string}</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
      <DropdownMenu.Group>
        <DropdownMenu.Item>{"Team"->React.string}</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>{"Invite users"->React.string}</DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>{"Email"->React.string}</DropdownMenu.Item>
              <DropdownMenu.Item>{"Message"->React.string}</DropdownMenu.Item>
              <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
              <DropdownMenu.Item>{"More..."->React.string}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
        <DropdownMenu.Item>
          {"New Team"->React.string}
          <DropdownMenu.Shortcut>{"⌘+T"->React.string}</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
      <DropdownMenu.Group>
        <DropdownMenu.Item>{"GitHub"->React.string}</DropdownMenu.Item>
        <DropdownMenu.Item>{"Support"->React.string}</DropdownMenu.Item>
        <DropdownMenu.Item disabled=true>{"API"->React.string}</DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
      <DropdownMenu.Group>
        <DropdownMenu.Item>
          {"Log out"->React.string}
          <DropdownMenu.Shortcut>{"⇧⌘Q"->React.string}</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu>
