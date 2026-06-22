<script setup lang="ts">
import ArrowLeftIcon from "@material-symbols/svg-400/rounded/arrow_left.svg?component"
import ArrowRightIcon from "@material-symbols/svg-400/rounded/arrow_right.svg?component"
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
</script>

<template>
  <ButtonGroup>
    <ButtonGroup>
      <Button variant="outline" size="sm">
        1
      </Button>
      <Button variant="outline" size="sm">
        2
      </Button>
      <Button variant="outline" size="sm">
        3
      </Button>
      <Button variant="outline" size="sm">
        4
      </Button>
      <Button variant="outline" size="sm">
        5
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline" size="icon-sm" aria-label="Previous">
        <ArrowLeftIcon />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Next">
        <ArrowRightIcon />
      </Button>
    </ButtonGroup>
  </ButtonGroup>
</template>
