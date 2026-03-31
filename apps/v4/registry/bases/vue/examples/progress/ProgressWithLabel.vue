<script setup lang="ts">
import { Example } from "@/components/example"
import { Field, FieldLabel } from "@/ui/field"
import { Progress } from "@/ui/progress"
</script>

<template>
  <Example title="With Label">
    <Field>
      <FieldLabel html-for="progress-upload">
        <span>Upload progress</span>
        <span class="ml-auto">66%</span>
      </FieldLabel>
      <Progress id="progress-upload" :model-value="66" class="w-full" />
    </Field>
  </Example>
</template>
