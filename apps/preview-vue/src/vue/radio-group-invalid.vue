<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/ui/field'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/ui/radio-group'
</script>

<template>
  <FieldSet class="w-full max-w-xs">
    <FieldLegend variant="label">Notification Preferences</FieldLegend>
    <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
    <RadioGroup default-value="email">
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem id="invalid-email" value="email" aria-invalid="true" />
        <FieldLabel for="invalid-email" class="font-normal">Email only</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem id="invalid-sms" value="sms" aria-invalid="true" />
        <FieldLabel for="invalid-sms" class="font-normal">SMS only</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem id="invalid-both" value="both" aria-invalid="true" />
        <FieldLabel for="invalid-both" class="font-normal">Both Email &amp; SMS</FieldLabel>
      </Field>
    </RadioGroup>
  </FieldSet>
</template>
