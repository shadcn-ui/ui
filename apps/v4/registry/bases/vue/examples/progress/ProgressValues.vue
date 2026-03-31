<script setup lang="ts">
import { Example } from "@/components/example"
import { Progress } from "@/ui/progress"
</script>

<template>
  <Example title="Progress Bar">
    <div class="flex w-full flex-col gap-4">
      <Progress :value="0" />
      <Progress :value="25" class="w-full" />
      <Progress :value="50" />
      <Progress :value="75" />
      <Progress :value="100" />
    </div>
  </Example>
</template>
