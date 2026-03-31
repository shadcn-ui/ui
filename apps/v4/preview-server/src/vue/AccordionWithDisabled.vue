<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion"
import { Example } from "@/components"

const items = [
  {
    value: "item-1",
    trigger: "Can I access my account history?",
    content:
      "Yes, you can view your complete account history including all transactions, plan changes, and support tickets in the Account History section of your dashboard.",
    disabled: false,
  },
  {
    value: "item-2",
    trigger: "Premium feature information",
    content:
      "This section contains information about premium features. Upgrade your plan to access this content.",
    disabled: true,
  },
  {
    value: "item-3",
    trigger: "How do I update my email address?",
    content:
      "You can update your email address in your account settings. You'll receive a verification email at your new address to confirm the change.",
    disabled: false,
  },
]
</script>

<template>
  <Example title="With Disabled">
    <Accordion
      type="single"
      collapsible
      class="style-lyra:rounded-none style-vega:rounded-lg style-nova:rounded-lg style-maia:rounded-lg style-mira:rounded-lg mx-auto max-w-lg overflow-hidden border"
    >
      <AccordionItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled"
        class="data-open:bg-muted/50 p-1"
      >
        <AccordionTrigger class="style-nova:px-2.5 style-lyra:px-2 style-vega:px-4">
          {{ item.trigger }}
        </AccordionTrigger>
        <AccordionContent class="style-nova:px-2.5 style-lyra:px-2 style-vega:px-4">
          {{ item.content }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Example>
</template>
