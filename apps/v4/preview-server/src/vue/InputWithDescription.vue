<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@/ui/field"
import { Input } from "@/ui/input"
</script>

<template>
  <Field>
    <FieldLabel html-for="input-demo-username">
      Username
    </FieldLabel>
    <Input
      id="input-demo-username"
      type="text"
      placeholder="Enter your username"
    />
    <FieldDescription>
      Choose a unique username for your account.
    </FieldDescription>
  </Field>
</template>
