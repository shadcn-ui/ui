<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/ui/field'
import { Switch } from '@/ui/switch'
</script>

<template>
  <Field orientation="horizontal" class="max-w-sm" data-invalid>
    <FieldContent>
      <FieldLabel for="switch-terms">
        Accept terms and conditions
      </FieldLabel>
      <FieldDescription>
        You must accept the terms and conditions to continue.
      </FieldDescription>
    </FieldContent>
    <Switch id="switch-terms" aria-invalid="true" />
  </Field>
</template>
