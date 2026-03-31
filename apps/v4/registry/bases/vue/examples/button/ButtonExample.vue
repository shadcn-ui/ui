<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import ButtonExamples from "./ButtonExamples.vue"
import ButtonIconLeft from "./ButtonIconLeft.vue"
import ButtonIconOnly from "./ButtonIconOnly.vue"
import ButtonIconRight from "./ButtonIconRight.vue"
import ButtonInvalidStates from "./ButtonInvalidStates.vue"
import ButtonVariantsAndSizes from "./ButtonVariantsAndSizes.vue"
</script>

<template>
  <ExampleWrapper class="lg:grid-cols-1 2xl:grid-cols-1">
    <ButtonVariantsAndSizes />
    <ButtonIconRight />
    <ButtonIconLeft />
    <ButtonIconOnly />
    <ButtonInvalidStates />
    <ButtonExamples />
  </ExampleWrapper>
</template>
