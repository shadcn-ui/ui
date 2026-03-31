<script setup lang="ts">
import { Badge } from "@/ui/badge"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Long Text">
    <div class="flex flex-wrap gap-2">
      <Badge variant="secondary">
        A badge with a lot of text to see how it wraps
      </Badge>
    </div>
  </Example>
</template>
