<script setup lang="ts">
import { Field, FieldLabel } from '@/ui/field'
import { Textarea } from '@/ui/textarea'
</script>

<template>
  <Field data-disabled>
    <FieldLabel for="textarea-disabled">Message</FieldLabel>
    <Textarea
      id="textarea-disabled"
      placeholder="Type your message here."
      disabled
    />
  </Field>
</template>
