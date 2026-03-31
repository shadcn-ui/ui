<script setup lang="ts">
import { Field, FieldLabel } from "@/ui/field"
import { Textarea } from "@/ui/textarea"
</script>

<template>
  <Field>
    <FieldLabel html-for="textarea-demo-disabled">
      Message
    </FieldLabel>
    <Textarea
      id="textarea-demo-disabled"
      placeholder="Type your message here."
      :disabled="true"
    />
  </Field>
</template>
