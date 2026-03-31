<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import ToggleBasic from "@/examples/toggle/ToggleBasic.vue"
import ToggleDisabled from "@/examples/toggle/ToggleDisabled.vue"
import ToggleOutline from "@/examples/toggle/ToggleOutline.vue"
import ToggleSizes from "@/examples/toggle/ToggleSizes.vue"
import ToggleWithButtonIcon from "@/examples/toggle/ToggleWithButtonIcon.vue"
import ToggleWithButtonIconText from "@/examples/toggle/ToggleWithButtonIconText.vue"
import ToggleWithButtonText from "@/examples/toggle/ToggleWithButtonText.vue"
import ToggleWithIcon from "@/examples/toggle/ToggleWithIcon.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <ToggleBasic />
    </Example>
    <Example title="Outline">
      <ToggleOutline />
    </Example>
    <Example title="Sizes">
      <ToggleSizes />
    </Example>
    <Example title="With Button Text">
      <ToggleWithButtonText />
    </Example>
    <Example title="With Button Icon">
      <ToggleWithButtonIcon />
    </Example>
    <Example title="With Button Icon + Text">
      <ToggleWithButtonIconText />
    </Example>
    <Example title="Disabled">
      <ToggleDisabled />
    </Example>
    <Example title="With Icon">
      <ToggleWithIcon />
    </Example>
  </ExampleWrapper>
</template>
