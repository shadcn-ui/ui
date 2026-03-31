<script setup lang="ts">
import { AspectRatio } from "@/ui/aspect-ratio"
import { Example } from "@/components"
</script>

<template>
  <Example title="9:16" class="items-center justify-center">
    <AspectRatio :ratio="9 / 16" class="bg-muted rounded-lg">
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
      >
    </AspectRatio>
  </Example>
</template>
