<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import ToggleBasic from "./ToggleBasic.vue"
import ToggleDisabled from "./ToggleDisabled.vue"
import ToggleOutline from "./ToggleOutline.vue"
import ToggleSizes from "./ToggleSizes.vue"
import ToggleWithButtonIcon from "./ToggleWithButtonIcon.vue"
import ToggleWithButtonIconText from "./ToggleWithButtonIconText.vue"
import ToggleWithButtonText from "./ToggleWithButtonText.vue"
import ToggleWithIcon from "./ToggleWithIcon.vue"
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
