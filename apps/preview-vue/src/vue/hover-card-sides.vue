<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/ui/hover-card'

const HOVER_CARD_SIDES = ['left', 'top', 'bottom', 'right'] as const
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2">
    <HoverCard
      v-for="side in HOVER_CARD_SIDES"
      :key="side"
      :open-delay="100"
      :close-delay="100"
    >
      <HoverCardTrigger as-child>
        <Button variant="outline" class="capitalize">
          {{ side }}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent :side="side">
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the {{ side }} side of the trigger.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
