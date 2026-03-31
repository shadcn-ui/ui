<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import PinInputBasic from "./PinInputBasic.vue"
import PinInputMasked from "./PinInputMasked.vue"
import PinInputWithSeparator from "./PinInputWithSeparator.vue"
</script>

<template>
  <ExampleWrapper>
    <PinInputBasic />
    <PinInputWithSeparator />
    <PinInputMasked />
  </ExampleWrapper>
</template>
