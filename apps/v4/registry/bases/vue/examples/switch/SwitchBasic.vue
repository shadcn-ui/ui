<script setup lang="ts">
import { Field, FieldLabel } from "@/ui/field"
import { Switch } from "@/ui/switch"
</script>

<template>
  <Field orientation="horizontal">
    <Switch id="switch-basic" />
    <FieldLabel html-for="switch-basic">
      Airplane Mode
    </FieldLabel>
  </Field>
</template>
