<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ui/field'
import { Textarea } from '@/ui/textarea'
</script>

<template>
  <Field>
    <FieldLabel for="textarea-message">Message</FieldLabel>
    <FieldDescription>Enter your message below.</FieldDescription>
    <Textarea id="textarea-message" placeholder="Type your message here." />
  </Field>
</template>
