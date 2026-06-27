<script setup lang="ts">
import { Field, FieldLabel } from '@/ui/field'
import { Switch } from '@/ui/switch'
</script>

<template>
  <Field orientation="horizontal" data-disabled class="w-fit">
    <Switch id="switch-disabled-unchecked" disabled />
    <FieldLabel for="switch-disabled-unchecked">Disabled</FieldLabel>
  </Field>
</template>
