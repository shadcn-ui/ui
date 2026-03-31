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
  <Example title="Disabled">
    <Tooltip>
      <TooltipTrigger :as-child="true">
        <span class="inline-block w-fit">
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This feature is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  </Example>
</template>
