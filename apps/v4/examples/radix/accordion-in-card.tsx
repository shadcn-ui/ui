import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/examples/radix/ui/accordion"
import { Button } from "@/examples/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/examples/radix/ui/card"
import { ArrowUpRightIcon } from "lucide-react"

export function AccordionInCard() {
  const items = [
    {
      value: "plans",
      trigger: "What subscription plans do you offer?",
      content: (
        <>
          <p>
            We offer three subscription tiers: Starter ($9/month), Professional
            ($29/month), and Enterprise ($99/month). Each plan includes
            increasing storage limits, API access, priority support, and team
            collaboration features.
          </p>
          <p>
            <a href="#">Annual billing is available</a> with a 20% discount. All
            plans include a 14-day free trial with no credit card required.
          </p>
          <Button size="sm">
            View plans
            <ArrowUpRightIcon />
          </Button>
        </>
      ),
    },
    {
      value: "billing",
      trigger: "How does billing work?",
      content: (
        <>
          <p>
            Billing occurs automatically at the start of each billing cycle. We
            accept all major credit cards, PayPal, and ACH transfers for
            enterprise customers.
          </p>
          <p>
            You&apos;ll receive an invoice via email after each payment. You can
            update your payment method or billing information anytime in your
            account settings. Failed payments will trigger automated retry
            attempts and email notifications.
          </p>
        </>
      ),
    },
    {
      value: "upgrade",
      trigger: "Can I upgrade or downgrade my plan?",
      content: (
        <>
          <p>
            Yes, you can change your plan at any time. When upgrading,
            you&apos;ll be charged a prorated amount for the remainder of your
            billing cycle and immediately gain access to new features.
          </p>
          <p>
            When downgrading, the change takes effect at the end of your current
            billing period, and you&apos;ll retain access to premium features
            until then. No refunds are provided for downgrades.
          </p>
        </>
      ),
    },
    {
      value: "cancel",
      trigger: "How do I cancel my subscription?",
      content: (
        <>
          <p>
            You can cancel your subscription anytime from your account settings.
            There are no cancellation fees or penalties. Your access will
            continue until the end of your current billing period.
          </p>
          <p>
            After cancellation, your data is retained for 30 days in case you
            want to reactivate. You can export all your data before or after
            canceling. We&apos;d love to hear your feedback about why
            you&apos;re leaving.
          </p>
        </>
      ),
    },
    {
      value: "refund",
      trigger: "What is your refund policy?",
      content: (
        <>
          <p>
            We offer a 30-day money-back guarantee for new subscriptions. If
            you&apos;re not satisfied within the first 30 days, contact our
            support team for a full refund.
          </p>
          <p>
            After 30 days, we don&apos;t provide refunds for partial billing
            periods, but you can cancel anytime to avoid future charges.
            Enterprise customers have custom refund terms outlined in their
            contracts.
          </p>
        </>
      ),
    },
  ]

  return (
    <Card className="mx-auto w-full max-w-lg gap-4">
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
        <CardDescription>
          Common questions about your account, plans, and payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          defaultValue="plans"
          className="style-maia:rounded-md style-mira:rounded-md"
        >
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
