<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip'

const sides = ['left', 'top', 'bottom', 'right'] as const
</script>

<template>
  <TooltipProvider>
    <div class="flex flex-wrap gap-2">
      <Tooltip v-for="side in sides" :key="side">
        <TooltipTrigger as-child>
          <Button variant="outline" class="w-fit capitalize">
            {{ side }}
          </Button>
        </TooltipTrigger>
        <TooltipContent :side="side">
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>
