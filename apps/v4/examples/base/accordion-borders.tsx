import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/examples/base/ui/accordion"

export default function AccordionBorders() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem
        value="billing"
        className="border px-4 first:rounded-t-lg last:rounded-b-lg"
      >
        <AccordionTrigger>How does billing work?</AccordionTrigger>
        <AccordionContent>
          We offer monthly and annual subscription plans. Billing is charged at
          the beginning of each cycle, and you can cancel anytime. All plans
          include automatic backups, 24/7 support, and unlimited team members.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="security"
        className="border-x border-b px-4 last:rounded-b-lg"
      >
        <AccordionTrigger>Is my data secure?</AccordionTrigger>
        <AccordionContent>
          Yes. We use end-to-end encryption, SOC 2 Type II compliance, and
          regular third-party security audits. All data is encrypted at rest and
          in transit using industry-standard protocols.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="integration"
        className="border-x border-b px-4 last:rounded-b-lg"
      >
        <AccordionTrigger>What integrations do you support?</AccordionTrigger>
        <AccordionContent>
          We integrate with 500+ popular tools including Slack, Zapier,
          Salesforce, HubSpot, and more. You can also build custom integrations
          using our REST API and webhooks.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
