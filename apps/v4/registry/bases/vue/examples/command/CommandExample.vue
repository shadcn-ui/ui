<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import CommandBasic from "@/examples/command/CommandBasic.vue"
import CommandManyItems from "@/examples/command/CommandManyItems.vue"
import CommandWithGroups from "@/examples/command/CommandWithGroups.vue"
import CommandWithShortcuts from "@/examples/command/CommandWithShortcuts.vue"
</script>

<template>
  <ExampleWrapper>
    <CommandBasic />
    <CommandWithShortcuts />
    <CommandWithGroups />
    <CommandManyItems />
  </ExampleWrapper>
</template>
