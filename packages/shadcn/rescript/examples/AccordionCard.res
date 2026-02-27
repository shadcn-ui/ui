type item = {
  value: string,
  trigger: string,
  content: string,
}

let items: array<item> = [
  {
    value: "plans",
    trigger: "What subscription plans do you offer?",
    content:
      "We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.",
  },
  {
    value: "billing",
    trigger: "How does billing work?",
    content:
      "Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers for enterprise customers. You'll receive an invoice via email after each payment.",
  },
  {
    value: "cancel",
    trigger: "How do I cancel my subscription?",
    content:
      "You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties. Your access will continue until the end of your current billing period.",
  },
]

@react.component
let make = () =>
  <Card className="w-full max-w-sm">
    <Card.Header>
      <Card.Title> {"Subscription & Billing"->React.string} </Card.Title>
      <Card.Description>
        {"Common questions about your account, plans, payments and cancellations."->React.string}
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <Accordion defaultValue=["plans"]>
        {items
        ->Array.map(item =>
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Trigger> {item.trigger->React.string} </Accordion.Trigger>
            <Accordion.Content> {item.content->React.string} </Accordion.Content>
          </Accordion.Item>
        )
        ->React.array}
      </Accordion>
    </Card.Content>
  </Card>
