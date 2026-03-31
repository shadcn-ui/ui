<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import TextareaBasic from "./TextareaBasic.vue"
import TextareaDisabled from "./TextareaDisabled.vue"
import TextareaInvalid from "./TextareaInvalid.vue"
import TextareaWithDescription from "./TextareaWithDescription.vue"
import TextareaWithLabel from "./TextareaWithLabel.vue"
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
