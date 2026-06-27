<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ui/field'
import { Input } from '@/ui/input'
</script>

<template>
  <Field>
    <FieldLabel for="input-required">
      Required Field <span class="text-destructive">*</span>
    </FieldLabel>
    <Input
      id="input-required"
      placeholder="This field is required"
      required
    />
    <FieldDescription>This field must be filled out.</FieldDescription>
  </Field>
</template>
