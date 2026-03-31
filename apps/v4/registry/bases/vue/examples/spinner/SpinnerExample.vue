<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import SpinnerBasic from "@/examples/spinner/SpinnerBasic.vue"
import SpinnerInBadges from "@/examples/spinner/SpinnerInBadges.vue"
import SpinnerInButtons from "@/examples/spinner/SpinnerInButtons.vue"
import SpinnerInEmpty from "@/examples/spinner/SpinnerInEmpty.vue"
import SpinnerInInputGroup from "@/examples/spinner/SpinnerInInputGroup.vue"
</script>

<template>
  <ExampleWrapper>
    <SpinnerBasic />
    <SpinnerInButtons />
    <SpinnerInBadges />
    <SpinnerInInputGroup />
    <SpinnerInEmpty />
  </ExampleWrapper>
</template>
