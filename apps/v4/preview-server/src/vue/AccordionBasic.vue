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
    trigger: "Is it accessible?",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    value: "item-2",
    trigger: "Is it styled?",
    content:
        "Yes. It comes with default styles that matches the other components' aesthetic.",
  },
  {
    value: "item-3",
    trigger: "Is it animated?",
    content:
        "Yes. It's animated by default, but you can disable it if you prefer.",
  },
]
</script>

<template>
  <Example title="Basic">
    <Accordion type="single" collapsible class="mx-auto max-w-lg">
      <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
        <AccordionTrigger>{{ item.trigger }}</AccordionTrigger>
        <AccordionContent>{{ item.content }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </Example>
</template>
