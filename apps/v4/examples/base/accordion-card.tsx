import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/examples/base/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/examples/base/ui/card"

export default function AccordionCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
        <CardDescription>
          Common questions about your account, plans, and payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion defaultValue={["plans"]}>
          <AccordionItem value="plans">
            <AccordionTrigger>
              What subscription plans do you offer?
            </AccordionTrigger>
            <AccordionContent>
              We offer three subscription tiers: Starter ($9/month),
              Professional ($29/month), and Enterprise ($99/month). Each plan
              includes increasing storage limits, API access, priority support,
              and team collaboration features.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="billing">
            <AccordionTrigger>How does billing work?</AccordionTrigger>
            <AccordionContent>
              Billing occurs automatically at the start of each billing cycle.
              We accept all major credit cards, PayPal, and ACH transfers for
              enterprise customers. You&apos;ll receive an invoice via email
              after each payment.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cancel">
            <AccordionTrigger>
              How do I cancel my subscription?
            </AccordionTrigger>
            <AccordionContent>
              You can cancel your subscription anytime from your account
              settings. There are no cancellation fees or penalties. Your access
              will continue until the end of your current billing period.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
