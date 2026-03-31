<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import LabelDisabled from "@/examples/label/LabelDisabled.vue"
import LabelWithCheckbox from "@/examples/label/LabelWithCheckbox.vue"
import LabelWithInput from "@/examples/label/LabelWithInput.vue"
import LabelWithTextarea from "@/examples/label/LabelWithTextarea.vue"
</script>

<template>
  <ExampleWrapper>
    <LabelWithCheckbox />
    <LabelWithInput />
    <LabelDisabled />
    <LabelWithTextarea />
  </ExampleWrapper>
</template>
