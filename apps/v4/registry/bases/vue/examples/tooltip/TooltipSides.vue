<script setup lang="ts">
import { Example } from "@/components/example"
import { Button } from "@/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/tooltip"

const sides = ["top", "right", "bottom", "left"] as const
</script>

<template>
  <Example title="Sides">
    <div class="flex flex-wrap gap-2">
      <Tooltip
        v-for="side in sides"
        :key="side"
      >
        <TooltipTrigger :as-child="true">
          <Button variant="outline" class="w-fit capitalize">
            {{ side }}
          </Button>
        </TooltipTrigger>
        <TooltipContent :side="side">
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </Example>
</template>
