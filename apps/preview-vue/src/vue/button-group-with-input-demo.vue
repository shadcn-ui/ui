<script setup lang="ts">
import SearchIcon from "@material-symbols/svg-400/rounded/search.svg?component"
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import { Input } from '@/ui/input'
</script>

<template>
  <ButtonGroup>
    <Input placeholder="Search..." />
    <Button variant="outline" aria-label="Search">
      <SearchIcon />
    </Button>
  </ButtonGroup>
</template>
