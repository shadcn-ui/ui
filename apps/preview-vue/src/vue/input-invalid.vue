<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ui/field'
import { Input } from '@/ui/input'
</script>

<template>
  <Field data-invalid>
    <FieldLabel for="input-invalid">Invalid Input</FieldLabel>
    <Input id="input-invalid" placeholder="Error" aria-invalid />
    <FieldDescription>
      This field contains validation errors.
    </FieldDescription>
  </Field>
</template>
