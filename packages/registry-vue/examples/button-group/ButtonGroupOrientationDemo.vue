<script setup lang="ts">
import MinusIcon from "@material-symbols/svg-400/rounded/remove.svg?component"
import PlusIcon from "@material-symbols/svg-400/rounded/add.svg?component"
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
</script>

<template>
  <ButtonGroup
    orientation="vertical"
    aria-label="Media controls"
    class="h-fit"
  >
    <Button variant="outline" size="icon">
      <PlusIcon />
    </Button>
    <Button variant="outline" size="icon">
      <MinusIcon />
    </Button>
  </ButtonGroup>
</template>
