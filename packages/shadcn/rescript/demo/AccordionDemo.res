@react.component
let make = () =>
  <Accordion defaultValue=["shipping"] className="max-w-lg">
    <Accordion.Item value="shipping">
      <Accordion.Trigger> {"What are your shipping options?"->React.string} </Accordion.Trigger>
      <Accordion.Content>
        {"We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international orders."->React.string}
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="returns">
      <Accordion.Trigger> {"What is your return policy?"->React.string} </Accordion.Trigger>
      <Accordion.Content>
        {"Returns accepted within 30 days. Items must be unused and in original packaging. Refunds processed within 5-7 business days."->React.string}
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="support">
      <Accordion.Trigger> {"How can I contact customer support?"->React.string} </Accordion.Trigger>
      <Accordion.Content>
        {"Reach us via email, live chat, or phone. We respond within 24 hours during business days."->React.string}
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
