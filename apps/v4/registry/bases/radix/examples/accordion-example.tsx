import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/radix/ui/accordion"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import Frame from "@/app/(design)/design/components/frame"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function AccordionDemo() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <AccordionBasic />
        <AccordionMultiple />
        <AccordionWithBorders />
        <AccordionInCard />
        <AccordionWithDisabled />
      </div>
    </div>
  )
}

function AccordionBasic() {
  return (
    <Frame title="Basic">
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
    </Frame>
  )
}

function AccordionMultiple() {
  return (
    <Frame title="Multiple">
      <Accordion type="multiple">
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
            regular security audits, rate limiting to prevent brute force
            attacks, and maintaining detailed audit logs. Additionally,
            you&apos;ll need to consider scalability, performance impact, and
            compliance with relevant data protection regulations such as GDPR or
            HIPAA.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            How does modern distributed system architecture handle eventual
            consistency and data synchronization across multiple regions?
          </AccordionTrigger>
          <AccordionContent>
            Modern distributed systems employ various strategies to maintain
            data consistency across regions. This often involves using
            techniques like CRDT (Conflict-Free Replicated Data Types), vector
            clocks, and gossip protocols. Systems might implement event sourcing
            patterns, utilize message queues for asynchronous updates, and
            employ sophisticated conflict resolution strategies. Popular
            solutions like Amazon&apos;s DynamoDB and Google&apos;s Spanner
            demonstrate different approaches to solving these challenges,
            balancing between consistency, availability, and partition tolerance
            as described in the CAP theorem.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Frame>
  )
}

function AccordionWithBorders() {
  return (
    <Frame title="With Borders">
      <Accordion type="single" collapsible className="gap-4">
        <AccordionItem value="billing" className="rounded-lg border">
          <AccordionTrigger className="px-4 text-base font-medium">
            How does billing work?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-4">
            We offer monthly and annual subscription plans. Billing is charged
            at the beginning of each cycle, and you can cancel anytime. All
            plans include automatic backups, 24/7 support, and unlimited team
            members. There are no hidden fees or setup costs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="security" className="rounded-lg border">
          <AccordionTrigger className="px-4 text-base font-medium">
            Is my data secure?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-4">
            Yes. We use end-to-end encryption, SOC 2 Type II compliance, and
            regular third-party security audits. All data is encrypted at rest
            and in transit using industry-standard protocols. We also offer
            optional two-factor authentication and single sign-on for enterprise
            customers.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="integration" className="rounded-lg border!">
          <AccordionTrigger className="px-4 text-base font-medium">
            What integrations do you support?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-4">
            <p>
              We integrate with 500+ popular tools including Slack, Zapier,
              Salesforce, HubSpot, and more. You can also build custom
              integrations using our REST API and webhooks.{" "}
            </p>
            <p>
              Our API documentation includes code examples in 10+ programming
              languages.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Frame>
  )
}

function AccordionInCard() {
  return (
    <Frame title="In Card">
      <Card className="gap-4">
        <CardHeader>
          <CardTitle>Subscription & Billing</CardTitle>
          <CardDescription>
            Common questions about your account, plans, and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="plans">
            <AccordionItem value="plans">
              <AccordionTrigger>
                What subscription plans do you offer?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  We offer three subscription tiers: Starter ($9/month),
                  Professional ($29/month), and Enterprise ($99/month). Each
                  plan includes increasing storage limits, API access, priority
                  support, and team collaboration features.
                </p>
                <p>
                  <a href="#">Annual billing is available</a> with a 20%
                  discount. All plans include a 14-day free trial with no credit
                  card required.
                </p>
                <Button size="sm">
                  View plans
                  <IconPlaceholder
                    lucide="ArrowUpRightIcon"
                    tabler="IconArrowUpRight"
                    hugeicons="ArrowUpRight01Icon"
                  />
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing">
              <AccordionTrigger>How does billing work?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Billing occurs automatically at the start of each billing
                  cycle. We accept all major credit cards, PayPal, and ACH
                  transfers for enterprise customers.
                </p>
                <p>
                  You&apos;ll receive an invoice via email after each payment.
                  You can update your payment method or billing information
                  anytime in your account settings. Failed payments will trigger
                  automated retry attempts and email notifications.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="upgrade">
              <AccordionTrigger>
                Can I upgrade or downgrade my plan?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Yes, you can change your plan at any time. When upgrading,
                  you&apos;ll be charged a prorated amount for the remainder of
                  your billing cycle and immediately gain access to new
                  features.
                </p>
                <p>
                  When downgrading, the change takes effect at the end of your
                  current billing period, and you&apos;ll retain access to
                  premium features until then. No refunds are provided for
                  downgrades.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancel">
              <AccordionTrigger>
                How do I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  You can cancel your subscription anytime from your account
                  settings. There are no cancellation fees or penalties. Your
                  access will continue until the end of your current billing
                  period.
                </p>
                <p>
                  After cancellation, your data is retained for 30 days in case
                  you want to reactivate. You can export all your data before or
                  after canceling. We&apos;d love to hear your feedback about
                  why you&apos;re leaving.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refund">
              <AccordionTrigger>What is your refund policy?</AccordionTrigger>
              <AccordionContent>
                <p>
                  We offer a 30-day money-back guarantee for new subscriptions.
                  If you&apos;re not satisfied within the first 30 days, contact
                  our support team for a full refund.
                </p>
                <p>
                  After 30 days, we don&apos;t provide refunds for partial
                  billing periods, but you can cancel anytime to avoid future
                  charges. Enterprise customers have custom refund terms
                  outlined in their contracts.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </Frame>
  )
}

function AccordionWithDisabled() {
  return (
    <Frame title="With Disabled">
      <Accordion
        type="single"
        collapsible
        className="overflow-hidden rounded-lg border"
      >
        <AccordionItem
          value="item-1"
          className="data-[state=open]:bg-muted/50 p-1"
        >
          <AccordionTrigger className="px-4">
            Can I access my account history?
          </AccordionTrigger>
          <AccordionContent className="px-4">
            Yes, you can view your complete account history including all
            transactions, plan changes, and support tickets in the Account
            History section of your dashboard.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          disabled
          className="data-[state=open]:bg-muted/50"
        >
          <AccordionTrigger className="px-4">
            Premium feature information
          </AccordionTrigger>
          <AccordionContent className="px-4">
            This section contains information about premium features. Upgrade
            your plan to access this content.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="data-[state=open]:bg-muted/50">
          <AccordionTrigger className="px-4">
            How do I update my email address?
          </AccordionTrigger>
          <AccordionContent className="px-4">
            You can update your email address in your account settings.
            You&apos;ll receive a verification email at your new address to
            confirm the change.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Frame>
  )
}
