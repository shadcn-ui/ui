import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/examples/base/ui/accordion"

export function AccordionMultiple() {
  const items = [
    {
      value: "item-1",
      trigger:
        "What are the key considerations when implementing a comprehensive enterprise-level authentication system?",
      content:
        "Implementing a robust enterprise authentication system requires careful consideration of multiple factors. This includes secure password hashing and storage, multi-factor authentication (MFA) implementation, session management, OAuth2 and SSO integration, regular security audits, rate limiting to prevent brute force attacks, and maintaining detailed audit logs. Additionally, you'll need to consider scalability, performance impact, and compliance with relevant data protection regulations such as GDPR or HIPAA.",
    },
    {
      value: "item-2",
      trigger:
        "How does modern distributed system architecture handle eventual consistency and data synchronization across multiple regions?",
      content:
        "Modern distributed systems employ various strategies to maintain data consistency across regions. This often involves using techniques like CRDT (Conflict-Free Replicated Data Types), vector clocks, and gossip protocols. Systems might implement event sourcing patterns, utilize message queues for asynchronous updates, and employ sophisticated conflict resolution strategies. Popular solutions like Amazon's DynamoDB and Google's Spanner demonstrate different approaches to solving these challenges, balancing between consistency, availability, and partition tolerance as described in the CAP theorem.",
    },
  ]

  return (
    <Accordion multiple className="mx-auto max-w-lg">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
