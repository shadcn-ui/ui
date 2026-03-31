<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import CommandBasic from "./CommandBasic.vue"
import CommandManyItems from "./CommandManyItems.vue"
import CommandWithGroups from "./CommandWithGroups.vue"
import CommandWithShortcuts from "./CommandWithShortcuts.vue"
</script>

<template>
  <ExampleWrapper>
    <CommandBasic />
    <CommandWithShortcuts />
    <CommandWithGroups />
    <CommandManyItems />
  </ExampleWrapper>
</template>
