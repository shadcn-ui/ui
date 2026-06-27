<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ui/field'
import { Textarea } from '@/ui/textarea'
</script>

<template>
  <Field data-invalid>
    <FieldLabel for="textarea-invalid">Message</FieldLabel>
    <Textarea
      id="textarea-invalid"
      placeholder="Type your message here."
      aria-invalid
    />
    <FieldDescription>Please enter a valid message.</FieldDescription>
  </Field>
</template>
