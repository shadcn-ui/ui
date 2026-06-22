<script setup lang="ts">
import ArrowUpIcon from "@material-symbols/svg-400/rounded/arrow_upward.svg?component"
import { Button } from '@/ui/button'
</script>

<template>
  <div class="flex flex-col gap-8">
    <Button variant="outline" size="icon" class="rounded-full">
      <ArrowUpIcon />
    </Button>
  </div>
</template>
