<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import NumberFieldBasic from "./NumberFieldBasic.vue"
import NumberFieldDisabled from "./NumberFieldDisabled.vue"
import NumberFieldWithLabel from "./NumberFieldWithLabel.vue"
</script>

<template>
  <ExampleWrapper>
    <NumberFieldBasic />
    <NumberFieldWithLabel />
    <NumberFieldDisabled />
  </ExampleWrapper>
</template>
