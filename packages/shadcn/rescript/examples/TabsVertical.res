@react.component
let make = () =>
  <BaseUi.Tabs.Root
    defaultValue="account"
    orientation=BaseUi.Types.Orientation.Horizontal
    dataSlot="tabs"
    dataOrientation="vertical"
    className="group/tabs flex gap-2 data-horizontal:flex-col"
  >
    <Tabs.List>
      <Tabs.Trigger value="account"> {"Account"->React.string} </Tabs.Trigger>
      <Tabs.Trigger value="password"> {"Password"->React.string} </Tabs.Trigger>
      <Tabs.Trigger value="notifications"> {"Notifications"->React.string} </Tabs.Trigger>
    </Tabs.List>
  </BaseUi.Tabs.Root>
