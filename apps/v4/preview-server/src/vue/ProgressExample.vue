<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import FileUploadList from "./FileUploadList.vue"
import ProgressControlled from "./ProgressControlled.vue"
import ProgressValues from "./ProgressValues.vue"
import ProgressWithLabel from "./ProgressWithLabel.vue"
</script>

<template>
  <ExampleWrapper>
    <ProgressValues />
    <ProgressWithLabel />
    <ProgressControlled />
    <FileUploadList />
  </ExampleWrapper>
</template>
