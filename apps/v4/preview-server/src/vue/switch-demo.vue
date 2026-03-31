<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import SwitchBasic from "./SwitchBasic.vue"
import SwitchDisabled from "./SwitchDisabled.vue"
import SwitchSizes from "./SwitchSizes.vue"
import SwitchWithDescription from "./SwitchWithDescription.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <SwitchBasic />
    </Example>
    <Example title="With Description">
      <SwitchWithDescription />
    </Example>
    <Example title="Disabled">
      <SwitchDisabled />
    </Example>
    <Example title="Sizes">
      <SwitchSizes />
    </Example>
  </ExampleWrapper>
</template>
