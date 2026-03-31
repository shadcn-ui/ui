<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import PaginationBasic from "@/examples/pagination/PaginationBasic.vue"
import PaginationSimple from "@/examples/pagination/PaginationSimple.vue"
import PaginationWithSelect from "@/examples/pagination/PaginationWithSelect.vue"
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
