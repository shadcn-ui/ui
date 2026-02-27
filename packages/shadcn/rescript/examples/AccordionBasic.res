type item = {
  value: string,
  trigger: string,
  content: string,
}

let items: array<item> = [
  {
    value: "item-1",
    trigger: "How do I reset my password?",
    content:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
  },
  {
    value: "item-2",
    trigger: "Can I change my subscription plan?",
    content:
      "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
  },
  {
    value: "item-3",
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
]

@react.component
let make = () =>
  <Accordion defaultValue=["item-1"] className="max-w-lg">
    {items
    ->Array.map(item =>
      <Accordion.Item key={item.value} value={item.value}>
        <Accordion.Trigger> {item.trigger->React.string} </Accordion.Trigger>
        <Accordion.Content> {item.content->React.string} </Accordion.Content>
      </Accordion.Item>
    )
    ->React.array}
  </Accordion>
