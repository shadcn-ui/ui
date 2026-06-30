<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip'

const sides = ['left', 'top', 'bottom', 'right'] as const

const labels: Record<typeof sides[number], string> = {
  left: 'يسار',
  top: 'أعلى',
  bottom: 'أسفل',
  right: 'يمين',
}
</script>

<template>
  <TooltipProvider>
    <div class="flex flex-wrap gap-2" dir="rtl">
      <Tooltip v-for="side in sides" :key="side">
        <TooltipTrigger as-child>
          <Button variant="outline" class="w-fit capitalize">
            {{ labels[side] }}
          </Button>
        </TooltipTrigger>
        <TooltipContent :side="side">
          إضافة إلى المكتبة
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>
