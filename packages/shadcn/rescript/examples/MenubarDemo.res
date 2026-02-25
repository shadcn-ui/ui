@react.component
let make = () =>
  <Menubar className="w-72">
    <Menubar.Menu>
      <Menubar.Trigger> {"File"->React.string} </Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Group>
          <Menubar.Item>
            {"New Tab"->React.string}
            <Menubar.Shortcut> {"⌘T"->React.string} </Menubar.Shortcut>
          </Menubar.Item>
          <Menubar.Item>
            {"New Window"->React.string}
            <Menubar.Shortcut> {"⌘N"->React.string} </Menubar.Shortcut>
          </Menubar.Item>
          <Menubar.Item disabled=true> {"New Incognito Window"->React.string} </Menubar.Item>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Sub>
            <Menubar.SubTrigger> {"Share"->React.string} </Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Group>
                <Menubar.Item> {"Email link"->React.string} </Menubar.Item>
                <Menubar.Item> {"Messages"->React.string} </Menubar.Item>
                <Menubar.Item> {"Notes"->React.string} </Menubar.Item>
              </Menubar.Group>
            </Menubar.SubContent>
          </Menubar.Sub>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Item>
            {"Print..."->React.string}
            <Menubar.Shortcut> {"⌘P"->React.string} </Menubar.Shortcut>
          </Menubar.Item>
        </Menubar.Group>
      </Menubar.Content>
    </Menubar.Menu>

    <Menubar.Menu>
      <Menubar.Trigger> {"Edit"->React.string} </Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Group>
          <Menubar.Item>
            {"Undo"->React.string}
            <Menubar.Shortcut> {"⌘Z"->React.string} </Menubar.Shortcut>
          </Menubar.Item>
          <Menubar.Item>
            {"Redo"->React.string}
            <Menubar.Shortcut> {"⇧⌘Z"->React.string} </Menubar.Shortcut>
          </Menubar.Item>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Sub>
            <Menubar.SubTrigger> {"Find"->React.string} </Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Group>
                <Menubar.Item> {"Search the web"->React.string} </Menubar.Item>
              </Menubar.Group>
              <Menubar.Separator> {React.null} </Menubar.Separator>
              <Menubar.Group>
                <Menubar.Item> {"Find..."->React.string} </Menubar.Item>
                <Menubar.Item> {"Find Next"->React.string} </Menubar.Item>
                <Menubar.Item> {"Find Previous"->React.string} </Menubar.Item>
              </Menubar.Group>
            </Menubar.SubContent>
          </Menubar.Sub>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Item> {"Cut"->React.string} </Menubar.Item>
          <Menubar.Item> {"Copy"->React.string} </Menubar.Item>
          <Menubar.Item> {"Paste"->React.string} </Menubar.Item>
        </Menubar.Group>
      </Menubar.Content>
    </Menubar.Menu>

    <Menubar.Menu>
      <Menubar.Trigger> {"View"->React.string} </Menubar.Trigger>
      <Menubar.Content className="w-44">
        <Menubar.Group>
          <Menubar.CheckboxItem> {"Bookmarks Bar"->React.string} </Menubar.CheckboxItem>
          <Menubar.CheckboxItem checked=true> {"Full URLs"->React.string} </Menubar.CheckboxItem>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Item dataInset=true>
            {"Reload"->React.string}
            <Menubar.Shortcut> {"⌘R"->React.string} </Menubar.Shortcut>
          </Menubar.Item>
          <Menubar.Item disabled=true dataInset=true>
            {"Force Reload"->React.string}
            <Menubar.Shortcut> {"⇧⌘R"->React.string} </Menubar.Shortcut>
          </Menubar.Item>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Item dataInset=true> {"Toggle Fullscreen"->React.string} </Menubar.Item>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Item dataInset=true> {"Hide Sidebar"->React.string} </Menubar.Item>
        </Menubar.Group>
      </Menubar.Content>
    </Menubar.Menu>

    <Menubar.Menu>
      <Menubar.Trigger> {"Profiles"->React.string} </Menubar.Trigger>
      <Menubar.Content>
        <Menubar.RadioGroup value="benoit">
          <Menubar.RadioItem value="andy"> {"Andy"->React.string} </Menubar.RadioItem>
          <Menubar.RadioItem value="benoit"> {"Benoit"->React.string} </Menubar.RadioItem>
          <Menubar.RadioItem value="Luis"> {"Luis"->React.string} </Menubar.RadioItem>
        </Menubar.RadioGroup>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Item dataInset=true> {"Edit..."->React.string} </Menubar.Item>
        </Menubar.Group>
        <Menubar.Separator> {React.null} </Menubar.Separator>
        <Menubar.Group>
          <Menubar.Item dataInset=true> {"Add Profile..."->React.string} </Menubar.Item>
        </Menubar.Group>
      </Menubar.Content>
    </Menubar.Menu>
  </Menubar>
