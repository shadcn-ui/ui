<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/ui/hover-card'

const physicalSides = ['left', 'top', 'bottom', 'right'] as const

const labels: Record<string, string> = {
  left: 'يسار',
  top: 'أعلى',
  bottom: 'أسفل',
  right: 'يمين',
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2">
    <HoverCard
      v-for="side in physicalSides"
      :key="side"
      :open-delay="10"
      :close-delay="100"
    >
      <HoverCardTrigger as-child>
        <Button variant="outline">
          {{ labels[side] }}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        :side="side"
        class="flex w-64 flex-col gap-1"
        dir="rtl"
      >
        <div class="font-semibold">سماعات لاسلكية</div>
        <div class="text-sm text-muted-foreground">٩٩.٩٩ $</div>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
