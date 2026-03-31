<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import AccordionBasic from "./AccordionBasic.vue"
import AccordionInCard from "./AccordionInCard.vue"
import AccordionMultiple from "./AccordionMultiple.vue"
import AccordionWithBorders from "./AccordionWithBorders.vue"
import AccordionWithDisabled from "./AccordionWithDisabled.vue"
</script>

<template>
  <ExampleWrapper class="w-full max-w-4xl lg:grid-cols-1 2xl:max-w-4xl 2xl:grid-cols-1">
    <AccordionBasic />
    <AccordionMultiple />
    <AccordionWithBorders />
    <AccordionInCard />
    <AccordionWithDisabled />
  </ExampleWrapper>
</template>
