@react.component
let make = () =>
  <Tabs defaultValue="overview" className="w-[400px]">
    <Tabs.List>
      <Tabs.Trigger value="overview"> {"Overview"->React.string} </Tabs.Trigger>
      <Tabs.Trigger value="analytics"> {"Analytics"->React.string} </Tabs.Trigger>
      <Tabs.Trigger value="reports"> {"Reports"->React.string} </Tabs.Trigger>
      <Tabs.Trigger value="settings"> {"Settings"->React.string} </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">
      <Card>
        <Card.Header>
          <Card.Title> {"Overview"->React.string} </Card.Title>
          <Card.Description>
            {"View your key metrics and recent project activity. Track progress across all your active projects."->React.string}
          </Card.Description>
        </Card.Header>
        <Card.Content className="text-muted-foreground text-sm">
          {"You have 12 active projects and 3 pending tasks."->React.string}
        </Card.Content>
      </Card>
    </Tabs.Content>
    <Tabs.Content value="analytics">
      <Card>
        <Card.Header>
          <Card.Title> {"Analytics"->React.string} </Card.Title>
          <Card.Description>
            {"Track performance and user engagement metrics. Monitor trends and identify growth opportunities."->React.string}
          </Card.Description>
        </Card.Header>
        <Card.Content className="text-muted-foreground text-sm">
          {"Page views are up 25% compared to last month."->React.string}
        </Card.Content>
      </Card>
    </Tabs.Content>
    <Tabs.Content value="reports">
      <Card>
        <Card.Header>
          <Card.Title> {"Reports"->React.string} </Card.Title>
          <Card.Description>
            {"Generate and download your detailed reports. Export data in multiple formats for analysis."->React.string}
          </Card.Description>
        </Card.Header>
        <Card.Content className="text-muted-foreground text-sm">
          {"You have 5 reports ready and available to export."->React.string}
        </Card.Content>
      </Card>
    </Tabs.Content>
    <Tabs.Content value="settings">
      <Card>
        <Card.Header>
          <Card.Title> {"Settings"->React.string} </Card.Title>
          <Card.Description>
            {"Manage your account preferences and options. Customize your experience to fit your needs."->React.string}
          </Card.Description>
        </Card.Header>
        <Card.Content className="text-muted-foreground text-sm">
          {"Configure notifications, security, and themes."->React.string}
        </Card.Content>
      </Card>
    </Tabs.Content>
  </Tabs>
