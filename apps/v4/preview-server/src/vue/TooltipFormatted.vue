<script setup lang="ts">
import { Example } from "@/components"
import { Button } from "@/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/tooltip"
</script>

<template>
  <Example title="Formatted Content">
    <Tooltip>
      <TooltipTrigger :as-child="true">
        <Button variant="outline" class="w-fit">
          Status
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div class="flex flex-col gap-1">
          <p class="font-semibold">
            Active
          </p>
          <p class="text-xs opacity-80">
            Last updated 2 hours ago
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  </Example>
</template>
