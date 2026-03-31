<script setup lang="ts">
import { Button } from '@/ui/button'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <Button disabled>
    <Spinner />
    Processing Payment
  </Button>
</template>
