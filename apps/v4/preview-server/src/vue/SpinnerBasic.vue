<script setup lang="ts">
import { Example } from "@/components"
import { Spinner } from "@/ui/spinner"
</script>

<template>
  <Example title="Basic">
    <div class="flex items-center gap-6">
      <Spinner />
      <Spinner class="size-6" />
    </div>
  </Example>
</template>
