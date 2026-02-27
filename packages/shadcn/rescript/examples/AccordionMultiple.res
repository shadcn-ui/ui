type item = {
  value: string,
  trigger: string,
  content: string,
}

let items: array<item> = [
  {
    value: "notifications",
    trigger: "Notification Settings",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "Privacy & Security",
    content:
      "Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
  },
  {
    value: "billing",
    trigger: "Billing & Subscription",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
]

@react.component
let make = () =>
  <Accordion multiple={true} className="max-w-lg" defaultValue=["notifications"]>
    {items
    ->Array.map(item =>
      <Accordion.Item key={item.value} value={item.value}>
        <Accordion.Trigger> {item.trigger->React.string} </Accordion.Trigger>
        <Accordion.Content> {item.content->React.string} </Accordion.Content>
      </Accordion.Item>
    )
    ->React.array}
  </Accordion>
