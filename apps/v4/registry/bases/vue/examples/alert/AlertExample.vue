<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import AlertBasic from "./AlertBasic.vue"
import AlertDestructive from "./AlertDestructive.vue"
import AlertWithActions from "./AlertWithActions.vue"
import AlertWithIcons from "./AlertWithIcons.vue"
</script>

<template>
  <ExampleWrapper class="lg:grid-cols-1">
    <AlertBasic />
    <AlertWithIcons />
    <AlertDestructive />
    <AlertWithActions />
  </ExampleWrapper>
</template>
