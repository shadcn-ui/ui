<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import CheckboxBasic from "@/examples/checkbox/CheckboxBasic.vue"
import CheckboxDisabled from "@/examples/checkbox/CheckboxDisabled.vue"
import CheckboxGroup from "@/examples/checkbox/CheckboxGroup.vue"
import CheckboxInTable from "@/examples/checkbox/CheckboxInTable.vue"
import CheckboxInvalid from "@/examples/checkbox/CheckboxInvalid.vue"
import CheckboxWithDescription from "@/examples/checkbox/CheckboxWithDescription.vue"
import CheckboxWithTitle from "@/examples/checkbox/CheckboxWithTitle.vue"
</script>

<template>
  <ExampleWrapper>
    <CheckboxBasic />
    <CheckboxWithDescription />
    <CheckboxInvalid />
    <CheckboxDisabled />
    <CheckboxWithTitle />
    <CheckboxInTable />
    <CheckboxGroup />
  </ExampleWrapper>
</template>
