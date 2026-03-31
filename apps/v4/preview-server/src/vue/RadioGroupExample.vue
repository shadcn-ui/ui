<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import RadioGroupBasic from "./RadioGroupBasic.vue"
import RadioGroupDisabled from "./RadioGroupDisabled.vue"
import RadioGroupGrid from "./RadioGroupGrid.vue"
import RadioGroupInvalid from "./RadioGroupInvalid.vue"
import RadioGroupWithDescriptions from "./RadioGroupWithDescriptions.vue"
import RadioGroupWithFieldSet from "./RadioGroupWithFieldSet.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <RadioGroupBasic />
    </Example>
    <Example title="With Descriptions">
      <RadioGroupWithDescriptions />
    </Example>
    <Example title="With FieldSet">
      <RadioGroupWithFieldSet />
    </Example>
    <Example title="Grid Layout">
      <RadioGroupGrid />
    </Example>
    <Example title="Disabled">
      <RadioGroupDisabled />
    </Example>
    <Example title="Invalid">
      <RadioGroupInvalid />
    </Example>
  </ExampleWrapper>
</template>
