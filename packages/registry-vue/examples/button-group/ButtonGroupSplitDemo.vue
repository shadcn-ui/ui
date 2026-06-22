<script setup lang="ts">
import PlusIcon from "@material-symbols/svg-400/rounded/add.svg?component"
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
