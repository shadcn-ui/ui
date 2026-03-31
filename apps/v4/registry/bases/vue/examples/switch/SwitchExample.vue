<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import SwitchBasic from "@/examples/switch/SwitchBasic.vue"
import SwitchDisabled from "@/examples/switch/SwitchDisabled.vue"
import SwitchSizes from "@/examples/switch/SwitchSizes.vue"
import SwitchWithDescription from "@/examples/switch/SwitchWithDescription.vue"
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
