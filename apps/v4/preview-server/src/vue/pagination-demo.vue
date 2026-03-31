<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import PaginationBasic from "./PaginationBasic.vue"
import PaginationSimple from "./PaginationSimple.vue"
import PaginationWithSelect from "./PaginationWithSelect.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <PaginationBasic />
    </Example>
    <Example title="Simple">
      <PaginationSimple />
    </Example>
    <Example title="With Select">
      <PaginationWithSelect />
    </Example>
  </ExampleWrapper>
</template>
