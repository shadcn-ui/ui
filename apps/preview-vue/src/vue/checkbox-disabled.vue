<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/ui/field'
</script>

<template>
  <FieldGroup class="mx-auto w-56">
    <Field orientation="horizontal" data-disabled>
      <Checkbox
        id="toggle-checkbox-disabled"
        name="toggle-checkbox-disabled"
        disabled
      />
      <FieldLabel for="toggle-checkbox-disabled">
        Enable notifications
      </FieldLabel>
    </Field>
  </FieldGroup>
</template>
