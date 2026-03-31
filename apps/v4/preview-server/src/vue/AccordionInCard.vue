<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion"
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Example } from "@/components"

const items = [
  {
    value: "plans",
    trigger: "What subscription plans do you offer?",
  },
  {
    value: "billing",
    trigger: "How does billing work?",
  },
  {
    value: "upgrade",
    trigger: "Can I upgrade or downgrade my plan?",
  },
  {
    value: "cancel",
    trigger: "How do I cancel my subscription?",
  },
  {
    value: "refund",
    trigger: "What is your refund policy?",
  },
]
</script>

<template>
  <Example title="In Card">
    <Card class="mx-auto w-full max-w-lg gap-4">
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
          default-value="plans"
          class="style-maia:rounded-md style-mira:rounded-md"
        >
          <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
            <AccordionTrigger>{{ item.trigger }}</AccordionTrigger>
            <AccordionContent>
              <template v-if="item.value === 'plans'">
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
                </Button>
              </template>
              <template v-else-if="item.value === 'billing'">
                <p>
                  Billing occurs automatically at the start of each billing cycle. We
                  accept all major credit cards, PayPal, and ACH transfers for
                  enterprise customers.
                </p>
                <p>
                  You'll receive an invoice via email after each payment. You can
                  update your payment method or billing information anytime in your
                  account settings. Failed payments will trigger automated retry
                  attempts and email notifications.
                </p>
              </template>
              <template v-else-if="item.value === 'upgrade'">
                <p>
                  Yes, you can change your plan at any time. When upgrading,
                  you'll be charged a prorated amount for the remainder of your
                  billing cycle and immediately gain access to new features.
                </p>
                <p>
                  When downgrading, the change takes effect at the end of your current
                  billing period, and you'll retain access to premium features
                  until then. No refunds are provided for downgrades.
                </p>
              </template>
              <template v-else-if="item.value === 'cancel'">
                <p>
                  You can cancel your subscription anytime from your account settings.
                  There are no cancellation fees or penalties. Your access will
                  continue until the end of your current billing period.
                </p>
                <p>
                  After cancellation, your data is retained for 30 days in case you
                  want to reactivate. You can export all your data before or after
                  canceling. We'd love to hear your feedback about why
                  you're leaving.
                </p>
              </template>
              <template v-else-if="item.value === 'refund'">
                <p>
                  We offer a 30-day money-back guarantee for new subscriptions. If
                  you're not satisfied within the first 30 days, contact our
                  support team for a full refund.
                </p>
                <p>
                  After 30 days, we don't provide refunds for partial billing
                  periods, but you can cancel anytime to avoid future charges.
                  Enterprise customers have custom refund terms outlined in their
                  contracts.
                </p>
              </template>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </Example>
</template>
