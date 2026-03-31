<script setup lang="ts">
import { Field, FieldLabel } from "@/ui/field"
import { Input } from "@/ui/input"
</script>

<template>
  <Field>
    <FieldLabel html-for="input-demo-disabled">
      Email
    </FieldLabel>
    <Input
      id="input-demo-disabled"
      type="email"
      placeholder="Email"
      :disabled="true"
    />
  </Field>
</template>
