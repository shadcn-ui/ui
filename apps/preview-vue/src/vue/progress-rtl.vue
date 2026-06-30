<script setup lang="ts">
import { ref } from 'vue'
import { Field, FieldLabel } from '@/ui/field'
import { Progress } from '@/ui/progress'

const dir = ref<'ltr' | 'rtl'>('rtl')
const label = ref('تقدم الرفع')
</script>

<template>
  <Field class="w-full max-w-sm" :dir="dir">
    <FieldLabel for="progress-upload-rtl">
      <span>{{ label }}</span>
      <span class="ms-auto">٦٦%</span>
    </FieldLabel>
    <Progress :model-value="66" id="progress-upload-rtl" class="rtl:rotate-180" />
  </Field>
</template>
