@react.component
let make = () =>
  <Accordion className="w-full">
    <Accordion.Item value="item-1">
      <Accordion.Trigger> {"Can I access my account history?"->React.string} </Accordion.Trigger>
      <Accordion.Content>
        {"Yes, you can view your complete account history including all transactions, plan changes, and support tickets in the Account History section of your dashboard."->React.string}
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2" disabled={true}>
      <Accordion.Trigger> {"Premium feature information"->React.string} </Accordion.Trigger>
      <Accordion.Content>
        {"This section contains information about premium features. Upgrade your plan to access this content."->React.string}
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger> {"How do I update my email address?"->React.string} </Accordion.Trigger>
      <Accordion.Content>
        {"You can update your email address in your account settings. You'll receive a verification email at your new address to confirm the change."->React.string}
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
