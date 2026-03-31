<script setup lang="ts">
import { Button } from '@/ui/button'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <Button size="sm" variant="outline" disabled>
    <Spinner class="animate-spin" />
    Submit
  </Button>
</template>
