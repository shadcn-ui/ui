<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import LabelDisabled from "./LabelDisabled.vue"
import LabelWithCheckbox from "./LabelWithCheckbox.vue"
import LabelWithInput from "./LabelWithInput.vue"
import LabelWithTextarea from "./LabelWithTextarea.vue"
</script>

<template>
  <ExampleWrapper>
    <LabelWithCheckbox />
    <LabelWithInput />
    <LabelDisabled />
    <LabelWithTextarea />
  </ExampleWrapper>
</template>
