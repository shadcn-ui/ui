<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import TextareaBasic from "@/examples/textarea/TextareaBasic.vue"
import TextareaDisabled from "@/examples/textarea/TextareaDisabled.vue"
import TextareaInvalid from "@/examples/textarea/TextareaInvalid.vue"
import TextareaWithDescription from "@/examples/textarea/TextareaWithDescription.vue"
import TextareaWithLabel from "@/examples/textarea/TextareaWithLabel.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <TextareaBasic />
    </Example>
    <Example title="Invalid">
      <TextareaInvalid />
    </Example>
    <Example title="With Label">
      <TextareaWithLabel />
    </Example>
    <Example title="With Description">
      <TextareaWithDescription />
    </Example>
    <Example title="Disabled">
      <TextareaDisabled />
    </Example>
  </ExampleWrapper>
</template>
