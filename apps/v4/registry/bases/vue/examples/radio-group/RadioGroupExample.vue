<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import RadioGroupBasic from "@/examples/radio-group/RadioGroupBasic.vue"
import RadioGroupDisabled from "@/examples/radio-group/RadioGroupDisabled.vue"
import RadioGroupGrid from "@/examples/radio-group/RadioGroupGrid.vue"
import RadioGroupInvalid from "@/examples/radio-group/RadioGroupInvalid.vue"
import RadioGroupWithDescriptions from "@/examples/radio-group/RadioGroupWithDescriptions.vue"
import RadioGroupWithFieldSet from "@/examples/radio-group/RadioGroupWithFieldSet.vue"
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
