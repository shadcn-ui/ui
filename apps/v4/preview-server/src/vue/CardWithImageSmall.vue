<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Example } from "@/components"
</script>

<template>
  <Example title="With Image (Small)">
    <Card size="sm" class="relative mx-auto w-full max-w-sm pt-0">
      <div class="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
      <img
        src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Photo by mymind on Unsplash"
        title="Photo by mymind on Unsplash"
        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
      >
      <CardHeader>
        <CardTitle>Beautiful Landscape</CardTitle>
        <CardDescription>
          A stunning view that captures the essence of natural beauty.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" class="w-full">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="Add01Icon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            data-icon="inline-start"
          />
          Button
        </Button>
      </CardFooter>
    </Card>
  </Example>
</template>
