<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import PopoverAlignments from "@/examples/popover/PopoverAlignments.vue"
import PopoverBasic from "@/examples/popover/PopoverBasic.vue"
import PopoverInDialog from "@/examples/popover/PopoverInDialog.vue"
import PopoverWithForm from "@/examples/popover/PopoverWithForm.vue"
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
