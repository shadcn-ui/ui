<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import TableBasic from "./TableBasic.vue"
import TableSimple from "./TableSimple.vue"
import TableWithActions from "./TableWithActions.vue"
import TableWithBadges from "./TableWithBadges.vue"
import TableWithFooter from "./TableWithFooter.vue"
import TableWithInput from "./TableWithInput.vue"
import TableWithSelect from "./TableWithSelect.vue"
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
