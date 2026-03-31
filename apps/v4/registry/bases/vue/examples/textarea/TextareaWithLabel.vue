<script setup lang="ts">
import { Field, FieldLabel } from "@/ui/field"
import { Textarea } from "@/ui/textarea"
</script>

<template>
  <Field>
    <FieldLabel html-for="textarea-demo-message">
      Message
    </FieldLabel>
    <Textarea
      id="textarea-demo-message"
      placeholder="Type your message here."
      :rows="6"
    />
  </Field>
</template>
