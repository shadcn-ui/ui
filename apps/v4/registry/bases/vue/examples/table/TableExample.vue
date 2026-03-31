<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import TableBasic from "@/examples/table/TableBasic.vue"
import TableSimple from "@/examples/table/TableSimple.vue"
import TableWithActions from "@/examples/table/TableWithActions.vue"
import TableWithBadges from "@/examples/table/TableWithBadges.vue"
import TableWithFooter from "@/examples/table/TableWithFooter.vue"
import TableWithInput from "@/examples/table/TableWithInput.vue"
import TableWithSelect from "@/examples/table/TableWithSelect.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <TableBasic />
    </Example>
    <Example title="With Footer">
      <TableWithFooter />
    </Example>
    <Example title="Simple">
      <TableSimple />
    </Example>
    <Example title="With Badges">
      <TableWithBadges />
    </Example>
    <Example title="With Actions">
      <TableWithActions />
    </Example>
    <Example title="With Select">
      <TableWithSelect />
    </Example>
    <Example title="With Input">
      <TableWithInput />
    </Example>
  </ExampleWrapper>
</template>
