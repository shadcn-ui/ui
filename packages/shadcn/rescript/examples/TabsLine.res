@react.component
let make = () =>
  <Tabs defaultValue="overview">
    <Tabs.List variant=Tabs.Variant.Line>
      <Tabs.Trigger value="overview"> {"Overview"->React.string} </Tabs.Trigger>
      <Tabs.Trigger value="analytics"> {"Analytics"->React.string} </Tabs.Trigger>
      <Tabs.Trigger value="reports"> {"Reports"->React.string} </Tabs.Trigger>
    </Tabs.List>
  </Tabs>
