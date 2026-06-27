<script setup lang="ts">
import { Field, FieldLabel } from '@/ui/field'
import { Progress } from '@/ui/progress'
</script>

<template>
  <Field class="w-full max-w-sm">
    <FieldLabel for="progress-upload">
      <span>Upload progress</span>
      <span class="ml-auto">66%</span>
    </FieldLabel>
    <Progress :model-value="66" id="progress-upload" />
  </Field>
</template>
