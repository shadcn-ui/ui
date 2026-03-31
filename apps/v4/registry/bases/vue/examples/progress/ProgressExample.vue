<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import FileUploadList from "@/examples/progress/FileUploadList.vue"
import ProgressControlled from "@/examples/progress/ProgressControlled.vue"
import ProgressValues from "@/examples/progress/ProgressValues.vue"
import ProgressWithLabel from "@/examples/progress/ProgressWithLabel.vue"
</script>

<template>
  <ExampleWrapper>
    <ProgressValues />
    <ProgressWithLabel />
    <ProgressControlled />
    <FileUploadList />
  </ExampleWrapper>
</template>
