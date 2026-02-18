@react.component
let make = () =>
  <Command className="max-w-sm rounded-lg border">
    <Command.Input placeholder="Type a command or search..." />
    <Command.List>
      <Command.Empty> {"No results found."->React.string} </Command.Empty>
      <Command.Group heading="Suggestions">
        <Command.Item>
          <Icons.Calendar />
          <span> {"Calendar"->React.string} </span>
        </Command.Item>
        <Command.Item>
          <Icons.Smile />
          <span> {"Search Emoji"->React.string} </span>
        </Command.Item>
        <Command.Item disabled={true}>
          <Icons.Calculator />
          <span> {"Calculator"->React.string} </span>
        </Command.Item>
      </Command.Group>
      <Command.Separator />
      <Command.Group heading="Settings">
        <Command.Item>
          <Icons.User />
          <span> {"Profile"->React.string} </span>
          <Command.Shortcut> {"⌘P"->React.string} </Command.Shortcut>
        </Command.Item>
        <Command.Item>
          <Icons.CreditCard />
          <span> {"Billing"->React.string} </span>
          <Command.Shortcut> {"⌘B"->React.string} </Command.Shortcut>
        </Command.Item>
        <Command.Item>
          <Icons.Settings />
          <span> {"Settings"->React.string} </span>
          <Command.Shortcut> {"⌘S"->React.string} </Command.Shortcut>
        </Command.Item>
      </Command.Group>
    </Command.List>
  </Command>
