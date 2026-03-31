<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import { Button } from '@/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/ui/button-group'
</script>

<template>
  <ButtonGroup>
    <Button variant="secondary">
      Button
    </Button>
    <ButtonGroupSeparator />
    <Button size="icon" variant="secondary">
      <PlusIcon />
    </Button>
  </ButtonGroup>
</template>
