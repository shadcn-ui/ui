<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import SpinnerBasic from "./SpinnerBasic.vue"
import SpinnerInBadges from "./SpinnerInBadges.vue"
import SpinnerInButtons from "./SpinnerInButtons.vue"
import SpinnerInEmpty from "./SpinnerInEmpty.vue"
import SpinnerInInputGroup from "./SpinnerInInputGroup.vue"
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
