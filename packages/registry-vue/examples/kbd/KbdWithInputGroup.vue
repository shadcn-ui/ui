<script setup lang="ts">
import SearchIcon from "@material-symbols/svg-400/rounded/search.svg?component"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ui/input-group'
import { Kbd } from '@/ui/kbd'
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-6">
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
