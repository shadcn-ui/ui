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
    <FieldLabel for="input-field-username">Username</FieldLabel>
    <Input
      id="input-field-username"
      type="text"
      placeholder="Enter your username"
    />
    <FieldDescription>
      Choose a unique username for your account.
    </FieldDescription>
  </Field>
</template>
