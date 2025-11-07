import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/radix/ui/accordion"

export default function AccordionDemo() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-background w-full max-w-[1500px] rounded-xl p-8">
        <div className="flex w-full max-w-xl flex-col gap-12">
          <AccordionExample1 />
          <AccordionExample2 />
          <AccordionExample3 />
        </div>
      </div>
    </div>
  )
}

function AccordionExample1() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function AccordionExample2() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          What are the key considerations when implementing a comprehensive
          enterprise-level authentication system?
        </AccordionTrigger>
        <AccordionContent>
          Implementing a robust enterprise authentication system requires
          careful consideration of multiple factors. This includes secure
          password hashing and storage, multi-factor authentication (MFA)
          implementation, session management, OAuth2 and SSO integration,
          regular security audits, rate limiting to prevent brute force attacks,
          and maintaining detailed audit logs. Additionally, you&apos;ll need to
          consider scalability, performance impact, and compliance with relevant
          data protection regulations such as GDPR or HIPAA.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          How does modern distributed system architecture handle eventual
          consistency and data synchronization across multiple regions?
        </AccordionTrigger>
        <AccordionContent>
          Modern distributed systems employ various strategies to maintain data
          consistency across regions. This often involves using techniques like
          CRDT (Conflict-Free Replicated Data Types), vector clocks, and gossip
          protocols. Systems might implement event sourcing patterns, utilize
          message queues for asynchronous updates, and employ sophisticated
          conflict resolution strategies. Popular solutions like Amazon&apos;s
          DynamoDB and Google&apos;s Spanner demonstrate different approaches to
          solving these challenges, balancing between consistency, availability,
          and partition tolerance as described in the CAP theorem.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function AccordionExample3() {
  return (
    <Accordion type="single" collapsible className="flex flex-col gap-4">
      <AccordionItem value="billing" className="rounded-lg border last:border">
        <AccordionTrigger className="px-4 text-base font-medium">
          How does billing work?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground px-4">
          We offer monthly and annual subscription plans. Billing is charged at
          the beginning of each cycle, and you can cancel anytime. All plans
          include automatic backups, 24/7 support, and unlimited team members.
          There are no hidden fees or setup costs.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="security" className="rounded-lg border">
        <AccordionTrigger className="px-4 text-base font-medium">
          Is my data secure?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground px-4">
          Yes. We use end-to-end encryption, SOC 2 Type II compliance, and
          regular third-party security audits. All data is encrypted at rest and
          in transit using industry-standard protocols. We also offer optional
          two-factor authentication and single sign-on for enterprise customers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="integration" className="rounded-lg border!">
        <AccordionTrigger className="px-4 text-base font-medium">
          What integrations do you support?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground px-4">
          We integrate with 500+ popular tools including Slack, Zapier,
          Salesforce, HubSpot, and more. You can also build custom integrations
          using our REST API and webhooks. Our API documentation includes code
          examples in 10+ programming languages.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
