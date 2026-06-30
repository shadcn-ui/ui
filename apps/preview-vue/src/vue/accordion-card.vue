<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card'

const items = [
  {
    value: 'plans',
    trigger: 'What subscription plans do you offer?',
    content:
      'We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.',
  },
  {
    value: 'billing',
    trigger: 'How does billing work?',
    content:
      'Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers for enterprise customers. You\'ll receive an invoice via email after each payment.',
  },
  {
    value: 'cancel',
    trigger: 'How do I cancel my subscription?',
    content:
      'You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties. Your access will continue until the end of your current billing period.',
  },
]
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Subscription &amp; Billing</CardTitle>
      <CardDescription>
        Common questions about your account, plans, payments and cancellations.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible default-value="plans">
        <AccordionItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
        >
          <AccordionTrigger>{{ item.trigger }}</AccordionTrigger>
          <AccordionContent>{{ item.content }}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
</template>
