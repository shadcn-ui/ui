<script setup lang="ts">
import { Example } from "@/components/example"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/tooltip"
</script>

<template>
  <Example title="On Link">
    <Tooltip>
      <TooltipTrigger :as-child="true">
        <a
          href="#"
          class="w-fit text-sm text-primary underline-offset-4 hover:underline"
          @click.prevent
        >
          Learn more
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click to read the documentation</p>
      </TooltipContent>
    </Tooltip>
  </Example>
</template>
