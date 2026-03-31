<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion"
import { Example } from "@/components/example"

const items = [
  {
    value: "billing",
    trigger: "How does billing work?",
    content:
      "We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members. There are no hidden fees or setup costs.",
  },
  {
    value: "security",
    trigger: "Is my data secure?",
    content:
      "Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All data is encrypted at rest and in transit using industry-standard protocols. We also offer optional two-factor authentication and single sign-on for enterprise customers.",
  },
  {
    value: "integration",
    trigger: "What integrations do you support?",
  },
]
</script>

<template>
  <Example title="With Borders">
    <Accordion
      type="single"
      collapsible
      class="style-lyra:gap-2 style-vega:gap-2 style-nova:gap-2 mx-auto max-w-lg"
    >
      <AccordionItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        class="style-vega:border style-nova:border style-lyra:border style-vega:rounded-lg style-nova:rounded-lg"
      >
        <AccordionTrigger class="style-nova:px-2.5 style-nova:text-sm style-vega:text-sm style-maia:text-sm style-mira:text-xs style-lyra:px-2 style-lyra:text-xs style-vega:px-4 font-medium">
          {{ item.trigger }}
        </AccordionTrigger>
        <AccordionContent class="text-muted-foreground style-nova:px-2.5 style-nova:text-sm style-lyra:px-2 style-lyra:text-xs style-vega:px-4 style-maia:px-0 style-mira:px-0">
          <template v-if="item.value === 'integration'">
            <p>
              We integrate with 500+ popular tools including Slack, Zapier,
              Salesforce, HubSpot, and more. You can also build custom
              integrations using our REST API and webhooks.
            </p>
            <p>
              Our API documentation includes code examples in 10+ programming
              languages.
            </p>
          </template>
          <template v-else>
            {{ item.content }}
          </template>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Example>
</template>
