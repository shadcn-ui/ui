<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import CheckboxBasic from "./CheckboxBasic.vue"
import CheckboxDisabled from "./CheckboxDisabled.vue"
import CheckboxGroup from "./CheckboxGroup.vue"
import CheckboxInTable from "./CheckboxInTable.vue"
import CheckboxInvalid from "./CheckboxInvalid.vue"
import CheckboxWithDescription from "./CheckboxWithDescription.vue"
import CheckboxWithTitle from "./CheckboxWithTitle.vue"
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
