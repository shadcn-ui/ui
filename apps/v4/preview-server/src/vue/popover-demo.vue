<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import PopoverAlignments from "./PopoverAlignments.vue"
import PopoverBasic from "./PopoverBasic.vue"
import PopoverInDialog from "./PopoverInDialog.vue"
import PopoverWithForm from "./PopoverWithForm.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <PopoverBasic />
    </Example>
    <Example title="With Form">
      <PopoverWithForm />
    </Example>
    <Example title="Alignments">
      <PopoverAlignments />
    </Example>
    <Example title="In Dialog">
      <PopoverInDialog />
    </Example>
  </ExampleWrapper>
</template>
